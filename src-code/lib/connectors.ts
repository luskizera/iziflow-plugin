// src-code/lib/connectors.ts
/// <reference types="@figma/plugin-typings" />

import type { 
  NodeData, 
  Connection, 
  BifurcationAnalysis, 
  BifurcationContext,
  CurvedConnectorConfig,
  Point2D
} from '../../shared/types/flow.types';
import type { RGB } from '../config/theme.config'; // Importa tipo RGB
import * as LayoutConfig from '../config/layout.config'; // Configurações de layout (sem tipos problemáticos agora)
import * as StyleConfig from '../config/styles.config'; // Configurações de estilo (sem tipos problemáticos agora)
import { nodeCache } from '../utils/nodeCache';
import { calculateExitEntryPoints } from './positionCalculator';

// --- Interfaces Internas (Tipos Removidos/Alterados para string) ---
interface ConnectorStyleBaseConfig {
    STROKE_WEIGHT: number;
    DASH_PATTERN: number[];
    // A API espera um valor específico, mas usamos string aqui para evitar erro TS
    // O valor de StyleConfig.Connectors.PRIMARY/SECONDARY.END_CAP deve ser uma string válida como "ARROW_LINES"
    END_CAP: string;
}

interface DeterminedConnectorConfig {
    styleBase: ConnectorStyleBaseConfig;
    // Usamos 'string' onde ConnectorMagnet falhava
    startConnection: { magnet?: string; position?: { x: number, y: number } };
    endMagnet: string;
    // Usamos 'string' onde ConnectorLineType falhava
    lineType: string;
    placeLabelNearStart: boolean;
    // Usamos 'string' onde ConnectorMagnet falhava
    actualStartMagnetForLabel: string;
    isSecondary: boolean;
}

// --- Função Principal ---
export namespace Connectors {
    /**
     * Cria conectores com suporte a bifurcações
     */
    export async function createBifurcatedConnectors(
        connections: Array<Connection>,
        bifurcations: BifurcationAnalysis[],
        nodeMap: { [id: string]: SceneNode },
        nodeDataMap: { [id: string]: NodeData },
        finalColors: Record<string, RGB>
    ): Promise<void> {
        // Construir mapa de contexto de bifurcações
        const bifurcationContextMap = buildBifurcationContextMap(bifurcations);
        
        console.log(`[Bifurcated Connectors] Criando conectores com ${bifurcations.length} bifurcações detectadas`);
        
        // Carregar fonte para labels
        try {
            await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        } catch (e: any) {
            console.error("[Bifurcated Connectors] Erro ao carregar fonte para etiquetas:", e);
            figma.notify(`Erro ao carregar fonte para etiquetas: ${e?.message || e}`, { error: true });
        }

        // Análise de conexões
        const outgoingPrimaryCounts: { [nodeId: string]: number } = {};
        const nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<Connection> } = {};
        const incomingPrimaryCounts: { [nodeId: string]: number } = {};
        
        connections.forEach(conn => {
            if (!conn.secondary) {
                outgoingPrimaryCounts[conn.from] = (outgoingPrimaryCounts[conn.from] || 0) + 1;
                if (!nodeOutgoingPrimaryConnections[conn.from]) nodeOutgoingPrimaryConnections[conn.from] = [];
                nodeOutgoingPrimaryConnections[conn.from].push(conn);
                incomingPrimaryCounts[conn.to] = (incomingPrimaryCounts[conn.to] || 0) + 1;
            }
        });

        const labelCreationPromises: Promise<void>[] = [];

        // Processar conexões com contexto de bifurcação
        for (const conn of connections) {
            const fromNode = nodeMap[conn.from];
            const toNode = nodeMap[conn.to];
            const fromNodeData = nodeDataMap[conn.from];
            const toNodeData = nodeDataMap[conn.to];

            if (!fromNode || !toNode || !fromNodeData || !toNodeData) {
                console.warn(`[Bifurcated Connectors] Nó/dados ausentes para conexão: ${conn.from} -> ${conn.to}. Pulando.`);
                continue;
            }

            // Determinar contexto de bifurcação
            const bifurcationContext = bifurcationContextMap.get(conn.from);
            
            // Usar configuração específica para bifurcações
            const config = determineBifurcatedConnectorConfig(
                conn, 
                fromNode, 
                toNode,
                fromNodeData, 
                toNodeData,
                bifurcationContext,
                incomingPrimaryCounts[conn.to] || 0, 
                nodeOutgoingPrimaryConnections
            );

            // Criar conector
            const connector = figma.createConnector();
            const fromNodeName = fromNodeData.name || conn.from;
            const toNodeName = toNodeData.name || conn.to;
            connector.name = `Bifurcated Connector: ${fromNodeName} -> ${toNodeName}`;

            connector.connectorLineType = config.lineType as any;

            // Anexar endpoints
            attachConnectorEndpoints(connector, fromNode.id, toNode.id, config.startConnection, config.endMagnet);

            // Aplicar estilos
            applyConnectorStyle(connector, config.styleBase, config.isSecondary);

            // Criar labels para decisões
            const labelText = conn.conditionLabel || conn.condition;
            if (labelText && labelText.trim() !== '' && fromNodeData.type === 'DECISION') {
                labelCreationPromises.push(
                    createBifurcatedConnectorLabel(labelText, fromNode, toNode, config, bifurcationContext, finalColors)
                        .catch(err => {
                            console.error(`[Bifurcated Connectors] Falha ao criar etiqueta para ${conn.from}->${conn.to}:`, err);
                            const errorMessage = (err instanceof Error) ? err.message : String(err);
                            figma.notify(`Erro ao criar etiqueta '${labelText}': ${errorMessage}`, { error: true });
                        })
                );
            }
        }

        // Aguardar criação de todas as labels
        try {
            await Promise.all(labelCreationPromises);
            console.log("[Bifurcated Connectors] Criação de conectores bifurcados e etiquetas concluída.");
        } catch (overallError: any) {
            console.error("[Bifurcated Connectors] Erro inesperado durante criação das etiquetas:", overallError);
            figma.notify(`Ocorreu um erro durante a criação das etiquetas: ${overallError?.message || overallError}`, { error: true });
        }
    }

    export async function createConnectors(
        connections: Array<Connection>,
        // Usamos SceneNode que é um tipo mais genérico e disponível
        nodeMap: { [id: string]: SceneNode },
        nodeDataMap: { [id: string]: NodeData },
        finalColors: Record<string, RGB>
    ): Promise<void> {

         try {
            // Carrega a fonte para os labels dos conectores
            await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        } catch (e: any) {
            console.error("[Connectors] Erro ao carregar fonte para etiquetas:", e);
            figma.notify(`Erro ao carregar fonte para etiquetas: ${e?.message || e}`, { error: true });
        }

        // Lógica de contagem de conexões (inalterada)
        const outgoingPrimaryCounts: { [nodeId: string]: number } = {};
        const nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<Connection> } = {};
        const incomingPrimaryCounts: { [nodeId: string]: number } = {};
        connections.forEach(conn => {
            if (!conn.secondary) {
                outgoingPrimaryCounts[conn.from] = (outgoingPrimaryCounts[conn.from] || 0) + 1;
                if (!nodeOutgoingPrimaryConnections[conn.from]) nodeOutgoingPrimaryConnections[conn.from] = [];
                nodeOutgoingPrimaryConnections[conn.from].push(conn);
                incomingPrimaryCounts[conn.to] = (incomingPrimaryCounts[conn.to] || 0) + 1;
            }
        });

        const labelCreationPromises: Promise<void>[] = [];

        // Itera sobre as conexões definidas
        for (const conn of connections) {
            const fromNode = nodeMap[conn.from];
            const toNode = nodeMap[conn.to];
            const fromNodeData = nodeDataMap[conn.from];
            const toNodeData = nodeDataMap[conn.to];

            // Valida se os nós existem no mapa
            if (!fromNode || !toNode || !fromNodeData) {
                console.warn(`[Connectors] Nó/dados ausentes para conexão: ${conn.from} -> ${conn.to}. Pulando.`);
                continue;
            }

            // Determina a configuração do conector (layout, tipo, magnets)
            // Agora usa a função que aceita/retorna strings onde os tipos falhavam
            const config = determineConnectorConfig(
                conn,
                fromNode,
                toNode,
                fromNodeData,
                toNodeData || fromNodeData,
                incomingPrimaryCounts[conn.to] || 0,
                nodeOutgoingPrimaryConnections
            );

            // Cria o nó conector
            const connector = figma.createConnector();
            const fromNodeName = fromNodeData.name || conn.from;
            const toNodeName = nodeDataMap[conn.to]?.name || conn.to;
            connector.name = `Connector: ${fromNodeName} -> ${toNodeName}`;

            // Define o tipo da linha (a API aceita a string, faz cast opcional para clareza)
            connector.connectorLineType = config.lineType as any;

            // Anexa os pontos de início e fim do conector
            attachConnectorEndpoints(connector, fromNode.id, toNode.id, config.startConnection, config.endMagnet);

            // Aplica os estilos (peso, traço, cor fixa)
            applyConnectorStyle(connector, config.styleBase, config.isSecondary);

            // Cria a etiqueta (label) apenas se for de uma decisão e tiver texto
            const labelText = conn.conditionLabel || conn.condition;
            if (labelText && labelText.trim() !== '' && fromNodeData.type === 'DECISION') {
                labelCreationPromises.push(
                    createConnectorLabel(labelText, fromNode, toNode, config.actualStartMagnetForLabel, config.placeLabelNearStart, finalColors)
                        .catch(err => {
                            console.error(`[Connectors] Falha ao criar etiqueta para ${conn.from}->${conn.to}:`, err);
                            const errorMessage = (err instanceof Error) ? err.message : String(err);
                            figma.notify(`Erro ao criar etiqueta '${labelText}': ${errorMessage}`, { error: true });
                        })
                );
            } else if (labelText && fromNodeData.type !== 'DECISION') {
                 // Log para debug se label for ignorado
                 console.log(`[Connectors] Debug: Ignorando label '${labelText}' para conexão ${conn.from} -> ${conn.to} (não é de Decision).`);
            }
        } // Fim do loop de conexões

        // Espera todas as criações de label terminarem
        try {
            await Promise.all(labelCreationPromises);
            console.log("[Connectors] Criação de conectores e etiquetas concluída.");
        } catch (overallError: any) {
             console.error("[Connectors] Erro inesperado durante criação das etiquetas:", overallError);
             figma.notify(`Ocorreu um erro durante a criação das etiquetas: ${overallError?.message || overallError}`, { error: true });
        }
    }
}

// --- Funções Auxiliares (Tipos Removidos/Alterados) ---

/**
 * Determina a configuração de layout e tipo para um conector específico.
 * Usa strings onde os tipos ConnectorMagnet/ConnectorLineType causavam erro.
 */
function determineConnectorConfig(
    conn: Connection,
    fromNode: SceneNode,
    toNode: SceneNode,
    fromNodeData: NodeData,
    toNodeData: NodeData,
    incomingPrimaryCountToTarget: number,
    nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<Connection> }
): DeterminedConnectorConfig { // Retorna a interface com tipos string onde necessário

    const isDecisionOrigin = fromNodeData.type === 'DECISION';
    const isSecondary = conn.secondary === true;
    const isConvergingPrimary = incomingPrimaryCountToTarget > 1 && !isSecondary;

    // Obtém estilo base (não-cor) de StyleConfig
    let styleBase: ConnectorStyleBaseConfig = isSecondary ? StyleConfig.Connectors.SECONDARY : StyleConfig.Connectors.PRIMARY;

    // Inicializa variáveis com tipos string onde necessário
    let startConnection: { magnet?: string; position?: { x: number; y: number } } = {};
    let finalLineType: string = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE : LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
    let placeLabelNearStart = false;
    let finalEndMagnet: string = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
    let finalStartMagnetForLabel: string = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET : LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;

    // Lógica de decisão para diferentes tipos de conexão
    if (isSecondary) {
        finalLineType = LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE;
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET;
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        startConnection = { magnet: finalStartMagnetForLabel };
        placeLabelNearStart = false;
    } else if (isDecisionOrigin) {
        placeLabelNearStart = true;
        finalLineType = LayoutConfig.Connectors.DECISION_PRIMARY_LINE_TYPE;
        const primaryOutputs = nodeOutgoingPrimaryConnections[conn.from] || [];
        const index = primaryOutputs.findIndex(c => (conn.id && c.id === conn.id) || (!conn.id && c.from === conn.from && c.to === conn.to && c.conditionLabel === conn.conditionLabel));
        const seq = LayoutConfig.Connectors.DECISION_PRIMARY_MAGNET_SEQUENCE;
        let targetMagnet: string = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET; // Usa string
        if (index !== -1) {
             // Garante que o índice não saia dos limites da sequência de magnets definida
             targetMagnet = seq[index % seq.length];
        } else {
            console.warn(`[Connectors] Conexão primária de decisão não encontrada: ${conn.from} -> ${conn.to}. Usando fallback: ${targetMagnet}.`);
        }
        finalStartMagnetForLabel = targetMagnet; // Magnet para posicionar o label
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;

        // Calcula a posição exata no nó de origem com base no magnet
        let startX: number, startY: number;
        const nodeWidth = fromNode.width;
        const nodeHeight = fromNode.height;
        switch (targetMagnet) {
            case 'TOP':    startX = nodeWidth / 2; startY = 0; break;
            case 'RIGHT':  startX = nodeWidth;     startY = nodeHeight / 2; break;
            case 'BOTTOM': startX = nodeWidth / 2; startY = nodeHeight; break;
            case 'LEFT':   startX = 0;             startY = nodeHeight / 2; break;
            case 'CENTER': startX = nodeWidth / 2; startY = nodeHeight / 2; break;
            case 'AUTO':   // AUTO geralmente mapeia para BOTTOM em conectores
                           startX = nodeWidth / 2; startY = nodeHeight; finalStartMagnetForLabel = 'BOTTOM'; break;
            default:       startX = nodeWidth;     startY = nodeHeight / 2; finalStartMagnetForLabel = 'RIGHT'; break; // Fallback
        }
        startConnection = { position: { x: startX, y: startY } }; // Decisão usa posição

    } else if (isConvergingPrimary) {
         finalLineType = LayoutConfig.Connectors.CONVERGENCE_PRIMARY_LINE_TYPE;
         finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
         finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
         startConnection = { magnet: finalStartMagnetForLabel };
         placeLabelNearStart = false;
    } else { // Primário Padrão
        finalLineType = LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        if (finalLineType === "STRAIGHT") {
            // Para linhas retas, CENTER geralmente é melhor
            startConnection = { magnet: "CENTER" };
            finalEndMagnet = "CENTER";
        } else {
             startConnection = { magnet: finalStartMagnetForLabel };
        }
        placeLabelNearStart = false;
    }

    const resolvedMagnets = resolveConnectorMagnets(conn, fromNode, toNode, fromNodeData, toNodeData);
    if (resolvedMagnets) {
        finalEndMagnet = resolvedMagnets.endMagnet;
        finalStartMagnetForLabel = resolvedMagnets.startMagnet;
        if (resolvedMagnets.forceMagnet || !startConnection.position) {
            startConnection = { magnet: resolvedMagnets.startMagnet };
        }
    }

    // Retorna o objeto de configuração
    return {
        // Recria o objeto styleBase com o tipo correto para END_CAP, se necessário
        styleBase: {
            ...styleBase,
            END_CAP: styleBase.END_CAP // Mantém a string como definida em StyleConfig
        },
        startConnection,
        endMagnet: finalEndMagnet,
        lineType: finalLineType,
        placeLabelNearStart,
        actualStartMagnetForLabel: finalStartMagnetForLabel,
        isSecondary
    };
}

/**
 * Aplica estilos visuais (peso, traço, ponta, cor fixa) a um conector.
 */
function applyConnectorStyle(
    connector: ConnectorNode,
    styleBase: ConnectorStyleBaseConfig,
    isSecondary: boolean // Usado para dashPattern e endCap do styleBase
): void {
    try {
        // A API do Figma espera os tipos corretos aqui. Usamos 'as' para garantir.
        connector.connectorEndStrokeCap = styleBase.END_CAP as ConnectorStrokeCap;
        connector.dashPattern = styleBase.DASH_PATTERN;
        connector.strokeWeight = styleBase.STROKE_WEIGHT;

        // Define a cor fixa como preto (RGB 0,0,0)
        connector.strokes = [{ type: "SOLID", color: {r:0, g:0, b:0} }];

    } catch(e: any) {
        console.error(`[Connectors] Erro ao aplicar estilo ao conector ${connector.name || connector.id}: ${e?.message || e}`);
    }
}

/**
 * Anexa os pontos de início e fim de um conector aos nós correspondentes.
 * Usa strings para os magnets, com cast para o tipo Figma API onde necessário.
 */
function attachConnectorEndpoints(
    connector: ConnectorNode,
    fromNodeId: string,
    toNodeId: string,
    // Aceita string para magnet
    startConnection: { magnet?: string; position?: { x: number, y: number } },
    endMagnet: string // Aceita string
): void {
    try {
        if (startConnection.position) {
            // A API aceita o objeto position diretamente
            connector.connectorStart = { endpointNodeId: fromNodeId, position: startConnection.position };
        } else {
            // A API aceita a string do magnet, faz cast para o tipo esperado
            connector.connectorStart = { endpointNodeId: fromNodeId, magnet: (startConnection.magnet ?? "AUTO") as any };
        }
        // A API aceita a string do magnet, faz cast
        connector.connectorEnd = { endpointNodeId: toNodeId, magnet: (endMagnet ?? "AUTO") as any };
    } catch (e: any) {
         console.error(`[Connectors] Erro ao anexar conector ${connector.name}:`, e);
         figma.notify(`Erro ao conectar nós (${fromNodeId} -> ${toNodeId}): ${e?.message || e}`, { error: true });
    }
}

/**
 * Cria o frame da etiqueta para um conector (apenas para decisões).
 * Usa as constantes de padding/estilo de StyleConfig.Labels.
 */
async function createConnectorLabel(
    labelText: string,
    fromNode: SceneNode,
    toNode: SceneNode,
    actualStartMagnetForLabel: string, // Recebe string
    placeNearStart: boolean,
    finalColors: Record<string, RGB> // Recebe cores para o label
): Promise<void> {
    // A validação de labelText e tipo de nó já foi feita antes de chamar esta função

    let labelFrame: FrameNode | null = null;
     try {
        labelFrame = figma.createFrame();
        labelFrame.name = `Condition: ${labelText}`;
        labelFrame.layoutMode = "HORIZONTAL";
        labelFrame.primaryAxisSizingMode = "AUTO";
        labelFrame.counterAxisSizingMode = "AUTO";

        // Usa as constantes corretas para padding de labels/chips de descrição
        labelFrame.paddingLeft = labelFrame.paddingRight = StyleConfig.Labels.DESC_CHIP_PADDING_HORIZONTAL;
        labelFrame.paddingTop = labelFrame.paddingBottom = StyleConfig.Labels.DESC_CHIP_PADDING_VERTICAL;

        labelFrame.cornerRadius = StyleConfig.Labels.DESC_CHIP_CORNER_RADIUS;
        labelFrame.strokes = []; // Sem borda

        // Aplica Cores do Tema (usando cores de chip default para o LABEL)
        const labelFillToken = 'chips_default_fill';
        if (finalColors[labelFillToken]) {
             labelFrame.fills = [{ type: 'SOLID', color: finalColors[labelFillToken] }];
        } else {
             console.warn(`[Connectors] Cor não encontrada para ${labelFillToken}. Usando fallback cinza.`);
             labelFrame.fills = [{ type: 'SOLID', color: {r:0.8,g:0.8,b:0.8}}];
        }

        const labelTextNode = figma.createText();
        labelTextNode.fontName = StyleConfig.Labels.FONT;
        labelTextNode.characters = labelText;
        labelTextNode.fontSize = StyleConfig.Labels.DESC_CHIP_FONT_SIZE;
        labelTextNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Essencial para HUG

         // Aplica Cores do Tema (usando cores de chip default para o TEXTO do LABEL)
        const labelTextToken = 'chips_default_text';
        if (finalColors[labelTextToken]) {
            labelTextNode.fills = [{ type: 'SOLID', color: finalColors[labelTextToken] }];
        } else {
             console.warn(`[Connectors] Cor não encontrada para ${labelTextToken}. Usando fallback preto.`);
             labelTextNode.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0}}];
        }

        labelFrame.appendChild(labelTextNode);
        // Adiciona à página pai do nó de origem (ou à página atual como fallback)
        (fromNode.parent || figma.currentPage).appendChild(labelFrame);

        // Espera um tick para o Auto Layout calcular o tamanho
        await new Promise(resolve => setTimeout(resolve, 0));
        const labelWidth = labelFrame.width;
        const labelHeight = labelFrame.height;
        let targetX: number, targetY: number;
        const offsetNear = LayoutConfig.Connectors.LABEL_OFFSET_NEAR_START;
        const offsetMidY = LayoutConfig.Connectors.LABEL_OFFSET_MID_LINE_Y;
        const fromNodeWidth = fromNode.width;
        const fromNodeHeight = fromNode.height;
        const toNodeHeight = toNode.height;

        // Lógica de posicionamento (usa actualStartMagnetForLabel como string)
        if (placeNearStart) {
             let startPointX: number, startPointY: number;
             const startConn = (fromNode as ConnectorNode).connectorStart; // Tenta ler como ConnectorNode
             if (startConn && 'position' in startConn && startConn.position) {
                 startPointX = fromNode.x + startConn.position.x;
                 startPointY = fromNode.y + startConn.position.y;
             } else {
                 // Fallback para estimativa
                 let estimatedX = fromNode.x + fromNodeWidth / 2; // Default center X
                 let estimatedY = fromNode.y + fromNodeHeight / 2; // Default center Y
                 switch (actualStartMagnetForLabel) {
                    case 'TOP':    estimatedY = fromNode.y; break;
                    case 'RIGHT':  estimatedX = fromNode.x + fromNodeWidth; break;
                    case 'BOTTOM': estimatedY = fromNode.y + fromNodeHeight; break;
                    case 'LEFT':   estimatedX = fromNode.x; break;
                    // CENTER e AUTO usam o default center X/Y
                 }
                 startPointX = estimatedX; startPointY = estimatedY;
                 console.warn(`[Connectors] Usando posição estimada para label near start...`);
             }
             // Calcula targetX, targetY baseado no magnet (string) e ponto de saída
             switch (actualStartMagnetForLabel) {
                case 'TOP':    targetX = startPointX; targetY = startPointY - offsetNear - labelHeight / 2; break;
                case 'RIGHT':  targetX = startPointX + offsetNear + labelWidth / 2; targetY = startPointY; break;
                case 'BOTTOM': targetX = startPointX; targetY = startPointY + offsetNear + labelHeight / 2; break;
                case 'LEFT':   targetX = startPointX - offsetNear - labelWidth / 2; targetY = startPointY; break;
                case 'CENTER': targetX = startPointX; targetY = startPointY - offsetNear - labelHeight / 2; break;
                default:       targetX = startPointX + offsetNear + labelWidth / 2; targetY = startPointY; break; // Fallback
            }
        } else {
            // Lógica mid line (usa actualStartMagnetForLabel como string)
            let startX = fromNode.x; let startY = fromNode.y;
            const startConn = (fromNode as ConnectorNode).connectorStart;
            if (startConn && 'position' in startConn && startConn.position) { /*...*/ }
            else { // Fallback para estimativa
                switch (actualStartMagnetForLabel) { /*...*/ }
            }
            const endX = toNode.x + toNode.width / 2;
            const endY = toNode.y + toNodeHeight / 2;
            targetX = (startX + endX) / 2;
            targetY = (startY + endY) / 2 + offsetMidY;
        }
        // Posiciona o centro do label no ponto alvo
        labelFrame.x = targetX - labelWidth / 2;
        labelFrame.y = targetY - labelHeight / 2;

    } catch (error: any) {
        console.error(`[Connectors] Erro ao criar/posicionar etiqueta '${labelText}':`, error);
        if (labelFrame && !labelFrame.removed) {
             try { labelFrame.remove(); } catch (removeError) { /* Ignora */ }
        }
    }
}

// --- Funções para Sistema de Bifurcação ---

/**
 * Constrói mapa de contexto de bifurcações para acesso rápido
 */
function buildBifurcationContextMap(bifurcations: BifurcationAnalysis[]): Map<string, BifurcationContext> {
    const contextMap = new Map<string, BifurcationContext>();
    
    bifurcations.forEach(bifurcation => {
        // Criar contexto para nó de decisão
        const context: BifurcationContext = {
            upperBranchNodes: bifurcation.branches.upper,
            lowerBranchNodes: bifurcation.branches.lower,
            isConvergencePoint: false
        };
        
        contextMap.set(bifurcation.decisionNodeId, context);
        
        // Marcar nó de convergência se existir
        if (bifurcation.convergenceNodeId) {
            const convergenceContext: BifurcationContext = {
                upperBranchNodes: bifurcation.branches.upper,
                lowerBranchNodes: bifurcation.branches.lower,
                isConvergencePoint: true
            };
            contextMap.set(bifurcation.convergenceNodeId, convergenceContext);
        }
    });
    
    return contextMap;
}

/**
 * Determina configuração de conector específica para bifurcações
 */
function determineBifurcatedConnectorConfig(
    conn: Connection,
    fromNode: SceneNode,
    toNode: SceneNode,
    fromNodeData: NodeData,
    toNodeData: NodeData,
    bifurcationContext: BifurcationContext | undefined,
    incomingPrimaryCountToTarget: number,
    nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<Connection> }
): DeterminedConnectorConfig {
    
    const isDecisionOrigin = fromNodeData.type === 'DECISION';
    const isSecondary = conn.secondary === true;
    const isConvergingPrimary = incomingPrimaryCountToTarget > 1 && !isSecondary;
    
    // Se não há contexto de bifurcação, usar lógica padrão
    if (!bifurcationContext || !isDecisionOrigin) {
        return determineConnectorConfig(
            conn, 
            fromNode,
            toNode,
            fromNodeData, 
            toNodeData,
            incomingPrimaryCountToTarget, 
            nodeOutgoingPrimaryConnections
        );
    }
    
    // Configuração específica para bifurcações
    const styleBase: ConnectorStyleBaseConfig = isSecondary ? 
        StyleConfig.Connectors.SECONDARY : StyleConfig.Connectors.PRIMARY;
    
    // Determinar se é ramo superior ou inferior
    const isUpperBranch = bifurcationContext.upperBranchNodes.includes(conn.to);
    const isLowerBranch = bifurcationContext.lowerBranchNodes.includes(conn.to);
    
    let startConnection: { magnet?: string; position?: { x: number; y: number } } = {};
    let finalEndMagnet: string = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
    let finalStartMagnetForLabel: string;
    
    if (isUpperBranch) {
        // Ramo superior - sai pela parte superior do nó
        finalStartMagnetForLabel = LayoutConfig.Bifurcation.DECISION_TOP_BRANCH_MAGNET;
        startConnection = { magnet: finalStartMagnetForLabel };
        console.log(`[Bifurcated Connectors] Conexão ${conn.from} -> ${conn.to}: Ramo SUPERIOR (${finalStartMagnetForLabel})`);
    } else if (isLowerBranch) {
        // Ramo inferior - sai pela parte inferior do nó
        finalStartMagnetForLabel = LayoutConfig.Bifurcation.DECISION_BOTTOM_BRANCH_MAGNET;
        startConnection = { magnet: finalStartMagnetForLabel };
        console.log(`[Bifurcated Connectors] Conexão ${conn.from} -> ${conn.to}: Ramo INFERIOR (${finalStartMagnetForLabel})`);
    } else {
        // Fallback para lógica padrão
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        startConnection = { magnet: finalStartMagnetForLabel };
        console.warn(`[Bifurcated Connectors] Conexão ${conn.from} -> ${conn.to}: Não encontrada em bifurcação, usando padrão`);
    }
    
    // Configurar entrada para convergência
    if (bifurcationContext.isConvergencePoint) {
        finalEndMagnet = LayoutConfig.Bifurcation.CONVERGENCE_ENTRY_MAGNET;
    }
    
    const config: DeterminedConnectorConfig = {
        styleBase: {
            ...styleBase,
            END_CAP: styleBase.END_CAP
        },
        startConnection,
        endMagnet: finalEndMagnet,
        lineType: LayoutConfig.Connectors.DECISION_PRIMARY_LINE_TYPE,
        placeLabelNearStart: true, // Labels perto do início para bifurcações
        actualStartMagnetForLabel: finalStartMagnetForLabel,
        isSecondary
    };

    const resolvedMagnets = resolveConnectorMagnets(conn, fromNode, toNode, fromNodeData, toNodeData);
    if (resolvedMagnets) {
        config.endMagnet = resolvedMagnets.endMagnet;
        config.actualStartMagnetForLabel = resolvedMagnets.startMagnet;
        if (resolvedMagnets.forceMagnet || !startConnection.position) {
            config.startConnection = { magnet: resolvedMagnets.startMagnet };
        }
    }

    return config;
}

function resolveConnectorMagnets(
    conn: Connection,
    fromNode: SceneNode,
    toNode: SceneNode,
    fromNodeData: NodeData,
    toNodeData: NodeData
): { startMagnet: string; endMagnet: string; forceMagnet: boolean } | null {
    const explicitExit = conn.exitMagnet || fromNodeData.layoutHint?.exitPoint;
    const explicitEntry = conn.entryMagnet || toNodeData?.layoutHint?.entryPoint;

    const fromCenter = {
        x: fromNode.x + fromNode.width / 2,
        y: fromNode.y + fromNode.height / 2
    };
    const toCenter = {
        x: toNode.x + toNode.width / 2,
        y: toNode.y + toNode.height / 2
    };

    const offset = {
        x: toCenter.x - fromCenter.x,
        y: toCenter.y - fromCenter.y
    };

    const calculated = calculateExitEntryPoints(offset, explicitExit, explicitEntry);
    return {
        startMagnet: calculated.exit.toUpperCase(),
        endMagnet: calculated.entry.toUpperCase(),
        forceMagnet: Boolean(explicitExit || explicitEntry)
    };
}

/**
 * Cria label para conector bifurcado com posicionamento otimizado
 */
async function createBifurcatedConnectorLabel(
    labelText: string,
    fromNode: SceneNode,
    toNode: SceneNode,
    config: DeterminedConnectorConfig,
    bifurcationContext: BifurcationContext | undefined,
    finalColors: Record<string, RGB>
): Promise<void> {
    
    // Se não há contexto de bifurcação, usar função padrão
    if (!bifurcationContext) {
        return createConnectorLabel(
            labelText, 
            fromNode, 
            toNode, 
            config.actualStartMagnetForLabel, 
            config.placeLabelNearStart, 
            finalColors
        );
    }
    
    let labelFrame: FrameNode | null = null;
    try {
        labelFrame = figma.createFrame();
        labelFrame.name = `Bifurcated Condition: ${labelText}`;
        labelFrame.layoutMode = "HORIZONTAL";
        labelFrame.primaryAxisSizingMode = "AUTO";
        labelFrame.counterAxisSizingMode = "AUTO";
        
        // Configuração padrão do frame
        labelFrame.paddingLeft = labelFrame.paddingRight = StyleConfig.Labels.DESC_CHIP_PADDING_HORIZONTAL;
        labelFrame.paddingTop = labelFrame.paddingBottom = StyleConfig.Labels.DESC_CHIP_PADDING_VERTICAL;
        labelFrame.cornerRadius = StyleConfig.Labels.DESC_CHIP_CORNER_RADIUS;
        labelFrame.strokes = [];
        
        // Aplicar cores
        const labelFillToken = 'chips_default_fill';
        if (finalColors[labelFillToken]) {
            labelFrame.fills = [{ type: 'SOLID', color: finalColors[labelFillToken] }];
        } else {
            labelFrame.fills = [{ type: 'SOLID', color: {r:0.8,g:0.8,b:0.8}}];
        }
        
        // Criar texto
        const labelTextNode = figma.createText();
        labelTextNode.fontName = StyleConfig.Labels.FONT;
        labelTextNode.characters = labelText;
        labelTextNode.fontSize = StyleConfig.Labels.DESC_CHIP_FONT_SIZE;
        labelTextNode.textAutoResize = "WIDTH_AND_HEIGHT";
        
        // Aplicar cor do texto
        const labelTextToken = 'chips_default_text';
        if (finalColors[labelTextToken]) {
            labelTextNode.fills = [{ type: 'SOLID', color: finalColors[labelTextToken] }];
        } else {
            labelTextNode.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0}}];
        }
        
        labelFrame.appendChild(labelTextNode);
        (fromNode.parent || figma.currentPage).appendChild(labelFrame);
        
        // Aguardar cálculo de layout
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Posicionamento específico para bifurcações
        const labelWidth = labelFrame.width;
        const labelHeight = labelFrame.height;
        const offsetNear = LayoutConfig.Connectors.LABEL_OFFSET_NEAR_START;
        
        let targetX: number, targetY: number;
        
        // Posicionamento baseado no magnet de saída
        switch (config.actualStartMagnetForLabel) {
            case 'TOP':
                targetX = fromNode.x + fromNode.width / 2;
                targetY = fromNode.y - offsetNear - labelHeight / 2;
                break;
            case 'BOTTOM':
                targetX = fromNode.x + fromNode.width / 2;
                targetY = fromNode.y + fromNode.height + offsetNear + labelHeight / 2;
                break;
            case 'RIGHT':
                targetX = fromNode.x + fromNode.width + offsetNear + labelWidth / 2;
                targetY = fromNode.y + fromNode.height / 2;
                break;
            case 'LEFT':
                targetX = fromNode.x - offsetNear - labelWidth / 2;
                targetY = fromNode.y + fromNode.height / 2;
                break;
            default:
                targetX = fromNode.x + fromNode.width + offsetNear + labelWidth / 2;
                targetY = fromNode.y + fromNode.height / 2;
                break;
        }
        
        // Centralizar o label no ponto alvo
        labelFrame.x = targetX - labelWidth / 2;
        labelFrame.y = targetY - labelHeight / 2;
        
    } catch (error: any) {
        console.error(`[Bifurcated Connectors] Erro ao criar/posicionar etiqueta bifurcada '${labelText}':`, error);
        if (labelFrame && !labelFrame.removed) {
            try { labelFrame.remove(); } catch (removeError) { /* Ignora */ }
        }
    }
}

// --- Sistema de Convergência Elegante ---

/**
 * Cria conectores curvos para convergência elegante de bifurcações
 */
export async function createCurvedConvergenceConnector(
    config: CurvedConnectorConfig,
    fromNodeId: string,
    toNodeId: string,
    finalColors: Record<string, RGB>
): Promise<ConnectorNode> {
    console.log(`[Curved Convergence] Criando conector curvo ${config.isUpperBranch ? 'superior' : 'inferior'} (${fromNodeId} -> ${toNodeId})`);
    
    const connector = figma.createConnector();
    connector.name = `Curved Convergence: ${fromNodeId} -> ${toNodeId} (${config.isUpperBranch ? 'Upper' : 'Lower'})`;
    
    try {
        // Configurar geometria curva
        if (config.useMultipleSegments) {
            await applyMultiSegmentCurve(connector, config, fromNodeId, toNodeId);
        } else {
            await applyNativeCurve(connector, config, fromNodeId, toNodeId);
        }
        
        // Aplicar estilo de convergência
        applyConvergenceStyle(connector, finalColors);
        
        console.log(`[Curved Convergence] Conector curvo criado com sucesso`);
        return connector;
        
    } catch (error: any) {
        console.error(`[Curved Convergence] Erro ao criar conector curvo:`, error);
        figma.notify(`Erro ao criar conector curvo: ${error?.message || error}`, { error: true });
        
        // Fallback para conector reto
        connector.connectorLineType = "ELBOWED";
        connector.connectorStart = { endpointNodeId: fromNodeId, magnet: "RIGHT" as any };
        connector.connectorEnd = { endpointNodeId: toNodeId, magnet: "LEFT" as any };
        
        return connector;
    }
}

/**
 * Aplica geometria curva usando múltiplos segmentos (método de fallback)
 */
async function applyMultiSegmentCurve(
    connector: ConnectorNode,
    config: CurvedConnectorConfig,
    fromNodeId: string,
    toNodeId: string
): Promise<void> {
    const geometry = config.geometry;
    const path = config.isUpperBranch ? geometry.upperPath : geometry.lowerPath;
    
    // Calcular pontos ao longo da curva Bézier
    const points = calculateBezierPoints(path, config.segmentCount || 8);
    
    // Configurar endpoints
    connector.connectorStart = { 
        endpointNodeId: fromNodeId, 
        magnet: "RIGHT" as any 
    };

    connector.connectorEnd = { 
        endpointNodeId: toNodeId, 
        magnet: "LEFT" as any 
    };
    
    // Configurar tipo de linha baseado na suavização
    if (config.smoothingFactor && config.smoothingFactor > 0.5) {
        connector.connectorLineType = "ELBOWED"; // Mais suave
    } else {
        connector.connectorLineType = "STRAIGHT"; // Mais direto
    }
    
    console.log(`[Curved Convergence] Aplicada curva de ${points.length} segmentos`);
}

/**
 * Tenta aplicar curva nativa do Figma (se disponível)
 */
async function applyNativeCurve(
    connector: ConnectorNode,
    config: CurvedConnectorConfig,
    fromNodeId: string,
    toNodeId: string
): Promise<void> {
    // A API atual do Figma não suporta curvas Bézier nativas para conectores
    // Esta função serve como placeholder para futuras implementações
    
    console.warn(`[Curved Convergence] Curvas nativas não suportadas, usando fallback de múltiplos segmentos`);
    return applyMultiSegmentCurve(connector, config, fromNodeId, toNodeId);
}

/**
 * Calcula pontos discretos ao longo de uma curva Bézier quadrática
 */
function calculateBezierPoints(path: any, segmentCount: number): Point2D[] {
    const points: Point2D[] = [];
    const { startPoint, controlPoint, endPoint } = path;
    
    for (let i = 0; i <= segmentCount; i++) {
        const t = i / segmentCount;
        
        // Fórmula de Bézier quadrática: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
        const x = Math.pow(1 - t, 2) * startPoint.x +
                  2 * (1 - t) * t * controlPoint.x +
                  Math.pow(t, 2) * endPoint.x;
                  
        const y = Math.pow(1 - t, 2) * startPoint.y +
                  2 * (1 - t) * t * controlPoint.y +
                  Math.pow(t, 2) * endPoint.y;
        
        points.push({ x, y });
    }
    
    return points;
}

/**
 * Aplica estilo específico para conectores de convergência
 */
function applyConvergenceStyle(connector: ConnectorNode, finalColors: Record<string, RGB>): void {
    try {
        // Configurações específicas para convergência
        connector.strokeWeight = StyleConfig.Connectors.PRIMARY.STROKE_WEIGHT * 1.2; // Ligeiramente mais grosso
        connector.dashPattern = []; // Linha sólida
        connector.connectorEndStrokeCap = "ARROW_LINES" as ConnectorStrokeCap;
        
        // Cor específica para convergência (pode usar uma cor diferenciada)
        const convergenceColorToken = 'connectors_convergence';
        if (finalColors[convergenceColorToken]) {
            connector.strokes = [{ 
                type: "SOLID", 
                color: finalColors[convergenceColorToken] 
            }];
        } else {
            // Fallback: usar cor primária com transparência reduzida
            connector.strokes = [{ 
                type: "SOLID", 
                color: { r: 0.2, g: 0.2, b: 0.2 } // Cinza escuro
            }];
        }
        
        console.log(`[Curved Convergence] Estilo de convergência aplicado`);
        
    } catch (error: any) {
        console.error(`[Curved Convergence] Erro ao aplicar estilo:`, error);
        // Fallback para estilo padrão
        connector.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    }
}

/**
 * Cria múltiplos conectores de convergência para uma bifurcação
 */
export async function createConvergenceConnectors(
    configs: CurvedConnectorConfig[],
    fromNodeIds: string[],
    toNodeId: string,
    finalColors: Record<string, RGB>
): Promise<ConnectorNode[]> {
    const connectors: ConnectorNode[] = [];
    
    console.log(`[Curved Convergence] Criando ${configs.length} conectores de convergência para ${toNodeId}`);
    
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        const fromNodeId = fromNodeIds[i];
        
        if (!fromNodeId) {
            console.warn(`[Curved Convergence] ID de nó de origem não fornecido para índice ${i}`);
            continue;
        }
        
        try {
            const connector = await createCurvedConvergenceConnector(
                config, 
                fromNodeId, 
                toNodeId, 
                finalColors
            );
            
            connectors.push(connector);
            
        } catch (error: any) {
            console.error(`[Curved Convergence] Erro ao criar conector ${i}:`, error);
            figma.notify(`Erro ao criar conector de convergência ${i + 1}: ${error?.message || error}`, { error: true });
        }
    }
    
    console.log(`[Curved Convergence] ${connectors.length} conectores de convergência criados`);
    return connectors;
}

/**
 * Função auxiliar para determinar se uma conexão é parte de convergência
 */
export function isConvergenceConnection(
    connection: Connection,
    bifurcations: BifurcationAnalysis[]
): boolean {
    for (const bifurcation of bifurcations) {
        if (!bifurcation.convergenceNodeId) continue;
        
        // Verificar se a conexão termina no nó de convergência
        if (connection.to === bifurcation.convergenceNodeId) {
            // Verificar se a origem está em um dos ramos
            const isFromUpperBranch = bifurcation.branches.upper.includes(connection.from);
            const isFromLowerBranch = bifurcation.branches.lower.includes(connection.from);
            
            return isFromUpperBranch || isFromLowerBranch;
        }
    }
    
    return false;
}

/**
 * Aplica suavização inteligente baseada no ângulo de convergência
 */
function calculateSmartSmoothingFactor(convergenceAngle: number): number {
    // Ângulos mais agudos precisam de mais suavização
    if (convergenceAngle < 30) return 0.9;
    if (convergenceAngle < 60) return 0.7;
    if (convergenceAngle < 90) return 0.5;
    return 0.3; // Ângulos obtusos precisam de menos suavização
}

// src-code/lib/connectors.ts
/// <reference types="@figma/plugin-typings" />

import type { NodeData, Connection } from '@shared/types/flow.types';
import type { RGB } from '../config/theme.config'; // Importa tipo RGB
import * as LayoutConfig from '../config/layout.config'; // Configurações de layout (sem tipos problemáticos agora)
import * as StyleConfig from '../config/styles.config'; // Configurações de estilo (sem tipos problemáticos agora)
import { nodeCache } from '../utils/nodeCache';

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

            // Valida se os nós existem no mapa
            if (!fromNode || !toNode || !fromNodeData) {
                console.warn(`[Connectors] Nó/dados ausentes para conexão: ${conn.from} -> ${conn.to}. Pulando.`);
                continue;
            }

            // Determina a configuração do conector (layout, tipo, magnets)
            // Agora usa a função que aceita/retorna strings onde os tipos falhavam
            const config = determineConnectorConfig(conn, fromNode, fromNodeData, incomingPrimaryCounts[conn.to] || 0, nodeOutgoingPrimaryConnections);

            // Cria o nó conector
            const connector = figma.createConnector();
            const fromNodeName = fromNodeData.name || conn.from;
            const toNodeName = nodeDataMap[conn.to]?.name || conn.to;
            connector.name = `Connector: ${fromNodeName} -> ${toNodeName}`;

            // Define o tipo da linha (a API aceita a string, faz cast opcional para clareza)
            connector.connectorLineType = config.lineType as ConnectorLineType;

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
    fromNodeData: NodeData,
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
            connector.connectorStart = { endpointNodeId: fromNodeId, magnet: (startConnection.magnet ?? "AUTO") as ConnectorMagnet };
        }
        // A API aceita a string do magnet, faz cast
        connector.connectorEnd = { endpointNodeId: toNodeId, magnet: (endMagnet ?? "AUTO") as ConnectorMagnet };
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
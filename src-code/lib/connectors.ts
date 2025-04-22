// src-code/lib/connectors.ts
/// <reference types="@figma/plugin-typings" />

import type { NodeData, Connection } from '@shared/types/flow.types';
import type { RGB } from '../config/theme.config'; // Importa tipo RGB
import * as LayoutConfig from '../config/layout.config';
import * as StyleConfig from '../config/styles.config'; // Para fontes, etc. (NÃO cores)
import { nodeCache } from '../utils/nodeCache';

// --- Interfaces Internas ---
interface ConnectorStyleBaseConfig {
    STROKE_WEIGHT: number;
    DASH_PATTERN: number[];
    END_CAP: ConnectorStrokeCap;
}

interface DeterminedConnectorConfig {
    styleBase: ConnectorStyleBaseConfig;
    startConnection: { magnet?: ConnectorMagnet; position?: { x: number, y: number } };
    endMagnet: ConnectorMagnet;
    lineType: ConnectorLineType;
    placeLabelNearStart: boolean;
    actualStartMagnetForLabel: ConnectorMagnet;
    isSecondary: boolean; // Adicionado para saber qual estilo base usar
}

// --- Função Principal ---
export namespace Connectors {
    export async function createConnectors(
        connections: Array<Connection>,
        nodeMap: { [id: string]: SceneNode },
        nodeDataMap: { [id: string]: NodeData },
        finalColors: Record<string, RGB> // <<< Recebe as cores (ainda necessário para labels de conector)
    ): Promise<void> {

         try {
            // Carregar fonte para labels (usa fonte de StyleConfig.Labels)
            await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        } catch (e: any) {
            console.error("[Connectors] Erro ao carregar fonte para etiquetas:", e);
            // Notifica o usuário Figma se houver erro no carregamento das fontes essenciais
            figma.notify(`Erro ao carregar fonte para etiquetas: ${e?.message || e}`, { error: true });
            // Continua mesmo sem a fonte para não travar
        }

        // Lógica de contagem de conexões permanece igual
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

        for (const conn of connections) {
            const fromNode = nodeMap[conn.from];
            const toNode = nodeMap[conn.to];
            const fromNodeData = nodeDataMap[conn.from];

            if (!fromNode || !toNode || !fromNodeData) {
                console.warn(`[Connectors] Nó/dados ausentes para conexão: ${conn.from} -> ${conn.to}. Pulando.`);
                continue;
            }

            // Determina a configuração (layout e tipo)
            const config = determineConnectorConfig(conn, fromNode, fromNodeData, incomingPrimaryCounts[conn.to] || 0, nodeOutgoingPrimaryConnections);

            // Cria o conector
            const connector = figma.createConnector();
            const fromNodeName = fromNodeData.name || conn.from;
            const toNodeName = nodeDataMap[conn.to]?.name || conn.to;
            connector.name = `Connector: ${fromNodeName} -> ${toNodeName}`;
            connector.connectorLineType = config.lineType;

            // Anexa endpoints
            attachConnectorEndpoints(connector, fromNode.id, toNode.id, config.startConnection, config.endMagnet);

            // Aplica Estilo (agora com cor fixa para a linha)
            applyConnectorStyle(connector, config.styleBase, config.isSecondary); // <<< REMOVIDO finalColors

            // Cria Label (passando cores para o label frame/texto)
            const labelText = conn.conditionLabel || conn.condition;
            // CORRIGIDO: Só cria label se for conexão de DECISION e tiver texto
            if (labelText && labelText.trim() !== '' && fromNodeData.type === 'DECISION') {
                labelCreationPromises.push(
                    createConnectorLabel(labelText, fromNode, toNode, config.actualStartMagnetForLabel, config.placeLabelNearStart, finalColors) // Passa finalColors para colorir o LABEL
                        .catch(err => {
                            console.error(`[Connectors] Falha ao criar etiqueta para ${conn.from}->${conn.to}:`, err);
                            const errorMessage = (err instanceof Error) ? err.message : String(err);
                            figma.notify(`Erro ao criar etiqueta '${labelText}': ${errorMessage}`, { error: true });
                        })
                );
            } else if (labelText && fromNodeData.type !== 'DECISION') {
                 // Opcional: Logar se um label foi ignorado porque não é de Decision
                 console.log(`[Connectors] Debug: Ignorando label '${labelText}' para conexão ${conn.from} -> ${conn.to} (não é de Decision).`);
            }
        } // Fim do loop de conexões

        try {
            await Promise.all(labelCreationPromises);
            console.log("[Connectors] Criação de conectores e etiquetas concluída.");
        } catch (overallError: any) {
             console.error("[Connectors] Erro inesperado durante criação das etiquetas:", overallError);
             figma.notify(`Ocorreu um erro durante a criação das etiquetas: ${overallError?.message || overallError}`, { error: true });
        }
    }
}

// --- Funções Auxiliares ---

// Função determineConnectorConfig permanece focada no layout e tipo
function determineConnectorConfig(
    conn: Connection,
    fromNode: SceneNode,
    fromNodeData: NodeData,
    incomingPrimaryCountToTarget: number,
    nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<Connection> }
): DeterminedConnectorConfig {

    const isDecisionOrigin = fromNodeData.type === 'DECISION';
    const isSecondary = conn.secondary === true;
    const isConvergingPrimary = incomingPrimaryCountToTarget > 1 && !isSecondary;

    // Usa as bases de estilo NÃO-COR de StyleConfig
    let styleBase: ConnectorStyleBaseConfig = isSecondary ? StyleConfig.Connectors.SECONDARY : StyleConfig.Connectors.PRIMARY;
    let startConnection: { magnet?: ConnectorMagnet; position?: { x: number; y: number } } = {};
    let finalLineType: ConnectorLineType = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE : LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
    let placeLabelNearStart = false;
    let finalEndMagnet: ConnectorMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
    let finalStartMagnetForLabel: ConnectorMagnet = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET : LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;

    // Lógica de decisão (igual à anterior, focada em layout/magnets/lineType)
    if (isSecondary) {
        finalLineType = LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE;
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET;
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        startConnection = { magnet: finalStartMagnetForLabel };
        placeLabelNearStart = false; // Labels secundários não ficam perto do início por padrão
    } else if (isDecisionOrigin) {
        placeLabelNearStart = true; // Labels de decisão ficam perto do início por padrão
        finalLineType = LayoutConfig.Connectors.DECISION_PRIMARY_LINE_TYPE;
        const primaryOutputs = nodeOutgoingPrimaryConnections[conn.from] || [];
        // Encontra o índice da conexão para determinar o magnet de saída na decisão
        const index = primaryOutputs.findIndex(c => (conn.id && c.id === conn.id) || (!conn.id && c.from === conn.from && c.to === conn.to && c.conditionLabel === conn.conditionLabel)); // Usar conditionLabel para diferenciar se IDs não existem
        const seq = LayoutConfig.Connectors.DECISION_PRIMARY_MAGNET_SEQUENCE;
        let targetMagnet: ConnectorMagnet = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        if (index !== -1) { targetMagnet = seq[index % seq.length]; }
        else { console.warn(`[Connectors] Conexão primária não encontrada para decisão ${conn.from} -> ${conn.to}. Usando fallback ${targetMagnet}.`); }
        finalStartMagnetForLabel = targetMagnet; // O label usa o magnet de saída da decisão
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        let startX: number, startY: number;
        // Calcula a posição exata no frame da decisão com base no magnet
        const nodeWidth = fromNode.width; // Usa largura real
        const nodeHeight = fromNode.height; // Usa altura real

        // Calcula a posição exata no frame da decisão com base no magnet
        switch (targetMagnet) {
            case 'TOP':    startX = nodeWidth / 2; startY = 0; break;
            case 'RIGHT':  startX = nodeWidth;     startY = nodeHeight / 2; break;
            case 'BOTTOM': startX = nodeWidth / 2; startY = nodeHeight; break;
            case 'LEFT':   startX = 0;             startY = nodeHeight / 2; break;
            case 'CENTER': startX = nodeWidth / 2; startY = nodeHeight / 2; break;
            case 'AUTO':   startX = nodeWidth / 2; startY = nodeHeight; finalStartMagnetForLabel = 'BOTTOM'; break; // Fallback se for AUTO
            default:       startX = nodeWidth;     startY = nodeHeight / 2; finalStartMagnetForLabel = 'RIGHT'; break; // Fallback
        }
        startConnection = { position: { x: startX, y: startY } }; // Conexão START da Decisão usa POSIÇÃO, não MAGNET
    } else if (isConvergingPrimary) {
        finalLineType = LayoutConfig.Connectors.CONVERGENCE_PRIMARY_LINE_TYPE;
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        startConnection = { magnet: finalStartMagnetForLabel }; // Conexão START padrão usa MAGNET
        placeLabelNearStart = false;
    } else {
        // Primário Padrão
        finalLineType = LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        if (finalLineType === "STRAIGHT") {
            // Para linhas STRAIGHT, usar CENTER-CENTER geralmente funciona melhor
            startConnection = { magnet: "CENTER" };
            finalEndMagnet = "CENTER";
        } else {
             startConnection = { magnet: finalStartMagnetForLabel }; // Conexão START padrão usa MAGNET
        }
        placeLabelNearStart = false;
    }

    return {
        styleBase,
        startConnection,
        endMagnet: finalEndMagnet,
        lineType: finalLineType,
        placeLabelNearStart,
        actualStartMagnetForLabel: finalStartMagnetForLabel,
        isSecondary // Passa a informação se é secundário
    };
}

// Aplica estilo (agora com cor fixa para a linha)
// CORRIGIDO: Remove finalColors e usa cor fixa
function applyConnectorStyle(
    connector: ConnectorNode,
    styleBase: ConnectorStyleBaseConfig,
    isSecondary: boolean // Ainda útil para dashPattern e endCap
): void {
    try {
        connector.connectorEndStrokeCap = styleBase.END_CAP;
        connector.dashPattern = styleBase.DASH_PATTERN;
        connector.strokeWeight = styleBase.STROKE_WEIGHT;

        // CORRIGIDO: Aplicar Cor FIXA (preto puro RGB 0-1)
        connector.strokes = [{ type: "SOLID", color: {r:0, g:0, b:0} }]; // Cor preta fixa

    } catch(e: any) {
        console.error(`[Connectors] Erro ao aplicar estilo ao conector ${connector.name || connector.id}: ${e?.message || e}`);
    }
}

// Função attachConnectorEndpoints permanece igual (não lida com cores)
function attachConnectorEndpoints(
    connector: ConnectorNode,
    fromNodeId: string,
    toNodeId: string,
    startConnection: { magnet?: ConnectorMagnet; position?: { x: number, y: number } },
    endMagnet: ConnectorMagnet
): void {
    try {
        if (startConnection.position) {
            connector.connectorStart = { endpointNodeId: fromNodeId, position: startConnection.position };
        } else {
            connector.connectorStart = { endpointNodeId: fromNodeId, magnet: startConnection.magnet ?? "AUTO" };
        }
        connector.connectorEnd = { endpointNodeId: toNodeId, magnet: endMagnet ?? "AUTO" };
    } catch (e: any) {
         console.error(`[Connectors] Erro ao anexar conector ${connector.name}:`, e);
         figma.notify(`Erro ao conectar nó ${fromNodeId} -> ${toNodeId}: ${e?.message || e}`, { error: true });
    }
}

/**
 * Cria o frame da etiqueta para um conector.
 * Usa as constantes de padding de StyleConfig.Labels.
 */
async function createConnectorLabel(
    labelText: string,
    fromNode: SceneNode,
    toNode: SceneNode,
    actualStartMagnetForLabel: ConnectorMagnet,
    placeNearStart: boolean,
    finalColors: Record<string, RGB> // <<< Recebe cores (para colorir o label)
): Promise<void> {
    // Esta função só é chamada se labelText não for vazio e a origem for DECISION (agora controlado em createConnectors)

    let labelFrame: FrameNode | null = null;
     try {
        labelFrame = figma.createFrame();
        labelFrame.name = `Condition: ${labelText}`;
        labelFrame.layoutMode = "HORIZONTAL";
        labelFrame.primaryAxisSizingMode = "AUTO";
        labelFrame.counterAxisSizingMode = "AUTO";

        // CORRIGIDO: Usar as constantes corretas para padding de labels/chips de descrição
        labelFrame.paddingLeft = labelFrame.paddingRight = StyleConfig.Labels.DESC_CHIP_PADDING_HORIZONTAL;
        labelFrame.paddingTop = labelFrame.paddingBottom = StyleConfig.Labels.DESC_CHIP_PADDING_VERTICAL;

        labelFrame.cornerRadius = StyleConfig.Labels.DESC_CHIP_CORNER_RADIUS; // Usa raio dos labels/chips de descrição
        labelFrame.strokes = []; // Sem borda por padrão

        // Aplicar Cores do Tema (usando cores de chip default para o LABEL)
        const labelFillToken = 'chips_default_fill'; // Labels de conector usam chips_default
        if (finalColors[labelFillToken]) {
             labelFrame.fills = [{ type: 'SOLID', color: finalColors[labelFillToken] }];
        } else { console.warn(`[Connectors] Cor não encontrada para ${labelFillToken}. Usando fallback cinza.`); labelFrame.fills = [{ type: 'SOLID', color: {r:0.8,g:0.8,b:0.8}}]; } // Fallback

        const labelTextNode = figma.createText();
        labelTextNode.fontName = StyleConfig.Labels.FONT; // Usa fonte dos labels/chips
        labelTextNode.characters = labelText;
        labelTextNode.fontSize = StyleConfig.Labels.DESC_CHIP_FONT_SIZE; // Usa tamanho dos labels/chips de descrição
        labelTextNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Essencial para HUG

         // Aplicar Cores do Tema (usando cores de chip default para o TEXTO do LABEL)
        const labelTextToken = 'chips_default_text'; // Labels de conector usam chips_default
        if (finalColors[labelTextToken]) {
            labelTextNode.fills = [{ type: 'SOLID', color: finalColors[labelTextToken] }];
        } else { console.warn(`[Connectors] Cor não encontrada para ${labelTextToken}. Usando fallback preto.`); labelTextNode.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0}}]; } // Fallback

        labelFrame.appendChild(labelTextNode);
        (fromNode.parent || figma.currentPage).appendChild(labelFrame); // Adiciona o labelFrame à página

        // Lógica de posicionamento (igual à anterior, agora que o frame tem AutoLayout e padding)
        // É necessário esperar um tick para o Auto Layout calcular o tamanho do labelFrame
        await new Promise(resolve => setTimeout(resolve, 0));
        const labelWidth = labelFrame.width;
        const labelHeight = labelFrame.height;
        let targetX: number;
        let targetY: number;
        const offsetNear = LayoutConfig.Connectors.LABEL_OFFSET_NEAR_START;
        const offsetMidY = LayoutConfig.Connectors.LABEL_OFFSET_MID_LINE_Y;
        const fromNodeWidth = fromNode.width; // Usa largura real do nó
        const fromNodeHeight = fromNode.height; // Usa altura real do nó
        const toNodeHeight = toNode.height; // Usa altura real do nó

        if (placeNearStart) { /* Lógica de posicionamento near start (Decisions) */
             // Calcula a posição do ponto de saída do conector no nó de origem
             let startPointX: number, startPointY: number;
             // Se a conexão de origem usa POSITION (como decisão), usa essa posição
             // Acessa a propriedade connectorStart diretamente para obter a posição/magnet
             const startConn = (fromNode as ConnectorNode).connectorStart; // Pode precisar verificar o tipo ConnectorNode/SceneNode
              if (startConn && 'position' in startConn && startConn.position) {
                  startPointX = fromNode.x + startConn.position.x;
                  startPointY = fromNode.y + startConn.position.y;
              } else {
                 // Se usa MAGNET, estima a posição no centro do lado correspondente
                 // Fallback se connectorStart.position não estiver disponível ou o nó não for ConnectorNode
                 let estimatedX, estimatedY;
                 switch (actualStartMagnetForLabel) {
                    case 'TOP':    estimatedX = fromNode.x + fromNodeWidth / 2; estimatedY = fromNode.y; break;
                    case 'RIGHT':  estimatedX = fromNode.x + fromNodeWidth;     estimatedY = fromNode.y + fromNodeHeight / 2; break;
                    case 'BOTTOM': estimatedX = fromNode.x + fromNodeWidth / 2; estimatedY = fromNode.y + fromNodeHeight; break;
                    case 'LEFT':   estimatedX = fromNode.x;             estimatedY = fromNode.y + fromNodeHeight / 2; break;
                    case 'CENTER': estimatedX = fromNode.x + fromNodeWidth / 2; estimatedY = fromNode.y + fromNodeHeight / 2; break;
                    default:       estimatedX = fromNode.x + fromNodeWidth;     estimatedY = fromNode.y + fromNodeHeight / 2; break; // Fallback RIGHT
                }
                startPointX = estimatedX;
                startPointY = estimatedY;
                 console.warn(`[Connectors] Usando posição estimada para label near start. Conector de ${fromNode.name} pode não ser ConnectorNode ou position não disponível.`);
             }


             // Calcula a posição alvo do label com base no ponto de saída e offset
             switch (actualStartMagnetForLabel) {
                case 'TOP':    targetX = startPointX; targetY = startPointY - offsetNear - labelHeight / 2; break;
                case 'RIGHT':  targetX = startPointX + offsetNear + labelWidth / 2; targetY = startPointY; break;
                case 'BOTTOM': targetX = startPointX; targetY = startPointY + offsetNear + labelHeight / 2; break;
                case 'LEFT':   targetX = startPointX - offsetNear - labelWidth / 2; targetY = startPointY; break;
                case 'CENTER': targetX = startPointX; targetY = startPointY - offsetNear - labelHeight / 2; break; // Para CENTER, posicionar acima? Ajustar conforme design
                default:       targetX = startPointX + offsetNear + labelWidth / 2; targetY = startPointY; break; // Fallback RIGHT
            }

        } else { /* Lógica de posicionamento mid line (outros casos, embora agora só Decisions tenham labels) */
             // Estima os pontos de início e fim da linha para calcular o ponto médio
             // Pode ser impreciso dependendo do tipo de linha (Elbowed vs Straight)
             let startX = fromNode.x; let startY = fromNode.y;
             // Tenta obter a posição real do start point do conector se for um ConnectorNode
             const startConn = (fromNode as ConnectorNode).connectorStart;
             if (startConn && 'position' in startConn && startConn.position) {
                 startX = fromNode.x + startConn.position.x;
                 startY = fromNode.y + startConn.position.y;
             } else {
                 // Fallback para estimativa baseada no magnet se a posição real não estiver disponível
                if      (actualStartMagnetForLabel === 'RIGHT')  { startX += fromNodeWidth; startY += fromNodeHeight / 2; }
                else if (actualStartMagnetForLabel === 'BOTTOM') { startX += fromNodeWidth / 2; startY += fromNodeHeight; }
                else if (actualStartMagnetForLabel === 'LEFT')   { startY += fromNodeHeight / 2; }
                else if (actualStartMagnetForLabel === 'TOP')    { startX += fromNodeWidth / 2; }
                else if (actualStartMagnetForLabel === 'CENTER') { startX += fromNodeWidth / 2; startY += fromNodeHeight / 2; }
                else                                             { startX += fromNodeWidth / 2; startY += fromNodeHeight / 2; } // Fallback
             }

            const endX = toNode.x + toNode.width / 2; // Centro X do nó de destino
            const endY = toNode.y + toNodeHeight / 2; // Centro Y do nó de destino

            targetX = (startX + endX) / 2; // Ponto médio X
            targetY = (startY + endY) / 2 + offsetMidY; // Ponto médio Y + offset vertical

        }
        labelFrame.x = targetX - labelWidth / 2; // Posiciona o centro do label no ponto alvo
        labelFrame.y = targetY - labelHeight / 2; // Posiciona o centro do label no ponto alvo

    } catch (error: any) {
        console.error(`[Connectors] Erro ao criar ou posicionar etiqueta '${labelText}':`, error);
        if (labelFrame && !labelFrame.removed) {
             try { labelFrame.remove(); } catch (removeError) { /* Ignora erro na remoção */ }
        }
    }
}
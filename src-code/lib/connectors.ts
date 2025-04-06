import { hexToRgb } from "../utils/hexToRgb"; // Manter se ainda necessário aqui, senão usar cores do config
import { nodeCache } from "../utils/nodeCache";
import { NodeData } from "../../src/lib/types"; // Garanta que este tipo exista e seja importado corretamente
import * as StyleConfig from "../config/styles.config";
import * as LayoutConfig from "../config/layout.config";

// Tipos redefinidos localmente para clareza, usando os tipos base do Figma onde disponíveis
type FigmaConnectorMagnet = ConnectorMagnet | "AUTO" | "TOP" | "LEFT" | "BOTTOM" | "RIGHT" | "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT";
type FigmaConnectorLineType = ConnectorLineType | "STRAIGHT" | "ELBOWED" | "CURVED";
type FigmaPaint = ReadonlyArray<Paint>; // Reutilizar tipo do Figma se possível

// Interface para a configuração do conector, para melhor tipagem interna
interface ConnectorStyleConfig {
    STROKE: FigmaPaint;
    STROKE_WEIGHT: number;
    DASH_PATTERN: number[];
    END_CAP: StrokeCap; // Usar o tipo base StrokeCap
}

// --- Função Principal Refatorada ---
export namespace Connectors {
    export async function createConnectors(
        connections: Array<{ id?: string; from: string; to: string; condition?: string; secondary?: boolean }>, // Adicionar 'id' se disponível no JSON
        nodeMap: { [id: string]: SceneNode },
        nodeDataMap: { [id: string]: NodeData }
    ): Promise<void> {
        try {
            // Carregar fonte para etiquetas usando a definição do config
            await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        } catch (e) {
            console.error("Erro ao carregar fonte para etiquetas:", e);
            figma.notify("Erro ao carregar fonte para as etiquetas.", { error: true });
        }

        // 1. Pré-calcular contagens e mapeamentos
        const outgoingPrimaryCounts: { [nodeId: string]: number } = {};
        const nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<any> } = {};
        const incomingPrimaryCounts: { [nodeId: string]: number } = {};

        connections.forEach(conn => {
            if (!conn.secondary) {
                outgoingPrimaryCounts[conn.from] = (outgoingPrimaryCounts[conn.from] || 0) + 1;
                if (!nodeOutgoingPrimaryConnections[conn.from]) {
                    nodeOutgoingPrimaryConnections[conn.from] = [];
                }
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
                console.warn(`[Connectors] Nó ou dados não encontrados para conexão: ${conn.from} -> ${conn.to}`);
                continue;
            }

            // 2. Determinar configuração usando função auxiliar
            const config = determineConnectorConfig(conn, fromNodeData, incomingPrimaryCounts[conn.to] || 0, nodeOutgoingPrimaryConnections);

            // 3. Criar Conector
            const connector = figma.createConnector();

            // 4. Aplicar Estilo
            applyConnectorStyle(connector, config.styleBase, config.lineType);

            // 5. Anexar Endpoints
            attachConnectorEndpoints(connector, fromNode.id, toNode.id, config.startMagnet, config.endMagnet);

            // 6. Agendar Criação da Etiqueta
            if (conn.condition) {
                labelCreationPromises.push(
                    createConnectorLabel(conn.condition, fromNode, toNode, config.startMagnet, config.placeLabelNearStart)
                );
            }
        }

        // 7. Aguardar todas as etiquetas serem criadas
        await Promise.all(labelCreationPromises);
        console.log("[Connectors] Criação de conectores e etiquetas concluída.");
    }
}

// --- Função Auxiliar para Determinar Configuração ---
interface DeterminedConnectorConfig {
    styleBase: ConnectorStyleConfig;
    startMagnet: FigmaConnectorMagnet;
    endMagnet: FigmaConnectorMagnet;
    lineType: FigmaConnectorLineType;
    placeLabelNearStart: boolean;
}

function determineConnectorConfig(
    conn: { id?: string; from: string; to: string; condition?: string; secondary?: boolean },
    fromNodeData: NodeData,
    incomingPrimaryCountToTarget: number,
    nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<any> }
): DeterminedConnectorConfig {

    const isDecisionOrigin = fromNodeData.type === 'DECISION';
    const isSecondary = conn.secondary === true;
    const isConvergingPrimary = incomingPrimaryCountToTarget > 1 && !isSecondary;

    let styleBase: ConnectorStyleConfig = isSecondary ? StyleConfig.Connectors.SECONDARY : StyleConfig.Connectors.PRIMARY;
    let startMagnet: FigmaConnectorMagnet = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET : LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
    let lineType: FigmaConnectorLineType = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE : LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
    let placeLabelNearStart = false;
    const endMagnet: FigmaConnectorMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;

    if (isDecisionOrigin) {
        placeLabelNearStart = true; // Etiquetas perto do início para decisões
        lineType = isSecondary ? LayoutConfig.Connectors.DECISION_SECONDARY_LINE_TYPE : LayoutConfig.Connectors.DECISION_PRIMARY_LINE_TYPE;

        if (isSecondary) {
            startMagnet = LayoutConfig.Connectors.DECISION_SECONDARY_START_MAGNET; // BOTTOM
        } else {
            // Atribui magnet baseado na sequência TOP, RIGHT, BOTTOM
            const primaryOutputs = nodeOutgoingPrimaryConnections[conn.from] || [];
            // Tenta encontrar pelo ID único da conexão se disponível, senão pela combinação from/to
            const index = primaryOutputs.findIndex(c => (conn.id && c.id === conn.id) || (c.from === conn.from && c.to === conn.to));
            const seq = LayoutConfig.Connectors.DECISION_PRIMARY_MAGNET_SEQUENCE;

            if (index >= 0 && index < seq.length) {
                startMagnet = seq[index];
            } else {
                startMagnet = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET; // Fallback (RIGHT)
                console.warn(`[Connectors] Índice de saída primária inválido (${index}) para decisão ${conn.from}. Usando fallback ${startMagnet}.`);
            }
        }
    } else if (isConvergingPrimary) {
        // Nó de destino é convergente e esta conexão é primária
        lineType = LayoutConfig.Connectors.CONVERGENCE_PRIMARY_LINE_TYPE; // ELBOWED
        // startMagnet e placeLabelNearStart mantêm os defaults (RIGHT, false)
    }
    // Outros casos (Secundária Padrão, Primária Padrão) já estão cobertos pelos defaults

    return { styleBase, startMagnet, endMagnet, lineType, placeLabelNearStart };
}


// --- Funções Auxiliares de Aplicação e Criação ---

function applyConnectorStyle(
    connector: ConnectorNode,
    styleBase: ConnectorStyleConfig,
    lineType: FigmaConnectorLineType
): void {
    connector.connectorLineType = lineType;
    connector.connectorEndStrokeCap = styleBase.END_CAP;
    connector.dashPattern = styleBase.DASH_PATTERN;
    connector.strokes = styleBase.STROKE;
    connector.strokeWeight = styleBase.STROKE_WEIGHT;
}

function attachConnectorEndpoints(
    connector: ConnectorNode,
    fromNodeId: string,
    toNodeId: string,
    startMagnet: FigmaConnectorMagnet,
    endMagnet: FigmaConnectorMagnet
): void {
    try {
        connector.connectorStart = {
            endpointNodeId: fromNodeId,
            magnet: startMagnet,
        };
        connector.connectorEnd = {
            endpointNodeId: toNodeId,
            magnet: endMagnet,
        };
    } catch (e) {
         console.error(`[Connectors] Erro ao anexar conector: ${fromNodeId} (${startMagnet}) -> ${toNodeId} (${endMagnet})`, e);
         // Considerar remover o conector problemático ou notificar erro
         // connector.remove(); // CUIDADO: pode deixar o fluxo incompleto
         figma.notify(`Erro ao conectar ${fromNodeId} a ${toNodeId}. Verifique os IDs e o layout.`, { error: true });
    }
}

async function createConnectorLabel(
    labelText: string,
    fromNode: SceneNode,
    toNode: SceneNode,
    startMagnet: FigmaConnectorMagnet,
    placeNearStart: boolean
): Promise<void> {
    // Usa constantes de StyleConfig e LayoutConfig
    const labelFrame = figma.createFrame();
    labelFrame.name = `Condition: ${labelText}`;
    labelFrame.layoutMode = "HORIZONTAL";
    labelFrame.primaryAxisSizingMode = "AUTO";
    labelFrame.counterAxisSizingMode = "AUTO";
    labelFrame.paddingLeft = labelFrame.paddingRight = StyleConfig.Labels.PADDING_HORIZONTAL;
    labelFrame.paddingTop = labelFrame.paddingBottom = StyleConfig.Labels.PADDING_VERTICAL;
    labelFrame.fills = StyleConfig.Labels.FILL;
    labelFrame.cornerRadius = StyleConfig.Labels.CORNER_RADIUS;
    labelFrame.strokes = [];

    const labelTextNode = figma.createText();
    // Fonte deve ter sido carregada na função principal
    labelTextNode.fontName = StyleConfig.Labels.FONT;
    labelTextNode.characters = labelText;
    labelTextNode.fontSize = StyleConfig.Labels.FONT_SIZE;
    labelTextNode.fills = StyleConfig.Labels.TEXT_COLOR;

    labelFrame.appendChild(labelTextNode);
    figma.currentPage.appendChild(labelFrame);

    let targetX: number;
    let targetY: number;
    const offsetNear = LayoutConfig.Connectors.LABEL_OFFSET_NEAR_START;
    const offsetMidY = LayoutConfig.Connectors.LABEL_OFFSET_MID_LINE_Y;

    if (placeNearStart) {
        // Posição perto do início (Decisões)
        switch (startMagnet) {
            case 'TOP':
                targetX = fromNode.x + fromNode.width / 2;
                targetY = fromNode.y - offsetNear;
                break;
            case 'RIGHT':
                targetX = fromNode.x + fromNode.width + offsetNear;
                targetY = fromNode.y + fromNode.height / 2;
                break;
            case 'BOTTOM':
                targetX = fromNode.x + fromNode.width / 2;
                targetY = fromNode.y + fromNode.height + offsetNear;
                break;
            default: // Fallback: centralizado acima
                targetX = fromNode.x + fromNode.width / 2;
                targetY = fromNode.y - offsetNear;
                console.warn(`[Connectors] Magnet de início inesperado '${startMagnet}' para etiqueta perto do início. Posicionando acima.`);
                break;
        }
    } else {
        // Posição no meio da linha (Outros casos) - lógica aproximada
        let startX = fromNode.x;
        let startY = fromNode.y;
        // Calcula ponto de partida aproximado baseado no magnet
        if (startMagnet === 'RIGHT') { startX += fromNode.width; startY += fromNode.height / 2; }
        else if (startMagnet === 'BOTTOM') { startX += fromNode.width / 2; startY += fromNode.height; }
        else if (startMagnet === 'LEFT') { startY += fromNode.height / 2; }
        else if (startMagnet === 'TOP') { startX += fromNode.width / 2; }
        else { startX += fromNode.width / 2; startY += fromNode.height / 2; } // Fallback centro

        const endX = toNode.x; // Assumindo endMagnet LEFT
        const endY = toNode.y + toNode.height / 2;

        targetX = (startX + endX) / 2;
        targetY = (startY + endY) / 2 + offsetMidY;
    }

    // Posiciona o centro do frame da etiqueta no ponto alvo
    labelFrame.x = targetX - labelFrame.width / 2;
    labelFrame.y = targetY - labelFrame.height / 2;
}
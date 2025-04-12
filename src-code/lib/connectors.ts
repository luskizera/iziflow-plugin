/// <reference types="@figma/plugin-typings" />

import { nodeCache } from "../utils/nodeCache";
import type { NodeData, Connection } from '../../src/lib/types'; // Ajuste o caminho se necessário
import * as StyleConfig from "../config/styles.config";
import * as LayoutConfig from "../config/layout.config";

// --- Interfaces Internas Usando Tipos Base do Figma ---
interface ConnectorStyleBaseConfig {
    STROKE: ReadonlyArray<Paint>;
    STROKE_WEIGHT: number;
    DASH_PATTERN: number[];
    END_CAP: StrokeCap; // <<< Direto do Figma
}

interface DeterminedConnectorConfig {
    styleBase: ConnectorStyleBaseConfig;
    startConnection: { magnet?: ConnectorMagnet; position?: { x: number, y: number } }; // <<< Direto do Figma
    endMagnet: ConnectorMagnet; // <<< Direto do Figma
    lineType: ConnectorLineType; // <<< Direto do Figma
    placeLabelNearStart: boolean;
    actualStartMagnetForLabel: ConnectorMagnet; // <<< Direto do Figma
}

// --- Função Principal ---
export namespace Connectors {
    export async function createConnectors(
        connections: Array<Connection>,
        nodeMap: { [id: string]: SceneNode },
        nodeDataMap: { [id: string]: NodeData }
    ): Promise<void> {
        // ... (código da função createConnectors igual à versão anterior,
        //      pois já usava os tipos base nas assinaturas das funções auxiliares) ...

        // Certifique-se que a implementação interna das funções auxiliares
        // como determineConnectorConfig, applyConnectorStyle, attachConnectorEndpoints
        // e createConnectorLabel esteja consistente com o uso dos tipos base.
        // A versão fornecida na resposta anterior já deve estar correta nesse sentido.

        // Exemplo de como a chamada interna se parece (inalterada):
         try {
            await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        } catch (e) {
            console.error("[Connectors] Erro ao carregar fonte:", e);
            figma.notify("Erro fonte etiquetas.", { error: true });
        }

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
                console.warn(`[Connectors] Nó/dados ausentes: ${conn.from} -> ${conn.to}. Pulando.`);
                continue;
            }

            const config = determineConnectorConfig(conn, fromNode, fromNodeData, incomingPrimaryCounts[conn.to] || 0, nodeOutgoingPrimaryConnections);

            const connector = figma.createConnector();
            connector.name = `Connector: ${conn.from} -> ${conn.to}`;

            applyConnectorStyle(connector, config.styleBase, config.lineType);

            attachConnectorEndpoints(connector, fromNode.id, toNode.id, config.startConnection, config.endMagnet);

            const labelText = conn.conditionLabel || conn.condition;
            if (labelText) {
                labelCreationPromises.push(
                    createConnectorLabel(labelText, fromNode, toNode, config.actualStartMagnetForLabel, config.placeLabelNearStart)
                );
            }
        }

        try {
            await Promise.all(labelCreationPromises);
            console.log("[Connectors] Criação concluída.");
        } catch (labelError) {
             console.error("[Connectors] Erro etiquetas:", labelError);
             figma.notify("Erro etiquetas.", { error: true });
        }
    }
}


// --- Função Auxiliar para Determinar Configuração (Usa e Retorna Tipos Base) ---
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

    let styleBase: ConnectorStyleBaseConfig = isSecondary ? StyleConfig.Connectors.SECONDARY : StyleConfig.Connectors.PRIMARY;
    let startConnection: { magnet?: ConnectorMagnet; position?: { x: number; y: number } } = {};
    let lineTypeDefault: ConnectorLineType = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE : LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
    let placeLabelNearStart = false;
    let endMagnetDefault: ConnectorMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
    let actualStartMagnetForLabelDefault: ConnectorMagnet = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET : LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;

    let finalLineType = lineTypeDefault;
    let finalStartMagnet = actualStartMagnetForLabelDefault;

    if (isSecondary) {
        finalLineType = LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE;
        finalStartMagnet = LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET;
        startConnection = { magnet: finalStartMagnet };
        placeLabelNearStart = false;

    } else if (isDecisionOrigin) {
        placeLabelNearStart = true;
        finalLineType = LayoutConfig.Connectors.DECISION_PRIMARY_LINE_TYPE;

        const primaryOutputs = nodeOutgoingPrimaryConnections[conn.from] || [];
        const index = primaryOutputs.findIndex(c => (conn.id && c.id === conn.id) || (c.from === conn.from && c.to === conn.to));
        const seq = LayoutConfig.Connectors.DECISION_PRIMARY_MAGNET_SEQUENCE;
        let targetMagnet: ConnectorMagnet = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;

        if (index >= 0 && index < seq.length) {
             targetMagnet = seq[index]; // Assume que seq só contém ConnectorMagnet válidos
        } else {
            console.warn(`[Connectors] Índice inválido (${index}) para decisão ${conn.from}. Usando fallback ${targetMagnet}.`);
        }
        finalStartMagnet = targetMagnet;

        let startX: number, startY: number;
        switch (targetMagnet) {
            case 'TOP':    startX = fromNode.width / 2; startY = 0; break;
            case 'RIGHT':  startX = fromNode.width;     startY = fromNode.height / 2; break;
            case 'BOTTOM': startX = fromNode.width / 2; startY = fromNode.height; break;
            default:       startX = fromNode.width / 2; startY = fromNode.height / 2; break;
        }
        startConnection = { position: { x: startX, y: startY } };

    } else if (isConvergingPrimary) {
        finalLineType = LayoutConfig.Connectors.CONVERGENCE_PRIMARY_LINE_TYPE;
        finalStartMagnet = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        startConnection = { magnet: finalStartMagnet };
        placeLabelNearStart = false;
    } else {
        finalLineType = LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
        finalStartMagnet = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        startConnection = { magnet: finalStartMagnet };
        placeLabelNearStart = false;
    }

    if (finalLineType === "STRAIGHT") {
        finalStartMagnet = "NONE";
        startConnection = { magnet: finalStartMagnet };
        endMagnetDefault = "NONE";
    }

    return {
        styleBase,
        startConnection,
        endMagnet: endMagnetDefault,
        lineType: finalLineType,
        placeLabelNearStart,
        actualStartMagnetForLabel: finalStartMagnet
    };
}


// --- Funções Auxiliares (Assinaturas usam tipos do Figma) ---

function applyConnectorStyle(
    connector: ConnectorNode,
    styleBase: ConnectorStyleBaseConfig,
    lineType: ConnectorLineType // <= Usa tipo base
): void {
    try {
        connector.connectorLineType = lineType;
        connector.connectorEndStrokeCap = styleBase.END_CAP; // Atribui direto
        connector.dashPattern = styleBase.DASH_PATTERN;
        connector.strokes = styleBase.STROKE;
        connector.strokeWeight = styleBase.STROKE_WEIGHT;
    } catch(e) {
        console.error(`[Connectors] Erro aplicar estilo ${connector.name || connector.id}:`, e);
    }
}

function attachConnectorEndpoints(
    connector: ConnectorNode,
    fromNodeId: string,
    toNodeId: string,
    startConnection: { magnet?: ConnectorMagnet; position?: { x: number, y: number } }, // <= Usa tipo base
    endMagnet: ConnectorMagnet // <= Usa tipo base
): void {
    try {
        if (startConnection.position) {
            connector.connectorStart = { endpointNodeId: fromNodeId, position: startConnection.position };
        } else {
            // Usa magnet, com fallback AUTO se for undefined
            connector.connectorStart = { endpointNodeId: fromNodeId, magnet: startConnection.magnet ?? "AUTO" };
        }
         // Usa endMagnet, com fallback AUTO se for undefined
        connector.connectorEnd = { endpointNodeId: toNodeId, magnet: endMagnet ?? "AUTO" };

    } catch (e) {
         console.error(`[Connectors] Erro anexar conector: ${fromNodeId} -> ${toNodeId}`, e);
         figma.notify(`Erro conectar ${fromNodeId} a ${toNodeId}.`, { error: true });
    }
}

async function createConnectorLabel(
    labelText: string,
    fromNode: SceneNode,
    toNode: SceneNode,
    actualStartMagnetForLabel: ConnectorMagnet, // <= Usa tipo base
    placeNearStart: boolean
): Promise<void> {
    if (!labelText || labelText.trim() === '') return;
    let labelFrame: FrameNode | null = null;
     try {
        labelFrame = figma.createFrame();
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
        labelTextNode.fontName = StyleConfig.Labels.FONT; // Usa FontName da config
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
            switch (actualStartMagnetForLabel) {
                case 'TOP':    targetX = fromNode.x + fromNode.width / 2; targetY = fromNode.y - offsetNear; break;
                case 'RIGHT':  targetX = fromNode.x + fromNode.width + offsetNear; targetY = fromNode.y + fromNode.height / 2; break;
                case 'BOTTOM': targetX = fromNode.x + fromNode.width / 2; targetY = fromNode.y + fromNode.height + offsetNear; break;
                default:       targetX = fromNode.x + fromNode.width / 2; targetY = fromNode.y - offsetNear; break;
            }
        } else {
            let startX = fromNode.x; let startY = fromNode.y;
            if (actualStartMagnetForLabel === 'RIGHT') { startX += fromNode.width; startY += fromNode.height / 2; }
            else if (actualStartMagnetForLabel === 'BOTTOM') { startX += fromNode.width / 2; startY += fromNode.height; }
            else if (actualStartMagnetForLabel === 'LEFT') { startY += fromNode.height / 2; }
            else if (actualStartMagnetForLabel === 'TOP') { startX += fromNode.width / 2; }
            else { startX += fromNode.width / 2; startY += fromNode.height / 2; }

            const endX = toNode.x;
            const endY = toNode.y + toNode.height / 2;

            targetX = (startX + endX) / 2;
            targetY = (startY + endY) / 2 + offsetMidY;
        }

        labelFrame.x = targetX - labelFrame.width / 2;
        labelFrame.y = targetY - labelFrame.height / 2;

    } catch (error) {
        console.error(`[Connectors] Erro etiqueta '${labelText}':`, error);
        if (labelFrame && !labelFrame.removed) { try { labelFrame.remove(); } catch (removeError) {} }
        throw error;
    }
}
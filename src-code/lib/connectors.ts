/// <reference types="@figma/plugin-typings" />

import { nodeCache } from "../utils/nodeCache";
import type { NodeData, Connection } from '@shared/types/flow.types';
import * as StyleConfig from "../config/styles.config";
import * as LayoutConfig from "../config/layout.config";

// --- Interfaces Internas Usando Tipos Base do Figma ---
interface ConnectorStyleBaseConfig {
    STROKE: ReadonlyArray<Paint>;
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
}

// --- Função Principal ---
export namespace Connectors {
    export async function createConnectors(
        connections: Array<Connection>,
        nodeMap: { [id: string]: SceneNode },
        nodeDataMap: { [id: string]: NodeData }
    ): Promise<void> {

         try {
            await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        } catch (e: any) {
            console.error("[Connectors] Erro ao carregar fonte para etiquetas:", e);
            figma.notify(`Erro ao carregar fonte: ${e?.message || e}`, { error: true });
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

            // >>> PONTO CHAVE: Esta função agora retorna a configuração correta <<<
            const config = determineConnectorConfig(conn, fromNode, fromNodeData, incomingPrimaryCounts[conn.to] || 0, nodeOutgoingPrimaryConnections);

            const connector = figma.createConnector();
            const fromNodeName = fromNodeData.name || conn.from;
            const toNodeName = nodeDataMap[conn.to]?.name || conn.to;
            connector.name = `Connector: ${fromNodeName} -> ${toNodeName}`;

            // Aplicar tipo de linha antes de anexar pode ajudar
            connector.connectorLineType = config.lineType;

            // Anexar endpoints usando a configuração determinada
            // A função attachConnectorEndpoints já lida com position vs magnet
            attachConnectorEndpoints(connector, fromNode.id, toNode.id, config.startConnection, config.endMagnet);

            // Aplicar o restante dos estilos
            applyConnectorStyle(connector, config.styleBase); // Passa apenas styleBase

            const labelText = conn.conditionLabel || conn.condition;
            if (labelText && labelText.trim() !== '') {
                labelCreationPromises.push(
                    createConnectorLabel(labelText, fromNode, toNode, config.actualStartMagnetForLabel, config.placeLabelNearStart)
                        .catch(err => {
                            console.error(`[Connectors] Falha ao criar etiqueta para ${conn.from}->${conn.to}:`, err);
                            const errorMessage = (err instanceof Error) ? err.message : String(err);
                            figma.notify(`Erro ao criar etiqueta '${labelText}': ${errorMessage}`, { error: true });
                        })
                );
            }
        }

        try {
            await Promise.all(labelCreationPromises);
            console.log("[Connectors] Criação de conectores e etiquetas concluída.");
        } catch (overallError: any) {
             console.error("[Connectors] Erro inesperado durante criação das etiquetas:", overallError);
             figma.notify(`Ocorreu um erro durante a criação das etiquetas: ${overallError?.message || overallError}`, { error: true });
        }
    }
}


// --- Função Auxiliar para Determinar Configuração ---
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
    let finalLineType: ConnectorLineType = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE : LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
    let placeLabelNearStart = false;
    let finalEndMagnet: ConnectorMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
    let finalStartMagnetForLabel: ConnectorMagnet = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET : LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;

    if (isSecondary) {
        // Lógica para conectores secundários (geralmente ELBOWED)
        finalLineType = LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE; // Provavelmente ELBOWED
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET; // Ex: BOTTOM
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET; // Ex: LEFT
        startConnection = { magnet: finalStartMagnetForLabel };
        placeLabelNearStart = false;

    } else if (isDecisionOrigin) {
        // Lógica para saídas de DECISION (geralmente ELBOWED, múltiplos magnets)
        placeLabelNearStart = true;
        finalLineType = LayoutConfig.Connectors.DECISION_PRIMARY_LINE_TYPE; // Provavelmente ELBOWED

        const primaryOutputs = nodeOutgoingPrimaryConnections[conn.from] || [];
        const index = primaryOutputs.findIndex(c => (conn.id && c.id === conn.id) || (!conn.id && c.from === conn.from && c.to === conn.to));
        const seq = LayoutConfig.Connectors.DECISION_PRIMARY_MAGNET_SEQUENCE;
        let targetMagnet: ConnectorMagnet = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;

        if (index !== -1) { targetMagnet = seq[index % seq.length]; }
        else { console.warn(`[Connectors] Conexão primária não encontrada para decisão ${conn.from} -> ${conn.to}. Usando fallback ${targetMagnet}.`); }

        finalStartMagnetForLabel = targetMagnet; // Magnet para lógica da label
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET; // Endpoint geralmente é padrão (LEFT)

        // Saídas de decisão geralmente usam posição fixa para evitar sobreposição
        let startX: number, startY: number;
        const nodeWidth = fromNode.width || StyleConfig.Nodes.DECISION.WIDTH;
        const nodeHeight = fromNode.height || StyleConfig.Nodes.DECISION.HEIGHT;
        switch (targetMagnet) {
            case 'TOP':    startX = nodeWidth / 2; startY = 0; break;
            case 'RIGHT':  startX = nodeWidth;     startY = nodeHeight / 2; break;
            case 'BOTTOM': startX = nodeWidth / 2; startY = nodeHeight; break;
            case 'LEFT':   startX = 0;             startY = nodeHeight / 2; break;
            default:       startX = nodeWidth;     startY = nodeHeight / 2; finalStartMagnetForLabel = 'RIGHT'; break; // Fallback
        }
        startConnection = { position: { x: startX, y: startY } }; // Usa posição

    } else if (isConvergingPrimary) {
        // Lógica para conexões primárias que chegam no mesmo nó (geralmente ELBOWED)
        finalLineType = LayoutConfig.Connectors.CONVERGENCE_PRIMARY_LINE_TYPE; // Provavelmente ELBOWED
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET; // Ex: RIGHT
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET; // Ex: LEFT
        startConnection = { magnet: finalStartMagnetForLabel };
        placeLabelNearStart = false;

    } else {
        // --- Lógica para Conexões Primárias Padrão ---
        finalLineType = LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE; // Definido como "STRAIGHT"
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET; // Definido como "RIGHT"
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET; // Definido como "LEFT"

        // >>>>> A CORREÇÃO CRÍTICA ESTÁ AQUI ABAIXO <<<<<
        // Se for STRAIGHT, ignora os magnets de borda e usa os permitidos
        if (finalLineType === "STRAIGHT") {
            console.log(`[Connectors] Ajustando magnets para STRAIGHT: ${conn.from} -> ${conn.to}`);
            // Usa CENTER para conectar ao centro dos nós
            startConnection = { magnet: "CENTER" };
            finalEndMagnet = "CENTER";
            // Mantém o 'finalStartMagnetForLabel' como 'RIGHT' (ou o original)
            // apenas para a lógica de *posicionamento da label*, se aplicável (placeNearStart=false aqui)
            // Mas o conector *real* usará CENTER.
        } else {
            // Se não for STRAIGHT (ex: se mudar o default para ELBOWED), usa os magnets calculados
             startConnection = { magnet: finalStartMagnetForLabel };
        }
        placeLabelNearStart = false; // Labels não ficam perto do início por padrão
    }

    // Retorna a configuração final
    return {
        styleBase,
        startConnection,         // Contém { magnet: 'CENTER' } ou { position: ... } ou { magnet: 'RIGHT/BOTTOM' }
        endMagnet: finalEndMagnet, // Contém 'CENTER' ou 'LEFT' (ou outro)
        lineType: finalLineType, // 'STRAIGHT' ou 'ELBOWED'
        placeLabelNearStart,
        actualStartMagnetForLabel: finalStartMagnetForLabel // O magnet original para cálculo da label
    };
}


// --- Funções Auxiliares de Aplicação e Criação ---

// Removido lineType daqui, pois já foi definido no conector antes de chamar attach
function applyConnectorStyle(
    connector: ConnectorNode,
    styleBase: ConnectorStyleBaseConfig
): void {
    try {
        // connector.connectorLineType = lineType; // Definido antes
        connector.connectorEndStrokeCap = styleBase.END_CAP;
        connector.dashPattern = styleBase.DASH_PATTERN;
        connector.strokes = styleBase.STROKE;
        connector.strokeWeight = styleBase.STROKE_WEIGHT;
    } catch(e: any) {
        console.error(`[Connectors] Erro ao aplicar estilo ao conector ${connector.name || connector.id}: ${e?.message || e}`);
    }
}

function attachConnectorEndpoints(
    connector: ConnectorNode,
    fromNodeId: string,
    toNodeId: string,
    startConnection: { magnet?: ConnectorMagnet; position?: { x: number, y: number } },
    endMagnet: ConnectorMagnet // Note que este endMagnet pode ser 'CENTER' agora para linhas retas
): void {
    try {
        // Lógica para endpoint inicial (posição ou magnet)
        if (startConnection.position) {
            // Se temos posição, o magnet é implicitamente 'NONE' para a API
            connector.connectorStart = { endpointNodeId: fromNodeId, position: startConnection.position };
        } else {
            // Se temos magnet (pode ser 'CENTER', 'RIGHT', 'BOTTOM', etc.)
            // Usar fallback 'AUTO' se magnet for undefined (não deveria acontecer com a lógica acima)
            connector.connectorStart = { endpointNodeId: fromNodeId, magnet: startConnection.magnet ?? "AUTO" };
        }

        // Lógica para endpoint final (sempre por magnet nesta implementação)
        // Usar fallback 'AUTO' se endMagnet for undefined
        connector.connectorEnd = { endpointNodeId: toNodeId, magnet: endMagnet ?? "AUTO" };

    } catch (e: any) {
         console.error(`[Connectors] Erro ao anexar conector ${connector.name}:`, e);
         // O erro específico da API será lançado aqui e capturado no loop principal
         // Exibir uma notificação genérica pode ser útil
         figma.notify(`Erro ao conectar nós (${fromNodeId} -> ${toNodeId}): ${e?.message || e}`, { error: true });
         // Re-lançar o erro para que o loop saiba que falhou? Opcional.
         // throw e;
    }
}

// Função createConnectorLabel permanece igual à versão completa anterior
async function createConnectorLabel(
    labelText: string,
    fromNode: SceneNode,
    toNode: SceneNode,
    actualStartMagnetForLabel: ConnectorMagnet,
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
        labelTextNode.fontName = StyleConfig.Labels.FONT;
        labelTextNode.characters = labelText;
        labelTextNode.fontSize = StyleConfig.Labels.FONT_SIZE;
        labelTextNode.fills = StyleConfig.Labels.TEXT_COLOR;

        labelFrame.appendChild(labelTextNode);
        (fromNode.parent || figma.currentPage).appendChild(labelFrame);

        await new Promise(resolve => setTimeout(resolve, 0));
        const labelWidth = labelFrame.width;
        const labelHeight = labelFrame.height;

        let targetX: number;
        let targetY: number;
        const offsetNear = LayoutConfig.Connectors.LABEL_OFFSET_NEAR_START;
        const offsetMidY = LayoutConfig.Connectors.LABEL_OFFSET_MID_LINE_Y;

        const fromNodeWidth = fromNode.width || 0;
        const fromNodeHeight = fromNode.height || 0;
        const toNodeHeight = toNode.height || 0;

        if (placeNearStart) {
            switch (actualStartMagnetForLabel) {
                case 'TOP':    targetX = fromNode.x + fromNodeWidth / 2; targetY = fromNode.y - offsetNear - labelHeight / 2; break;
                case 'RIGHT':  targetX = fromNode.x + fromNodeWidth + offsetNear + labelWidth / 2; targetY = fromNode.y + fromNodeHeight / 2; break;
                case 'BOTTOM': targetX = fromNode.x + fromNodeWidth / 2; targetY = fromNode.y + fromNodeHeight + offsetNear + labelHeight / 2; break;
                case 'LEFT':   targetX = fromNode.x - offsetNear - labelWidth / 2; targetY = fromNode.y + fromNodeHeight / 2; break;
                default:
                    targetX = fromNode.x + fromNodeWidth / 2;
                    targetY = fromNode.y - offsetNear - labelHeight / 2;
                    console.warn(`[Connectors Label] Magnet '${actualStartMagnetForLabel}' inesperado para 'NearStart'. Usando TOP.`);
                    break;
            }
        } else {
            let startX = fromNode.x; let startY = fromNode.y;
            if      (actualStartMagnetForLabel === 'RIGHT')  { startX += fromNodeWidth; startY += fromNodeHeight / 2; }
            else if (actualStartMagnetForLabel === 'BOTTOM') { startX += fromNodeWidth / 2; startY += fromNodeHeight; }
            else if (actualStartMagnetForLabel === 'LEFT')   { startY += fromNodeHeight / 2; }
            else if (actualStartMagnetForLabel === 'TOP')    { startX += fromNodeWidth / 2; }
            else                                             { startX += fromNodeWidth / 2; startY += fromNodeHeight / 2; }

            const endX = toNode.x;
            const endY = toNode.y + toNodeHeight / 2;

            targetX = (startX + endX) / 2;
            targetY = (startY + endY) / 2 + offsetMidY;
        }

        labelFrame.x = targetX - labelWidth / 2;
        labelFrame.y = targetY - labelHeight / 2;

    } catch (error: any) {
        console.error(`[Connectors] Erro ao criar ou posicionar etiqueta '${labelText}':`, error);
        if (labelFrame && !labelFrame.removed) {
             try { labelFrame.remove(); } catch (removeError) { /* Ignora erro na remoção */ }
        }
    }
}
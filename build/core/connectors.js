"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnectors = createConnectors;
function createConnectors(connections, nodes) {
    for (const conn of connections) {
        const fromNodeData = nodes.get(conn.from);
        const toNodeData = nodes.get(conn.to);
        if (fromNodeData && toNodeData) {
            const fromNode = fromNodeData.node;
            const toNode = toNodeData.node;
            const isDecisionNode = fromNodeData.type === "DECISION";
            const connector = figma.createConnector();
            connector.connectorStart = { endpointNodeId: fromNode.id, magnet: 'AUTO' };
            connector.connectorEnd = { endpointNodeId: toNode.id, magnet: 'AUTO' };
            if (isDecisionNode) {
                connector.connectorLineType = 'ELBOWED';
            }
            else {
                connector.connectorLineType = 'STRAIGHT';
            }
            connector.connectorEndStrokeCap = 'ARROW_LINES';
            connector.strokeWeight = 2;
            connector.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            if (isDecisionNode) {
                if (conn.conditionType === "negative") {
                    connector.dashPattern = [4, 4];
                }
                else {
                    connector.dashPattern = [];
                }
            }
            figma.currentPage.appendChild(connector);
            if (conn.conditionLabel) {
                figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
                    var _a;
                    const label = figma.createText();
                    label.characters = (_a = conn.conditionLabel) !== null && _a !== void 0 ? _a : "";
                    label.fontSize = 12;
                    label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                    label.x = (fromNode.x + fromNode.width + toNode.x) / 2 - (label.width / 2);
                    label.y = Math.min(fromNode.y, toNode.y) - 20;
                    figma.currentPage.appendChild(label);
                });
            }
        }
    }
}

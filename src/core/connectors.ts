import { Parser } from './parser'; // Adjust the import path as necessary

export function createConnectors(connections: Parser.ConnectionData[], nodes: Map<string, Parser.NodeWithType>): void {
  for (const conn of connections) {
    const fromNodeData = nodes.get(conn.from);
    const toNodeData = nodes.get(conn.to);

    if (fromNodeData && toNodeData) {
      const fromNode = fromNodeData.node;
      const toNode = toNodeData.node;
      const isDecisionNode = fromNodeData.type === "DECISION";

      // Usa ConnectorNode para todas as conexões
      const connector = figma.createConnector();
      connector.connectorStart = { endpointNodeId: fromNode.id, magnet: 'AUTO' };
      connector.connectorEnd = { endpointNodeId: toNode.id, magnet: 'AUTO' };

      if (isDecisionNode) {
        // Conector ELBOWED para decisionNodes
        connector.connectorLineType = 'ELBOWED';
      } else {
        // Conector STRAIGHT para outros nós
        connector.connectorLineType = 'STRAIGHT';
      }

      connector.connectorEndStrokeCap = 'ARROW_LINES';
      connector.strokeWeight = 2;
      connector.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];

      // Aplica estilo baseado no conditionType (somente para decisionNodes)
      if (isDecisionNode) {
        if (conn.conditionType === "negative") {
          connector.dashPattern = [4, 4]; // Linha tracejada para negativa
        } else {
          connector.dashPattern = []; // Linha normal para positiva
        }
      }

      figma.currentPage.appendChild(connector);

      // Adiciona o rótulo se houver conditionLabel (trata string | undefined)
      if (conn.conditionLabel) {
        figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
          const label = figma.createText();
          label.characters = conn.conditionLabel ?? ""; // TypeScript agora aceita, pois verificamos com if
          label.fontSize = 12;
          label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; // Preto
          // Posiciona o rótulo acima da conexão, ajustado para evitar sobreposição
          label.x = (fromNode.x + fromNode.width + toNode.x) / 2 - (label.width / 2);
          label.y = Math.min(fromNode.y, toNode.y) - 20; // Acima da linha, ajustado manualmente
          figma.currentPage.appendChild(label);
        });
      }
    }
  }
}
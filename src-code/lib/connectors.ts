export namespace Connectors {
  export function createConnectors(connections: any[], nodeMap: { [id: string]: SceneNode }): void {
    for (const conn of connections) {
      const fromNode = nodeMap[conn.from];
      const toNode = nodeMap[conn.to];

      if (fromNode && toNode) {
        const connector = figma.createConnector();
        
        if (conn.secondary === true) {
          createSecondaryConnector(connector, fromNode, toNode, conn);
        } else {
          createPrimaryConnector(connector, fromNode, toNode, conn);
        }
      }
    }
  }

  function createPrimaryConnector(
    connector: ConnectorNode,
    fromNode: SceneNode,
    toNode: SceneNode,
    conn: any
  ): void {
    connector.connectorLineType = "STRAIGHT";
    connector.connectorEndStrokeCap = "ARROW_LINES";
    connector.dashPattern = [];
    connector.strokes = [{ type: "SOLID", color: hexToRgb("#000000") }];
    connector.strokeWeight = 1;

    connector.connectorStart = {
      endpointNodeId: fromNode.id,
      position: { x: fromNode.width, y: fromNode.height / 2 }
    };

    connector.connectorEnd = {
      endpointNodeId: toNode.id,
      position: { x: 0, y: toNode.height / 2 }
    };

    if (conn.condition) {
      const startX = fromNode.x + fromNode.width;
      const startY = fromNode.y + fromNode.height / 2;
      const endX = toNode.x;
      const endY = toNode.y + toNode.height / 2;
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) + 1;
      
      createConditionChip(conn.condition, midX, midY);
    }
  }

  function createSecondaryConnector(
    connector: ConnectorNode,
    fromNode: SceneNode,
    toNode: SceneNode,
    conn: any
  ): void {
    connector.connectorLineType = "ELBOWED";
    connector.connectorEndStrokeCap = "ARROW_LINES";
    connector.dashPattern = [4, 4];
    connector.strokes = [{ type: "SOLID", color: hexToRgb("#939393") }];
    connector.strokeWeight = 1;

    const fromNodeBottomCenterX = fromNode.x + fromNode.width / 2;
    const fromNodeBottomCenterY = fromNode.y + fromNode.height;
    const verticalSegmentEndY = fromNodeBottomCenterY + 60;
    const horizontalSegmentEndX = fromNodeBottomCenterX - 910;

    connector.connectorStart = {
      endpointNodeId: fromNode.id,
      position: { x: fromNode.width / 2, y: fromNode.height }
    };

    connector.connectorEnd = {
      endpointNodeId: toNode.id,
      magnet: 'LEFT'
    };

    if (conn.condition) {
      const midXConditionChip = horizontalSegmentEndX + 910 / 2;
      const midYConditionChip = verticalSegmentEndY + 1;
      createConditionChip(conn.condition, midXConditionChip, midYConditionChip);
    }
  }

  async function createConditionChip(condition: string, x: number, y: number): Promise<void> {
    const conditionFrame = figma.createFrame();
    conditionFrame.layoutMode = "HORIZONTAL";
    conditionFrame.primaryAxisSizingMode = "AUTO";
    conditionFrame.counterAxisSizingMode = "AUTO";
    conditionFrame.paddingLeft = conditionFrame.paddingRight = 12;
    conditionFrame.paddingTop = conditionFrame.paddingBottom = 8;
    conditionFrame.fills = [{ type: "SOLID", color: hexToRgb("#323232") }];
    conditionFrame.cornerRadius = 4;
    conditionFrame.strokes = [];

    const conditionText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Medium" });
    conditionText.characters = condition;
    conditionText.fontName = { family: "Inter", style: "Medium" };
    conditionText.fontSize = 14;
    conditionText.fills = [{ type: "SOLID", color: hexToRgb("#FFFFFF") }];

    conditionFrame.appendChild(conditionText);
    figma.currentPage.appendChild(conditionFrame);

    conditionFrame.x = x - conditionFrame.width / 2;
    conditionFrame.y = y - conditionFrame.height / 2;
  }

  function hexToRgb(hex: string) {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return { r, g, b };
  }
}

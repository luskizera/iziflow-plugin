import { NodeData } from "../core/parser";

// Sobrecarga de tipo para aceitar { name?: string } ou NodeData
export function createDecisionNode(data: { name?: string }): SceneNode;
export function createDecisionNode(nodeData: NodeData): SceneNode;
export function createDecisionNode(dataOrNode: { name?: string } | NodeData): SceneNode {
  const name = "name" in dataOrNode ? dataOrNode.name : dataOrNode.name;
  const frame = figma.createFrame();
  frame.name = name || "DECISION";
  frame.resize(300, 200);
  frame.layoutMode = "VERTICAL";
  frame.counterAxisSizingMode = "AUTO";
  frame.primaryAxisAlignItems = "CENTER";
  frame.primaryAxisSizingMode = "AUTO";
  frame.paddingTop = 16;
  frame.paddingBottom = 16;
  frame.paddingLeft = 16;
  frame.paddingRight = 16;

  const polygon = figma.createPolygon();
  polygon.pointCount = 4;
  polygon.resize(200, 300);
  polygon.rotation = 90;
  polygon.fills = [{ type: "SOLID", color: hexToRgb("#A3A3A3") }];
  polygon.name = "Polygon";

  const text = figma.createText();
  frame.appendChild(polygon);
  frame.appendChild(text);

  return frame;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}
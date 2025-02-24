import { createChipNode } from './chipNode';
import { NodeData } from '../core/parser'; // Import corrigido

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Cria um EntryPoint Node no Figma
 * @param nodeData Dados do nó do tipo NodeData
 * @returns FrameNode criado
 */
export function createEntryPointNode(nodeData: NodeData): FrameNode {
  const entryNode = figma.createFrame();
  entryNode.name = nodeData.name || "ENTRYPOINT";
  entryNode.layoutMode = "VERTICAL";
  entryNode.primaryAxisAlignItems = "MIN";
  entryNode.counterAxisSizingMode = "FIXED"; // Largura fixa
  entryNode.primaryAxisSizingMode = "AUTO"; // Altura variável
  entryNode.resize(400, 0); // Define largura fixa de 400px, altura ajustada automaticamente
  entryNode.paddingTop = 24;
  entryNode.paddingBottom = 24;
  entryNode.paddingLeft = 24;
  entryNode.paddingRight = 24;
  entryNode.cornerRadius = 24;
  entryNode.strokeWeight = 2;

  entryNode.fills = [{ type: 'SOLID', color: hexToRGB('#F4F4F5') }]; // Fundo cinza claro
  entryNode.strokes = [{
    type: "SOLID",
    color: hexToRGB("#A1A1AA")
  }];
  entryNode.dashPattern = [4,4];
  entryNode.itemSpacing = 8; // Espaço entre o chip e o texto

  // Chip com o tipo do nó (usando createChipNode para "ENTRYPOINT")
  const chip = createChipNode("ENTRYPOINT");
  entryNode.appendChild(chip);

  // Texto do nome do nó
  const nameText = figma.createText();
  figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }).then(() => {
    nameText.characters = nodeData.name;
    nameText.fontSize = 24;
    nameText.fontName = { family: "Inter", style: "Semi Bold" };
    nameText.textAlignHorizontal = "LEFT";
    nameText.textAlignVertical = "TOP";
    nameText.fills = [{ type: 'SOLID', color: hexToRGB('#09090B') }]; // Texto preto
    nameText.resizeWithoutConstraints(352, nameText.height); // Limita a largura interna, mas permite altura variável
    nameText.textAutoResize = "HEIGHT";
    entryNode.appendChild(nameText);
  });

  return entryNode;
}

/**
 * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
 * @param hex Cor no formato HEX
 * @returns RGBColor
 */
function hexToRGB(hex: string): RGBColor {
  const sanitizedHex = hex.replace('#', '');
  const bigint = parseInt(sanitizedHex, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255
  };
}
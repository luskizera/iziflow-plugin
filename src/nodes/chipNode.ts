import { hexToRgb } from "../utils/hexToRgb";

export async function createChipNode(type: string): Promise<FrameNode> {
    const chip = figma.createFrame();
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";
    chip.paddingLeft = 16;
    chip.paddingRight = 16;
    chip.paddingTop = 4;
    chip.paddingBottom = 4;
    chip.cornerRadius = 8;
    chip.strokeWeight = 0;
    chip.fills = [{ type: "SOLID", color: hexToRgb ("#18181B") }];

    // Carrega a fonte "Inter Bold" (assumindo que o nó chamante pode carregar, mas aqui garantimos)
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = type.toUpperCase();
    textNode.fontSize = 14;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.fills = [{ type: "SOLID", color: hexToRgb("#FAFAFA") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";

    chip.appendChild(textNode);
    return chip;
  }
export async function createDescriptionChip(label: string): Promise<FrameNode> {
    const chip = figma.createFrame();
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";
    chip.paddingLeft = 12; // Padding lateral de 12px
    chip.paddingRight = 12;
    chip.paddingTop = 2; // Padding vertical de 2px
    chip.paddingBottom = 2;
    chip.cornerRadius = 8;
    chip.strokeWeight = 0;
    chip.fills = [{ type: "SOLID", color: hexToRgb("#F4F4F5") }];

    // Carrega a fonte "Inter Bold" (assumindo compatibilidade com o nó chamante)
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = label.toUpperCase(); // Mantém em maiúsculas por padrão
    textNode.fontSize = 12;
    textNode.fontName = { family: "Inter", style: "Semi Bold" };
    textNode.fills = [{ type: "SOLID", color: hexToRgb("#3F3F46") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";

    chip.appendChild(textNode);
    return chip;
  }
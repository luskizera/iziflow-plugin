namespace ChipNode {
  interface RGB {
    r: number;
    g: number;
    b: number;
  }

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
    chip.fills = [{ type: "SOLID", color: hexToRGB("#18181B") }];

    // Fonte já carregada no nível superior, mas mantemos a criação do texto
    const textNode = figma.createText();
    textNode.characters = type.toUpperCase();
    textNode.fontSize = 14;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.fills = [{ type: "SOLID", color: hexToRGB("#FAFAFA") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";

    chip.appendChild(textNode);
    return chip;
  }

  export function hexToRGB(hex: string): RGB {
    const sanitizedHex = hex.replace("#", "");
    const bigint = parseInt(sanitizedHex, 16);
    return {
      r: ((bigint >> 16) & 255) / 255,
      g: ((bigint >> 8) & 255) / 255,
      b: (bigint & 255) / 255,
    };
  }
}
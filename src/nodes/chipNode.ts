namespace ChipNode {
  interface RGB {
    r: number;
    g: number;
    b: number;
  }

  /**
   * Cria um chip padrão com texto indicando o tipo do nó (ex.: "STEP", "ENTRYPOINT").
   * Características: fundo #18181B, texto #FAFAFA, fonte 14px "Inter Bold", padding 16px/4px.
   * @param type - O tipo do chip (ex.: "STEP", "ENTRYPOINT")
   * @returns FrameNode estilizado com largura e altura ajustadas ao conteúdo
   */
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

    // Carrega a fonte "Inter Bold" (assumindo que o nó chamante pode carregar, mas aqui garantimos)
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = type.toUpperCase();
    textNode.fontSize = 14;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.fills = [{ type: "SOLID", color: hexToRGB("#FAFAFA") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";

    chip.appendChild(textNode);
    return chip;
  }

  /**
   * Cria um chip de descrição (ex.: "ACTION", "INPUTS") com estilo específico para o StepNode.
   * Características: fundo #F4F4F5, texto #3F3F46, fonte 12px "Inter Bold", padding lateral 12px, padding vertical 2px.
   * @param label - O label do chip (ex.: "Action", "Inputs")
   * @returns FrameNode estilizado com largura e altura ajustadas ao conteúdo
   */
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
    chip.fills = [{ type: "SOLID", color: hexToRGB("#F4F4F5") }];

    // Carrega a fonte "Inter Bold" (assumindo compatibilidade com o nó chamante)
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = label.toUpperCase(); // Mantém em maiúsculas por padrão
    textNode.fontSize = 12;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.fills = [{ type: "SOLID", color: hexToRGB("#3F3F46") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";

    chip.appendChild(textNode);
    return chip;
  }

  /**
   * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma.
   * @param hex - Código hexadecimal da cor (ex.: "#18181B")
   * @returns RGB
   */
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
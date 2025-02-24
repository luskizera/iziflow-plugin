namespace ChipNode {
/**
 * @param type - O tipo do nó (STEP, ENTRYPOINT, etc.)
 * @returns FrameNode estilizado
 */
export function createChipNode(type: string): FrameNode {
    const chip = figma.createFrame();
    chip.layoutMode = 'HORIZONTAL';
    chip.counterAxisSizingMode = 'AUTO';
    chip.primaryAxisSizingMode = 'AUTO';
    chip.paddingLeft = 16;
    chip.paddingRight = 16;
    chip.paddingTop = 2;
    chip.paddingBottom = 2;
    chip.cornerRadius = 8;
    chip.strokeWeight = 0;
  
    // Define cor fixa do chip: #18181B (preto)
    chip.fills = [{
      type: 'SOLID',
      color: hexToRGB('#18181B')
    }];
  
    // Cria o texto dentro do chip
    const textNode = figma.createText();
    textNode.characters = type.toUpperCase(); // Mostra o tipo (ex.: STEP, ENTRY POINT)
    textNode.fontSize = 12;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Branco
  
    // Adiciona o texto ao chip
    chip.appendChild(textNode);
  
    return chip;
  }
  
  /**
   * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
   * @param hex - Código hexadecimal da cor (ex.: #18181B)
   * @returns RGB
   */
  export function hexToRGB(hex: string): RGB {
    const sanitizedHex = hex.replace('#', '');
    const bigint = parseInt(sanitizedHex, 16);
    return {
      r: ((bigint >> 16) & 255) / 255,
      g: ((bigint >> 8) & 255) / 255,
      b: (bigint & 255) / 255
    };
  }
}
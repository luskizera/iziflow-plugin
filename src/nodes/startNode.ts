namespace StartNode {
interface RGBColor {
    r: number;
    g: number;
    b: number;
  }
  
  /**
   * Cria o Start Node no Figma com formato circular
   * Exibe o texto "START" centralizado
   * @param nodeData Dados do nó
   * @returns FrameNode estilizado
   */
  export function createStartNode(nodeData: any): FrameNode {
    const startNode = figma.createFrame();
    startNode.name = nodeData.name || "START";
    startNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
    startNode.cornerRadius = 400; // Para deixar o nó totalmente circular
    startNode.layoutMode = "VERTICAL";
    startNode.counterAxisSizingMode = "AUTO";
    startNode.primaryAxisAlignItems = "CENTER";
    startNode.primaryAxisSizingMode = "AUTO";
    startNode.paddingTop = 55.5; // Ajuste para centralizar o texto
    startNode.paddingBottom = 55.5;
    startNode.paddingLeft = 30; // Ajuste para centralizar o texto
    startNode.paddingRight = 30;
  
    // Define o preenchimento do nó (cor de fundo): #18181B (preto)
    startNode.fills = [{
      type: 'SOLID',
      color: hexToRGB('#18181B')
    }];
  
    // Cria o texto "START"
    const textNode = figma.createText();
    figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
      textNode.characters = "START";
      textNode.fontSize = 24; // Mantém a fonte original
      textNode.fontName = { family: "Inter", style: "Bold" };
      textNode.textAlignHorizontal = "CENTER";
      textNode.textAlignVertical = "CENTER";
      textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
      startNode.appendChild(textNode);
    });
  
    return startNode;
  }
  
  /**
   * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
   * @param hex - Código hexadecimal da cor (ex.: #18181B)
   * @returns RGBColor
   */
  export function hexToRGB(hex: string): RGBColor {
    const sanitizedHex = hex.replace('#', '');
    const bigint = parseInt(sanitizedHex, 16);
    return {
      r: ((bigint >> 16) & 255) / 255,
      g: ((bigint >> 8) & 255) / 255,
      b: (bigint & 255) / 255
    };
  }
}
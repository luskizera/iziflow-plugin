interface RGBColor {
    r: number;
    g: number;
    b: number;
  }
  
  /**
   * Cria o End Node no Figma com formato circular
   * Exibe o texto "END" centralizado
   * @param nodeData Dados do nó
   * @returns FrameNode estilizado
   */
  export function createEndNode(nodeData: any): FrameNode {
    // Cria o frame principal do End Node
    const endNode = figma.createFrame();
    endNode.name = nodeData.name || "END";
    endNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
    endNode.cornerRadius = 400; // Para deixar o nó totalmente circular
    endNode.layoutMode = "VERTICAL";
    endNode.counterAxisSizingMode = "AUTO";
    endNode.primaryAxisAlignItems = "CENTER";
    endNode.primaryAxisSizingMode = "AUTO";
    endNode.paddingTop = 55.5; // Ajuste para centralizar o texto
    endNode.paddingBottom = 55.5;
    endNode.paddingLeft = 30; // Ajuste para centralizar o texto
    endNode.paddingRight = 30;
  
    // Define o preenchimento do nó (cor de fundo): #18181B (preto)
    endNode.fills = [{
      type: 'SOLID',
      color: hexToRGB('#18181B')
    }];
  
    // Cria o texto "END"
    const textNode = figma.createText();
    figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
      textNode.characters = "END";
      textNode.fontSize = 24; // Mantém a fonte original
      textNode.fontName = { family: "Inter", style: "Bold" };
      textNode.textAlignHorizontal = "CENTER";
      textNode.textAlignVertical = "CENTER";
      textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
      endNode.appendChild(textNode);
    });
  
    return endNode;
  }
  
  /**
   * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
   * @param hex - Código hexadecimal da cor (ex.: #18181B)
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
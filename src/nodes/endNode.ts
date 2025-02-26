namespace EndNode {
  interface RGBColor {
    r: number;
    g: number;
    b: number;
  }

  /**
   * Cria o End Node no Figma com formato circular
   * Exibe o texto "End" centralizado manualmente em um frame de 140x140px
   * @param nodeData Dados do nó
   * @returns FrameNode estilizado
   */
  export async function createEndNode(nodeData: any): Promise<FrameNode> {
    const endNode = figma.createFrame();
    endNode.name = nodeData.name || "End";
    endNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
    endNode.cornerRadius = 400; // Para deixar o nó totalmente circular
    endNode.layoutMode = "NONE"; // Remove Auto Layout, posicionamento manual
    endNode.fills = [{
      type: 'SOLID',
      color: hexToRGB('#18181B')
    }];

    // Carrega a fonte e cria o texto
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = "End";
    textNode.fontSize = 24; // Mantém a fonte original
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.textAlignHorizontal = "CENTER";
    textNode.textAlignVertical = "CENTER";
    textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
    textNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Ajusta automaticamente ao conteúdo

    // Ajusta o tamanho do texto para garantir centralização
    const textWidth = Math.min(80, textNode.width); // Limita a largura para caber no círculo
    const textHeight = textNode.height;
    textNode.resize(textWidth, textHeight);

    // Centraliza o texto manualmente no frame de 140x140px
    textNode.x = (endNode.width - textWidth) / 2; // Centraliza horizontalmente (30px)
    textNode.y = (endNode.height - textHeight) / 2; // Centraliza verticalmente (~58px)

    // Adiciona o texto ao frame
    endNode.appendChild(textNode);

    // Força a renderização completa e adiciona à página
    figma.currentPage.appendChild(endNode);

    // Força um pequeno atraso para garantir que o Figma processe o layout
    await new Promise((resolve) => setTimeout(resolve, 0));

    return endNode;
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
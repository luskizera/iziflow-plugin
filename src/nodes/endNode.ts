namespace EndNode {
  interface RGBColor {
      r: number;
      g: number;
      b: number;
    }
    
    /**
     * Cria o End Node no Figma com formato circular
     * Exibe o texto "End" centralizado
     * @param nodeData Dados do nó
     * @returns FrameNode estilizado
     */
    export function createEndNode(nodeData: any): FrameNode {
      const EndNode = figma.createFrame();
      EndNode.name = nodeData.name || "End";
      EndNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
      EndNode.cornerRadius = 400; // Para deixar o nó totalmente circular
      EndNode.layoutMode = "VERTICAL";
      EndNode.counterAxisSizingMode = "AUTO";
      EndNode.primaryAxisAlignItems = "CENTER";
      EndNode.primaryAxisSizingMode = "AUTO";
      EndNode.paddingTop = 55.5; // Ajuste para centralizar o texto
      EndNode.paddingBottom = 55.5;
      EndNode.paddingLeft = 30; // Ajuste para centralizar o texto
      EndNode.paddingRight = 30;
    
      // Define o preenchimento do nó (cor de fundo): #18181B (preto)
      EndNode.fills = [{
        type: 'SOLID',
        color: hexToRGB('#18181B')
      }];
    
      // Cria o texto "End"
      const textNode = figma.createText();
      figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
        textNode.characters = "End";
        textNode.fontSize = 24; // Mantém a fonte original
        textNode.fontName = { family: "Inter", style: "Bold" };
        textNode.textAlignHorizontal = "CENTER";
        textNode.textAlignVertical = "CENTER";
        textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
        EndNode.appendChild(textNode);
      });
    
      return EndNode;
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
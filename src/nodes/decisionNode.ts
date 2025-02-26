// decisionNode.ts
namespace DecisionNode {
  interface RGBColor {
    r: number;
    g: number;
    b: number;
  }

  /**
   * Representa os dados de um nó Decision, podendo ser um objeto simples com nome ou um NodeData mais complexo.
   */
  type DecisionData = { name?: string } | Parser.NodeData;

  /**
   * Cria um nó Decision no Figma representando uma decisão com um losango cinza e texto centralizado.
   * O frame é transparente (300x200px) com layoutMode: "NONE", contendo um polígono de 300x200px (#A3A3A3) e texto preto.
   * @param data Dados do nó, incluindo o nome opcional
   * @returns Promise<SceneNode> Frame configurado como nó Decision
   * @throws Error se houver falha ao carregar fontes ou criar elementos
   */
  export async function createDecisionNode(data: DecisionData): Promise<SceneNode> {
    try {
      // Extrai o nome do nó (padrão "DECISION" se não fornecido)
      const name = "name" in data ? data.name : data.name || "DECISION";

      // Cria o frame principal
      const frame = figma.createFrame();
      frame.name = "decisionNode";
      frame.resize(300, 200); // Dimensões fixas de 300x200px
      frame.fills = []; // Frame transparente, sem preenchimento
      frame.strokes = []; // Sem bordas
      frame.strokeWeight = 1; // Peso da borda (0 para nenhuma borda visível, mas mantido por consistência)
      frame.cornerRadius = 0; // Cantos retos
      frame.layoutMode = "NONE"; // Sem Auto Layout, posicionamento manual
      frame.primaryAxisAlignItems = "CENTER"; // Centralização vertical (ignorado com layoutMode: "NONE")
      frame.counterAxisAlignItems = "CENTER"; // Centralização horizontal (ignorado com layoutMode: "NONE")
      frame.paddingLeft = 0;
      frame.paddingRight = 0;
      frame.paddingTop = 0;
      frame.paddingBottom = 0;
      frame.itemSpacing = 0; // Sem espaçamento entre filhos (ignorado com layoutMode: "NONE")
      frame.clipsContent = true; // Recorta conteúdo que ultrapasse o frame

      // Carrega a fonte "Inter Semi Bold" necessária para o texto
      await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }).catch((error) => {
        throw new Error(`Falha ao carregar a fonte Inter Semi Bold: ${error.message}`);
      });

      // Cria o polígono (losango) preenchendo todo o frame
      const polygon = figma.createPolygon();
      polygon.name = "Polygon";
      polygon.pointCount = 4; // Quadrilátero
      polygon.resize(300, 200); // O losango ocupa todo o frame
      polygon.fills = [
        {
          type: "SOLID",
          visible: true,
          opacity: 1,
          blendMode: "NORMAL",
          color: {
            r: 0.6392157077789307, // #A3A3A3 em RGB normalizado
            g: 0.6392157077789307,
            b: 0.6392157077789307,
          },
        },
      ];
      polygon.strokes = []; // Sem bordas
      polygon.strokeWeight = 1; // Peso da borda (0 para nenhuma borda visível, mas mantido por consistência)
      polygon.cornerRadius = 0; // Cantos retos

      // Posiciona o polígono no frame (x: 0, y: 0 como especificado)
      polygon.x = 0;
      polygon.y = 0;

      // Cria e configura o texto
      const text = figma.createText();
      text.name = "name";
      text.characters = "Is Phone Verification\nSuccessful?"; // Texto específico da configuração
      text.fontSize = 18;
      text.fontName = { family: "Inter", style: "Semi Bold" };
      text.textAlignHorizontal = "CENTER";
      text.textAlignVertical = "CENTER";
      text.fills = [
        {
          type: "SOLID",
          visible: true,
          opacity: 1,
          blendMode: "NORMAL",
          color: {
            r: 0.03529411926865578, // #09090B em RGB normalizado (preto escuro)
            g: 0.03529411926865578,
            b: 0.04313725605607033,
          },
        },
      ];
      text.strokes = []; // Sem bordas
      text.strokeWeight = 1; // Peso da borda (0 para nenhuma borda visível, mas mantido por consistência)
      text.textAutoResize = "WIDTH_AND_HEIGHT"; // Ajusta automaticamente ao conteúdo

      // Ajusta o tamanho do texto para corresponder à configuração (180x44px)
      text.resize(180, 44); // Dimensões fixas conforme a configuração
      // Posiciona o texto no frame nas coordenadas especificadas
      text.x = 60; // Centralizado horizontalmente (60px no frame de 300px)
      text.y = 78; // Centralizado verticalmente (78px no frame de 200px)

      // Adiciona os elementos ao frame
      frame.appendChild(polygon);
      frame.appendChild(text);

      // Posiciona o frame nas coordenadas especificadas
      frame.x = 2891;
      frame.y = 6336;

      // Adiciona o frame à página para garantir renderização e cálculo de layout
      figma.currentPage.appendChild(frame);

      // Força um pequeno atraso para garantir que o Figma processe o layout
      await new Promise((resolve) => setTimeout(resolve, 0));

      return frame;
    } catch (error) {
      console.error("Erro ao criar o nó Decision:", error);
      throw error;
    }
  }

  /**
   * Converte uma cor HEX para o formato RGB normalizado (0-1) usado pelo Figma.
   * @param hex String HEX da cor (ex.: "#A3A3A3")
   * @returns Objeto com valores RGB normalizados
   */
  export function hexToRgb(hex: string): RGBColor {
    const sanitizedHex = hex.replace("#", "");
    const r = parseInt(sanitizedHex.slice(0, 2), 16) / 255;
    const g = parseInt(sanitizedHex.slice(2, 4), 16) / 255;
    const b = parseInt(sanitizedHex.slice(4, 6), 16) / 255;
    return { r, g, b };
  }
}
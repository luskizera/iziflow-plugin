import { hexToRgb } from "../utils/hexToRgb";

export async function createEntryPointNode(nodeData: Parser.NodeData): Promise<FrameNode> {
    const entryNode = figma.createFrame();
    entryNode.name = nodeData.name || "ENTRYPOINT";

    // Configuração do Auto Layout para largura fixa e altura dinâmica
    entryNode.layoutMode = "VERTICAL";
    entryNode.primaryAxisSizingMode = "AUTO"; // Deve ajustar altura ao conteúdo
    entryNode.counterAxisSizingMode = "FIXED"; // Largura fixa em 400px
    entryNode.resize(400, 1); // Altura inicial mínima
    entryNode.paddingTop = 24;
    entryNode.paddingBottom = 24;
    entryNode.paddingLeft = 24;
    entryNode.paddingRight = 24;
    entryNode.cornerRadius = 24;
    entryNode.strokeWeight = 2;
    entryNode.itemSpacing = 8;
    entryNode.fills = [{ type: "SOLID", color: ChipNode.hexToRGB("#F4F4F5") }];
    entryNode.strokes = [{ type: "SOLID", color: ChipNode.hexToRGB("#A1A1AA") }];
    entryNode.dashPattern = [4, 4];

    // Carrega todas as fontes necessárias de uma vez
    await Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Bold" }), // Para o chip
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }), // Para o texto
    ]);

    // Adiciona o chip
    const chip = await ChipNode.createChipNode("ENTRYPOINT");
    entryNode.appendChild(chip);
    console.log("Altura do chip após adicionar:", chip.height);

    // Adiciona o texto
    const nameText = figma.createText();
    nameText.characters = nodeData.name || "ENTRYPOINT";
    nameText.fontSize = 24;
    nameText.fontName = { family: "Inter", style: "Semi Bold" };
    nameText.textAlignHorizontal = "LEFT";
    nameText.textAlignVertical = "TOP";
    nameText.fills = [{ type: "SOLID", color: ChipNode.hexToRGB("#09090B") }];
    nameText.textAutoResize = "HEIGHT";
    nameText.resize(352, nameText.height); // 400 - 24*2 padding
    entryNode.appendChild(nameText);
    console.log("Altura do texto após adicionar:", nameText.height);
    console.log("Altura do entryNode antes de ajuste:", entryNode.height);

    // Calcula a altura total manualmente como fallback
    const totalHeight = chip.height + nameText.height + entryNode.itemSpacing + entryNode.paddingTop + entryNode.paddingBottom;
    entryNode.resize(400, totalHeight);
    console.log("Altura ajustada manualmente:", totalHeight);

    // Adiciona um pequeno atraso pra garantir que o Figma processe o layout
    await new Promise((resolve) => setTimeout(resolve, 0));
    console.log("Altura final do entryNode após tick:", entryNode.height);

    return entryNode;
  }
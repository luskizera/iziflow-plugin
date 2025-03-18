import { hexToRgb } from "../utils/hexToRgb";
import { nodeCache } from "../utils/nodeCache";
import { layoutManager } from "../utils/layoutManager";

export namespace Frames {
  export async function createStartNode(nodeData: any): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = (nodeData.name?.trim()) || "Unnamed Node";
    
    frame.layoutMode = "NONE";
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "FIXED";
    frame.resize(140, 140);
    frame.cornerRadius = 400;

    frame.fills = [{
      type: "SOLID",
      color: hexToRgb("#18181B")
    }];

    const titleText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    titleText.characters = "START";
    titleText.fontName = { family: "Inter", style: "Bold" };
    titleText.fontSize = 24;
    titleText.fills = [{
      type: "SOLID",
      color: hexToRgb("#FAFAFA")
    }];
    
    frame.appendChild(titleText);
    titleText.x = (frame.width - titleText.width) / 2;
    titleText.y = (frame.height - titleText.height) / 2;

    return frame;
  }

  export async function createEndNode(nodeData: any): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = (nodeData.name?.trim()) || "Unnamed Node";
    
    frame.layoutMode = "NONE";
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "FIXED";
    frame.resize(140, 140);
    frame.cornerRadius = 400;

    frame.fills = [{
      type: "SOLID",
      color: hexToRgb("#18181B")
    }];

    const titleText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    titleText.characters = "END";
    titleText.fontName = { family: "Inter", style: "Bold" };
    titleText.fontSize = 24;
    titleText.fills = [{ type: "SOLID", color: hexToRgb("#FAFAFA") }];
    
    frame.appendChild(titleText);
    titleText.x = (frame.width - titleText.width) / 2;
    titleText.y = (frame.height - titleText.height) / 2;

    return frame;
  }

  export async function createStepNode(nodeData: any): Promise<FrameNode> {
    if (!nodeData || !nodeData.type) {
      console.error('NodeData inválido:', nodeData);
      throw new Error('NodeData inválido');
    }

    try {
      console.log(`[Step] Criando ${nodeData.type}:`, {
        id: nodeData.id,
        name: nodeData.name,
        type: nodeData.type,
        description: nodeData.description
      });

      // Criar frame principal
      const stepNode = figma.createFrame();
      figma.currentPage.appendChild(stepNode);

      // Configuração básica
      stepNode.name = nodeData.name || "Unnamed Step";
      stepNode.layoutMode = "VERTICAL";
      stepNode.primaryAxisSizingMode = "AUTO";
      stepNode.counterAxisSizingMode = "AUTO";
      stepNode.itemSpacing = 16;
      stepNode.fills = [];
      stepNode.strokes = [];

      // Carregar fontes
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Regular" })
      ]);

      // Criar e configurar título
      const titleBlock = await createTitleBlock(nodeData);
      stepNode.appendChild(titleBlock);

      // Processar descrição se existir
      if (nodeData.description && typeof nodeData.description === 'object') {
        const descriptions = Object.entries(nodeData.description).map(([label, content]) => ({
          label,
          content: Array.isArray(content) ? content.join('\n') : String(content)
        }));

        if (descriptions.length > 0) {
          const descBlock = await createDescriptionBlock(descriptions);
          stepNode.appendChild(descBlock);
        }
      }

      console.log(`[Step] Frame criado com sucesso:`, stepNode.id);
      return stepNode;

    } catch (error) {
      console.error('[Step] Erro:', error);
      throw error;
    }
  }

  // Novo método auxiliar para criar bloco de título
  async function createTitleBlock(nodeData: any): Promise<FrameNode> {
    const titleBlock = figma.createFrame();
    titleBlock.name = `${nodeData.type} Title Block`;
    titleBlock.layoutMode = "VERTICAL";
    titleBlock.primaryAxisSizingMode = "AUTO";
    titleBlock.counterAxisSizingMode = "FIXED";
    titleBlock.itemSpacing = 8;
    titleBlock.paddingTop = titleBlock.paddingBottom = titleBlock.paddingLeft = titleBlock.paddingRight = 24;
    titleBlock.cornerRadius = 24;

    // Estilo específico para cada tipo
    if (nodeData.type === "ENTRYPOINT") {
      titleBlock.strokes = [{ type: "SOLID", color: hexToRgb("#A1A1AA") }];
      titleBlock.fills = [{ type: "SOLID", color: hexToRgb("#F4F4F5") }];
      titleBlock.dashPattern = [4, 4];
    } else {
      titleBlock.strokes = [{ type: "SOLID", color: hexToRgb("#A1A1AA") }];
      titleBlock.fills = [{ type: "SOLID", color: hexToRgb("#F4F4F5") }];
    }
    titleBlock.strokeWeight = 2;

    // Adicionar chip e texto do título
    const typeChip = await createTypeChip(nodeData.type);
    titleBlock.appendChild(typeChip);

    const titleText = figma.createText();
    titleText.characters = nodeData.name || "Untitled Step";
    titleText.fontName = { family: "Inter", style: "Semi Bold" };
    titleText.fontSize = 24;
    titleText.fills = [{ type: "SOLID", color: hexToRgb("#09090B") }];
    titleText.textAutoResize = "WIDTH_AND_HEIGHT";
    titleBlock.appendChild(titleText);

    // Redimensiona usando a altura calculada do bloco
    titleBlock.resize(400, titleBlock.height);

    return titleBlock;
  }

  export async function createDecisionNode(nodeData: any): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.layoutMode = "NONE";
    frame.name = (nodeData.name?.trim()) || "Unnamed Decision";
    frame.resize(300, 200);
    frame.fills = [];
    frame.strokes = [];

    const diamond = figma.createPolygon();
    diamond.pointCount = 4;
    diamond.resize(300, 200);
    diamond.rotation = 0;
    diamond.name = "Diamond Shape";
    diamond.fills = [{ type: "SOLID", color: hexToRgb("#A3A3A3") }];
    
    diamond.x = 0;
    diamond.y = 0;
    frame.appendChild(diamond);

    const titleText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    titleText.characters = nodeData.name || "Untitled Decision";
    titleText.fontName = { family: "Inter", style: "Semi Bold" };
    titleText.fontSize = 18;
    titleText.fills = [{ type: "SOLID", color: hexToRgb("#09090B") }];
    
    const textContainer = figma.createFrame();
    textContainer.layoutMode = "NONE";
    textContainer.name = "Decision Text Container";
    textContainer.resize(180, titleText.height);
    textContainer.fills = [];
    textContainer.strokes = [];

    textContainer.appendChild(titleText);

    textContainer.x = (300 - textContainer.width) / 2;
    textContainer.y = (200 - textContainer.height) / 2;
    frame.appendChild(textContainer);

    return frame;
  }

  // Métodos auxiliares privados
  async function createTypeChip(text: string): Promise<FrameNode> {
    return nodeCache.enqueueTask(async () => {
        const chip = figma.createFrame();
        chip.name = "TypeChip";
        chip.layoutMode = "HORIZONTAL";
        chip.primaryAxisSizingMode = chip.counterAxisSizingMode = "AUTO";
        chip.paddingTop = chip.paddingBottom = 2;
        chip.paddingLeft = chip.paddingRight = 16;
        chip.cornerRadius = 8;
        chip.fills = [{ type: "SOLID", color: hexToRgb("#18181B") }];

        await nodeCache.loadFont("Inter", "Semi Bold");
        const chipText = figma.createText();
        chipText.characters = text;
        chipText.fontName = { family: "Inter", style: "Semi Bold" };
        chipText.fontSize = 14;
        chipText.fills = [{ type: "SOLID", color: hexToRgb("#FAFAFA") }];
        chipText.textAutoResize = "WIDTH_AND_HEIGHT";
        chip.appendChild(chipText);

        return chip;
    });
  }

  async function createDescriptionBlock(descriptions: any[]): Promise<FrameNode> {
    const block = figma.createFrame();
    block.name = "Description Block";
    block.layoutMode = "VERTICAL";
    block.primaryAxisSizingMode = "AUTO";
    block.counterAxisSizingMode = "FIXED";
    block.itemSpacing = 8;
    block.paddingTop = block.paddingBottom = block.paddingLeft = block.paddingRight = 24;
    block.cornerRadius = 24;
    block.strokes = [{ type: "SOLID", color: hexToRgb("#E4E4E7") }];
    block.strokeWeight = 2;
    block.fills = [{ type: "SOLID", color: hexToRgb("#FFFFFF") }];

    // Adiciona cada seção da descrição
    for (const desc of descriptions) {
      const itemFrame = await createDescriptionItem(desc);
      block.appendChild(itemFrame);
    }

    // Redimensiona usando a altura calculada
    block.resize(400, block.height);

    return block;
  }

  async function createDescriptionItem(desc: any): Promise<FrameNode> {
    const frame = figma.createFrame();
    frame.name = desc.label || "Description Item";
    frame.layoutMode = "VERTICAL";
    frame.layoutAlign = "STRETCH";
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "AUTO";
    frame.itemSpacing = 8;
    frame.paddingBottom = 24;
    frame.fills = [];
    frame.strokes = [];

    // Adiciona o chip com o label
    const labelChip = await createTypeChip(desc.label.toUpperCase());
    frame.appendChild(labelChip);

    // Adiciona o conteúdo
    const content = figma.createText();
    content.characters = desc.content;
    content.fontName = { family: "Inter", style: "Regular" };
    content.fontSize = 18;
    content.fills = [{ type: "SOLID", color: hexToRgb("#1E1E1E") }];
    content.textAutoResize = "HEIGHT";
    content.layoutAlign = "STRETCH";
    frame.appendChild(content);

    return frame;
  }

}

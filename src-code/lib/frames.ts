import { hexToRgb } from "../utils/hexToRgb"; // Necessário se as cores não forem usadas diretamente
import { nodeCache } from "../utils/nodeCache";
import { NodeData, DescriptionField } from "../../src/lib/types"; // Ajuste o caminho se necessário
import * as StyleConfig from "../config/styles.config";
import * as LayoutConfig from "../config/layout.config";

export namespace Frames {

    // Carregamento único de fontes usadas pelos frames (pode ser movido para code.ts se preferir)
    async function loadFrameFonts(): Promise<void> {
        try {
            await Promise.all(
                StyleConfig.FontsToLoad.map(font => nodeCache.loadFont(font.family, font.style))
            );
        } catch (e) {
            console.error("[Frames] Erro ao carregar fontes:", e);
            figma.notify("Erro ao carregar fontes para os nós.", { error: true });
        }
    }
    // Chame isso uma vez antes de começar a criar os frames em code.ts
    // await loadFrameFonts(); // Descomente se mover o carregamento para cá

    export async function createStartNode(nodeData: NodeData): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style); // Garante a fonte específica

        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;
        frame.name = (nodeData.name?.trim()) || "Start";
        frame.layoutMode = "NONE"; // Para posicionamento manual do texto
        frame.primaryAxisSizingMode = "FIXED";
        frame.counterAxisSizingMode = "FIXED";
        frame.resize(style.SIZE, style.SIZE);
        frame.cornerRadius = style.CORNER_RADIUS;
        frame.fills = style.FILL;

        const titleText = figma.createText();
        titleText.characters = "START"; // Texto fixo
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.fills = style.TEXT_COLOR;
        titleText.textAlignHorizontal = "CENTER";
        titleText.textAlignVertical = "CENTER";
        // Necessário definir tamanho para centralizar corretamente em frame NONE
        titleText.resize(style.SIZE, style.SIZE);
        frame.appendChild(titleText);
        // Texto ocupa todo o frame, já centralizado pelas propriedades de texto

        return frame;
    }

    export async function createEndNode(nodeData: NodeData): Promise<FrameNode> {
         await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style); // Garante a fonte específica

        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;
        frame.name = (nodeData.name?.trim()) || "End";
        frame.layoutMode = "NONE";
        frame.primaryAxisSizingMode = "FIXED";
        frame.counterAxisSizingMode = "FIXED";
        frame.resize(style.SIZE, style.SIZE);
        frame.cornerRadius = style.CORNER_RADIUS;
        frame.fills = style.FILL;

        const titleText = figma.createText();
        titleText.characters = "END"; // Texto fixo
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.fills = style.TEXT_COLOR;
        titleText.textAlignHorizontal = "CENTER";
        titleText.textAlignVertical = "CENTER";
        titleText.resize(style.SIZE, style.SIZE);
        frame.appendChild(titleText);

        return frame;
    }

    export async function createStepNode(nodeData: NodeData): Promise<FrameNode> {
        // Fontes devem ser pré-carregadas idealmente em code.ts ou com loadFrameFonts()
        const nodeWidth = LayoutConfig.Nodes.STEP_ENTRYPOINT_BLOCK_WIDTH;

        const stepNode = figma.createFrame();
        stepNode.name = nodeData.name || "Unnamed Step/Entry";
        stepNode.layoutMode = "VERTICAL";
        stepNode.primaryAxisSizingMode = "AUTO"; // Altura automática
        stepNode.counterAxisSizingMode = "FIXED"; // Largura fixa
        stepNode.itemSpacing = LayoutConfig.Nodes.GENERAL_NODE_ITEM_SPACING; // Espaço entre Título e Descrição
        stepNode.fills = []; // Frame principal é transparente
        stepNode.strokes = [];
        stepNode.resize(nodeWidth, 0); // Define largura fixa, altura inicial 0 (será AUTO)


        // Criar e configurar título
        const titleBlock = await createTitleBlock(nodeData, nodeWidth);
        stepNode.appendChild(titleBlock);

        // Processar campos da descrição, se houver
        if (nodeData.description && nodeData.description.length > 0) {
            const descBlock = await createDescriptionBlock(nodeData.description, nodeWidth);
            stepNode.appendChild(descBlock);
        } else {
             // Se não houver descrição, removemos o espaçamento extra
             stepNode.itemSpacing = 0;
        }

        console.log(`[Frames] Nó Step/Entry criado: ${stepNode.name} (ID: ${stepNode.id})`);
        return stepNode;
    }

    export async function createDecisionNode(nodeData: NodeData): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.DECISION.FONT.family, StyleConfig.Nodes.DECISION.FONT.style);

        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.DECISION;
        frame.name = (nodeData.name?.trim()) || "Decision";
        frame.layoutMode = "NONE"; // Para posicionar losango e texto
        frame.resize(style.WIDTH, style.HEIGHT);
        frame.fills = []; // Frame container transparente
        frame.strokes = [];

        // Criar o Losango
        const diamond = figma.createPolygon();
        diamond.pointCount = 4;
        diamond.resize(style.WIDTH, style.HEIGHT); // Losango ocupa todo o frame
        diamond.name = "Diamond Shape";
        diamond.fills = style.SHAPE_FILL;
        frame.appendChild(diamond);

        // Criar o Texto
        const titleText = figma.createText();
        titleText.characters = nodeData.name || "Untitled Decision";
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.fills = style.TEXT_COLOR;
        titleText.textAlignHorizontal = "CENTER";
        titleText.textAutoResize = "HEIGHT"; // Ajusta altura, largura limitada abaixo
        // Limitar largura do texto para caber dentro do losango
        const maxTextWidth = style.WIDTH * 0.7; // Ajuste este fator conforme necessário
        titleText.resize(maxTextWidth, titleText.height); // Aplica largura máxima

        frame.appendChild(titleText);

        // Centralizar texto dentro do frame/losango
        titleText.x = (style.WIDTH - titleText.width) / 2;
        titleText.y = (style.HEIGHT - titleText.height) / 2;

        console.log(`[Frames] Nó Decision criado: ${frame.name} (ID: ${frame.id})`);
        return frame;
    }

    // --- Funções Auxiliares Privadas (Refatoradas) ---

    // Cria o Chip (usado em Título e Descrição)
    async function createTypeChip(text: string): Promise<FrameNode> {
        // Fonte deve ser carregada antes
        const chip = figma.createFrame();
        const style = StyleConfig.Labels; // Usando estilos de Label para chips
        chip.name = `Chip: ${text}`;
        chip.layoutMode = "HORIZONTAL";
        chip.primaryAxisSizingMode = chip.counterAxisSizingMode = "AUTO";
        chip.paddingTop = chip.paddingBottom = style.PADDING_VERTICAL;
        chip.paddingLeft = chip.paddingRight = style.PADDING_HORIZONTAL;
        chip.cornerRadius = style.CORNER_RADIUS;
        chip.fills = style.FILL;

        const chipText = figma.createText();
        chipText.characters = text.toUpperCase(); // Deixar texto do chip em maiúsculas
        chipText.fontName = style.FONT;
        chipText.fontSize = style.FONT_SIZE;
        chipText.fills = style.TEXT_COLOR;
        chipText.textAutoResize = "WIDTH_AND_HEIGHT";
        chip.appendChild(chipText);

        return chip;
    }

    // Cria o Bloco de Título para Step/Entrypoint
    async function createTitleBlock(nodeData: NodeData, nodeWidth: number): Promise<FrameNode> {
        const titleBlock = figma.createFrame();
        const style = StyleConfig.Nodes.TITLE_BLOCK;
        const layout = LayoutConfig.Nodes;

        titleBlock.name = `${nodeData.type} Title Block`;
        titleBlock.layoutMode = "VERTICAL";
        titleBlock.layoutAlign = "STRETCH"; // Ocupa a largura do pai (stepNode)
        titleBlock.primaryAxisSizingMode = "AUTO";
        titleBlock.counterAxisSizingMode = "AUTO"; // Largura definida pelo pai
        titleBlock.itemSpacing = layout.TITLE_BLOCK_ITEM_SPACING;
        titleBlock.paddingTop = titleBlock.paddingBottom = titleBlock.paddingLeft = titleBlock.paddingRight = layout.TITLE_BLOCK_PADDING;
        titleBlock.cornerRadius = style.CORNER_RADIUS;
        titleBlock.fills = style.FILL;
        titleBlock.strokes = style.STROKE;
        titleBlock.strokeWeight = style.STROKE_WEIGHT;
        if (nodeData.type === "ENTRYPOINT") {
            titleBlock.dashPattern = style.ENTRYPOINT_DASH_PATTERN;
        }

        // Chip com o tipo do nó
        const typeChip = await createTypeChip(nodeData.type);
        titleBlock.appendChild(typeChip);

        // Texto do título
        const titleText = figma.createText();
        titleText.characters = nodeData.name || `Untitled ${nodeData.type}`;
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.fills = style.TEXT_COLOR;
        titleText.layoutAlign = "STRETCH"; // Ocupa a largura do titleBlock
        titleText.textAutoResize = "HEIGHT"; // Ajusta altura automaticamente
        titleBlock.appendChild(titleText);

        return titleBlock;
    }

    // Cria o Bloco de Descrição para Step/Entrypoint
    async function createDescriptionBlock(descriptionFields: DescriptionField[], nodeWidth: number): Promise<FrameNode> {
        const block = figma.createFrame();
        const style = StyleConfig.Nodes.DESCRIPTION_BLOCK;
        const layout = LayoutConfig.Nodes;

        block.name = "Description Block";
        block.layoutMode = "VERTICAL";
        block.layoutAlign = "STRETCH";
        block.primaryAxisSizingMode = "AUTO";
        block.counterAxisSizingMode = "AUTO"; // Largura definida pelo pai
        block.itemSpacing = layout.DESCRIPTION_BLOCK_ITEM_SPACING;
        block.paddingTop = block.paddingBottom = block.paddingLeft = block.paddingRight = layout.DESCRIPTION_BLOCK_PADDING;
        block.cornerRadius = style.CORNER_RADIUS;
        block.strokes = style.STROKE;
        block.strokeWeight = style.STROKE_WEIGHT;
        block.fills = style.FILL;

        for (const field of descriptionFields) {
            if (field.label && field.content) { // Garante que temos label e conteúdo
                 const itemFrame = await createDescriptionItem(field);
                 block.appendChild(itemFrame);
            } else {
                console.warn(`[Frames] Campo de descrição inválido ignorado em ${block.parent?.name || 'nó desconhecido'}:`, field);
            }
        }

         // Remover padding inferior do último item para evitar espaçamento duplo
         const children = block.children;
         if (children.length > 0) {
             const lastChild = children[children.length - 1];
             if ('paddingBottom' in lastChild) {
                (lastChild as FrameNode).paddingBottom = 0;
             }
         }


        return block;
    }

    // Cria um Item dentro do Bloco de Descrição
    async function createDescriptionItem(field: DescriptionField): Promise<FrameNode> {
        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.DESCRIPTION_ITEM;
        const layout = LayoutConfig.Nodes;

        frame.name = field.label || "Description Item";
        frame.layoutMode = "VERTICAL";
        frame.layoutAlign = "STRETCH"; // Ocupa largura do bloco de descrição
        frame.primaryAxisSizingMode = "AUTO";
        frame.counterAxisSizingMode = "AUTO"; // Largura definida pelo pai
        frame.itemSpacing = layout.DESCRIPTION_ITEM_SPACING;
        frame.paddingBottom = layout.DESCRIPTION_ITEM_PADDING_BOTTOM; // Espaço após este item
        frame.fills = [];
        frame.strokes = [];

        // Chip com o Label
        const labelChip = await createTypeChip(field.label); // Assume que label sempre existe aqui
        frame.appendChild(labelChip);

        // Conteúdo
        let contentText = '';
        // Simplificar formatação - apenas junta arrays com nova linha
        if (Array.isArray(field.content)) {
            contentText = field.content.join('\n');
        } else if (typeof field.content === 'object' && field.content !== null) {
             // Formata objeto como chave: valor
             contentText = Object.entries(field.content)
                 .map(([key, value]) => `${key}: ${value}`)
                 .join('\n');
        }
        else {
            contentText = String(field.content ?? ''); // Garante que é string
        }

        if (contentText.trim()) { // Só adiciona se houver conteúdo
            const content = figma.createText();
            content.characters = contentText;
            content.fontName = style.CONTENT_FONT;
            content.fontSize = style.CONTENT_FONT_SIZE;
            content.fills = style.CONTENT_TEXT_COLOR;
            content.layoutAlign = "STRETCH";
            content.textAutoResize = "HEIGHT";
            frame.appendChild(content);
        } else {
             // Se não houver conteúdo, remove o espaçamento extra após o chip
             frame.itemSpacing = 0;
        }


        return frame;
    }
} // Fim do namespace Frames
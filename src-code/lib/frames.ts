import { hexToRgb } from "../utils/hexToRgb";
import { nodeCache } from "../utils/nodeCache";
import type { NodeData, DescriptionField } from '../../src/lib/types';
import * as StyleConfig from "../config/styles.config";
import * as LayoutConfig from "../config/layout.config";

function frameDebugLog(context: string, message: string, data?: any) {
    console.log(`[Frames:${context}] ${message}`, data || '');
}

export namespace Frames {

    // Funções createStartNode, createEndNode, createDecisionNode - permanecem iguais à versão anterior
    export async function createStartNode(nodeData: NodeData): Promise<FrameNode> {
       frameDebugLog('StartNode', `Iniciando criação para ID: ${nodeData.id}`);
       await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);

       const frame = figma.createFrame();
       const style = StyleConfig.Nodes.START_END;
       frame.name = (nodeData.name?.trim()) || "Start";
       frame.layoutMode = "NONE";
       frame.primaryAxisSizingMode = "FIXED";
       frame.counterAxisSizingMode = "FIXED";
       frame.resize(style.SIZE, style.SIZE);
       frame.cornerRadius = style.CORNER_RADIUS;
       frame.fills = style.FILL;

       const titleText = figma.createText();
       titleText.characters = "START";
       titleText.fontName = style.FONT;
       titleText.fontSize = style.FONT_SIZE;
       titleText.fills = style.TEXT_COLOR;
       titleText.textAlignHorizontal = "CENTER";
       titleText.textAlignVertical = "CENTER";
       titleText.resize(style.SIZE, style.SIZE);
       frame.appendChild(titleText);

       frameDebugLog('StartNode', `Criação concluída. ID Figma: ${frame.id}`);
       return frame;
    }

    export async function createEndNode(nodeData: NodeData): Promise<FrameNode> {
       frameDebugLog('EndNode', `Iniciando criação para ID: ${nodeData.id}`);
       await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);

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
       titleText.characters = "END";
       titleText.fontName = style.FONT;
       titleText.fontSize = style.FONT_SIZE;
       titleText.fills = style.TEXT_COLOR;
       titleText.textAlignHorizontal = "CENTER";
       titleText.textAlignVertical = "CENTER";
       titleText.resize(style.SIZE, style.SIZE);
       frame.appendChild(titleText);

       frameDebugLog('EndNode', `Criação concluída. ID Figma: ${frame.id}`);
       return frame;
    }

     export async function createDecisionNode(nodeData: NodeData): Promise<FrameNode> {
        frameDebugLog('DecisionNode', `Iniciando criação para ID: ${nodeData.id}`);
        await nodeCache.loadFont(StyleConfig.Nodes.DECISION.FONT.family, StyleConfig.Nodes.DECISION.FONT.style);

        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.DECISION;
        frame.name = (nodeData.name?.trim()) || "Decision";
        frame.layoutMode = "NONE";
        frame.resize(style.WIDTH, style.HEIGHT);
        frame.fills = [];
        frame.strokes = [];

        const diamond = figma.createPolygon();
        diamond.pointCount = 4;
        diamond.resize(style.WIDTH, style.HEIGHT);
        diamond.name = "Diamond Shape";
        diamond.fills = style.SHAPE_FILL;
        frame.appendChild(diamond);

        const titleText = figma.createText();
        titleText.characters = nodeData.name || "Untitled Decision";
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.fills = style.TEXT_COLOR;
        titleText.textAlignHorizontal = "CENTER";
        titleText.textAutoResize = "HEIGHT";
        const maxTextWidth = style.WIDTH * 0.7;
        // Definir largura PRIMEIRO para calcular altura correta
        titleText.resize(maxTextWidth, 1); // Altura mínima temporária
        // Força o Figma a calcular a altura baseada no conteúdo e largura
        await new Promise(resolve => setTimeout(resolve, 0)); // Pequena pausa pode ajudar

        frame.appendChild(titleText);

        // Re-calcular centralização APÓS o texto ter sua altura final
        titleText.x = (style.WIDTH - titleText.width) / 2;
        titleText.y = (style.HEIGHT - titleText.height) / 2;

        frameDebugLog('DecisionNode', `Criação concluída. ID Figma: ${frame.id}`);
        return frame;
    }

    // --- Correção Principal: Step/Entrypoint com Auto Layout ---
    export async function createStepNode(nodeData: NodeData): Promise<FrameNode> {
        frameDebugLog('StepNode', `Iniciando criação para ID: ${nodeData.id}, Nome: ${nodeData.name}`);
        const nodeWidth = LayoutConfig.Nodes.STEP_ENTRYPOINT_BLOCK_WIDTH;

        const stepNode = figma.createFrame();
        stepNode.name = nodeData.name || "Unnamed Step/Entry";
        stepNode.layoutMode = "VERTICAL";
        stepNode.primaryAxisSizingMode = "AUTO"; // <<< Altura é AUTO
        stepNode.counterAxisSizingMode = "FIXED"; // <<< Largura é FIXA
        stepNode.itemSpacing = LayoutConfig.Nodes.GENERAL_NODE_ITEM_SPACING;
        stepNode.fills = [];
        stepNode.strokes = [];
        stepNode.resizeWithoutConstraints(nodeWidth, 1); // Define largura fixa, altura inicial mínima

        frameDebugLog('StepNode', `Frame base criado com L=${nodeWidth}. ID: ${stepNode.id}`);

        // Criar e configurar título
        try {
            const titleBlock = await createTitleBlock(nodeData, nodeWidth);
            stepNode.appendChild(titleBlock);
            frameDebugLog('StepNode', `Bloco de título adicionado. Altura título: ${titleBlock.height}, Altura nó: ${stepNode.height}`);
        } catch (error) {
            frameDebugLog('StepNode', `Erro ao criar bloco de título para ${nodeData.id}:`, error);
        }

        // --- CORREÇÃO NA VERIFICAÇÃO DA DESCRIÇÃO ---
        const descriptionFields = nodeData.description?.fields; // Acessa a propriedade 'fields'
        frameDebugLog('StepNode', `Verificando descrição para ${nodeData.id}:`, descriptionFields);

        if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {
            frameDebugLog('StepNode', `Descrição encontrada com ${descriptionFields.length} campos. Criando bloco...`);
            try {
                // Passa o array 'fields' para a função
                const descBlock = await createDescriptionBlock(descriptionFields, nodeWidth);
                if (descBlock.height > 1) {
                    stepNode.appendChild(descBlock);
                    frameDebugLog('StepNode', `Bloco de descrição adicionado. Altura desc: ${descBlock.height}, Altura final nó: ${stepNode.height}`);
                } else {
                    frameDebugLog('StepNode', 'Bloco de descrição criado mas vazio. Removendo.');
                    descBlock.remove();
                    stepNode.itemSpacing = 0;
                }
            } catch (error) {
                frameDebugLog('StepNode', `Erro ao criar bloco de descrição para ${nodeData.id}:`, error);
                stepNode.itemSpacing = 0;
            }
        } else {
            frameDebugLog('StepNode', `Nenhuma descrição válida encontrada para ${nodeData.id}.`);
            stepNode.itemSpacing = 0; // Remove espaço se não houver descrição
        }
        // Fim da correção

        // Log final da altura
        // Uma pequena pausa pode dar tempo ao Figma para calcular o layout final
        await new Promise(resolve => setTimeout(resolve, 0));
        frameDebugLog('StepNode', `Criação finalizada para ${nodeData.id}. Altura final: ${stepNode.height}`);
        if (stepNode.height <= 1) {
             console.warn(`[Frames:StepNode] ALERTA: Nó ${nodeData.id} ('${nodeData.name}') finalizou com altura <= 1. Verifique Auto Layout dos filhos.`);
        }

        return stepNode;
    }

    // --- Funções Auxiliares (Garantir Largura Fixa) ---

    async function createTypeChip(text: string): Promise<FrameNode> {
        const chip = figma.createFrame();
        const style = StyleConfig.Labels;
        chip.name = `Chip: ${text}`;
        chip.layoutMode = "HORIZONTAL";
        // Ambos AUTO para chip se ajustar ao texto
        chip.primaryAxisSizingMode = "AUTO";
        chip.counterAxisSizingMode = "AUTO";
        chip.paddingTop = chip.paddingBottom = style.PADDING_VERTICAL;
        chip.paddingLeft = chip.paddingRight = style.PADDING_HORIZONTAL;
        chip.cornerRadius = style.CORNER_RADIUS;
        chip.fills = style.FILL;

        const chipText = figma.createText();
        chipText.characters = text.toUpperCase();
        chipText.fontName = style.FONT;
        chipText.fontSize = style.FONT_SIZE;
        chipText.fills = style.TEXT_COLOR;
        // Texto também AUTO
        chipText.textAutoResize = "WIDTH_AND_HEIGHT";
        chip.appendChild(chipText);
        return chip;
    }

    async function createTitleBlock(nodeData: NodeData, nodeWidth: number): Promise<FrameNode> {
        const titleBlock = figma.createFrame();
        const style = StyleConfig.Nodes.TITLE_BLOCK;
        const layout = LayoutConfig.Nodes;

        titleBlock.name = `${nodeData.type} Title Block`;
        titleBlock.layoutMode = "VERTICAL";
        titleBlock.primaryAxisSizingMode = "AUTO"; // <<< Altura AUTO
        titleBlock.counterAxisSizingMode = "FIXED"; // <<< Largura FIXA
        titleBlock.itemSpacing = layout.TITLE_BLOCK_ITEM_SPACING;
        titleBlock.paddingTop = titleBlock.paddingBottom = titleBlock.paddingLeft = titleBlock.paddingRight = layout.TITLE_BLOCK_PADDING;
        titleBlock.cornerRadius = style.CORNER_RADIUS;
        titleBlock.fills = style.FILL;
        titleBlock.strokes = style.STROKE;
        titleBlock.strokeWeight = style.STROKE_WEIGHT;
        if (nodeData.type === "ENTRYPOINT") {
            titleBlock.dashPattern = style.ENTRYPOINT_DASH_PATTERN;
        }
        // Define a largura fixa do bloco
        titleBlock.resizeWithoutConstraints(nodeWidth, 1);

        const typeChip = await createTypeChip(nodeData.type);
        // Chip não precisa de layoutAlign pois o pai é vertical e o chip tem largura AUTO
        titleBlock.appendChild(typeChip);

        const titleText = figma.createText();
        titleText.characters = nodeData.name || `Untitled ${nodeData.type}`;
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.fills = style.TEXT_COLOR;
        titleText.layoutAlign = "STRETCH"; // <<< Texto estica na largura disponível
        titleText.textAutoResize = "HEIGHT"; // <<< Altura do texto é automática
        titleBlock.appendChild(titleText);

        // Pequena pausa para garantir cálculo do layout antes de retornar
        await new Promise(resolve => setTimeout(resolve, 0));
        frameDebugLog('TitleBlock', `Bloco de título criado para ${nodeData.id}. Altura: ${titleBlock.height}`);
        return titleBlock;
    }

    // Recebe agora 'descriptionFields' (o array)
    async function createDescriptionBlock(descriptionFields: DescriptionField[], nodeWidth: number): Promise<FrameNode> {
        frameDebugLog('DescBlock', `Iniciando criação com ${descriptionFields.length} campos.`);
        const block = figma.createFrame();
        const style = StyleConfig.Nodes.DESCRIPTION_BLOCK;
        const layout = LayoutConfig.Nodes;

        block.name = "Description Block";
        block.layoutMode = "VERTICAL";
        block.primaryAxisSizingMode = "AUTO"; // <<< Altura AUTO
        block.counterAxisSizingMode = "FIXED"; // <<< Largura FIXA
        block.itemSpacing = layout.DESCRIPTION_BLOCK_ITEM_SPACING;
        block.paddingTop = block.paddingBottom = block.paddingLeft = block.paddingRight = layout.DESCRIPTION_BLOCK_PADDING;
        block.cornerRadius = style.CORNER_RADIUS;
        block.strokes = style.STROKE;
        block.strokeWeight = style.STROKE_WEIGHT;
        block.fills = style.FILL;
        // Define a largura fixa do bloco
        block.resizeWithoutConstraints(nodeWidth, 1);

        let hasVisibleContent = false;

        for (const field of descriptionFields) {
            if (field && field.label && typeof field.label === 'string' && field.label.trim() !== '') {
                frameDebugLog('DescBlock', `Processando campo: ${field.label}`);
                try {
                    // Passa a largura disponível para o item (largura do bloco - paddings)
                    const itemAvailableWidth = nodeWidth - (layout.DESCRIPTION_BLOCK_PADDING * 2);
                    const itemFrame = await createDescriptionItem(field, itemAvailableWidth);
                    if (itemFrame.height > 1) {
                        block.appendChild(itemFrame);
                        hasVisibleContent = true;
                    } else {
                        frameDebugLog('DescBlock', `Item '${field.label}' criado com altura zero. Removendo.`);
                        itemFrame.remove();
                    }
                } catch (itemError) {
                    frameDebugLog('DescBlock', `Erro ao criar item '${field.label}':`, itemError);
                }
            } else {
                frameDebugLog('DescBlock', `Campo inválido ignorado:`, field);
            }
        }

        if (!hasVisibleContent) {
            frameDebugLog('DescBlock', `Nenhum item visível adicionado. Redimensionando para altura mínima.`);
            block.resize(nodeWidth, 1); // Garante altura mínima > 0 se vazio
            // Ajusta padding para não ocupar espaço visual se estiver vazio
            block.paddingTop = block.paddingBottom = 0;
            block.itemSpacing = 0;
        } else {
             const children = block.children;
             if (children.length > 0) {
                 const lastChild = children[children.length - 1];
                 // Remove padding do último item via config
                 if ('paddingBottom' in lastChild && typeof lastChild.paddingBottom === 'number') {
                    (lastChild as FrameNode).paddingBottom = 0;
                 }
             }
             // Pausa para garantir cálculo do layout
             await new Promise(resolve => setTimeout(resolve, 0));
             frameDebugLog('DescBlock', `Bloco de descrição finalizado. Altura: ${block.height}`);
        }


        return block;
    }

     // Recebe largura disponível
    async function createDescriptionItem(field: DescriptionField, availableWidth: number): Promise<FrameNode> {
        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.DESCRIPTION_ITEM;
        const layout = LayoutConfig.Nodes;

        frame.name = field.label || "Description Item";
        frame.layoutMode = "VERTICAL";
        frame.primaryAxisSizingMode = "AUTO"; // <<< Altura AUTO
        frame.counterAxisSizingMode = "FIXED"; // <<< Largura FIXA (herdada/definida)
        frame.itemSpacing = layout.DESCRIPTION_ITEM_SPACING;
        frame.paddingBottom = layout.DESCRIPTION_ITEM_PADDING_BOTTOM;
        frame.fills = [];
        frame.strokes = [];
        // Define a largura fixa do item
        frame.resizeWithoutConstraints(availableWidth, 1);

        const labelChip = await createTypeChip(field.label);
        // Chip não precisa de layoutAlign
        frame.appendChild(labelChip);

        let contentText = '';
        if (Array.isArray(field.content)) { contentText = field.content.join('\n'); }
        else if (typeof field.content === 'object' && field.content !== null) { contentText = Object.entries(field.content).map(([k, v]) => `${k}: ${v}`).join('\n'); }
        else { contentText = String(field.content ?? ''); }

        if (contentText.trim()) {
            const content = figma.createText();
            content.characters = contentText;
            content.fontName = style.CONTENT_FONT;
            content.fontSize = style.CONTENT_FONT_SIZE;
            content.fills = style.CONTENT_TEXT_COLOR;
            content.layoutAlign = "STRETCH"; // <<< Ocupa largura
            content.textAutoResize = "HEIGHT"; // <<< Altura automática
            frame.appendChild(content);
        } else {
            frame.itemSpacing = 0;
            frame.paddingBottom = 0;
            frameDebugLog('DescItem', `Campo '${field.label}' sem conteúdo.`);
        }

        // Pausa para garantir cálculo
        await new Promise(resolve => setTimeout(resolve, 0));
        frameDebugLog('DescItem', `Item '${field.label}' criado. Altura: ${frame.height}`);
        return frame;
    }

} // Fim do namespace Frames
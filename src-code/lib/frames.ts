// src-code/lib/frames.ts
/// <reference types="@figma/plugin-typings" />

import type { NodeData, DescriptionField } from '@shared/types/flow.types';
import type { RGB } from '../config/theme.config';
import * as LayoutConfig from '../config/layout.config'; // Ainda pode ser útil para espaçamento ENTRE nós
import * as StyleConfig from '../config/styles.config'; // Configurações não-temáticas
import { nodeCache } from '../utils/nodeCache'; // Para carregar fontes
import { getIconSvgStringForNodeType } from '../config/icons';

// --- Funções Auxiliares Internas (Refatoradas conforme nodeLayout.md e corrigidas) ---

/**
 * Cria um chip genérico. Usado por _createNodeTypeChip e _createDescLabelChip.
 * Corrigido: Busca por tokens com hífen (-) conforme gerados por theme.config.ts.
 */
async function _createChip(
    text: string,
    chipType: 'NodeType' | 'DescLabel',
    variant: 'Default' | 'Error' | 'Step' | 'Decision' | 'Entrypoint',
    finalColors: Record<string, RGB>,
    iconSvgString?: string
): Promise<FrameNode> {
    // Carregar fonte comum para todos os chips
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

    const chip = figma.createFrame();
    chip.name = `${variant} Chip: ${text}`;

    // --- Auto Layout e Sizing ---
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisSizingMode = "AUTO"; // HUG horizontal
    chip.counterAxisSizingMode = "AUTO"; // HUG vertical

    // --- Padding e Radius (Conforme nodeLayout.md e StyleConfig) ---
    const paddingH = chipType === 'NodeType' ? StyleConfig.Labels.TYPE_CHIP_PADDING_HORIZONTAL : StyleConfig.Labels.DESC_CHIP_PADDING_HORIZONTAL;
    const paddingV = chipType === 'NodeType' ? StyleConfig.Labels.TYPE_CHIP_PADDING_VERTICAL : StyleConfig.Labels.DESC_CHIP_PADDING_VERTICAL;
    chip.paddingLeft = chip.paddingRight = paddingH;
    chip.paddingTop = chip.paddingBottom = paddingV;
    chip.cornerRadius = chipType === 'NodeType' ? StyleConfig.Labels.TYPE_CHIP_CORNER_RADIUS : StyleConfig.Labels.DESC_CHIP_CORNER_RADIUS;

    // --- Item Spacing ---
    chip.itemSpacing = chipType === 'NodeType' ? StyleConfig.Labels.TYPE_CHIP_ITEM_SPACING : StyleConfig.Labels.DESC_CHIP_ITEM_SPACING;

    // --- Cores (Definidas pelo Tema) ---
    // CORRIGIDO: Usar nomes de tokens com hífen (-)
    let fillToken: string, textToken: string, iconToken: string | null = null;
    switch (variant) {
        case 'Error': fillToken = 'chips_error_fill'; textToken = 'chips_error_text'; break; // Mantido underscore pois é key 'error'
        case 'Step': fillToken = 'step_chip-fill'; textToken = 'step_chip-text'; iconToken = 'step_chip-icon'; break; // CORRIGIDO
        case 'Decision': fillToken = 'decision_chip-fill'; textToken = 'decision_chip-text'; iconToken = 'decision_chip-icon'; break; // CORRIGIDO
        case 'Entrypoint': fillToken = 'entrypoints_chip-fill'; textToken = 'entrypoints_chip-text'; iconToken = 'entrypoints_chip-icon'; break; // CORRIGIDO (era 'chip_fill')
        default: fillToken = 'chips_default_fill'; textToken = 'chips_default_text'; break; // Mantido underscore pois é key 'default'
    }

    if (finalColors[fillToken]) chip.fills = [{ type: 'SOLID', color: finalColors[fillToken] }]; else { console.warn(`[frames] Cor não encontrada para token: ${fillToken}`); chip.fills = []; }
    chip.strokes = []; // Chips não têm borda na especificação

    // --- Ícone SVG (Apenas para NodeType chips) ---
    if (chipType === 'NodeType' && iconSvgString && iconToken && finalColors[iconToken]) {
        try {
            const iconNode = figma.createNodeFromSvg(iconSvgString);
            iconNode.name = `${variant} Icon`;
            iconNode.resize(16, 16); // Tamanho fixo 16x16
            if ('findAll' in iconNode) {
                 // Encontra todas as camadas de geometria para aplicar a cor
                 const vectorNodes = (iconNode as FrameNode).findAll(n => n.type === 'VECTOR' || n.type === 'STAR' || n.type === 'BOOLEAN_OPERATION' || n.type === 'ELLIPSE' || n.type === 'POLYGON' || n.type === 'RECTANGLE' || n.type === 'TEXT') as GeometryMixin[];
                 if (vectorNodes.length > 0) {
                    vectorNodes.forEach(vector => {
                         // Aplica cor de preenchimento e remove bordas originais do SVG
                        const iconColor = finalColors[iconToken!];
                         if (iconColor) { // Verifica se a cor existe
                             vector.fills = [{ type: 'SOLID', color: iconColor }];
                             vector.strokes = [];
                         } else {
                              console.warn(`[frames] Cor do ícone '${iconToken}' não encontrada para aplicar.`);
                         }
                    });
                 } else {
                      // Fallback: se não encontrou vetores dentro, tenta aplicar no próprio nó SVG (menos comum)
                       if ('fills' in iconNode) {
                           const iconColor = finalColors[iconToken!];
                            if (iconColor) { // Verifica se a cor existe
                                (iconNode as GeometryMixin).fills = [{ type: 'SOLID', color: iconColor }];
                                (iconNode as GeometryMixin).strokes = [];
                            }
                       }
                  }
            }
            chip.appendChild(iconNode);
        } catch (error) { console.error(`[frames] Erro ao criar nó a partir do SVG para ${variant}:`, error); /* Continua sem ícone */ }
    } else if (chipType === 'NodeType' && iconSvgString) { console.warn(`[frames] Token de cor '${iconToken}' ou cor não encontrada para ícone ${variant}`); }


    // --- Texto do Chip ---
    const chipTextNode = figma.createText();
    const fontSize = chipType === 'NodeType' ? StyleConfig.Labels.TYPE_CHIP_FONT_SIZE : StyleConfig.Labels.DESC_CHIP_FONT_SIZE;
    chipTextNode.fontName = StyleConfig.Labels.FONT;
    chipTextNode.fontSize = fontSize;
    chipTextNode.characters = text;
    chipTextNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Essencial para HUG

    // CORRIGIDO: Usar nome de token com hífen (-)
    if (finalColors[textToken]) chipTextNode.fills = [{ type: 'SOLID', color: finalColors[textToken] }]; else console.warn(`[frames] Cor não encontrada para token: ${textToken}`);

    chip.appendChild(chipTextNode);

    return chip;
}

/** Cria o chip para o tipo do nó (Decision, Step, Entrypoint). */
async function _createNodeTypeChip(type: 'Step' | 'Decision' | 'Entrypoint', finalColors: Record<string, RGB>): Promise<FrameNode> {
    // Usa o tipo uppercase como texto do chip
    const chipText = type.toUpperCase();
    const svgString = getIconSvgStringForNodeType(type);
    // Passa o tipo como variante para _createChip para obter cores e configs corretas
    return _createChip(chipText, 'NodeType', type, finalColors, svgString);
}

/** Cria o chip para o rótulo de um item de descrição. */
async function _createDescLabelChip(label: string, finalColors: Record<string, RGB>): Promise<FrameNode> {
    // Determina a variante (Error ou Default) com base no rótulo
    const isError = label.toUpperCase().includes("ERROR"); // Lógica simples baseada em "ERROR"
    const variant = isError ? 'Error' : 'Default';
    // Passa a variante para _createChip para obter cores e configs corretas (chips_error_fill/text ou chips_default_fill/text)
    return _createChip(label, 'DescLabel', variant, finalColors);
}

/** Cria o frame container para o título e o chip de tipo (nodeTitle). */
async function _createNodeTitleFrame(nodeData: NodeData, finalColors: Record<string, RGB>, type: 'Step' | 'Decision' | 'Entrypoint'): Promise<FrameNode> {
    // Carregar fontes necessárias para o texto do título e o chip de tipo
    await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style); // Carrega fonte do chip via StyleConfig.Labels

    const titleFrame = figma.createFrame();
    titleFrame.name = `${type} Title Container`;

    // --- Auto Layout e Sizing (Conforme nodeLayout.md) ---
    titleFrame.layoutMode = "VERTICAL"; // Vertical
    titleFrame.primaryAxisSizingMode = "AUTO"; // HUG Vertical
    titleFrame.counterAxisSizingMode = "FIXED"; // FILL Horizontal (FIXED no pai e STRETCH no filho)
    titleFrame.layoutAlign = "STRETCH"; // Ocupa largura total do pai

    // --- Padding e Radius (Conforme nodeLayout.md - 0) ---
    titleFrame.paddingLeft = titleFrame.paddingRight = 0;
    titleFrame.paddingTop = titleFrame.paddingBottom = 0;
    titleFrame.cornerRadius = 0;

    // --- Item Spacing (Conforme nodeLayout.md) ---
    titleFrame.itemSpacing = 8;

    // --- Alinhamento (Conforme nodeLayout.md) ---
    titleFrame.primaryAxisAlignItems = "CENTER"; // Alinha itens verticalmente (CENTER conforme nodeLayout)
    titleFrame.counterAxisAlignItems = "MIN"; // Alinha itens à esquerda horizontalmente

    titleFrame.fills = []; // Sem preenchimento próprio

    // --- Children: nodeTypeChip e Node Name Text ---

    // Chip de Tipo (Criado primeiro para ficar no topo no Auto Layout Vertical)
    const typeChip = await _createNodeTypeChip(type, finalColors);
    titleFrame.appendChild(typeChip); // Adiciona o chip

    // Texto do Nome do Nó
    const titleText = figma.createText();
    titleText.name = "Node Name Text";
    titleText.characters = nodeData.name || `Untitled ${type}`; // Usa o nome do nó do Markdown
    titleText.fontName = StyleConfig.Nodes.TITLE_BLOCK.FONT; // Fonte do Título
    titleText.fontSize = StyleConfig.Nodes.TITLE_BLOCK.FONT_SIZE; // Tamanho do Título
    titleText.textAutoResize = "HEIGHT"; // Altura automática
    titleText.layoutAlign = "STRETCH"; // Ocupa largura restante horizontal no ALIGN MIN do pai

    // Cor do Texto do Título (Definida pelo Tema)
    // CORRIGIDO: Usar nome de token com hífen (-)
    let titleTextToken: string;
    switch(type) {
        case 'Decision': titleTextToken = 'decision_title-text'; break; // CORRIGIDO
        case 'Entrypoint': titleTextToken = 'entrypoints_title-text'; break; // CORRIGIDO
        default: titleTextToken = 'step_title-text'; break; // Default para Step, CORRIGIDO
    }
    if (finalColors[titleTextToken]) titleText.fills = [{ type: 'SOLID', color: finalColors[titleTextToken] }]; else console.warn(`[frames] Cor não encontrada para token: ${titleTextToken}`);

    titleFrame.appendChild(titleText); // Adiciona o texto

    return titleFrame;
}

/** Cria o frame container para um item individual da descrição (descItem). */
async function _createDescItemFrame(field: DescriptionField, finalColors: Record<string, RGB>, parentType: 'Step' | 'Entrypoint'): Promise<FrameNode | null> { // Retorna FrameNode | null
    // Carregar fontes necessárias para o chip de descrição e o conteúdo
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style); // Fonte do chip
    await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style); // Fonte do conteúdo

    // Valida o campo antes de criar o frame
    if (!field || !field.label || typeof field.label !== 'string' || field.label.trim() === '') {
         console.warn(`[frames] Campo de descrição inválido ou vazio encontrado. Pulando item.`, field);
         return null; // Retorna null se o campo for inválido/vazio
    }


    const itemFrame = figma.createFrame();
    itemFrame.name = `Desc Item: ${field.label}`;

    // --- Auto Layout e Sizing (Conforme nodeLayout.md) ---
    // CORRIGIDO: nodeLayout.md especifica Horizontal para descItem. Ajustando AL.
    itemFrame.layoutMode = "HORIZONTAL"; // Horizontal (Chip ao lado do Conteúdo)
    itemFrame.primaryAxisSizingMode = "FIXED"; // FILL Horizontal (Ocupa largura total do descBlock)
    itemFrame.counterAxisSizingMode = "AUTO"; // HUG Vertical (Altura se ajusta ao conteúdo)
    itemFrame.layoutAlign = "STRETCH"; // Ocupa largura total do pai (descBlock)

    // --- Padding e Radius (Conforme nodeLayout.md - 0) ---
    itemFrame.paddingLeft = itemFrame.paddingRight = 0;
    itemFrame.paddingTop = itemFrame.paddingBottom = 0;
    itemFrame.cornerRadius = 0;

    // --- Item Spacing (Conforme nodeLayout.md) ---
    itemFrame.itemSpacing = 8; // Espaço entre o chip label e o texto do conteúdo

    // --- Alinhamento (Conforme nodeLayout.md) ---
    itemFrame.primaryAxisAlignItems = "MIN"; // Alinha itens (Chip, Texto) à esquerda (padrão Horizontal)
    itemFrame.counterAxisAlignItems = "MIN"; // Alinha itens ao topo verticalmente

    itemFrame.fills = []; // Sem preenchimento próprio

    // --- Children: _createDescLabelChip e Description Content Text ---

    // Chip do Label da Descrição (Criado primeiro para ficar à esquerda no Auto Layout Horizontal)
    const descChip = await _createDescLabelChip(field.label, finalColors);
    descChip.layoutAlign = "MIN"; // Alinha o chip ao topo dentro do itemFrame (counter axis)
    itemFrame.appendChild(descChip); // Adiciona o chip label


    // Texto do Conteúdo da Descrição
    let contentText = '';
    if (Array.isArray(field.content)) {
        contentText = field.content.join('\n');
    } else if (typeof field.content === 'object' && field.content !== null) {
         // Transforma objeto em string chave: valor
        contentText = Object.entries(field.content).map(([k, v]) => `${k}: ${v}`).join('\n');
    } else {
        contentText = String(field.content ?? '');
    }


    if (contentText.trim()) { // Só cria o texto se houver conteúdo não vazio
        const content = figma.createText();
        content.name = "Description Content";
        content.characters = contentText;
        content.fontName = StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT; // Fonte do Conteúdo
        content.fontSize = StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT_SIZE; // Tamanho do Conteúdo
        content.layoutGrow = 1; // Ocupa todo o espaço horizontal restante no Auto Layout Horizontal
        content.textAutoResize = "HEIGHT"; // Altura automática

        // Cor do Texto do Conteúdo (Definida pelo Tema)
        // CORRIGIDO: Usar nome de token com hífen (-)
        const descTextToken = parentType === 'Entrypoint' ? 'entrypoints_desc-text' : 'step_desc-text'; // CORRIGIDO (entrypoints_desc_text não existia)
        if (finalColors[descTextToken]) content.fills = [{ type: 'SOLID', color: finalColors[descTextToken] }]; else console.warn(`[frames] Cor não encontrada para token: ${descTextToken}`);

        itemFrame.appendChild(content); // Adiciona o texto do conteúdo
    } else {
        // Se não há conteúdo, o itemSpacing de 8px entre chip e texto não é necessário.
        itemFrame.itemSpacing = 0;
         console.warn(`[frames] Conteúdo de descrição vazio para label '${field.label}'.`);
    }

    return itemFrame; // Retorna o frame criado
}

/** Cria o frame container para o bloco de descrição (descBlock), contendo múltiplos descItems. */
async function _createDescBlockFrame(descriptionFields: DescriptionField[], finalColors: Record<string, RGB>, parentType: 'Step' | 'Entrypoint'): Promise<FrameNode | null> {
     // Carrega fontes usadas pelos descItems (recursivo, mas bom garantir)
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
    await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

    const descBlock = figma.createFrame();
    descBlock.name = "Description Block Container";

    // --- Auto Layout e Sizing (Conforme nodeLayout.md) ---
    descBlock.layoutMode = "VERTICAL"; // Vertical
    descBlock.primaryAxisSizingMode = "AUTO"; // HUG Vertical
    descBlock.counterAxisSizingMode = "FIXED"; // FILL Horizontal
    descBlock.layoutAlign = "STRETCH"; // Ocupa largura total do pai (stepNode)

    // --- Padding e Radius (Conforme nodeLayout.md - 0) ---
    descBlock.paddingLeft = descBlock.paddingRight = 0;
    descBlock.paddingTop = descBlock.paddingBottom = 0;
    descBlock.cornerRadius = 0;

    // --- Item Spacing (Conforme nodeLayout.md) ---
    descBlock.itemSpacing = 24; // Espaço entre cada descItem

    // --- Alinhamento (Conforme nodeLayout.md) ---
    descBlock.primaryAxisAlignItems = "MIN"; // Alinha itens (descItems) ao topo
    descBlock.counterAxisAlignItems = "MIN"; // Alinha itens à esquerda

    descBlock.fills = []; // Sem preenchimento próprio

    let addedItems = 0;
    // Itera sobre os campos de descrição para criar cada descItem
    for (const field of descriptionFields) {
        // _createDescItemFrame agora valida e retorna null se inválido
        const itemFrame = await _createDescItemFrame(field, finalColors, parentType);
        // Só adiciona o item se ele foi criado com sucesso (não é null)
         if (itemFrame) {
            descBlock.appendChild(itemFrame);
            addedItems++;
         }
    }

    // Retorna o bloco apenas se ele contiver pelo menos um item válido
    if (addedItems > 0) {
        return descBlock;
    } else {
        console.warn(`[frames] _createDescBlockFrame: Nenhum item de descrição válido foi adicionado para o tipo ${parentType}. Retornando null.`);
        // Opcional: Remover o frame criado se ele estiver vazio, para não adicionar um frame vazio à página
        if (!descBlock.removed) {
             try { descBlock.remove(); } catch(e){/*ignore*/} // Tenta remover para limpar
        }
        return null; // Retorna null para indicar que o bloco está vazio/inválido
    }
}

/** Cria o frame container para o divisor (divider). */
async function _createDivider(finalColors: Record<string, RGB>): Promise<FrameNode> {
     // Carrega a fonte para garantir que o contexto de cores esteja pronto se necessário (embora o divisor não use texto)
     // await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style); // Não necessário para linha

    const dividerFrame = figma.createFrame();
    dividerFrame.name = "Divider Container";

    // --- Auto Layout e Sizing (Conforme nodeLayout.md) ---
    dividerFrame.layoutMode = "VERTICAL"; // Vertical
    dividerFrame.primaryAxisSizingMode = "AUTO"; // HUG Vertical (altura da linha + padding)
    dividerFrame.counterAxisSizingMode = "FIXED"; // FILL Horizontal
    dividerFrame.layoutAlign = "STRETCH"; // Ocupa largura total do pai (stepNode)

    // --- Padding e Radius (Conforme nodeLayout.md) ---
    dividerFrame.paddingLeft = 20;
    dividerFrame.paddingRight = 20;
    dividerFrame.paddingTop = dividerFrame.paddingBottom = 0; // Vertical padding 0
    dividerFrame.cornerRadius = 0;

    // --- Item Spacing (Conforme nodeLayout.md) ---
    dividerFrame.itemSpacing = 0; // Conforme sua correção

    // --- Alinhamento (Conforme nodeLayout.md) ---
    dividerFrame.primaryAxisAlignItems = "CENTER"; // Centraliza itens verticalmente (a linha)
    dividerFrame.counterAxisAlignItems = "CENTER"; // Centraliza itens horizontalmente (a linha)

    dividerFrame.fills = []; // Sem preenchimento próprio

    // --- Child: Line ---
    const lineNode = figma.createLine();
    lineNode.name = "Divider Line";
    lineNode.layoutAlign = "STRETCH"; // Ocupa largura total no Auto Layout Vertical
    lineNode.strokeWeight = 1; // Peso da linha

    // Cor da Linha (Definida pelo Tema)
    const lineColorToken = 'divider_line';
    if (finalColors[lineColorToken]) {
        lineNode.strokes = [{ type: 'SOLID', color: finalColors[lineColorToken] }];
    } else { console.warn(`[frames] Cor não encontrada para token: ${lineColorToken}`); lineNode.strokes = [{ type: 'SOLID', color: {r:0.8, g:0.8, b:0.8}}]; } // Fallback cinza claro

    // Linhas não podem ter filhos, então não precisa de appendChild
    // O lineNode é o único conteúdo do dividerFrame, posicionado pelo AL do frame.
    // Adicionar a linha ao frame:
    dividerFrame.appendChild(lineNode);
    dividerFrame.minHeight = 1; // Define a altura mínima para garantir que o Auto Layout funcione corretamente


    return dividerFrame;
}


// --- Funções Principais Exportadas (Refatoradas e Corrigidas) ---

export namespace Frames { // <<< ADICIONADO 'export' AQUI - ERA 'export namespace Frames' antes, corrigido para 'export namespace Frames'

    /** Cria o nó START. */
    export async function createStartNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        // Carrega a fonte definida em StyleConfig
        await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);

        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;

        frame.name = nodeData.name || "Start"; // Usa nome do Markdown ou fallback
        frame.resize(style.SIZE, style.SIZE); // Tamanho fixo (150x150)
        frame.cornerRadius = style.CORNER_RADIUS; // Raio (100) para formar círculo

        // --- Auto Layout para Centralizar Texto ---
        frame.layoutMode = "VERTICAL"; // Vertical
        frame.primaryAxisSizingMode = "FIXED"; // O frame pai tem tamanho FIXO (150x150)
        frame.counterAxisSizingMode = "FIXED"; // O frame pai tem tamanho FIXO (150x150)
        frame.primaryAxisAlignItems = "CENTER"; // Centraliza itens verticalmente
        frame.counterAxisAlignItems = "CENTER"; // Centraliza itens horizontalmente
        frame.itemSpacing = 0; // Sem espaçamento entre itens (só tem 1 item: o texto)
        // Padding = 0 (conforme sua instrução)

        // --- Cores e Borda (Definidas pelo Tema) ---
        if (finalColors.node_startend_fill) frame.fills = [{ type: 'SOLID', color: finalColors.node_startend_fill }]; else frame.fills = [];
        if (finalColors.node_startend_border) {
            frame.strokes = [{ type: 'SOLID', color: finalColors.node_startend_border }];
            frame.strokeWeight = 1;
            frame.strokeAlign = "INSIDE"; // strokeAlign INSIDE conforme JSON
        } else { frame.strokes = []; }


        // --- Texto Interno ---
        const titleText = figma.createText();
        titleText.name = "Node Name Text";
        // CORRIGIDO: Hardcodar "START"
        titleText.characters = "Start";
        titleText.fontName = style.FONT; // Fonte (Inter Medium)
        titleText.fontSize = style.FONT_SIZE; // Tamanho (30)
        titleText.textAutoResize = "HEIGHT"; // Deixa o Auto Layout redimensionar a altura
        titleText.layoutAlign = "INHERIT"; // Permite que o Auto Layout do pai o posicione/centralize

        // Cor do Texto (Definida pelo Tema)
        // Usa token específico para START ou fallback
        const textColor = finalColors['node_startend_start-text'] ?? finalColors.node_startend_text ?? {r:1,g:1,b:1}; // Fallback branco
        titleText.fills = [{ type: 'SOLID', color: textColor }];

        // REMOVIDO: titleText.resize(style.SIZE, style.SIZE); // Conflita com Auto Layout
        // REMOVIDO: titleText.textAlignHorizontal/Vertical - Centralização feita pelo AL do pai

        frame.appendChild(titleText); // Adiciona o texto

        return frame;
    }

    /** Cria o nó END. */
    export async function createEndNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
         // Segue a mesma lógica de createStartNode para consistência visual
        await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);

        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;

        frame.name = nodeData.name || "End"; // Usa nome do Markdown ou fallback
        frame.resize(style.SIZE, style.SIZE); // Tamanho fixo (150x150)
        frame.cornerRadius = style.CORNER_RADIUS; // Raio (100)

        // --- Auto Layout para Centralizar Texto ---
        frame.layoutMode = "VERTICAL";
        frame.primaryAxisSizingMode = "FIXED";
        frame.counterAxisSizingMode = "FIXED";
        frame.primaryAxisAlignItems = "CENTER";
        frame.counterAxisAlignItems = "CENTER";
        frame.itemSpacing = 0;
        // Padding = 0

        // --- Cores e Borda (Definidas pelo Tema) ---
        if (finalColors.node_startend_fill) frame.fills = [{ type: 'SOLID', color: finalColors.node_startend_fill }]; else frame.fills = [];
        if (finalColors.node_startend_border) {
            frame.strokes = [{ type: 'SOLID', color: finalColors.node_startend_border }];
            frame.strokeWeight = 1;
            frame.strokeAlign = "INSIDE"; // strokeAlign INSIDE
        } else { frame.strokes = []; }

        // --- Texto Interno ---
        const titleText = figma.createText();
        titleText.name = "Node Name Text";
        // CORRIGIDO: Hardcodar "END"
        titleText.characters = "End";
        titleText.fontName = style.FONT; // Fonte (Inter Medium)
        titleText.fontSize = style.FONT_SIZE; // Tamanho (30)
        titleText.textAutoResize = "HEIGHT";
        titleText.layoutAlign = "INHERIT";

        // Cor do Texto (Definida pelo Tema)
        // Usa token específico para END ou fallback
        const textColor = finalColors['node_startend_end-text'] ?? finalColors.node_startend_text ?? {r:1,g:1,b:1}; // Fallback branco
        titleText.fills = [{ type: 'SOLID', color: textColor }];

        // REMOVIDO: titleText.resize(...)
        // REMOVIDO: titleText.textAlignHorizontal/Vertical

        frame.appendChild(titleText); // Adiciona o texto

        return frame;
    }

    /** Cria o nó DECISION. */
    export async function createDecisionNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        // Carrega fontes necessárias (para o título e o chip de tipo, que são criados dentro de _createNodeTitleFrame)
         await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
         await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Decision";

        // --- Auto Layout e Sizing (Conforme nodeLayout.md) ---
        mainFrame.layoutMode = "VERTICAL"; // Vertical
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG Vertical (Altura se ajusta ao conteúdo)
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1); // Define a largura fixa (400)

        // --- Padding e Radius (Conforme nodeLayout.md) ---
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.DECISION.CORNER_RADIUS; // Raio (8)

        // --- Item Spacing (Conforme nodeLayout.md) ---
        mainFrame.itemSpacing = 24; // Espaço entre itens (só tem 1 item: o nodeTitle)

        // --- Alinhamento (Conforme nodeLayout.md) ---
        mainFrame.primaryAxisAlignItems = "CENTER"; // Centraliza itens verticalmente
        mainFrame.counterAxisAlignItems = "MIN"; // Alinha itens à esquerda horizontalmente

        mainFrame.clipsContent = true; // Recorta conteúdo que sair do frame

        // --- Cores e Borda (Definidas pelo Tema) ---
        if (finalColors.decision_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.decision_fill }]; else mainFrame.fills = [];
        if (finalColors.decision_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.decision_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];


        // --- Child: nodeTitle ---
        // Cria o container do título, passando os dados do nó e as cores
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Decision');
        mainFrame.appendChild(titleFrame); // Adiciona o bloco de título

        // Decision não tem divisor nem bloco de descrição na especificação.

        return mainFrame;
    }

    /** Cria o nó STEP. */
    export async function createStepNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        // Carrega fontes necessárias (para título, chip, descrição, divisor)
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Step";

        // --- Auto Layout e Sizing (Conforme nodeLayout.md) ---
        mainFrame.layoutMode = "VERTICAL"; // Vertical
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG Vertical
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1); // Define a largura fixa (400)

        // --- Padding e Radius (Conforme nodeLayout.md) ---
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.STEP_ENTRYPOINT.CORNER_RADIUS; // Raio (8)

        // --- Item Spacing (Conforme nodeLayout.md) ---
        mainFrame.itemSpacing = 24; // Espaço padrão entre blocos (Título, Divisor, Descrição)

        // --- Alinhamento (Conforme nodeLayout.md) ---
        mainFrame.primaryAxisAlignItems = "CENTER"; // Centraliza itens verticalmente
        mainFrame.counterAxisAlignItems = "MIN"; // Alinha itens à esquerda horizontalmente

        mainFrame.clipsContent = true;

        // --- Cores e Borda (Definidas pelo Tema) ---
        if (finalColors.step_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.step_fill }]; else mainFrame.fills = [];
        if (finalColors.step_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.step_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // --- Child 1: nodeTitle ---
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Step');
        mainFrame.appendChild(titleFrame); // Adiciona o bloco de título

        // --- Children Condicionais: divider e descBlock ---
        const descriptionFields = nodeData.description?.fields;
        if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {

            // Cria e adiciona o divisor APENAS se houver campos de descrição
            try {
                const divider = await _createDivider(finalColors);
                 if (divider) {
                    mainFrame.appendChild(divider);
                 } else {
                      console.warn(`[frames] _createDivider retornou nulo para stepNode ${nodeData.id}.`);
                 }
            } catch(e) { console.error(`[frames] Erro ao criar divisor para stepNode ${nodeData.id}:`, e); }

            // Cria e adiciona o bloco de descrição APENAS se houver campos de descrição VÁLIDOS
            try {
                const descBlock = await _createDescBlockFrame(descriptionFields, finalColors, 'Step');
                if (descBlock) { // _createDescBlockFrame já verifica se tem itens válidos dentro
                     mainFrame.appendChild(descBlock);
                } else {
                     console.warn(`[frames] descBlock vazio ou nulo para stepNode ${nodeData.id}.`);
                }
            } catch(e) { console.error(`[frames] Erro ao criar descBlock para stepNode ${nodeData.id}:`, e); }

        } else {
             // Se não há descrição, o itemSpacing padrão de 24px do mainFrame ainda se aplica
             // entre o titleFrame e a borda inferior do mainFrame. Isso está OK.
        }

        return mainFrame;
    }

    /** Cria o nó ENTRYPOINT. */
    export async function createEntrypointNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        // Segue a mesma lógica de createStepNode, mas sem divisor e descrição
        // Carrega fontes necessárias (para título e chip de tipo)
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

         const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Entrypoint";

        // --- Auto Layout e Sizing (Conforme nodeLayout.md) ---
        mainFrame.layoutMode = "VERTICAL"; // Vertical
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG Vertical
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1); // Define a largura fixa (400)

        // --- Padding e Radius (Conforme nodeLayout.md) ---
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.STEP_ENTRYPOINT.CORNER_RADIUS; // Raio (8)

        // --- Item Spacing (Conforme nodeLayout.md) ---
        mainFrame.itemSpacing = 0; // Não há mais de um item (só o nodeTitle)

        // --- Alinhamento (Conforme nodeLayout.md) ---
        mainFrame.primaryAxisAlignItems = "CENTER"; // Centraliza itens verticalmente
        mainFrame.counterAxisAlignItems = "MIN"; // Alinha itens à esquerda horizontalmente

        mainFrame.clipsContent = true;

        // --- Cores e Borda (Definidas pelo Tema) ---
        if (finalColors.entrypoints_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.entrypoints_fill }]; else mainFrame.fills = [];
        if (finalColors.entrypoints_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.entrypoints_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // --- Child 1: nodeTitle ---
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Entrypoint');
        mainFrame.appendChild(titleFrame); // Adiciona o bloco de título

        // Entrypoint não tem divisor nem bloco de descrição na especificação.

        return mainFrame;
    }

} // Fim do namespace Frames
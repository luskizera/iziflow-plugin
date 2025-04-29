// src-code/lib/frames.ts
/// <reference types="@figma/plugin-typings" />

import type { NodeData, DescriptionField } from '@shared/types/flow.types';
import type { RGB } from '../config/theme.config';
// Importa apenas as configurações de estilo NÃO TEMÁTICAS
import * as StyleConfig from '../config/styles.config';
import { nodeCache } from '../utils/nodeCache';
import { getIconSvgStringForNodeType } from '../config/icons';
// Importa a definição dos tokens semânticos para referência das chaves
import { semanticTokenDefinitions } from '../config/theme.config'; // Importa as definições

// --- Tipos Internos ---

// Define as variantes possíveis para os chips de descrição (devem corresponder às chaves em theme.config -> chips)
type DescChipVariant = 'Default' | 'Error' | 'Success' | 'Info' | 'Action' | 'Input';

// Define as variantes possíveis para os chips de tipo de nó
type NodeTypeVariant = 'Step' | 'Decision' | 'Entrypoint';

// Tipo combinado para a função _createChip
type ChipVariant = DescChipVariant | NodeTypeVariant;

// --- Funções Auxiliares Internas ---

/**
 * Cria um chip genérico com base na variante, tipo e texto fornecidos.
 * CORRIGIDO para usar 'entrypoints' como prefixo de token para nós ENTRYPOINT.
 */
async function _createChip(
    text: string, // O texto a ser exibido no chip
    chipType: 'NodeType' | 'DescLabel', // Indica se é um chip de tipo de nó ou de descrição
    variant: ChipVariant, // A variante que determina o estilo (cor) e potencialmente o ícone
    finalColors: Record<string, RGB>, // Cores resolvidas do tema
    iconSvgString?: string // SVG opcional (usado apenas para NodeType)
): Promise<FrameNode> {
    // Carrega a fonte padrão para chips
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

    const chip = figma.createFrame();
    chip.name = `${variant} ${chipType} Chip: ${text}`; // Nome descritivo

    // Configurações de Auto Layout (Horizontal, HUG/HUG)
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisAlignItems = "CENTER"
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";

    // Determina Padding, Radius, Spacing, Font Size com base no chipType
    const isNodeType = chipType === 'NodeType';
    const paddingH = isNodeType ? StyleConfig.Labels.TYPE_CHIP_PADDING_HORIZONTAL : StyleConfig.Labels.DESC_CHIP_PADDING_HORIZONTAL;
    const paddingV = isNodeType ? StyleConfig.Labels.TYPE_CHIP_PADDING_VERTICAL : StyleConfig.Labels.DESC_CHIP_PADDING_VERTICAL;
    chip.paddingLeft = chip.paddingRight = paddingH;
    chip.paddingTop = chip.paddingBottom = paddingV;
    chip.cornerRadius = isNodeType ? StyleConfig.Labels.TYPE_CHIP_CORNER_RADIUS : StyleConfig.Labels.DESC_CHIP_CORNER_RADIUS;
    chip.itemSpacing = isNodeType ? StyleConfig.Labels.TYPE_CHIP_ITEM_SPACING : StyleConfig.Labels.DESC_CHIP_ITEM_SPACING;
    const fontSize = isNodeType ? StyleConfig.Labels.TYPE_CHIP_FONT_SIZE : StyleConfig.Labels.DESC_CHIP_FONT_SIZE;

    // Determina os tokens de cor corretos com base na variante e tipo
    let fillToken: string | null = null;
    let textToken: string | null = null;
    let iconToken: string | null = null;
    // Garante que variant seja string antes de chamar toLowerCase
    const variantLower = typeof variant === 'string' ? variant.toLowerCase() : 'default';

    if (isNodeType) { // Para chips de tipo de nó (Step, Decision, Entrypoint)
        // <<< CORREÇÃO AQUI >>>
        // Define o prefixo correto para buscar os tokens semânticos
        let tokenPrefix = variantLower; // Default: 'step', 'decision'
        if (variantLower === 'entrypoint') {
            tokenPrefix = 'entrypoints'; // Usa o plural definido no theme.config.ts
        }
        // <<< FIM DA CORREÇÃO >>>

        // Constrói os nomes dos tokens usando o prefixo correto
        fillToken = `${tokenPrefix}_chip-fill`; // Ex: step_chip-fill, decision_chip-fill, entrypoints_chip-fill
        textToken = `${tokenPrefix}_chip-text`; // Ex: step_chip-text, decision_chip-text, entrypoints_chip-text
        iconToken = `${tokenPrefix}_chip-icon`; // Ex: step_chip-icon, decision_chip-icon, entrypoints_chip-icon
    } else { // Para chips de descrição (Action, Input, Error, Success, Info, Default)
        // Usa a variante como chave para buscar dentro do objeto 'chips'
        let chipKey: keyof typeof semanticTokenDefinitions.chips = 'default'; // Fallback
        if (variantLower in semanticTokenDefinitions.chips) {
             // Converte para o tipo correto para acessar o objeto
            chipKey = variantLower as keyof typeof semanticTokenDefinitions.chips;
        }
        // Constrói o nome do token achatado esperado por getThemeColors
        fillToken = `chips_${chipKey}_fill`; // Ex: chips_error_fill
        textToken = `chips_${chipKey}_text`; // Ex: chips_error_text
        // Chips de descrição não usam ícone por padrão
    }

    // Aplica Fill com fallback
    if (fillToken && finalColors[fillToken]) {
        chip.fills = [{ type: 'SOLID', color: finalColors[fillToken] }];
    } else {
        // console.warn(`[frames] Cor de Fill não encontrada para token: ${fillToken}. Usando fallback.`);
        chip.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]; // Cinza claro fallback
    }
    chip.strokes = []; // Sem borda

    // Adiciona Ícone (apenas para NodeType se disponível e cor encontrada)
    if (isNodeType && iconSvgString && iconToken && finalColors[iconToken]) {
        try {
            const iconNode = figma.createNodeFromSvg(iconSvgString);
            iconNode.name = `${variant} Icon`;
            iconNode.resize(16, 16); // Tamanho padrão do ícone
            const iconColor = finalColors[iconToken];

            // Tenta aplicar a cor recursivamente (para SVGs complexos) ou diretamente
            if ('findAll' in iconNode) {
                 const vectorNodes = (iconNode as FrameNode).findAll(n => 'fills' in n) as GeometryMixin[];
                 vectorNodes.forEach(vector => {
                    // Verifica se fills é um array antes de atribuir
                    if (Array.isArray(vector.fills)) {
                        vector.fills = [{ type: 'SOLID', color: iconColor }];
                        vector.strokes = []; // Remove borda do ícone
                    }
                 });
            } else if ('fills' in iconNode && Array.isArray(iconNode.fills)) { // Fallback para SVG simples
                 (iconNode as GeometryMixin).fills = [{ type: 'SOLID', color: iconColor }];
                 (iconNode as GeometryMixin).strokes = [];
            }
            chip.appendChild(iconNode);
        } catch (error) { console.error(`[frames] Erro ao criar ícone SVG para ${variant}:`, error); }
    } else if (isNodeType && iconSvgString && iconToken && !finalColors[iconToken]) {
        // Log específico se a cor do ícone não foi encontrada
        // console.warn(`[frames] Token/cor do ícone não encontrado: ${iconToken}. Ícone não será colorido.`);
        // Adiciona o ícone mesmo sem cor (ele usará a cor padrão do SVG)
         try {
            const iconNode = figma.createNodeFromSvg(iconSvgString);
            iconNode.name = `${variant} Icon (Uncolored)`;
            iconNode.resize(16, 16);
            chip.appendChild(iconNode);
        } catch (error) { console.error(`[frames] Erro ao criar ícone SVG (não colorido) para ${variant}:`, error); }
    }

    // Adiciona Texto
    const chipTextNode = figma.createText();
    chipTextNode.fontName = StyleConfig.Labels.FONT;
    chipTextNode.fontSize = fontSize;
    chipTextNode.characters = text; // Usa o texto padronizado passado
    chipTextNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Necessário para HUG funcionar

    // Aplica Cor do Texto com fallback
    if (textToken && finalColors[textToken]) {
         // Verifica se fills é um array antes de atribuir
         if (Array.isArray(chipTextNode.fills)) {
            chipTextNode.fills = [{ type: 'SOLID', color: finalColors[textToken] }];
         }
    } else {
        // console.warn(`[frames] Cor de Texto não encontrada para token: ${textToken}. Usando fallback.`);
         if (Array.isArray(chipTextNode.fills)) {
            chipTextNode.fills = [{ type: 'SOLID', color: {r:0, g:0, b:0} }]; // Preto fallback
         }
    }
    chip.appendChild(chipTextNode);

    return chip;
}


/**
 * Cria o chip específico para o tipo do nó (STEP, DECISION, ENTRYPOINT).
 */
async function _createNodeTypeChip(type: NodeTypeVariant, finalColors: Record<string, RGB>): Promise<FrameNode> {
    const chipText = type.toUpperCase(); // Texto é o tipo em maiúsculas
    const svgString = getIconSvgStringForNodeType(type);
    // A variante passada para _createChip é o próprio tipo de nó
    return _createChip(chipText, 'NodeType', type, finalColors, svgString);
}

/**
 * Cria o chip para o rótulo de um item de descrição, identificando a variante
 * e usando um texto padronizado para exibição no chip.
 */
async function _createDescLabelChip(label: string, finalColors: Record<string, RGB>): Promise<FrameNode> {
    const normalizedLabel = label.trim().toLowerCase();
    let variant: DescChipVariant = 'Default';
    let standardDisplayText = label.trim(); // Texto padrão inicial

    // 1. Identificar Variante (prioriza exato, depois 'includes')
    switch (normalizedLabel) {
        case 'action': variant = 'Action'; break;
        case 'inputs': case 'input': variant = 'Input'; break;
        case 'error state': case 'error states': case 'error': case 'error message': case 'error messages': variant = 'Error'; break; // Adicionado error message(s)
        case 'success feedback': case 'success message': case 'success': variant = 'Success'; break;
        case 'info': case 'message': case 'note': case 'context': case 'instructions': case 'summary': case 'title': case 'highlights': case 'security note': case 'prompt': case 'options': case 'motivation': case 'tone': variant = 'Info'; break; // Adicionado prompt, options, etc.
        case 'validation': variant = 'Default'; standardDisplayText="VALIDATION"; break; // Tratamento especial para Validation como Default
    }
    // Fallback 'includes' (mantido, mas menos provável de ser necessário com mais casos exatos)
    if (variant === 'Default' && standardDisplayText === label.trim()) { // Só faz fallback se ainda não achou e não é Validation
        if (normalizedLabel.includes("error")) { variant = 'Error'; }
        else if (normalizedLabel.includes("success")) { variant = 'Success'; }
        else if (normalizedLabel.includes("action")) { variant = 'Action'; }
        else if (normalizedLabel.includes("input")) { variant = 'Input'; }
        else if (normalizedLabel.includes("info") || normalizedLabel.includes("message") || normalizedLabel.includes("note")) { variant = 'Info'; }
    }

    // 2. Definir Texto Padrão baseado na Variante Final (se não for validation)
    if (standardDisplayText === label.trim()) { // Só ajusta se não for validation
        switch(variant) {
            case 'Action': standardDisplayText = "ACTION"; break;
            case 'Input': standardDisplayText = "INPUTS"; break;
            case 'Error': standardDisplayText = "ERROR"; break;
            case 'Success': standardDisplayText = "SUCCESS"; break;
            case 'Info': standardDisplayText = "INFO"; break;
            default: // Para 'Default' (exceto Validation)
                standardDisplayText = label.trim().toUpperCase(); // Mantém original (ou Uppercase)
                if (variant === 'Default') {
                     // console.warn(`[frames] Rótulo DESC não padronizado: "${label}". Usando estilo Default e texto ${standardDisplayText}.`);
                }
                break;
        }
    }

    // console.log(`[frames] Label Input: "${label}", Variante: ${variant}, Texto Exibido: "${standardDisplayText}"`);

    // Chama _createChip com texto padronizado e variante correta
    return _createChip(standardDisplayText, 'DescLabel', variant, finalColors);
}


/**
 * Cria o frame container para o título (Chip de Tipo + Nome do Nó).
 */
async function _createNodeTitleFrame(nodeData: NodeData, finalColors: Record<string, RGB>, type: NodeTypeVariant): Promise<FrameNode> {
    await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

    const titleFrame = figma.createFrame();
    titleFrame.name = `${type} Title Container`;
    titleFrame.layoutMode = "VERTICAL";
    titleFrame.primaryAxisSizingMode = "AUTO"; // HUG V
    titleFrame.counterAxisSizingMode = "FIXED"; // FILL H
    titleFrame.layoutAlign = "STRETCH";
    titleFrame.paddingLeft = titleFrame.paddingRight = 0;
    titleFrame.paddingTop = titleFrame.paddingBottom = 0;
    titleFrame.cornerRadius = 0;
    titleFrame.itemSpacing = 8; // Espaço entre chip e texto
    titleFrame.primaryAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    titleFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    titleFrame.fills = [];

    // Chip de Tipo (no topo)
    const typeChip = await _createNodeTypeChip(type, finalColors);
    titleFrame.appendChild(typeChip);

    // Texto do Nome do Nó
    const titleText = figma.createText();
    titleText.name = "Node Name Text";
    titleText.characters = nodeData.name || `Untitled ${type}`;
    titleText.fontName = StyleConfig.Nodes.TITLE_BLOCK.FONT;
    titleText.fontSize = StyleConfig.Nodes.TITLE_BLOCK.FONT_SIZE;
    titleText.textAutoResize = "HEIGHT";
    titleText.layoutAlign = "STRETCH"; // Ocupa largura

    // Cor do Texto do Título (já estava correto para entrypoints)
    let titleTextToken: string;
    switch(type) {
        case 'Decision': titleTextToken = 'decision_title-text'; break;
        case 'Entrypoint': titleTextToken = 'entrypoints_title-text'; break;
        default: titleTextToken = 'step_title-text'; break; // Default to step
    }

    if (finalColors[titleTextToken]) {
         if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: finalColors[titleTextToken] }];
    } else {
         // console.warn(`[frames] Cor não encontrada para token de título: ${titleTextToken}. Usando fallback preto.`);
         if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0} }];
    }
    titleFrame.appendChild(titleText);

    return titleFrame;
}

/**
 * Cria o frame para um item de descrição (Chip + Conteúdo) com layout horizontal.
 */
async function _createDescItemFrame(field: DescriptionField, finalColors: Record<string, RGB>, parentType: NodeTypeVariant): Promise<FrameNode | null> {
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
    await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

    if (!field || !field.label || typeof field.label !== 'string' || field.label.trim() === '') return null;

    const itemFrame = figma.createFrame();
    itemFrame.name = `Desc Item: ${field.label}`;
    itemFrame.layoutMode = "HORIZONTAL"; // Lado a lado
    itemFrame.primaryAxisSizingMode = "FIXED"; // Ocupa largura do pai
    itemFrame.counterAxisSizingMode = "AUTO"; // Altura HUG
    itemFrame.layoutAlign = "STRETCH";
    itemFrame.itemSpacing = 8; // Espaço entre chip e texto
    itemFrame.primaryAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    itemFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    itemFrame.paddingLeft = itemFrame.paddingRight = 0;
    itemFrame.paddingTop = itemFrame.paddingBottom = 0;
    itemFrame.cornerRadius = 0;
    itemFrame.fills = [];

    // Chip do Label (Ocupa espaço restante)
    const descChip = await _createDescLabelChip(field.label, finalColors);
    descChip.layoutGrow = 1; // Faz o chip esticar
    itemFrame.appendChild(descChip);

    // Texto do Conteúdo (Largura fixa)
    let contentText = '';
    if (Array.isArray(field.content)) { contentText = field.content.join('\n'); }
    else if (typeof field.content === 'object' && field.content !== null) { contentText = Object.entries(field.content).map(([k, v]) => `${k}: ${v}`).join('\n'); }
    else { contentText = String(field.content ?? ''); }

    // Processa \n no conteúdo para criar quebras de linha reais
    contentText = contentText.replace(/\\n/g, '\n');

    if (contentText.trim()) {
        const content = figma.createText();
        content.name = "Description Content";
        content.characters = contentText;
        content.fontName = StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT;
        content.fontSize = StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT_SIZE;
        content.layoutSizingHorizontal = "FIXED"; // Largura Fixa
        content.resize(258, content.height); // Define largura 258px - Ajuste se necessário
        content.textAutoResize = "HEIGHT"; // Altura automática
        content.layoutAlign = "MIN"; // <<< CORRIGIDO de MIN

        // Cor do texto (Ajustado para buscar token de Entrypoint corretamente)
        let descTextToken: string;
         switch(parentType) {
             case 'Decision': descTextToken = 'decision_desc-text'; break; // Assumindo que Decision usa step como fallback ou tem seu token
             case 'Entrypoint': descTextToken = 'entrypoints_desc-text'; break;
             default: descTextToken = 'step_desc-text'; break; // Default to step
         }
         // Adiciona fallback se token de description não existir (ex: para Decision)
         if (!finalColors[descTextToken]) {
             descTextToken = 'step_desc-text'; // Tenta usar step como fallback geral para descrição
             // console.warn(`[frames] Token ${parentType}_desc-text não encontrado, usando fallback ${descTextToken}`);
         }


        if (finalColors[descTextToken]) {
            if(Array.isArray(content.fills)) content.fills = [{ type: 'SOLID', color: finalColors[descTextToken] }];
        } else {
            // console.warn(`[frames] Cor de descrição não encontrada para token: ${descTextToken}. Usando fallback preto.`);
            if(Array.isArray(content.fills)) content.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0}}];
        }
        itemFrame.appendChild(content);
    } else {
        // Se não há conteúdo, remove o espaçamento entre itens (o chip ocupa tudo)
        itemFrame.itemSpacing = 0;
        // Mantém layoutGrow = 1 no chip para ocupar o espaço
    }

    return itemFrame;
}

/** Cria o frame container para o bloco de descrição (descBlock). */
async function _createDescBlockFrame(descriptionFields: DescriptionField[], finalColors: Record<string, RGB>, parentType: NodeTypeVariant): Promise<FrameNode | null> {
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
    await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

    const descBlock = figma.createFrame();
    descBlock.name = "Description Block Container";
    descBlock.layoutMode = "VERTICAL";
    descBlock.primaryAxisSizingMode = "AUTO"; // HUG V
    descBlock.counterAxisSizingMode = "FIXED"; // FILL H
    descBlock.layoutAlign = "STRETCH";
    descBlock.itemSpacing = 12; // Reduzido espaço entre descItems
    descBlock.primaryAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    descBlock.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    descBlock.paddingLeft = descBlock.paddingRight = 0;
    descBlock.paddingTop = descBlock.paddingBottom = 0;
    descBlock.cornerRadius = 0;
    descBlock.fills = [];

    let addedItems = 0;
    for (const field of descriptionFields) {
        const itemFrame = await _createDescItemFrame(field, finalColors, parentType);
         if (itemFrame) {
            descBlock.appendChild(itemFrame);
            addedItems++;
         }
    }

    // Retorna o bloco apenas se itens foram adicionados
    if (addedItems > 0) return descBlock;
    else {
        // console.warn(`[frames] Nenhum item de descrição válido para ${parentType}. Bloco não será adicionado.`);
        if (!descBlock.removed) { try { descBlock.remove(); } catch(e){} }
        return null;
    }
}

/** Cria o frame container para o divisor (divider). */
async function _createDivider(finalColors: Record<string, RGB>): Promise<FrameNode> {
    const dividerFrame = figma.createFrame();
    dividerFrame.name = "Divider Container";
    dividerFrame.layoutMode = "VERTICAL"; // Mantém vertical para conter a linha
    dividerFrame.primaryAxisSizingMode = "AUTO"; // Altura mínima definida pela linha
    dividerFrame.counterAxisSizingMode = "FIXED"; // Ocupa largura total
    dividerFrame.layoutAlign = "STRETCH"; // Ocupa largura no pai
    // Ajusta padding para alinhamento visual da linha
    dividerFrame.paddingLeft = 20;
    dividerFrame.paddingRight = 20;
    dividerFrame.paddingTop = 0; // Sem padding vertical no container
    dividerFrame.paddingBottom = 0;
    dividerFrame.cornerRadius = 0;
    dividerFrame.itemSpacing = 0;
    dividerFrame.primaryAxisAlignItems = "CENTER"; // Centraliza linha verticalmente se houver espaço
    dividerFrame.counterAxisAlignItems = "CENTER"; // Centraliza linha horizontalmente (não fará diferença com STRETCH)
    dividerFrame.fills = []; // Sem fundo

    const lineNode = figma.createLine();
    lineNode.name = "Divider Line";
    lineNode.layoutAlign = "STRETCH"; // Linha ocupa a largura do container (menos padding)
    lineNode.strokeWeight = 1;

    const lineColorToken = 'divider_line';
    if (finalColors[lineColorToken]) {
        lineNode.strokes = [{ type: 'SOLID', color: finalColors[lineColorToken] }];
    } else {
        // console.warn(`[frames] Cor não encontrada para token: ${lineColorToken}. Usando fallback cinza.`);
        lineNode.strokes = [{ type: 'SOLID', color: {r:0.8, g:0.8, b:0.8}}];
    }

    dividerFrame.appendChild(lineNode);
    // Garante altura mínima para o frame não colapsar
    dividerFrame.minHeight = lineNode.strokeWeight; // Altura mínima é a espessura da linha

    return dividerFrame;
}


// --- Funções Principais Exportadas ---

export namespace Frames {

    /** Cria o nó START. */
    export async function createStartNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);
        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;
        frame.name = nodeData.name || "Start";
        frame.resize(style.SIZE, style.SIZE);
        frame.cornerRadius = style.CORNER_RADIUS;
        frame.layoutMode = "VERTICAL";
        frame.primaryAxisSizingMode = "FIXED";
        frame.counterAxisSizingMode = "FIXED";
        frame.primaryAxisAlignItems = "CENTER";
        frame.counterAxisAlignItems = "CENTER";
        frame.itemSpacing = 0;
        // Busca cor de fill específica para Start, depois fallback geral, depois transparente
        const fillToken = 'node_startend_start-fill'; // Nome específico sugerido
        const fillFallbackToken = 'node_startend_fill';
        const fillColor = finalColors[fillToken] ?? finalColors[fillFallbackToken] ?? null;
        if (fillColor) frame.fills = [{ type: 'SOLID', color: fillColor }]; else frame.fills = [];

        const borderToken = 'node_startend_border';
        if (finalColors[borderToken]) {
            frame.strokes = [{ type: 'SOLID', color: finalColors[borderToken] }];
            frame.strokeWeight = 1; frame.strokeAlign = "INSIDE";
        } else { frame.strokes = []; }

        const titleText = figma.createText();
        titleText.name = "Node Name Text";
        titleText.characters = "Start"; // Texto Fixo
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.textAutoResize = "HEIGHT";
        titleText.layoutAlign = "INHERIT";
        const textColorToken = 'node_startend_start-text';
        const textFallbackToken = 'node_startend_text';
        const textColor = finalColors[textColorToken] ?? finalColors[textFallbackToken] ?? {r:0,g:0,b:0}; // Fallback preto
        if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: textColor }];

        frame.appendChild(titleText);
        return frame;
    }

    /** Cria o nó END. */
    export async function createEndNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);
        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;
        frame.name = nodeData.name || "End";
        frame.resize(style.SIZE, style.SIZE);
        frame.cornerRadius = style.CORNER_RADIUS;
        frame.layoutMode = "VERTICAL";
        frame.primaryAxisSizingMode = "FIXED";
        frame.counterAxisSizingMode = "FIXED";
        frame.primaryAxisAlignItems = "CENTER";
        frame.counterAxisAlignItems = "CENTER";
        frame.itemSpacing = 0;
        // Busca cor de fill específica para End, depois fallback geral, depois transparente
        const fillToken = 'node_startend_end-fill'; // Nome específico sugerido
        const fillFallbackToken = 'node_startend_fill';
        const fillColor = finalColors[fillToken] ?? finalColors[fillFallbackToken] ?? null;
        if (fillColor) frame.fills = [{ type: 'SOLID', color: fillColor }]; else frame.fills = [];

        const borderToken = 'node_startend_border';
        if (finalColors[borderToken]) {
            frame.strokes = [{ type: 'SOLID', color: finalColors[borderToken] }];
            frame.strokeWeight = 1; frame.strokeAlign = "INSIDE";
        } else { frame.strokes = []; }

        const titleText = figma.createText();
        titleText.name = "Node Name Text";
        titleText.characters = "End"; // Texto Fixo
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.textAutoResize = "HEIGHT";
        titleText.layoutAlign = "INHERIT";
        const textColorToken = 'node_startend_end-text';
        const textFallbackToken = 'node_startend_text';
        const textColor = finalColors[textColorToken] ?? finalColors[textFallbackToken] ?? {r:0,g:0,b:0}; // Fallback preto
        if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: textColor }];

        frame.appendChild(titleText);
        return frame;
    }

    /** Cria o nó DECISION. */
    export async function createDecisionNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Decision";
        mainFrame.layoutMode = "VERTICAL";
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG V
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura Fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1); // Usa mesma largura de STEP
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.DECISION.CORNER_RADIUS; // 8px
        mainFrame.itemSpacing = 16; // Espaço entre Título e Descrição (se houver)
        mainFrame.primaryAxisAlignItems = "CENTER"; // Alinhamento V
        mainFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
        mainFrame.clipsContent = true;

        // Aplica cores do tema
        if (finalColors.decision_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.decision_fill }]; else mainFrame.fills = [];
        if (finalColors.decision_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.decision_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // Adiciona Título
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Decision');
        mainFrame.appendChild(titleFrame);

         // Adiciona Descrição (se houver)
         const descriptionFields = nodeData.description?.fields;
         if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {
             const descBlock = await _createDescBlockFrame(descriptionFields, finalColors, 'Decision');
              // Adiciona divisor apenas se o bloco de descrição foi criado com sucesso e se há título
             if (descBlock && titleFrame) {
                  try {
                      const divider = await _createDivider(finalColors);
                      if (divider) mainFrame.appendChild(divider); // Adiciona APÓS o título
                  } catch(e) { console.error(`[frames] Erro ao criar divisor para decision ${nodeData.id}:`, e); }
                  mainFrame.appendChild(descBlock); // Adiciona descrição após divisor
                  mainFrame.itemSpacing = 24; // Aumenta espaçamento se tiver descrição
             } else if (descBlock) {
                  mainFrame.appendChild(descBlock); // Adiciona descrição mesmo sem título (caso raro)
                  mainFrame.itemSpacing = 0;
             }
         }

        return mainFrame;
    }

    /** Cria o nó STEP. */
    export async function createStepNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Step";
        mainFrame.layoutMode = "VERTICAL";
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG V
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura Fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1);
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.STEP_ENTRYPOINT.CORNER_RADIUS; // 8px
        mainFrame.itemSpacing = 24; // Espaço padrão entre Título, Divisor, Descrição
        mainFrame.primaryAxisAlignItems = "CENTER"; // Alinhamento V
        mainFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
        mainFrame.clipsContent = true;

        // Aplica cores do tema
        if (finalColors.step_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.step_fill }]; else mainFrame.fills = [];
        if (finalColors.step_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.step_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // Adiciona Título
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Step');
        mainFrame.appendChild(titleFrame);

        // Adiciona Divisor e Descrição (se houver)
        const descriptionFields = nodeData.description?.fields;
        if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {
            const descBlock = await _createDescBlockFrame(descriptionFields, finalColors, 'Step');
            // Adiciona divisor apenas se o bloco de descrição foi criado com sucesso
            if (descBlock) {
                 try {
                     const divider = await _createDivider(finalColors);
                     if (divider) mainFrame.appendChild(divider); // Adiciona APÓS o título
                 } catch(e) { console.error(`[frames] Erro ao criar divisor para step ${nodeData.id}:`, e); }
                 mainFrame.appendChild(descBlock); // Adiciona descrição após divisor
            }
        }

        return mainFrame;
    }

    /** Cria o nó ENTRYPOINT. */
    export async function createEntrypointNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
         await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style); // Carrega fonte da descrição tbm

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Entrypoint";
        mainFrame.layoutMode = "VERTICAL";
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG V
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura Fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1);
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.STEP_ENTRYPOINT.CORNER_RADIUS; // 8px
        mainFrame.itemSpacing = 24; // Espaço padrão, ajustado se houver descrição
        mainFrame.primaryAxisAlignItems = "CENTER"; // Alinhamento V
        mainFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
        mainFrame.clipsContent = true;

        // Aplica cores do tema (usando 'entrypoints' como chave)
        if (finalColors.entrypoints_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.entrypoints_fill }]; else mainFrame.fills = [];
        if (finalColors.entrypoints_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.entrypoints_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // Adiciona Título
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Entrypoint');
        mainFrame.appendChild(titleFrame);

         // Adiciona Divisor e Descrição (se houver) - Lógica igual ao STEP
        const descriptionFields = nodeData.description?.fields;
        if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {
            const descBlock = await _createDescBlockFrame(descriptionFields, finalColors, 'Entrypoint');
            if (descBlock) {
                 try {
                     const divider = await _createDivider(finalColors);
                     if (divider) mainFrame.appendChild(divider);
                 } catch(e) { console.error(`[frames] Erro ao criar divisor para entrypoint ${nodeData.id}:`, e); }
                 mainFrame.appendChild(descBlock);
            }
        } else {
             // Se não houver descrição, remove o espaçamento padrão após o título
             mainFrame.itemSpacing = 0;
        }


        return mainFrame;
    }

} // Fim do namespace Frames
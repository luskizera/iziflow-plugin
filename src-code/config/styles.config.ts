// src-code/config/styles.config.ts
/// <reference types="@figma/plugin-typings" />

// Este arquivo agora foca em estilos NÃO temáticos: fontes, tamanhos, raios, pesos, etc.
// As cores são gerenciadas por theme.config.ts

// --- Estilos de Conectores (Apenas não-cor) ---
export const Connectors = {
    PRIMARY: {
        // STROKE: definido pelo tema (token: connector_primary)
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [], // Sólido
        END_CAP: "ARROW_LINES" as ConnectorStrokeCap, // Tipo correto da API
    },
    SECONDARY: {
        // STROKE: definido pelo tema (token: connector_secondary)
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [4, 4], // Tracejado
        END_CAP: "ARROW_LINES" as ConnectorStrokeCap, // Tipo correto da API
    },
};

// --- Estilos de Etiquetas/Chips (Apenas não-cor) ---
// Reflete chipsNode e nodeTypeChip do nodeLayout.md
export const Labels = {
    // Configuração base para chips de descrição (chipsNode)
    DESC_CHIP_PADDING_HORIZONTAL: 6,
    DESC_CHIP_PADDING_VERTICAL: 1,
    DESC_CHIP_CORNER_RADIUS: 4,
    DESC_CHIP_FONT_SIZE: 12,
    DESC_CHIP_ITEM_SPACING: 4, // Espaço entre ícone e texto (embora chipsNode não tenha ícone)

    // Configuração para chips de tipo de nó (nodeTypeChip)
    TYPE_CHIP_PADDING_HORIZONTAL: 8,
    TYPE_CHIP_PADDING_VERTICAL: 4,
    TYPE_CHIP_CORNER_RADIUS: 6,
    TYPE_CHIP_FONT_SIZE: 14,
    TYPE_CHIP_ITEM_SPACING: 8, // Espaço entre ícone e texto

    // Fonte comum para todos os chips
    FONT: { family: "Inter", style: "Medium" } as FontName,
};

// --- Estilos de Nós (Apenas não-cor) ---
export const Nodes = {
    START_END: {
        // FILL, STROKE, TEXT_COLOR: definidos pelo tema
        CORNER_RADIUS: 100, // Raio para formar círculo em 150x150
        FONT: { family: "Inter", style: "Medium" } as FontName, // Conforme discussão
        FONT_SIZE: 30, // Conforme discussão
        SIZE: 150, // Tamanho fixo 150x150
    },
    DECISION: { // Configurações para o frame principal DECISION
        // FILL, STROKE: definidos pelo tema
        CORNER_RADIUS: 8, // Conforme nodeLayout.md
        // Padding e Item Spacing definidos diretamente nas funções de criação
    },
     STEP_ENTRYPOINT: { // Configurações comuns para frames principais STEP/ENTRYPOINT
        // FILL, STROKE: definidos pelo tema
        CORNER_RADIUS: 8, // Conforme nodeLayout.md
        WIDTH: 400, // Largura fixa conforme nodeLayout.md
        // Padding e Item Spacing definidos diretamente nas funções de criação
    },
    TITLE_BLOCK: { // Estilos para o frame container do Título (nodeTitle)
        // FILL: none
        // STROKE: none
        // Padding e Item Spacing definidos diretamente nas funções de criação
        FONT: { family: "Inter", style: "Regular" } as FontName, // Fonte do Nome do Nó
        FONT_SIZE: 24, // Tamanho do Nome do Nó
    },
    DESCRIPTION_BLOCK: { // Estilos para o frame container da Descrição (descBlock)
        // FILL: none
        // STROKE: none
        // Padding e Item Spacing definidos diretamente nas funções de criação
    },
    DESCRIPTION_ITEM: { // Estilos para o frame container de cada Item da Descrição (descItem)
        // FILL: none
        // STROKE: none
         // Padding e Item Spacing definidos diretamente nas funções de criação
        CONTENT_FONT: { family: "Inter", style: "Regular" } as FontName, // Fonte do Conteúdo da Descrição
        CONTENT_FONT_SIZE: 16, // Tamanho do Conteúdo da Descrição
    },
    DIVIDER: { // Estilos para o frame container do Divisor (divider)
        // FILL: none
        // STROKE: none
        // Padding e Item Spacing definidos diretamente nas funções de criação
    }
};

// --- Fontes Usadas ---
// Fontes que precisam ser carregadas via figma.loadFontAsync
export const FontsToLoad: FontName[] = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" }, // Se usado em algum lugar
    { family: "Inter", style: "Bold" },    // Se usado em algum lugar (START/END agora usa Medium)
];
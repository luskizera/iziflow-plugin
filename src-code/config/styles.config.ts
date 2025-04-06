import { hexToRgb } from "../utils/hexToRgb";

// Tipos básicos (podem já existir nas tipagens do Figma)
type FigmaPaint = ReadonlyArray<Paint>;
type FigmaFont = { family: string; style: string };
type FigmaStrokeCap = StrokeCap | "NONE" | "ROUND" | "SQUARE" | "LINE_ARROW" | "TRIANGLE_ARROW" | "ARROW_LINES" | "ARROW_EQUILATERAL";

// --- Cores Base ---
const Colors = {
    BLACK: hexToRgb("#000000"),
    DARK_GRAY: hexToRgb("#323232"),
    MEDIUM_GRAY: hexToRgb("#939393"),
    LIGHT_GRAY_STROKE: hexToRgb("#A1A1AA"), // Borda do título Step/Entry
    VERY_LIGHT_GRAY_FILL: hexToRgb("#F4F4F5"), // Fundo do título Step/Entry
    BORDER_GRAY: hexToRgb("#E4E4E7"), // Borda da descrição
    WHITE: hexToRgb("#FFFFFF"),
    WHITE_TEXT: hexToRgb("#FAFAFA"), // Texto Start/End
    DARK_TEXT: hexToRgb("#09090B"), // Texto títulos Step/Decision
    CONTENT_TEXT: hexToRgb("#1E1E1E"), // Texto descrições
    START_END_FILL: hexToRgb("#18181B"),
    DECISION_FILL: hexToRgb("#A3A3A3"), // Cinza para o losango
};

// --- Estilos de Conectores ---
export const Connectors = {
    PRIMARY: {
        STROKE: [{ type: "SOLID", color: Colors.BLACK }] as FigmaPaint,
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [] as number[],
        END_CAP: "ARROW_LINES" as FigmaStrokeCap,
    },
    SECONDARY: {
        STROKE: [{ type: "SOLID", color: Colors.MEDIUM_GRAY }] as FigmaPaint,
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [4, 4] as number[],
        END_CAP: "ARROW_LINES" as FigmaStrokeCap,
    },
};

// --- Estilos de Etiquetas/Chips ---
export const Labels = {
    PADDING_HORIZONTAL: 12,
    PADDING_VERTICAL: 8,
    CORNER_RADIUS: 4,
    FILL: [{ type: "SOLID", color: Colors.DARK_GRAY }] as FigmaPaint,
    TEXT_COLOR: [{ type: "SOLID", color: Colors.WHITE }] as FigmaPaint,
    FONT: { family: "Inter", style: "Medium" } as FigmaFont,
    FONT_SIZE: 14,
};

// --- Estilos de Nós ---
export const Nodes = {
    // Nós Start/End (Circulares)
    START_END: {
        FILL: [{ type: "SOLID", color: Colors.START_END_FILL }] as FigmaPaint,
        CORNER_RADIUS: 400, // Grande para parecer círculo
        TEXT_COLOR: [{ type: "SOLID", color: Colors.WHITE_TEXT }] as FigmaPaint,
        FONT: { family: "Inter", style: "Bold" } as FigmaFont,
        FONT_SIZE: 24,
        SIZE: 140, // Tamanho fixo
    },
    // Nós de Decisão (Losango)
    DECISION: {
        SHAPE_FILL: [{ type: "SOLID", color: Colors.DECISION_FILL }] as FigmaPaint,
        TEXT_COLOR: [{ type: "SOLID", color: Colors.DARK_TEXT }] as FigmaPaint,
        FONT: { family: "Inter", style: "Semi Bold" } as FigmaFont,
        FONT_SIZE: 18,
        WIDTH: 300, // Tamanho fixo do losango
        HEIGHT: 200,
    },
    // Bloco de Título (Step/Entrypoint)
    TITLE_BLOCK: {
        FILL: [{ type: "SOLID", color: Colors.VERY_LIGHT_GRAY_FILL }] as FigmaPaint,
        STROKE: [{ type: "SOLID", color: Colors.LIGHT_GRAY_STROKE }] as FigmaPaint,
        STROKE_WEIGHT: 2,
        CORNER_RADIUS: 24,
        ENTRYPOINT_DASH_PATTERN: [4, 4] as number[], // Apenas para Entrypoint
        TEXT_COLOR: [{ type: "SOLID", color: Colors.DARK_TEXT }] as FigmaPaint,
        FONT: { family: "Inter", style: "Semi Bold" } as FigmaFont,
        FONT_SIZE: 24,
    },
    // Bloco de Descrição (Step/Entrypoint)
    DESCRIPTION_BLOCK: {
        FILL: [{ type: "SOLID", color: Colors.WHITE }] as FigmaPaint,
        STROKE: [{ type: "SOLID", color: Colors.BORDER_GRAY }] as FigmaPaint,
        STROKE_WEIGHT: 2,
        CORNER_RADIUS: 24,
    },
    // Itens dentro do Bloco de Descrição
    DESCRIPTION_ITEM: {
        // Estilos do Chip de Label são definidos em Labels acima
        CONTENT_TEXT_COLOR: [{ type: "SOLID", color: Colors.CONTENT_TEXT }] as FigmaPaint,
        CONTENT_FONT: { family: "Inter", style: "Regular" } as FigmaFont,
        CONTENT_FONT_SIZE: 18,
    }
};

// --- Fontes Usadas (para pré-carregamento centralizado, se necessário) ---
export const FontsToLoad: FigmaFont[] = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
];
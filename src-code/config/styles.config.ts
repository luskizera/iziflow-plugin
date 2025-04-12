/// <reference types="@figma/plugin-typings" />

import { hexToRgb } from "../utils/hexToRgb";

// --- Cores Base ---
const Colors = {
    BLACK: hexToRgb("#000000"),
    DARK_GRAY: hexToRgb("#323232"),
    MEDIUM_GRAY: hexToRgb("#939393"),
    LIGHT_GRAY_STROKE: hexToRgb("#A1A1AA"),
    VERY_LIGHT_GRAY_FILL: hexToRgb("#F4F4F5"),
    BORDER_GRAY: hexToRgb("#E4E4E7"),
    WHITE: hexToRgb("#FFFFFF"),
    WHITE_TEXT: hexToRgb("#FAFAFA"),
    DARK_TEXT: hexToRgb("#09090B"),
    CONTENT_TEXT: hexToRgb("#1E1E1E"),
    START_END_FILL: hexToRgb("#18181B"),
    DECISION_FILL: hexToRgb("#A3A3A3"),
};

// --- Estilos de Conectores ---
export const Connectors = {
    PRIMARY: {
        STROKE: [{ type: "SOLID", color: Colors.BLACK }] as ReadonlyArray<Paint>,
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [] as number[],
        // Usar tipo base StrokeCap
        END_CAP: "ARROW_LINES" as StrokeCap,
    },
    SECONDARY: {
        STROKE: [{ type: "SOLID", color: Colors.MEDIUM_GRAY }] as ReadonlyArray<Paint>,
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [4, 4] as number[],
        // Usar tipo base StrokeCap
        END_CAP: "ARROW_LINES" as StrokeCap,
    },
};

// --- Estilos de Etiquetas/Chips ---
export const Labels = {
    PADDING_HORIZONTAL: 12,
    PADDING_VERTICAL: 8,
    CORNER_RADIUS: 4,
    FILL: [{ type: "SOLID", color: Colors.DARK_GRAY }] as ReadonlyArray<Paint>,
    TEXT_COLOR: [{ type: "SOLID", color: Colors.WHITE }] as ReadonlyArray<Paint>,
    FONT: { family: "Inter", style: "Medium" } as FontName, // Usa tipo base FontName
    FONT_SIZE: 14,
};

// --- Estilos de Nós ---
export const Nodes = {
    START_END: {
        FILL: [{ type: "SOLID", color: Colors.START_END_FILL }] as ReadonlyArray<Paint>,
        CORNER_RADIUS: 400,
        TEXT_COLOR: [{ type: "SOLID", color: Colors.WHITE_TEXT }] as ReadonlyArray<Paint>,
        FONT: { family: "Inter", style: "Bold" } as FontName, // Usa tipo base FontName
        FONT_SIZE: 24,
        SIZE: 140,
    },
    DECISION: {
        SHAPE_FILL: [{ type: "SOLID", color: Colors.DECISION_FILL }] as ReadonlyArray<Paint>,
        TEXT_COLOR: [{ type: "SOLID", color: Colors.DARK_TEXT }] as ReadonlyArray<Paint>,
        FONT: { family: "Inter", style: "Semi Bold" } as FontName, // Usa tipo base FontName
        FONT_SIZE: 18,
        WIDTH: 300,
        HEIGHT: 200,
    },
    TITLE_BLOCK: {
        FILL: [{ type: "SOLID", color: Colors.VERY_LIGHT_GRAY_FILL }] as ReadonlyArray<Paint>,
        STROKE: [{ type: "SOLID", color: Colors.LIGHT_GRAY_STROKE }] as ReadonlyArray<Paint>,
        STROKE_WEIGHT: 2,
        CORNER_RADIUS: 24,
        ENTRYPOINT_DASH_PATTERN: [4, 4] as number[],
        TEXT_COLOR: [{ type: "SOLID", color: Colors.DARK_TEXT }] as ReadonlyArray<Paint>,
        FONT: { family: "Inter", style: "Semi Bold" } as FontName, // Usa tipo base FontName
        FONT_SIZE: 24,
    },
    DESCRIPTION_BLOCK: {
        FILL: [{ type: "SOLID", color: Colors.WHITE }] as ReadonlyArray<Paint>,
        STROKE: [{ type: "SOLID", color: Colors.BORDER_GRAY }] as ReadonlyArray<Paint>,
        STROKE_WEIGHT: 2,
        CORNER_RADIUS: 24,
    },
    DESCRIPTION_ITEM: {
        CONTENT_TEXT_COLOR: [{ type: "SOLID", color: Colors.CONTENT_TEXT }] as ReadonlyArray<Paint>,
        CONTENT_FONT: { family: "Inter", style: "Regular" } as FontName, // Usa tipo base FontName
        CONTENT_FONT_SIZE: 18,
    }
};

// --- Fontes Usadas ---
// Usar tipo base FontName para garantir consistência
export const FontsToLoad: FontName[] = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
];
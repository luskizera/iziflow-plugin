// src-code/config/layout.config.ts
/// <reference types="@figma/plugin-typings" />

// --- Configuração de Layout de Conectores ---
export const Connectors = {
    // Removido 'as ConnectorMagnet' - A API espera a string literal.
    DEFAULT_PRIMARY_START_MAGNET: "RIGHT",
    DEFAULT_SECONDARY_START_MAGNET: "BOTTOM",
    DEFAULT_END_MAGNET: "LEFT",

    // Removido 'as ConnectorLineType' - A API espera a string literal.
    DEFAULT_PRIMARY_LINE_TYPE: "ELBOWED",
    DEFAULT_SECONDARY_LINE_TYPE: "ELBOWED",

    DECISION_PRIMARY_LINE_TYPE: "ELBOWED",
    DECISION_SECONDARY_LINE_TYPE: "ELBOWED",
    // Removido 'as ConnectorMagnet' do array - O tipo será inferido como string[].
    DECISION_PRIMARY_MAGNET_SEQUENCE: ["TOP", "RIGHT", "BOTTOM"],
    DECISION_SECONDARY_START_MAGNET: "BOTTOM",

    CONVERGENCE_PRIMARY_LINE_TYPE: "ELBOWED",

    LABEL_OFFSET_NEAR_START: 45,
    LABEL_OFFSET_MID_LINE_Y: 10,
};

// --- Configuração de Layout de Nós ---
// Mantém apenas espaçamento *entre* nós
export const Nodes = {
    HORIZONTAL_SPACING: 300,
    VERTICAL_SPACING: 0,
};
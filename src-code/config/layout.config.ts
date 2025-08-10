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

// --- Configuração de Sistema de Bifurcação ---
export const Bifurcation = {
    ENABLED: true, // Flag global para habilitar/desabilitar
    VERTICAL_SPACING_BETWEEN_BRANCHES: 150, // Espaço vertical entre ramos
    HORIZONTAL_OFFSET_FOR_BRANCHES: 100, // Offset horizontal antes da bifurcação
    MIN_NODES_FOR_BIFURCATION: 2, // Mínimo de saídas para considerar bifurcação
    MAX_NODES_FOR_BIFURCATION: 2, // Máximo (inicialmente apenas binárias)
    
    // Configurações de magnetos específicas para bifurcação
    DECISION_TOP_BRANCH_MAGNET: "TOP",
    DECISION_BOTTOM_BRANCH_MAGNET: "BOTTOM",
    CONVERGENCE_ENTRY_MAGNET: "LEFT",
};

// --- Configuração de Faixas Verticais ---
export const VerticalLanes = {
    LANE_HEIGHT: 200, // Altura de cada "faixa" vertical
    LANE_SPACING: 50, // Espaço adicional entre faixas
    CENTER_LANE_INDEX: 0, // Índice da faixa central (linha principal)
};
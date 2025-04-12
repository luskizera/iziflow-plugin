/// <reference types="@figma/plugin-typings" />

// Não definimos mais aliases locais 'Figma...'

// --- Configuração de Layout de Conectores ---
export const Connectors = {
    // Usamos 'as ConnectorMagnet' para garantir o tipo correto vindo das tipagens globais
    DEFAULT_PRIMARY_START_MAGNET: "RIGHT" as ConnectorMagnet,
    DEFAULT_SECONDARY_START_MAGNET: "BOTTOM" as ConnectorMagnet,
    DEFAULT_END_MAGNET: "LEFT" as ConnectorMagnet,

    // Usamos 'as ConnectorLineType'
    DEFAULT_PRIMARY_LINE_TYPE: "STRAIGHT" as ConnectorLineType,
    DEFAULT_SECONDARY_LINE_TYPE: "ELBOWED" as ConnectorLineType,

    DECISION_PRIMARY_LINE_TYPE: "ELBOWED" as ConnectorLineType,
    DECISION_SECONDARY_LINE_TYPE: "ELBOWED" as ConnectorLineType,
    DECISION_PRIMARY_MAGNET_SEQUENCE: ["TOP", "RIGHT", "BOTTOM"] as ConnectorMagnet[],
    DECISION_SECONDARY_START_MAGNET: "BOTTOM" as ConnectorMagnet,

    CONVERGENCE_PRIMARY_LINE_TYPE: "ELBOWED" as ConnectorLineType,

    LABEL_OFFSET_NEAR_START: 45,
    LABEL_OFFSET_MID_LINE_Y: 10,
};

// --- Configuração de Layout de Nós ---
export const Nodes = {
    HORIZONTAL_SPACING: 300,
    VERTICAL_SPACING: 150,
    TITLE_BLOCK_PADDING: 24,
    TITLE_BLOCK_ITEM_SPACING: 8,
    DESCRIPTION_BLOCK_PADDING: 24,
    DESCRIPTION_BLOCK_ITEM_SPACING: 8,
    DESCRIPTION_ITEM_PADDING_BOTTOM: 24,
    DESCRIPTION_ITEM_SPACING: 8,
    GENERAL_NODE_PADDING: { horizontal: 24, vertical: 20 },
    GENERAL_NODE_ITEM_SPACING: 16,
    STEP_ENTRYPOINT_BLOCK_WIDTH: 400,
};
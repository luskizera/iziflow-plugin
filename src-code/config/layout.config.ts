// Tipos básicos (corrigidos)
type FigmaConnectorMagnet = "AUTO" | "TOP" | "LEFT" | "BOTTOM" | "RIGHT" | "TOP_LEFT" | "TOP_RIGHT" | "BOTTOM_LEFT" | "BOTTOM_RIGHT";
type FigmaConnectorLineType = "STRAIGHT" | "ELBOWED" | "CURVED";

// --- Configuração de Layout de Conectores ---
export const Connectors = {
    // Magnets de Origem Padrão
    DEFAULT_PRIMARY_START_MAGNET: "RIGHT" as FigmaConnectorMagnet,
    DEFAULT_SECONDARY_START_MAGNET: "BOTTOM" as FigmaConnectorMagnet,

    // Magnet de Destino Padrão (quase sempre LEFT)
    DEFAULT_END_MAGNET: "LEFT" as FigmaConnectorMagnet,

    // Tipos de Linha Padrão
    DEFAULT_PRIMARY_LINE_TYPE: "STRAIGHT" as FigmaConnectorLineType,
    DEFAULT_SECONDARY_LINE_TYPE: "ELBOWED" as FigmaConnectorLineType,

    // Configurações Específicas para Decisões
    DECISION_PRIMARY_LINE_TYPE: "ELBOWED" as FigmaConnectorLineType,
    DECISION_SECONDARY_LINE_TYPE: "ELBOWED" as FigmaConnectorLineType, // Mantém ELBOWED para secundárias de decisão
    DECISION_PRIMARY_MAGNET_SEQUENCE: ["TOP", "RIGHT", "BOTTOM"] as FigmaConnectorMagnet[],
    DECISION_SECONDARY_START_MAGNET: "BOTTOM" as FigmaConnectorMagnet, // Confirma saída inferior para secundárias

    // Configurações Específicas para Convergência
    CONVERGENCE_PRIMARY_LINE_TYPE: "ELBOWED" as FigmaConnectorLineType, // Linhas primárias chegando a um nó com >1 entrada

    // Offsets de Etiqueta
    LABEL_OFFSET_NEAR_START: 45, // Distância da etiqueta ao nó (para decisões)
    LABEL_OFFSET_MID_LINE_Y: 10, // Offset Y para etiquetas no meio da linha
};

// --- Configuração de Layout de Nós ---
export const Nodes = {
    // Espaçamento entre níveis de nós (horizontal)
    HORIZONTAL_SPACING: 300,

    // Espaçamento vertical entre nós no mesmo nível (se aplicável)
    VERTICAL_SPACING: 150, // Pode não ser usado na lógica atual, mas útil para futuras expansões

    // Configurações de Layout Interno dos Nós (ex: Step/Entrypoint)
    TITLE_BLOCK_PADDING: 24, // Assume padding igual em todos os lados
    TITLE_BLOCK_ITEM_SPACING: 8,

    DESCRIPTION_BLOCK_PADDING: 24, // Assume padding igual
    DESCRIPTION_BLOCK_ITEM_SPACING: 8,

    DESCRIPTION_ITEM_PADDING_BOTTOM: 24, // Espaçamento após o conteúdo do item
    DESCRIPTION_ITEM_SPACING: 8, // Espaçamento entre Label e Content

    GENERAL_NODE_PADDING: { horizontal: 24, vertical: 20 }, // Para outros tipos, se padronizado
    GENERAL_NODE_ITEM_SPACING: 16, // Para outros tipos, se padronizado

    // Largura fixa para blocos de Step/Entrypoint (para garantir alinhamento)
    STEP_ENTRYPOINT_BLOCK_WIDTH: 400,
};
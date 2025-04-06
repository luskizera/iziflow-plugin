// src/lib/types.ts

/**
 * Representa um campo individual dentro da descrição de um nó.
 * Exportado para ser usado por FlowNode e outros módulos.
 */
export interface DescriptionField {
  label: string;
  /** O conteúdo pode ser uma string simples, uma lista ou um objeto chave-valor. */
  content: string | string[] | Record<string, string>;
  /** Permite propriedades adicionais, se necessário. */
  [key: string]: any;
}

/**
 * Representa a estrutura de um nó individual no fluxo, conforme definido no JSON.
 * Exportado para ser usado por Flow, FlowData e NodeData.
 */
export interface FlowNode {
  id: string;
  type: "START" | "END" | "STEP" | "DECISION" | "ENTRYPOINT";
  name: string;
  metadata?: {
    category?: string;
    createdBy?: string;
    [key: string]: any;
  };
  /** Usa a interface DescriptionField definida acima. */
  description?: DescriptionField[];
}

/**
 * Alias para FlowNode, exportado para uso em módulos como code.ts, frames.ts, etc.
 * Garante que estamos usando a mesma estrutura centralizada.
 */
export type NodeData = FlowNode;

/**
 * Representa uma conexão entre dois nós.
 * Exportado para ser usado por Flow e FlowData.
 */
export interface Connection {
  /** ID opcional para a conexão, útil para identificar conexões específicas. */
  id?: string;
  from: string; // ID do nó de origem
  to: string;   // ID do nó de destino
  condition?: string; // Texto da condição (para etiquetas)
  secondary?: boolean; // Indica se é uma conexão secundária (visual tracejado/diferente)
}

/**
 * Representa um fluxo completo com nome, nós e conexões.
 * Exportado para ser usado por FlowData.
 */
export interface Flow {
  /** Nome opcional do fluxo. */
  flowName?: string;
  nodes: FlowNode[];
  connections: Connection[];
}

/**
 * Representa a estrutura geral do JSON de entrada.
 * Pode ser um único fluxo (com propriedades no nível raiz) ou uma coleção de fluxos.
 * Exportado para ser usado na validação ou processamento inicial do JSON.
 */
export interface FlowData {
  /** Propriedades opcionais se o JSON representar um único fluxo no nível raiz. */
  flowName?: string;
  nodes?: FlowNode[];
  connections?: Connection[];

  /** Propriedade opcional se o JSON contiver uma lista de fluxos nomeados. */
  flows?: Flow[];
}
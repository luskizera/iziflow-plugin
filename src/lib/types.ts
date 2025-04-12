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
  /**
   * CORREÇÃO: 'description' agora é um objeto opcional
   * que CONTÉM a propriedade 'fields' (que é o array).
   */
  description?: {
    fields: DescriptionField[]; // O array está DENTRO de 'fields'
    // Você pode adicionar outras propriedades dentro de 'description' se necessário
    // title?: string; // Exemplo
  };
}

/**
 * Alias para FlowNode, exportado para uso em módulos como code.ts, frames.ts, etc.
 */
export type NodeData = FlowNode;

/**
 * Representa uma conexão entre dois nós.
 */
export interface Connection {
  id?: string;
  from: string;
  to: string;
  condition?: string;
  /** Usado nos seus exemplos JSON para a etiqueta da conexão. */
  conditionLabel?: string; // Mantido/Adicionado
  secondary?: boolean;
}

/**
 * Representa um fluxo completo com nome, nós e conexões.
 */
export interface Flow {
  flowName?: string;
  nodes: FlowNode[];
  connections: Connection[];
}

/**
 * Representa a estrutura geral do JSON de entrada.
 */
export interface FlowData {
  flowName?: string;
  nodes?: FlowNode[];
  connections?: Connection[];
  flows?: Flow[];
}
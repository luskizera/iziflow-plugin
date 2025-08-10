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
    [key: string]: any; // Permite outras propriedades em metadata
  };
  /**
   * CORREÇÃO: 'description' agora é um objeto opcional
   * que CONTÉM a propriedade 'fields' (que é o array).
   */
  description?: { // <--- Agora é um objeto opcional
    fields: DescriptionField[]; // <--- O array está aqui dentro
    // Você pode adicionar outras propriedades aqui no futuro se precisar
    // title?: string;
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
  id?: string; // ID pode ser opcional
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
  flowName?: string; // Nome do fluxo pode ser opcional
  nodes: FlowNode[];
  connections: Connection[];
}

/**
 * Representa a estrutura geral do JSON de entrada.
 * Pode ser um Flow diretamente ou um objeto contendo um array 'flows'.
 */
export interface FlowData {
  flowName?: string;
  nodes?: FlowNode[];
  connections?: Connection[];
  flows?: Flow[];
}

/**
 * Representa uma entrada no histórico de fluxos.
 */
export interface HistoryEntry {
  id: string;          // Gerado com UUID ou timestamp + aleatório
  name: string;        // Um nome curto para o fluxo, extraído do markdown
  markdown: string;    // O conteúdo completo do fluxo em markdown
  createdAt: string;   // Data de criação em formato ISO string
}

// --- Tipos para Sistema de Bifurcação ---

/**
 * Configuração para sistema de bifurcação.
 */
export interface BifurcationConfig {
  enabled: boolean;
  verticalSpacing: number;
  horizontalOffset: number;
}

/**
 * Posição no layout com informação de faixa vertical.
 */
export interface LayoutPosition {
  x: number;
  y: number;
  laneIndex: number; // Nova propriedade para controle vertical
}

/**
 * Análise estrutural de uma bifurcação no fluxo.
 */
export interface BifurcationAnalysis {
  decisionNodeId: string;
  branches: {
    upper: string[]; // IDs dos nós no ramo superior
    lower: string[]; // IDs dos nós no ramo inferior
  };
  convergenceNodeId?: string; // Onde os ramos se reconectam
}

/**
 * Contexto de bifurcação para configuração de conectores.
 */
export interface BifurcationContext {
  upperBranchNodes: string[];
  lowerBranchNodes: string[];
  isConvergencePoint: boolean;
}

/**
 * Tipos de resolução de conflitos verticais.
 */
export type ConflictType = 'HORIZONTAL_OVERLAP' | 'LANE_COLLISION' | 'VERTICAL_SPACING';

/**
 * Resolução de conflitos no layout vertical.
 */
export interface ConflictResolution {
  type: ConflictType;
  affectedNodes: string[];
  suggestedResolution: 'EXPAND_SPACING' | 'RELOCATE_NODES' | 'ADJUST_LANES';
}

// --- Tipos para Sistema de Convergência ---

/**
 * Representa um ponto 2D no sistema de coordenadas.
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Configuração para cálculo de curvas Bézier.
 */
export interface BezierPathConfig {
  startPoint: Point2D;
  controlPoint: Point2D;
  endPoint: Point2D;
  tension?: number; // Tensão da curva (0-1), padrão 0.5
}

/**
 * Geometria calculada para convergência de ramos.
 */
export interface ConvergenceGeometry {
  upperPath: BezierPathConfig;
  lowerPath: BezierPathConfig;
  convergenceAngle: number; // Ângulo ideal de convergência em graus
  upperControlPoint: Point2D; // Ponto de controle para ramo superior
  lowerControlPoint: Point2D; // Ponto de controle para ramo inferior
}

/**
 * Configuração para criação de conectores curvos.
 */
export interface CurvedConnectorConfig {
  geometry: ConvergenceGeometry;
  isUpperBranch: boolean;
  useMultipleSegments: boolean; // True se API do Figma não suportar curvas nativas
  segmentCount?: number; // Número de segmentos para simular curva (padrão 8)
  smoothingFactor?: number; // Fator de suavização (0-1), padrão 0.7
}

// --- Interface de Configuração da Fase 7 ---

/**
 * Preferências de layout do usuário para sistema inteligente.
 */
export interface LayoutPreferences {
  enableBifurcation: boolean; // Habilitar layout bifurcado
  verticalSpacing: number; // Espaçamento vertical entre ramos
  curvedConnectors: boolean; // Usar conectores curvos nas convergências
  autoDetectDecisions: boolean; // Detectar automaticamente decisões binárias
  fallbackToLinear: boolean; // Sempre usar fallback linear em caso de erro
  performanceMode: boolean; // Modo de performance (menos efeitos visuais)
}

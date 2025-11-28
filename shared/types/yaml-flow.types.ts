// shared/types/yaml-flow.types.ts
// Tipos específicos para documentos no formato IziFlow YAML.

export interface YAMLFlowDocument {
  metadata: YAMLMetadata;
  nodes: Record<string, YAMLNode>;
  connections: YAMLConnection[];
}

export interface YAMLMetadata {
  layout: YAMLLayoutConfig;
}

export interface YAMLLayoutConfig {
  algorithm: 'auto';
  unit: number; // Representa quantos pixels equivalem a 1u
  first_node_position: 'center';
  spacing?: {
    horizontal?: UnitValue;
    vertical?: UnitValue;
  };
}

export type UnitValue = string | number; // '2u' | '1.5u' | '400px' | 400

export interface YAMLNode {
  type: 'ENTRYPOINT' | 'STEP' | 'DECISION' | 'END';
  name: string;
  description?: string;
  content?: string;
  position?: YAMLNodePosition;
}

export interface YAMLNodePosition {
  anchor?: string;
  offset?: OffsetValue;
  exit?: ConnectorAnchor;
  entry?: ConnectorAnchor;
}

export interface OffsetValue {
  x: UnitValue;
  y: UnitValue;
}

export type ConnectorAnchor = 'top' | 'right' | 'bottom' | 'left';

export interface YAMLConnection {
  from: string;
  to: string;
  label?: string;
  style?: ConnectionStyle;
}

export interface ConnectionStyle {
  line_type?: 'STRAIGHT' | 'ELBOWED';
  exit?: ConnectorAnchor;
  entry?: ConnectorAnchor;
}

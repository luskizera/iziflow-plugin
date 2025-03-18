export interface FlowNode {
  id: string;
  type: "START" | "END" | "STEP" | "DECISION";
  name: string;
  description?: {
    label: string;
    content: string;
  }[];
}

export interface Connection {
  from: string;
  to: string;
  condition?: string;
  secondary?: boolean;
}

export interface Flow {
  nodes: FlowNode[];
  connections: Connection[];
}

export interface FlowData {
  flows?: Flow[];
}

export interface FlowNode {
  id: string;
  type: "START" | "END" | "STEP" | "DECISION" | "ENTRYPOINT";
  name: string;
  metadata?: {
    category?: string;
    createdBy?: string;
    [key: string]: any;
  };
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

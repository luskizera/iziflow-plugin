export declare function parseJSON(json: FlowJSON): Promise<Map<string, NodeWithType>>;
export interface FlowJSON {
    flowName: string;
    nodes: NodeData[];
    connections: ConnectionData[];
}
export interface NodeData {
    id: string;
    name?: string;
    type: string;
    metadata?: Record<string, any>;
    description?: {
        action?: string;
        inputs?: string[];
        outputs?: string[];
        errors?: string[];
    } | {
        label: string;
        content: string | string[];
    }[];
}
export interface ConnectionData {
    id: string;
    from: string;
    to: string;
    conditionLabel?: string;
    conditionType?: "positive" | "negative";
}
export interface NodeWithType {
    node: SceneNode;
    type: string;
}

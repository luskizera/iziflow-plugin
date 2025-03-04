import { NodeData } from './../core/parser';
export interface DecisionNode {
    createDecisionNode(data: NodeData): Promise<SceneNode>;
}
export declare function createDecisionNode(data: NodeData): Promise<SceneNode>;

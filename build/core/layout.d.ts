import { ConnectionData } from './parser';
export interface Layout {
    buildGraph(nodes: any[], connections: ConnectionData[]): {
        adjacencyList: {
            [id: string]: string[];
        };
        inDegree: {
            [id: string]: number;
        };
    };
    getSortedLevels(_: Map<string, SceneNode>, connections: ConnectionData[]): number[];
    layoutNodes(nodes: Map<string, SceneNode>, connections: ConnectionData[], spacing?: number): void;
}
export declare function buildGraph(nodes: any[], connections: ConnectionData[]): {
    adjacencyList: {
        [id: string]: string[];
    };
    inDegree: {
        [id: string]: number;
    };
};
export declare function getSortedLevels(_: Map<string, SceneNode>, connections: ConnectionData[]): number[];
export declare function layoutNodes(nodes: Map<string, SceneNode>, connections: ConnectionData[], spacing?: number): void;

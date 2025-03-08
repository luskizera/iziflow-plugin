//graphUtils.ts

import { Connection } from "../core/parser";

export function buildGraph(nodes: SceneNode[], connections: Connection[]) {
    const adjacencyList: { [id: string]: string[] } = {};
    const inDegree: { [id: string]: number } = {};

    nodes.forEach(node => {
        adjacencyList[node.id] = []; // Garante que a lista de adjacência está sempre inicializada
        inDegree[node.id] = 0;
    });

    connections.forEach(conn => {
        if (!adjacencyList[conn.from]) {
            adjacencyList[conn.from] = []; // Inicializa se não existir
        }
        adjacencyList[conn.from].push(conn.to);
        inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
    });

    return { adjacencyList, inDegree };
}
``


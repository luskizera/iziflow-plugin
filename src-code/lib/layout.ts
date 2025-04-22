// src-code/lib/layout.ts
export namespace Layout {
  export function buildGraph(nodes: any[], connections: any[]) {
    const adjacencyList: { [id: string]: string[] } = {};
    const inDegree: { [id: string]: number } = {};

    nodes.forEach(node => {
      adjacencyList[node.id] = [];
      inDegree[node.id] = 0;
    });

    connections.forEach(conn => {
      adjacencyList[conn.from].push(conn.to);
      inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
    });

    return { adjacencyList, inDegree };
  }

  export function getSortedLevels(levelToNodes: { [level: number]: string[] }): number[] {
    return Object.keys(levelToNodes)
      .map(n => parseInt(n, 10))
      .sort((a, b) => a - b);
  }
}

namespace Layout {


/**
 * Constrói o grafo com a lista de adjacências e grau de entrada.
 */
export function buildGraph(nodes: any[], connections: Parser.ConnectionData[]): { adjacencyList: { [id: string]: string[] }, inDegree: { [id: string]: number } } {
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

/**
 * Retorna os níveis ordenados do grafo (simplificado para layout horizontal).
 */
export function getSortedLevels(_: Map<string, SceneNode>, connections: Parser.ConnectionData[]): number[] {
  // Para um layout horizontal simples, retornamos apenas [0] para indicar um único nível
  return [0];
}

/**
 * Posiciona os nós no layout em uma linha horizontal uniforme.
 */
export function layoutNodes(nodes: Map<string, SceneNode>, connections: Parser.ConnectionData[], spacing: number = 300): void {
  let x = 0;
  const startNode = Array.from(nodes.entries()).find(([_, node]) => node.name === 'Start');
  if (!startNode) {
    console.error("No START node found.");
    return;
  }

  const [startId, startNodeObj] = startNode;
  startNodeObj.x = 0;
  startNodeObj.y = 0;
  let maxHeight = startNodeObj.height;

  const positionedNodes = new Set<string>([startId]);
  const queue: string[] = [startId];

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const currentNode = nodes.get(currentId);
    if (!currentNode) continue;

    const outgoingConnections = connections.filter(conn => conn.from === currentId);
    outgoingConnections.forEach(conn => {
      const targetId = conn.to;
      if (!positionedNodes.has(targetId)) {
        const targetNode = nodes.get(targetId);
        if (targetNode) {
          // Ajusta o X com base na largura do nó atual mais o espaçamento
          targetNode.x = x + currentNode.width + spacing;
          targetNode.y = 0; // Alinhamento horizontal fixo
          maxHeight = Math.max(maxHeight, targetNode.height);
          x = targetNode.x + targetNode.width;
          positionedNodes.add(targetId);
          queue.push(targetId);
        }
      }
    });
  }

  // Centraliza verticalmente todos os nós com base na altura máxima
  for (const node of [...nodes.values()]) { // Usamos spread operator para evitar o erro
    node.y = (maxHeight - node.height) / 2;
  }
}
}
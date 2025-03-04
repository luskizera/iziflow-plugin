import { ConnectionData } from './parser';

export interface Layout { buildGraph(nodes: any[], connections: ConnectionData[]): { adjacencyList: { [id: string]: string[] }, inDegree: { [id: string]: number } }; getSortedLevels(_: Map<string, SceneNode>, connections: ConnectionData[]): number[]; layoutNodes(nodes: Map<string, SceneNode>, connections: ConnectionData[], spacing?: number): void; }

export function buildGraph(nodes: any[], connections: ConnectionData[]): { adjacencyList: { [id: string]: string[] }, inDegree: { [id: string]: number } } {
    const adjacencyList: { [id: string]: string[] } = {};
    const inDegree: { [id: string]: number } = {};

    console.log("📊 Construindo grafo de conexões...");

    nodes.forEach(node => {
      adjacencyList[node.id] = [];
      inDegree[node.id] = 0;
    });

    connections.forEach(conn => {
      adjacencyList[conn.from].push(conn.to);
      inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
    });

    console.log("🔗 Lista de adjacências:", adjacencyList);
    console.log("📊 Grau de entrada:", inDegree);

    return { adjacencyList, inDegree };
  }
export function getSortedLevels(_: Map<string, SceneNode>, connections: ConnectionData[]): number[] {
    console.log("📐 Definindo níveis do layout...");
    return [0]; // Simples layout horizontal
  }
export function layoutNodes(nodes: Map<string, SceneNode>, connections: ConnectionData[], spacing: number = 300): void {
    console.log("🔄 Iniciando layout dos nós...");

    let x = 0;
    const startNode = Array.from(nodes.entries()).find(([_, node]) => node.name === 'Start');
    if (!startNode) {
      console.error("🚨 No START node found.");
      return;
    }

    const [startId, startNodeObj] = startNode;
    startNodeObj.x = 0;
    startNodeObj.y = 0;
    let maxHeight = startNodeObj.height;

    console.log(`📍 START node posicionado em (${startNodeObj.x}, ${startNodeObj.y})`);

    const positionedNodes = new Set<string>([startId]);
    const queue: string[] = [startId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentNode = nodes.get(currentId);
      if (!currentNode) continue;

      console.log(`🔀 Processando conexões a partir de: ${currentNode.name}`);

      const outgoingConnections = connections.filter(conn => conn.from === currentId);
      outgoingConnections.forEach(conn => {
        const targetId = conn.to;
        if (!positionedNodes.has(targetId)) {
          const targetNode = nodes.get(targetId);
          if (targetNode) {
            targetNode.x = x + currentNode.width + spacing;
            targetNode.y = 0;

            console.log(`➡️ Posicionando ${targetNode.name} em (${targetNode.x}, ${targetNode.y})`);

            maxHeight = Math.max(maxHeight, targetNode.height);
            x = targetNode.x + targetNode.width;
            positionedNodes.add(targetId);
            queue.push(targetId);
          } else {
            console.warn(`⚠️ Nó de destino não encontrado: ${targetId}`);
          }
        }
      });
    }

    for (const node of [...nodes.values()]) {
      node.y = (maxHeight - node.height) / 2;
      console.log(`🎯 Centralizando ${node.name} em Y: ${node.y}`);
    }

    console.log("✅ Layout finalizado.");
  }

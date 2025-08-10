// src-code/lib/layout.ts
import { FlowNode, Connection, BifurcationAnalysis, LayoutPosition } from '@shared/types/flow.types';

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

  // --- Sistema de Análise Estrutural para Bifurcações ---

  /**
   * Detecta decisões binárias e analisa seus padrões de bifurcação
   */
  export function detectBinaryDecisions(
    nodes: FlowNode[], 
    connections: Connection[]
  ): BifurcationAnalysis[] {
    const bifurcations: BifurcationAnalysis[] = [];
    
    // Filtrar nós de decisão
    const decisionNodes = nodes.filter(node => node.type === 'DECISION');
    
    for (const decision of decisionNodes) {
      const outgoingConnections = connections.filter(conn => 
        conn.from === decision.id && !conn.secondary
      );
      
      // Verificar se é decisão binária
      if (outgoingConnections.length === 2) {
        const analysis = analyzeBifurcationPaths(
          decision.id, 
          outgoingConnections, 
          connections
        );
        bifurcations.push(analysis);
      }
    }
    
    return bifurcations;
  }

  /**
   * Analisa os caminhos de uma bifurcação específica
   */
  function analyzeBifurcationPaths(
    decisionId: string,
    branches: Connection[],
    allConnections: Connection[]
  ): BifurcationAnalysis {
    // Mapear cada ramo até convergência ou fim
    const upperBranch = traceBranchPath(branches[0], allConnections);
    const lowerBranch = traceBranchPath(branches[1], allConnections);
    
    // Detectar ponto de convergência
    const convergence = findConvergencePoint(upperBranch, lowerBranch, allConnections);
    
    return {
      decisionNodeId: decisionId,
      branches: {
        upper: upperBranch,
        lower: lowerBranch
      },
      convergenceNodeId: convergence
    };
  }

  /**
   * Rastreia o caminho de um ramo até o fim ou convergência
   */
  function traceBranchPath(startConnection: Connection, allConnections: Connection[]): string[] {
    const path: string[] = [startConnection.to];
    let currentNodeId = startConnection.to;
    
    while (true) {
      const nextConnection = allConnections.find(conn => 
        conn.from === currentNodeId && !conn.secondary
      );
      
      if (!nextConnection) {
        break; // Fim do ramo
      }
      
      currentNodeId = nextConnection.to;
      path.push(currentNodeId);
      
      // Verificar se chegamos a um ponto onde outro ramo também chega
      const incomingConnections = allConnections.filter(conn => conn.to === currentNodeId);
      if (incomingConnections.length > 1) {
        break; // Possível ponto de convergência
      }
    }
    
    return path;
  }

  /**
   * Encontra o ponto onde dois ramos se reconectam
   */
  function findConvergencePoint(
    upperBranch: string[], 
    lowerBranch: string[], 
    allConnections: Connection[]
  ): string | undefined {
    // Procurar por nós que recebem conexões de ambos os ramos
    for (const connection of allConnections) {
      const incomingConnections = allConnections.filter(conn => conn.to === connection.to);
      
      if (incomingConnections.length >= 2) {
        const hasUpperBranch = incomingConnections.some(conn => upperBranch.includes(conn.from));
        const hasLowerBranch = incomingConnections.some(conn => lowerBranch.includes(conn.from));
        
        if (hasUpperBranch && hasLowerBranch) {
          return connection.to;
        }
      }
    }
    
    return undefined;
  }

  /**
   * Calcula as faixas verticais para cada nó baseado nas bifurcações
   */
  export function calculateVerticalLanes(
    bifurcations: BifurcationAnalysis[],
    nodes: FlowNode[]
  ): Map<string, number> {
    const nodeLaneMap = new Map<string, number>();
    
    // Todos os nós começam na faixa central (0)
    nodes.forEach(node => nodeLaneMap.set(node.id, 0));
    
    // Processar bifurcações sequencialmente
    bifurcations.forEach((bifurcation, index) => {
      // Ramo superior: lane +1
      bifurcation.branches.upper.forEach(nodeId => {
        nodeLaneMap.set(nodeId, 1);
      });
      
      // Ramo inferior: lane -1
      bifurcation.branches.lower.forEach(nodeId => {
        nodeLaneMap.set(nodeId, -1);
      });
      
      // Nó de convergência volta para lane 0
      if (bifurcation.convergenceNodeId) {
        nodeLaneMap.set(bifurcation.convergenceNodeId, 0);
      }
    });
    
    return nodeLaneMap;
  }

  /**
   * Realiza ordenação topológica considerando as bifurcações
   */
  export function topologicalSort(nodes: FlowNode[], connections: Connection[]): FlowNode[] {
    const { adjacencyList, inDegree } = buildGraph(nodes, connections);
    const queue: string[] = [];
    const result: FlowNode[] = [];
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    // Encontrar nós sem dependências
    Object.keys(inDegree).forEach(nodeId => {
      if (inDegree[nodeId] === 0) {
        queue.push(nodeId);
      }
    });
    
    // Processar fila
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentNode = nodeMap.get(currentId);
      
      if (currentNode) {
        result.push(currentNode);
      }
      
      // Processar vizinhos
      adjacencyList[currentId].forEach(neighborId => {
        inDegree[neighborId]--;
        if (inDegree[neighborId] === 0) {
          queue.push(neighborId);
        }
      });
    }
    
    return result;
  }
}

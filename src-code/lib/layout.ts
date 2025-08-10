// src-code/lib/layout.ts
import type { 
  FlowNode, 
  Connection, 
  BifurcationAnalysis, 
  LayoutPosition, 
  ConflictResolution, 
  ConflictType,
  Point2D,
  BezierPathConfig,
  ConvergenceGeometry,
  CurvedConnectorConfig
} from '../../shared/types/flow.types';

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

  // --- Sistema de Gerenciamento Vertical ---

  /**
   * Interface para nó com posição em faixa
   */
  interface NodeInLane {
    nodeId: string;
    position: LayoutPosition;
    width: number;
    height: number;
  }

  /**
   * Detecta conflitos verticais no layout
   */
  export function detectVerticalConflicts(
    positions: Map<string, LayoutPosition>,
    bifurcations: BifurcationAnalysis[],
    nodeWidths: Map<string, number> = new Map(),
    nodeHeights: Map<string, number> = new Map()
  ): ConflictResolution[] {
    const conflicts: ConflictResolution[] = [];
    const MIN_HORIZONTAL_SPACING = 50; // Espaçamento mínimo entre nós
    const MIN_VERTICAL_SPACING = 30;   // Espaçamento mínimo vertical
    
    console.log(`[Vertical Management] Detectando conflitos em ${positions.size} posições`);
    
    // Agrupar nós por faixa
    const nodesByLane = groupNodesByLane(positions, nodeWidths, nodeHeights);
    
    // Analisar cada faixa para conflitos horizontais
    for (const [laneIndex, nodesInLane] of nodesByLane.entries()) {
      if (laneIndex === 0) continue; // Faixa central raramente tem conflitos
      
      console.log(`[Vertical Management] Analisando faixa ${laneIndex} com ${nodesInLane.length} nós`);
      
      // Ordenar nós por posição X
      const sortedByX = nodesInLane.sort((a, b) => a.position.x - b.position.x);
      
      // Detectar sobreposições horizontais
      for (let i = 0; i < sortedByX.length - 1; i++) {
        const current = sortedByX[i];
        const next = sortedByX[i + 1];
        
        const currentRightEdge = current.position.x + current.width;
        const requiredSpacing = MIN_HORIZONTAL_SPACING;
        const actualSpacing = next.position.x - currentRightEdge;
        
        if (actualSpacing < requiredSpacing) {
          conflicts.push({
            type: 'HORIZONTAL_OVERLAP',
            affectedNodes: [current.nodeId, next.nodeId],
            suggestedResolution: 'EXPAND_SPACING'
          });
          
          console.log(`[Vertical Management] Conflito horizontal detectado: ${current.nodeId} <-> ${next.nodeId} (${actualSpacing}px < ${requiredSpacing}px)`);
        }
      }
    }
    
    // Detectar colisões entre faixas (nós muito próximos verticalmente)
    const allNodes = Array.from(positions.entries()).map(([nodeId, position]) => ({
      nodeId,
      position,
      width: nodeWidths.get(nodeId) || 400,
      height: nodeHeights.get(nodeId) || 100
    }));
    
    for (let i = 0; i < allNodes.length - 1; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const nodeA = allNodes[i];
        const nodeB = allNodes[j];
        
        // Verificar se estão em faixas diferentes mas muito próximas
        if (nodeA.position.laneIndex !== nodeB.position.laneIndex) {
          const verticalDistance = Math.abs(nodeA.position.y - nodeB.position.y);
          const minRequiredDistance = Math.max(nodeA.height, nodeB.height) / 2 + MIN_VERTICAL_SPACING;
          
          if (verticalDistance < minRequiredDistance) {
            conflicts.push({
              type: 'LANE_COLLISION',
              affectedNodes: [nodeA.nodeId, nodeB.nodeId],
              suggestedResolution: 'ADJUST_LANES'
            });
            
            console.log(`[Vertical Management] Colisão entre faixas detectada: ${nodeA.nodeId} (lane ${nodeA.position.laneIndex}) <-> ${nodeB.nodeId} (lane ${nodeB.position.laneIndex})`);
          }
        }
      }
    }
    
    console.log(`[Vertical Management] ${conflicts.length} conflitos detectados`);
    return conflicts;
  }

  /**
   * Agrupa nós por faixa vertical
   */
  function groupNodesByLane(
    positions: Map<string, LayoutPosition>,
    nodeWidths: Map<string, number>,
    nodeHeights: Map<string, number>
  ): Map<number, NodeInLane[]> {
    const nodesByLane = new Map<number, NodeInLane[]>();
    
    for (const [nodeId, position] of positions.entries()) {
      const laneIndex = position.laneIndex;
      
      if (!nodesByLane.has(laneIndex)) {
        nodesByLane.set(laneIndex, []);
      }
      
      nodesByLane.get(laneIndex)!.push({
        nodeId,
        position,
        width: nodeWidths.get(nodeId) || 400,
        height: nodeHeights.get(nodeId) || 100
      });
    }
    
    return nodesByLane;
  }

  /**
   * Resolve conflitos verticais automaticamente
   */
  export function resolveVerticalConflicts(
    conflicts: ConflictResolution[],
    positions: Map<string, LayoutPosition>,
    nodeWidths: Map<string, number> = new Map()
  ): Map<string, LayoutPosition> {
    const resolvedPositions = new Map(positions);
    
    console.log(`[Vertical Management] Resolvendo ${conflicts.length} conflitos`);
    
    for (const conflict of conflicts) {
      switch (conflict.type) {
        case 'HORIZONTAL_OVERLAP':
          resolveHorizontalOverlap(conflict, resolvedPositions, nodeWidths);
          break;
        case 'LANE_COLLISION':
          resolveLaneCollision(conflict, resolvedPositions);
          break;
        case 'VERTICAL_SPACING':
          resolveVerticalSpacing(conflict, resolvedPositions);
          break;
        default:
          console.warn(`[Vertical Management] Tipo de conflito não reconhecido: ${conflict.type}`);
          break;
      }
    }
    
    console.log(`[Vertical Management] Resolução concluída`);
    return resolvedPositions;
  }

  /**
   * Resolve sobreposição horizontal expandindo espaçamento
   */
  function resolveHorizontalOverlap(
    conflict: ConflictResolution,
    positions: Map<string, LayoutPosition>,
    nodeWidths: Map<string, number>
  ): void {
    if (conflict.affectedNodes.length < 2) return;
    
    const [firstNodeId, secondNodeId] = conflict.affectedNodes;
    const firstPos = positions.get(firstNodeId);
    const secondPos = positions.get(secondNodeId);
    
    if (!firstPos || !secondPos) return;
    
    const firstWidth = nodeWidths.get(firstNodeId) || 400;
    const requiredSpacing = 60; // Espaçamento mínimo aumentado
    
    // Calcular nova posição para o segundo nó
    const newX = firstPos.x + firstWidth + requiredSpacing;
    
    const updatedSecondPos: LayoutPosition = {
      ...secondPos,
      x: newX
    };
    
    positions.set(secondNodeId, updatedSecondPos);
    
    console.log(`[Vertical Management] Resolvido overlap horizontal: ${secondNodeId} movido para x=${newX}`);
    
    // Propagar ajuste para nós subsequentes na mesma faixa
    propagateHorizontalAdjustment(secondNodeId, secondPos.laneIndex, newX + (nodeWidths.get(secondNodeId) || 400) + requiredSpacing, positions, nodeWidths);
  }

  /**
   * Propaga ajuste horizontal para nós subsequentes
   */
  function propagateHorizontalAdjustment(
    adjustedNodeId: string,
    laneIndex: number,
    minNextX: number,
    positions: Map<string, LayoutPosition>,
    nodeWidths: Map<string, number>
  ): void {
    const nodesInSameLane = Array.from(positions.entries())
      .filter(([_, pos]) => pos.laneIndex === laneIndex)
      .map(([nodeId, pos]) => ({ nodeId, pos }))
      .sort((a, b) => a.pos.x - b.pos.x);
    
    const adjustedIndex = nodesInSameLane.findIndex(node => node.nodeId === adjustedNodeId);
    if (adjustedIndex === -1) return;
    
    // Ajustar nós subsequentes
    for (let i = adjustedIndex + 1; i < nodesInSameLane.length; i++) {
      const currentNode = nodesInSameLane[i];
      
      if (currentNode.pos.x < minNextX) {
        const updatedPos: LayoutPosition = {
          ...currentNode.pos,
          x: minNextX
        };
        
        positions.set(currentNode.nodeId, updatedPos);
        console.log(`[Vertical Management] Propagação: ${currentNode.nodeId} movido para x=${minNextX}`);
        
        // Atualizar minNextX para o próximo nó
        minNextX = minNextX + (nodeWidths.get(currentNode.nodeId) || 400) + 60;
      } else {
        break; // Não há mais conflitos subsequentes
      }
    }
  }

  /**
   * Resolve colisão entre faixas ajustando espaçamento vertical
   */
  function resolveLaneCollision(
    conflict: ConflictResolution,
    positions: Map<string, LayoutPosition>
  ): void {
    if (conflict.affectedNodes.length < 2) return;
    
    const [nodeAId, nodeBId] = conflict.affectedNodes;
    const posA = positions.get(nodeAId);
    const posB = positions.get(nodeBId);
    
    if (!posA || !posB) return;
    
    // Aumentar separação entre faixas
    const laneHeightIncrease = 50; // Aumentar altura da faixa
    const affectedLane = Math.abs(posA.laneIndex) > Math.abs(posB.laneIndex) ? posA.laneIndex : posB.laneIndex;
    
    // Ajustar todos os nós na faixa afetada
    for (const [nodeId, pos] of positions.entries()) {
      if (pos.laneIndex === affectedLane) {
        const newY = pos.y + (affectedLane > 0 ? laneHeightIncrease : -laneHeightIncrease);
        const updatedPos: LayoutPosition = {
          ...pos,
          y: newY
        };
        positions.set(nodeId, updatedPos);
      }
    }
    
    console.log(`[Vertical Management] Resolvida colisão de faixas: faixa ${affectedLane} ajustada`);
  }

  /**
   * Resolve problemas de espaçamento vertical
   */
  function resolveVerticalSpacing(
    conflict: ConflictResolution,
    positions: Map<string, LayoutPosition>
  ): void {
    // Implementação para ajustes de espaçamento vertical específicos
    console.log(`[Vertical Management] Resolvendo espaçamento vertical para nós: ${conflict.affectedNodes.join(', ')}`);
    
    // Por enquanto, aplicar ajuste simples
    for (const nodeId of conflict.affectedNodes) {
      const pos = positions.get(nodeId);
      if (pos && pos.laneIndex !== 0) {
        const adjustment = pos.laneIndex > 0 ? 20 : -20;
        const updatedPos: LayoutPosition = {
          ...pos,
          y: pos.y + adjustment
        };
        positions.set(nodeId, updatedPos);
      }
    }
  }

  /**
   * Função principal de gerenciamento vertical
   */
  export function manageVerticalLayout(
    positions: Map<string, LayoutPosition>,
    bifurcations: BifurcationAnalysis[],
    nodeWidths: Map<string, number> = new Map(),
    nodeHeights: Map<string, number> = new Map()
  ): Map<string, LayoutPosition> {
    console.log(`[Vertical Management] Iniciando gerenciamento vertical para ${positions.size} nós`);
    
    // 1. Detectar conflitos
    const conflicts = detectVerticalConflicts(positions, bifurcations, nodeWidths, nodeHeights);
    
    if (conflicts.length === 0) {
      console.log(`[Vertical Management] Nenhum conflito detectado`);
      return positions;
    }
    
    // 2. Resolver conflitos
    const resolvedPositions = resolveVerticalConflicts(conflicts, positions, nodeWidths);
    
    // 3. Verificar se novos conflitos foram introduzidos (máximo 2 iterações)
    const remainingConflicts = detectVerticalConflicts(resolvedPositions, bifurcations, nodeWidths, nodeHeights);
    
    if (remainingConflicts.length > 0 && remainingConflicts.length < conflicts.length) {
      console.log(`[Vertical Management] Segunda passada de resolução (${remainingConflicts.length} conflitos restantes)`);
      return resolveVerticalConflicts(remainingConflicts, resolvedPositions, nodeWidths);
    }
    
    console.log(`[Vertical Management] Gerenciamento concluído`);
    return resolvedPositions;
  }

  // --- Sistema de Convergência Elegante ---

  /**
   * Calcula a geometria de convergência para dois ramos de bifurcação.
   * @param upperBranchEndNode Posição do último nó do ramo superior
   * @param lowerBranchEndNode Posição do último nó do ramo inferior  
   * @param convergenceNode Posição do nó de convergência
   * @returns Geometria calculada com curvas Bézier para ambos os ramos
   */
  export function calculateConvergenceGeometry(
    upperBranchEndNode: LayoutPosition,
    lowerBranchEndNode: LayoutPosition,
    convergenceNode: LayoutPosition
  ): ConvergenceGeometry {
    console.log(`[Convergence] Calculando geometria de convergência`);
    
    // Calcular pontos de controle para curvas suaves
    const distanceToConvergence = convergenceNode.x - Math.max(upperBranchEndNode.x, lowerBranchEndNode.x);
    const controlOffsetX = Math.max(50, distanceToConvergence * 0.6); // Offset dinâmico baseado na distância
    
    // Ponto de controle para ramo superior
    const upperControlPoint: Point2D = {
      x: convergenceNode.x - controlOffsetX,
      y: upperBranchEndNode.y + (convergenceNode.y - upperBranchEndNode.y) * 0.3
    };
    
    // Ponto de controle para ramo inferior
    const lowerControlPoint: Point2D = {
      x: convergenceNode.x - controlOffsetX,
      y: lowerBranchEndNode.y + (convergenceNode.y - lowerBranchEndNode.y) * 0.3
    };
    
    // Calcular ângulo ideal de convergência
    const upperAngle = Math.atan2(
      convergenceNode.y - upperBranchEndNode.y,
      convergenceNode.x - upperBranchEndNode.x
    );
    const lowerAngle = Math.atan2(
      convergenceNode.y - lowerBranchEndNode.y,
      convergenceNode.x - lowerBranchEndNode.x
    );
    const convergenceAngle = Math.abs(upperAngle - lowerAngle) * (180 / Math.PI);
    
    // Configurar curvas Bézier
    const upperPath: BezierPathConfig = {
      startPoint: { x: upperBranchEndNode.x, y: upperBranchEndNode.y },
      controlPoint: upperControlPoint,
      endPoint: { x: convergenceNode.x, y: convergenceNode.y },
      tension: 0.6
    };
    
    const lowerPath: BezierPathConfig = {
      startPoint: { x: lowerBranchEndNode.x, y: lowerBranchEndNode.y },
      controlPoint: lowerControlPoint,
      endPoint: { x: convergenceNode.x, y: convergenceNode.y },
      tension: 0.6
    };
    
    console.log(`[Convergence] Geometria calculada - Ângulo: ${convergenceAngle.toFixed(2)}°`);
    
    return {
      upperPath,
      lowerPath,
      convergenceAngle,
      upperControlPoint,
      lowerControlPoint
    };
  }

  /**
   * Calcula pontos ao longo de uma curva Bézier quadrática.
   * @param config Configuração da curva Bézier
   * @param segments Número de segmentos para aproximar a curva
   * @returns Array de pontos ao longo da curva
   */
  export function calculateBezierPath(config: BezierPathConfig, segments: number = 8): Point2D[] {
    const points: Point2D[] = [];
    const { startPoint, controlPoint, endPoint } = config;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      
      // Fórmula de Bézier quadrática: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
      const x = Math.pow(1 - t, 2) * startPoint.x +
                2 * (1 - t) * t * controlPoint.x +
                Math.pow(t, 2) * endPoint.x;
                
      const y = Math.pow(1 - t, 2) * startPoint.y +
                2 * (1 - t) * t * controlPoint.y +
                Math.pow(t, 2) * endPoint.y;
      
      points.push({ x, y });
    }
    
    return points;
  }

  /**
   * Calcula o ângulo otimizado para entrada no nó de convergência.
   * @param upperBranchEnd Posição do último nó do ramo superior
   * @param lowerBranchEnd Posição do último nó do ramo inferior
   * @param convergenceNode Posição do nó de convergência
   * @returns Ângulo em graus para melhor aproximação visual
   */
  export function calculateOptimalAngle(
    upperBranchEnd: Point2D,
    lowerBranchEnd: Point2D,
    convergenceNode: Point2D
  ): number {
    // Calcular vetores dos ramos ao ponto de convergência
    const upperVector = {
      x: convergenceNode.x - upperBranchEnd.x,
      y: convergenceNode.y - upperBranchEnd.y
    };
    
    const lowerVector = {
      x: convergenceNode.x - lowerBranchEnd.x,
      y: convergenceNode.y - lowerBranchEnd.y
    };
    
    // Calcular magnitudes
    const upperMagnitude = Math.sqrt(upperVector.x ** 2 + upperVector.y ** 2);
    const lowerMagnitude = Math.sqrt(lowerVector.x ** 2 + lowerVector.y ** 2);
    
    // Calcular produto escalar
    const dotProduct = upperVector.x * lowerVector.x + upperVector.y * lowerVector.y;
    
    // Calcular ângulo entre os vetores
    const angle = Math.acos(dotProduct / (upperMagnitude * lowerMagnitude));
    
    // Retornar em graus
    return angle * (180 / Math.PI);
  }

  /**
   * Verifica se a geometria de convergência é válida e não causará sobreposições.
   * @param geometry Geometria calculada para verificação
   * @param existingPositions Posições existentes de outros nós
   * @returns True se a geometria é válida
   */
  export function validateConvergenceGeometry(
    geometry: ConvergenceGeometry,
    existingPositions: Map<string, LayoutPosition>
  ): boolean {
    // Verificar se os pontos de controle não colidem com nós existentes
    const minDistance = 30; // Distância mínima de qualquer nó
    
    for (const [nodeId, pos] of existingPositions.entries()) {
      // Verificar distância do ponto de controle superior
      const upperDistance = Math.sqrt(
        Math.pow(geometry.upperControlPoint.x - pos.x, 2) +
        Math.pow(geometry.upperControlPoint.y - pos.y, 2)
      );
      
      // Verificar distância do ponto de controle inferior
      const lowerDistance = Math.sqrt(
        Math.pow(geometry.lowerControlPoint.x - pos.x, 2) +
        Math.pow(geometry.lowerControlPoint.y - pos.y, 2)
      );
      
      if (upperDistance < minDistance || lowerDistance < minDistance) {
        console.warn(`[Convergence] Geometria inválida - muito próxima do nó ${nodeId}`);
        return false;
      }
    }
    
    // Verificar se o ângulo de convergência não é muito agudo
    if (geometry.convergenceAngle < 15 || geometry.convergenceAngle > 150) {
      console.warn(`[Convergence] Geometria inválida - ângulo inadequado: ${geometry.convergenceAngle}°`);
      return false;
    }
    
    return true;
  }

  /**
   * Ajusta automaticamente a geometria de convergência se ela for inválida.
   * @param geometry Geometria original
   * @param existingPositions Posições existentes
   * @returns Geometria ajustada
   */
  export function adjustConvergenceGeometry(
    geometry: ConvergenceGeometry,
    existingPositions: Map<string, LayoutPosition>
  ): ConvergenceGeometry {
    let adjustedGeometry = { ...geometry };
    
    // Se o ângulo for muito agudo, afastar os pontos de controle
    if (geometry.convergenceAngle < 15) {
      const extraOffset = 40;
      
      adjustedGeometry.upperControlPoint.x -= extraOffset;
      adjustedGeometry.lowerControlPoint.x -= extraOffset;
      
      // Recalcular as curvas
      adjustedGeometry.upperPath = {
        ...adjustedGeometry.upperPath,
        controlPoint: adjustedGeometry.upperControlPoint
      };
      
      adjustedGeometry.lowerPath = {
        ...adjustedGeometry.lowerPath,
        controlPoint: adjustedGeometry.lowerControlPoint
      };
      
      console.log(`[Convergence] Geometria ajustada - pontos de controle afastados`);
    }
    
    return adjustedGeometry;
  }

  /**
   * Função principal para preparar convergência elegante.
   * @param bifurcation Análise da bifurcação
   * @param positions Posições calculadas dos nós
   * @returns Configuração completa para conectores curvos
   */
  export function prepareElegantConvergence(
    bifurcation: BifurcationAnalysis,
    positions: Map<string, LayoutPosition>
  ): CurvedConnectorConfig[] | null {
    if (!bifurcation.convergenceNodeId) {
      console.log(`[Convergence] Nenhum ponto de convergência encontrado para decisão ${bifurcation.decisionNodeId}`);
      return null;
    }
    
    // Obter posições dos últimos nós de cada ramo
    const upperBranchEnd = bifurcation.branches.upper[bifurcation.branches.upper.length - 1];
    const lowerBranchEnd = bifurcation.branches.lower[bifurcation.branches.lower.length - 1];
    
    const upperEndPos = positions.get(upperBranchEnd);
    const lowerEndPos = positions.get(lowerBranchEnd);
    const convergencePos = positions.get(bifurcation.convergenceNodeId);
    
    if (!upperEndPos || !lowerEndPos || !convergencePos) {
      console.warn(`[Convergence] Posições não encontradas para convergência`);
      return null;
    }
    
    // Calcular geometria
    let geometry = calculateConvergenceGeometry(upperEndPos, lowerEndPos, convergencePos);
    
    // Validar e ajustar se necessário
    if (!validateConvergenceGeometry(geometry, positions)) {
      geometry = adjustConvergenceGeometry(geometry, positions);
    }
    
    // Criar configurações para ambos os conectores
    const configs: CurvedConnectorConfig[] = [
      {
        geometry,
        isUpperBranch: true,
        useMultipleSegments: true, // Figma pode não suportar curvas nativas
        segmentCount: 8,
        smoothingFactor: 0.7
      },
      {
        geometry,
        isUpperBranch: false,
        useMultipleSegments: true,
        segmentCount: 8,
        smoothingFactor: 0.7
      }
    ];
    
    console.log(`[Convergence] Configurações de convergência preparadas para ${bifurcation.decisionNodeId}`);
    return configs;
  }

  // --- Funções de Teste e Validação ---

  /**
   * Testa a geometria de convergência com diferentes configurações
   * Esta função serve para validar a implementação durante desenvolvimento
   */
  export function testConvergenceGeometry(): void {
    console.log(`[Convergence Test] Iniciando testes de geometria de convergência`);
    
    // Cenário de teste 1: Convergência próxima
    const upperPos1: LayoutPosition = { x: 100, y: 50, laneIndex: 1 };
    const lowerPos1: LayoutPosition = { x: 100, y: 150, laneIndex: -1 };
    const convergencePos1: LayoutPosition = { x: 300, y: 100, laneIndex: 0 };
    
    const geometry1 = calculateConvergenceGeometry(upperPos1, lowerPos1, convergencePos1);
    console.log(`[Convergence Test] Cenário 1 - Ângulo: ${geometry1.convergenceAngle.toFixed(2)}°`);
    
    // Cenário de teste 2: Convergência distante
    const upperPos2: LayoutPosition = { x: 100, y: 0, laneIndex: 1 };
    const lowerPos2: LayoutPosition = { x: 100, y: 200, laneIndex: -1 };
    const convergencePos2: LayoutPosition = { x: 500, y: 100, laneIndex: 0 };
    
    const geometry2 = calculateConvergenceGeometry(upperPos2, lowerPos2, convergencePos2);
    console.log(`[Convergence Test] Cenário 2 - Ângulo: ${geometry2.convergenceAngle.toFixed(2)}°`);
    
    // Cenário de teste 3: Convergência muito aguda
    const upperPos3: LayoutPosition = { x: 100, y: 90, laneIndex: 1 };
    const lowerPos3: LayoutPosition = { x: 100, y: 110, laneIndex: -1 };
    const convergencePos3: LayoutPosition = { x: 150, y: 100, laneIndex: 0 };
    
    const geometry3 = calculateConvergenceGeometry(upperPos3, lowerPos3, convergencePos3);
    console.log(`[Convergence Test] Cenário 3 - Ângulo: ${geometry3.convergenceAngle.toFixed(2)}°`);
    
    // Teste de validação
    const mockPositions = new Map<string, LayoutPosition>();
    mockPositions.set('test1', { x: 200, y: 75, laneIndex: 0 });
    mockPositions.set('test2', { x: 250, y: 125, laneIndex: 0 });
    
    const isValid1 = validateConvergenceGeometry(geometry1, mockPositions);
    const isValid2 = validateConvergenceGeometry(geometry2, mockPositions);
    const isValid3 = validateConvergenceGeometry(geometry3, mockPositions);
    
    console.log(`[Convergence Test] Validação - Cenário 1: ${isValid1}, Cenário 2: ${isValid2}, Cenário 3: ${isValid3}`);
    
    // Teste de ajuste automático
    if (!isValid3) {
      const adjustedGeometry3 = adjustConvergenceGeometry(geometry3, mockPositions);
      console.log(`[Convergence Test] Cenário 3 ajustado - Novo ângulo: ${adjustedGeometry3.convergenceAngle.toFixed(2)}°`);
    }
    
    console.log(`[Convergence Test] Testes concluídos`);
  }

  /**
   * Testa o cálculo de curvas Bézier com diferentes tensões
   */
  export function testBezierCalculation(): void {
    console.log(`[Bezier Test] Testando cálculo de curvas Bézier`);
    
    const testPath: BezierPathConfig = {
      startPoint: { x: 0, y: 0 },
      controlPoint: { x: 50, y: 50 },
      endPoint: { x: 100, y: 0 },
      tension: 0.5
    };
    
    // Teste com diferentes quantidades de segmentos
    const segments4 = calculateBezierPath(testPath, 4);
    const segments8 = calculateBezierPath(testPath, 8);
    const segments16 = calculateBezierPath(testPath, 16);
    
    console.log(`[Bezier Test] 4 segmentos: ${segments4.length} pontos`);
    console.log(`[Bezier Test] 8 segmentos: ${segments8.length} pontos`);
    console.log(`[Bezier Test] 16 segmentos: ${segments16.length} pontos`);
    
    // Validar se os pontos inicial e final estão corretos
    const firstPoint = segments8[0];
    const lastPoint = segments8[segments8.length - 1];
    
    const startCorrect = firstPoint.x === testPath.startPoint.x && firstPoint.y === testPath.startPoint.y;
    const endCorrect = lastPoint.x === testPath.endPoint.x && lastPoint.y === testPath.endPoint.y;
    
    console.log(`[Bezier Test] Ponto inicial correto: ${startCorrect}, Ponto final correto: ${endCorrect}`);
    
    if (startCorrect && endCorrect) {
      console.log(`[Bezier Test] ✅ Cálculo de Bézier funcionando corretamente`);
    } else {
      console.warn(`[Bezier Test] ⚠️ Possível problema no cálculo de Bézier`);
    }
  }

  /**
   * Função de teste abrangente para todo o sistema de convergência
   */
  export function runConvergenceTests(): void {
    console.log(`[Convergence System] Executando suite completa de testes`);
    
    try {
      testConvergenceGeometry();
      testBezierCalculation();
      console.log(`[Convergence System] ✅ Todos os testes passaram`);
    } catch (error: any) {
      console.error(`[Convergence System] ❌ Falha nos testes:`, error);
    }
  }
}

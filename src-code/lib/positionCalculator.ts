// src-code/lib/positionCalculator.ts
/// <reference types="@figma/plugin-typings" />

import type { FlowNode } from '@shared/types/flow.types';

export interface AbsolutePosition {
  x: number;
  y: number;
}

export interface CalculatedPosition extends AbsolutePosition {
  nodeId: string;
  calculationMode: 'manual' | 'auto';
  anchorUsed?: string;
}

export interface LayoutSpacingConfig {
  unit: number;
  spacing: {
    horizontal: number;
    vertical: number;
  };
}

const COLLISION_THRESHOLD = 0.4; // 40% do espaçamento informado

/**
 * Calcula posições absolutas para nodes com layoutHint baseado em anchors.
 */
export function calculateAbsolutePositions(
  flowNodes: FlowNode[],
  viewportCenter: AbsolutePosition,
  layoutConfig: LayoutSpacingConfig
): Map<string, CalculatedPosition> {
  const positions = new Map<string, CalculatedPosition>();
  if (!flowNodes.length) {
    return positions;
  }

  const firstNode = findFirstNode(flowNodes);
  if (!firstNode) {
    return positions;
  }

  positions.set(firstNode.id, {
    nodeId: firstNode.id,
    x: viewportCenter.x,
    y: viewportCenter.y,
    calculationMode: 'manual'
  });

  const processed = new Set<string>([firstNode.id]);
  const sortedNodes = topologicalSortByAnchors(flowNodes);

  for (const node of sortedNodes) {
    if (processed.has(node.id)) {
      continue;
    }

    const layoutHint = node.layoutHint;
    if (layoutHint?.anchorId && layoutHint?.offset) {
      const anchorPosition = positions.get(layoutHint.anchorId);
      if (!anchorPosition) {
        console.warn(
          `[Position Calculator] Anchor "${layoutHint.anchorId}" ainda não posicionado para o nó "${node.id}". Mantendo algoritmo automático.`
        );
        continue;
      }

      positions.set(node.id, {
        nodeId: node.id,
        x: anchorPosition.x + layoutHint.offset.x,
        y: anchorPosition.y + layoutHint.offset.y,
        calculationMode: 'manual',
        anchorUsed: layoutHint.anchorId
      });
      processed.add(node.id);
    }
  }

  warnOnPotentialCollisions(positions, layoutConfig.spacing);
  return positions;
}

/**
 * Determina o primeiro nó do fluxo (ENTRYPOINT ou fallback).
 */
function findFirstNode(flowNodes: FlowNode[]): FlowNode | undefined {
  const entrypointWithoutAnchor = flowNodes.find(
    node => node.type === 'ENTRYPOINT' && !node.layoutHint?.anchorId
  );
  if (entrypointWithoutAnchor) {
    return entrypointWithoutAnchor;
  }

  const firstEntrypoint = flowNodes.find(node => node.type === 'ENTRYPOINT');
  if (firstEntrypoint) {
    return firstEntrypoint;
  }

  return flowNodes[0];
}

/**
 * Ordena nós por dependência de anchors usando Kahn.
 */
function topologicalSortByAnchors(flowNodes: FlowNode[]): FlowNode[] {
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  const nodeMap = new Map(flowNodes.map(node => [node.id, node]));

  flowNodes.forEach(node => {
    graph.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  flowNodes.forEach(node => {
    const anchorId = node.layoutHint?.anchorId;
    if (anchorId && graph.has(anchorId)) {
      graph.get(anchorId)!.push(node.id);
      inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
    }
  });

  const queue: string[] = [];
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  const sorted: FlowNode[] = [];
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    const node = nodeMap.get(currentId);
    if (node) {
      sorted.push(node);
    }

    for (const neighbor of graph.get(currentId) || []) {
      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Adiciona nós restantes (ciclos já foram evitados no parser, mas por precaução)
  if (sorted.length < flowNodes.length) {
    for (const node of flowNodes) {
      if (!sorted.includes(node)) {
        sorted.push(node);
      }
    }
  }

  return sorted;
}

function warnOnPotentialCollisions(
  positions: Map<string, CalculatedPosition>,
  spacing: LayoutSpacingConfig['spacing']
): void {
  const manualPositions = Array.from(positions.values()).filter(pos => pos.calculationMode === 'manual');
  for (let i = 0; i < manualPositions.length; i++) {
    for (let j = i + 1; j < manualPositions.length; j++) {
      const a = manualPositions[i];
      const b = manualPositions[j];
      const deltaX = Math.abs(a.x - b.x);
      const deltaY = Math.abs(a.y - b.y);

      const horizontalThreshold = spacing.horizontal * COLLISION_THRESHOLD;
      const verticalThreshold = spacing.vertical * COLLISION_THRESHOLD;

      if (deltaX < horizontalThreshold && deltaY < verticalThreshold) {
        console.warn(
          `[Position Calculator] Nós "${a.nodeId}" e "${b.nodeId}" estão muito próximos (Δx=${deltaX.toFixed(
            1
          )}px, Δy=${deltaY.toFixed(1)}px). Considere ajustar offsets.`
        );
      }
    }
  }
}

/**
 * Calcula exit/entry points com base no offset entre nós.
 */
export function calculateExitEntryPoints(
  offset: { x: number; y: number },
  explicitExit?: string,
  explicitEntry?: string
): {
  exit: 'top' | 'right' | 'bottom' | 'left';
  entry: 'top' | 'right' | 'bottom' | 'left';
} {
  if (explicitExit && explicitEntry) {
    return {
      exit: explicitExit as any,
      entry: explicitEntry as any
    };
  }

  const absX = Math.abs(offset.x);
  const absY = Math.abs(offset.y);
  let exit: 'top' | 'right' | 'bottom' | 'left' = 'right';
  let entry: 'top' | 'right' | 'bottom' | 'left' = 'left';

  if (absX >= absY) {
    if (offset.x >= 0) {
      exit = 'right';
      entry = 'left';
    } else {
      exit = 'left';
      entry = 'right';
    }
  } else {
    if (offset.y >= 0) {
      exit = 'bottom';
      entry = 'top';
    } else {
      exit = 'top';
      entry = 'bottom';
    }
  }

  if (explicitExit) {
    exit = explicitExit as any;
  }
  if (explicitEntry) {
    entry = explicitEntry as any;
  }

  return { exit, entry };
}

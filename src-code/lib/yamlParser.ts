// src-code/lib/yamlParser.ts
/// <reference types="@figma/plugin-typings" />

import yaml from 'js-yaml';
import type { FlowNode, Connection, DescriptionField } from '@shared/types/flow.types';
import type {
  YAMLFlowDocument,
  YAMLNode,
  YAMLConnection,
  UnitValue,
} from '@shared/types/yaml-flow.types';
import type { LayoutSpacingConfig } from './positionCalculator';

export type ParsedLayoutConfig = LayoutSpacingConfig;

export interface ParsedYAMLFlowResult {
  nodes: FlowNode[];
  connections: Connection[];
  layoutConfig: ParsedLayoutConfig;
  flowName?: string;
}

const DEFAULT_HORIZONTAL_SPACING = '1u';
const DEFAULT_VERTICAL_SPACING = '0.75u';

/**
 * Converte string YAML para estrutura do plugin.
 */
export function parseYAMLToFlow(input: string): ParsedYAMLFlowResult {
  let document: YAMLFlowDocument;

  try {
    document = yaml.load(input) as YAMLFlowDocument;
  } catch (error: any) {
    throw new Error(`Erro ao interpretar YAML: ${error.message}`);
  }

  validateYAMLDocument(document);

  const flowName = sanitizeFlowName(document.metadata?.name);
  const unit = document.metadata.layout.unit;
  const layoutConfig: ParsedLayoutConfig = {
    unit,
    spacing: {
      horizontal: parseUnit(document.metadata.layout.spacing?.horizontal ?? DEFAULT_HORIZONTAL_SPACING, unit),
      vertical: parseUnit(document.metadata.layout.spacing?.vertical ?? DEFAULT_VERTICAL_SPACING, unit),
    },
  };

  const nodes = convertYAMLNodesToFlowNodes(document.nodes, unit);
  const connections = convertYAMLConnectionsToFlowConnections(document.connections);

  return { nodes, connections, layoutConfig, flowName };
}

/**
 * Converte valor de unidade (u, px ou número) para pixels absolutos.
 */
export function parseUnit(value: UnitValue, baseUnit: number): number {
  if (typeof value === 'number') {
    return value;
  }

  const trimmed = value.trim();

  if (trimmed.endsWith('u')) {
    const units = parseFloat(trimmed.slice(0, -1));
    if (Number.isNaN(units)) {
      throw new Error(`Formato de unidade inválido: ${value}`);
    }
    return units * baseUnit;
  }

  if (trimmed.endsWith('px')) {
    const pixels = parseFloat(trimmed.slice(0, -2));
    if (Number.isNaN(pixels)) {
      throw new Error(`Formato de pixel inválido: ${value}`);
    }
    return pixels;
  }

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric)) {
    return numeric;
  }

  throw new Error(`Formato de unidade inválido: ${value}. Use "2u", "1.5u" ou "400px"`);
}

function validateYAMLDocument(doc: YAMLFlowDocument | undefined): asserts doc is YAMLFlowDocument {
  if (!doc || typeof doc !== 'object') {
    throw new Error('Documento YAML inválido. Certifique-se de que metadata, nodes e connections estejam definidos.');
  }

  const layout = doc.metadata?.layout;
  if (!layout) {
    throw new Error('metadata.layout é obrigatório.');
  }

  if (doc.metadata?.name && typeof doc.metadata.name !== 'string') {
    throw new Error('metadata.name deve ser uma string quando definido.');
  }

  if (layout.algorithm !== 'auto') {
    throw new Error(`Algoritmo de layout não suportado: ${layout.algorithm}. Use "auto".`);
  }

  if (typeof layout.unit !== 'number' || Number.isNaN(layout.unit)) {
    throw new Error('metadata.layout.unit deve ser um número.');
  }

  if (!doc.nodes || typeof doc.nodes !== 'object' || Array.isArray(doc.nodes)) {
    throw new Error('A seção nodes é obrigatória e deve ser um objeto.');
  }

  const nodeIds = Object.keys(doc.nodes);
  if (nodeIds.length === 0) {
    throw new Error('Defina pelo menos um nó em nodes.');
  }

  for (const [nodeId, node] of Object.entries(doc.nodes)) {
    if (!node || typeof node !== 'object') {
      throw new Error(`Nó "${nodeId}" inválido.`);
    }

    if (!node.type) {
      throw new Error(`Node "${nodeId}" precisa do campo type.`);
    }

    if (!['ENTRYPOINT', 'STEP', 'DECISION', 'END'].includes(node.type)) {
      throw new Error(`Node "${nodeId}" possui type inválido: ${node.type}.`);
    }

    if (!node.name || typeof node.name !== 'string') {
      throw new Error(`Node "${nodeId}" precisa do campo name.`);
    }

    if (node.position?.anchor && !nodeIds.includes(node.position.anchor)) {
      throw new Error(`Node "${nodeId}" referencia anchor inexistente: ${node.position.anchor}.`);
    }
  }

  if (!Array.isArray(doc.connections)) {
    throw new Error('A seção connections é obrigatória e deve ser um array.');
  }

  doc.connections.forEach((conn, index) => {
    if (!conn.from) {
      throw new Error(`Connection ${index} precisa do campo from.`);
    }
    if (!conn.to) {
      throw new Error(`Connection ${index} precisa do campo to.`);
    }
    if (!nodeIds.includes(conn.from)) {
      throw new Error(`Connection ${index} referencia nó inexistente: ${conn.from}.`);
    }
    if (!nodeIds.includes(conn.to)) {
      throw new Error(`Connection ${index} referencia nó inexistente: ${conn.to}.`);
    }
  });

  detectCircularAnchors(doc.nodes);
}

function sanitizeFlowName(name: string | undefined): string | undefined {
  if (!name) {
    return undefined;
  }
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function detectCircularAnchors(nodes: Record<string, YAMLNode>): void {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(nodeId: string): void {
    if (visiting.has(nodeId)) {
      throw new Error(`Referência circular detectada envolvendo o nó "${nodeId}".`);
    }
    if (visited.has(nodeId)) {
      return;
    }

    visiting.add(nodeId);
    const anchor = nodes[nodeId]?.position?.anchor;
    if (anchor) {
      dfs(anchor);
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
  }

  Object.keys(nodes).forEach((nodeId) => {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  });
}

function convertYAMLNodesToFlowNodes(
  yamlNodes: Record<string, YAMLNode>,
  baseUnit: number,
): FlowNode[] {
  return Object.entries(yamlNodes).map(([nodeId, yamlNode]) => {
    const flowNode: FlowNode = {
      id: nodeId,
      type: yamlNode.type,
      name: yamlNode.name,
      description: buildDescriptionFields(yamlNode),
      content: yamlNode.content,
    };

    if (yamlNode.position) {
      flowNode.layoutHint = {
        anchorId: yamlNode.position.anchor,
        offset: yamlNode.position.offset
          ? {
              x: parseUnit(yamlNode.position.offset.x, baseUnit),
              y: parseUnit(yamlNode.position.offset.y, baseUnit),
            }
          : undefined,
        exitPoint: yamlNode.position.exit,
        entryPoint: yamlNode.position.entry,
      };
    }

    return flowNode;
  });
}

function buildDescriptionFields(node: YAMLNode): FlowNode['description'] | undefined {
  const fields: DescriptionField[] = [];

  if (node.description) {
    fields.push({ label: 'Description', content: node.description });
  }

  if (node.content) {
    fields.push({ label: 'Content', content: node.content });
  }

  return fields.length > 0 ? { fields } : undefined;
}

function convertYAMLConnectionsToFlowConnections(yamlConnections: YAMLConnection[]): Connection[] {
  return yamlConnections.map((yamlConn) => ({
    from: yamlConn.from,
    to: yamlConn.to,
    label: yamlConn.label,
    conditionLabel: yamlConn.label,
    exitMagnet: yamlConn.style?.exit,
    entryMagnet: yamlConn.style?.entry,
    lineType: yamlConn.style?.line_type,
  }));
}

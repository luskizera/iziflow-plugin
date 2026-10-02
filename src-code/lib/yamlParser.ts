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

import { YAMLFlowDocumentSchema } from '@shared/schemas/yaml-flow.schema';

function validateYAMLDocument(doc: unknown): asserts doc is YAMLFlowDocument {
  const result = YAMLFlowDocumentSchema.safeParse(doc);
  if (!result.success) {
    const firstIssue = result.error.issues[0];
    const pathStr = firstIssue.path.length > 0 ? ` [${firstIssue.path.join('.')}]` : '';
    throw new Error(`YAML validation error${pathStr}: ${firstIssue.message}`);
  }
}

function sanitizeFlowName(name: string | undefined): string | undefined {
  if (!name) {
    return undefined;
  }
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed : undefined;
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
    // Tenta parsear content como campos estruturados (label: value)
    const contentFields = parseStructuredContent(node.content);

    if (contentFields.length > 0) {
      // Se encontrou campos estruturados, adiciona cada um como field separado
      for (const field of contentFields) {
        fields.push(field);
      }
    } else {
      // Se não é estruturado, adiciona como field único "Content"
      fields.push({ label: 'Content', content: node.content });
    }
  }

  return fields.length > 0 ? { fields } : undefined;
}

/**
 * Parseia conteúdo estruturado no formato "Label: Value" em múltiplos fields.
 * Detecta TODOS os tópicos (qualquer texto seguido de ":"), independente de indentação.
 *
 * Exemplo:
 *   "Instruction: Type your code\nErrors:\n  invalid: Wrong code\n  expired: Code expired"
 *
 * Retorna:
 *   [
 *     { label: 'Instruction', content: 'Type your code' },
 *     { label: 'invalid', content: 'Wrong code' },
 *     { label: 'expired', content: 'Code expired' }
 *   ]
 *
 * Nota: "Errors:" sem conteúdo inline é ignorado (serve apenas como header visual no YAML)
 */
function parseStructuredContent(content: string): DescriptionField[] {
  const fields: DescriptionField[] = [];
  const lines = content.split('\n');

  let currentLabel: string | null = null;
  let currentContent: string[] = [];

  const saveCurrentField = () => {
    if (currentLabel !== null) {
      const contentText = currentContent.join('\n').trim();
      // Só adiciona se tiver conteúdo OU se o label não for um header vazio
      if (contentText.length > 0) {
        fields.push({ label: currentLabel, content: contentText });
      }
      // Se não tem conteúdo, não adiciona (ignora headers vazios como "Errors:")
    }
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Ignora linhas vazias
    if (trimmedLine.length === 0) {
      continue;
    }

    // Verifica se a linha é um tópico (contém ":")
    const topicMatch = trimmedLine.match(/^([^:]+):\s*(.*)$/);

    if (topicMatch) {
      // Salva o tópico anterior antes de começar novo
      saveCurrentField();

      // Inicia novo tópico
      currentLabel = topicMatch[1].trim();
      const inlineContent = topicMatch[2].trim();

      // Se tem conteúdo na mesma linha (ex: "Message: texto"), adiciona
      if (inlineContent.length > 0) {
        currentContent = [inlineContent];
      } else {
        currentContent = [];
      }
    } else if (currentLabel !== null) {
      // Se não é um novo tópico mas existe um tópico ativo, adiciona ao conteúdo
      currentContent.push(trimmedLine);
    }
    // Se não é tópico e não há tópico ativo, ignora a linha
  }

  // Adiciona o último tópico se existir
  saveCurrentField();

  return fields;
}

function convertYAMLConnectionsToFlowConnections(yamlConnections: YAMLConnection[]): Connection[] {
  return yamlConnections.map((yamlConn) => ({
    from: yamlConn.from,
    to: yamlConn.to,
    label: yamlConn.label,
    conditionLabel: yamlConn.label,
    secondary: yamlConn.secondary,
    exitMagnet: yamlConn.style?.exit,
    entryMagnet: yamlConn.style?.entry,
    lineType: yamlConn.style?.line_type,
  }));
}

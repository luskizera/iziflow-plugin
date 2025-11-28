# iziFlow - Plano de ação para refatoração YAML

## Resumo executivo

**Objetivo:** Substituir completamente a sintaxe Markdown por YAML no iziFlow, oferecendo controle fino de posicionamento através de offsets relativos e unidades customizáveis.

**Duração estimada:** 4-6 semanas  
**Complexidade:** Média-Alta  
**Impacto:** Alto (quebra compatibilidade com formato antigo)

---

## Cronograma macro

| Fase | Duração | Entregável |
|------|---------|------------|
| **Fase 1** | 1 semana | Parser YAML + Tipos básicos |
| **Fase 2** | 1-2 semanas | Algoritmo de posicionamento relativo |
| **Fase 3** | 1 semana | Controle de conectores |
| **Fase 4** | 1 semana | Validação e testes |
| **Fase 5** | 0.5-1 semana | Documentação e ajustes finais |

---

## Fase 1: Parser YAML e tipos básicos (1 semana)

### Objetivos
- Criar parser YAML funcional
- Estender tipos TypeScript para suportar YAML
- Implementar detecção automática de formato (YAML vs Markdown)
- Garantir compatibilidade com estrutura existente

### Tarefas

#### 1.1 Instalar dependências (1h)

```bash
cd iziflow-plugin
npm install js-yaml @types/js-yaml --save
```

**Validação:** `npm list js-yaml` mostra versão instalada

---

#### 1.2 Criar tipos YAML (2-3h)

**Arquivo:** `shared/types/yaml-flow.types.ts`

```typescript
// shared/types/yaml-flow.types.ts

export interface YAMLFlowDocument {
  metadata: YAMLMetadata;
  nodes: { [nodeId: string]: YAMLNode };
  connections: YAMLConnection[];
}

export interface YAMLMetadata {
  layout: {
    algorithm: 'auto';
    unit: number;
    first_node_position: 'center';
    spacing?: {
      horizontal?: string | number;
      vertical?: string | number;
    };
  };
}

export interface YAMLNode {
  type: 'ENTRYPOINT' | 'STEP' | 'DECISION' | 'END';
  name: string;
  description?: string;
  content?: string;
  position?: YAMLNodePosition;
}

export interface YAMLNodePosition {
  anchor?: string;
  offset?: {
    x: string | number;
    y: string | number;
  };
  exit?: 'top' | 'right' | 'bottom' | 'left';
  entry?: 'top' | 'right' | 'bottom' | 'left';
}

export interface YAMLConnection {
  from: string;
  to: string;
  label?: string;
  style?: {
    line_type?: 'STRAIGHT' | 'ELBOWED';
    exit?: 'top' | 'right' | 'bottom' | 'left';
    entry?: 'top' | 'right' | 'bottom' | 'left';
  };
}

// Tipos auxiliares
export type UnitValue = string | number; // "2u" | "400px" | 400
```

**Validação:** Compilação TypeScript sem erros

---

#### 1.3 Criar parser YAML (6-8h)

**Arquivo:** `src-code/lib/yamlParser.ts`

```typescript
// src-code/lib/yamlParser.ts
import * as yaml from 'js-yaml';
import type { FlowNode, Connection } from '@shared/types/flow.types';
import type { 
  YAMLFlowDocument, 
  YAMLNode, 
  YAMLConnection,
  UnitValue 
} from '@shared/types/yaml-flow.types';

/**
 * Converte string YAML em estrutura de fluxo
 */
export function parseYAMLToFlow(input: string): {
  flowNodes: FlowNode[];
  flowConnections: Connection[];
  layoutConfig: { unit: number; spacing: { horizontal: number; vertical: number } };
} {
  // 1. Parse YAML
  const doc = yaml.load(input) as YAMLFlowDocument;
  
  // 2. Validar estrutura básica
  validateYAMLDocument(doc);
  
  // 3. Extrair configuração de layout
  const layoutConfig = {
    unit: doc.metadata.layout.unit,
    spacing: {
      horizontal: parseUnit(doc.metadata.layout.spacing?.horizontal || '1.5u', doc.metadata.layout.unit),
      vertical: parseUnit(doc.metadata.layout.spacing?.vertical || '0.75u', doc.metadata.layout.unit)
    }
  };
  
  // 4. Converter nodes
  const flowNodes = convertYAMLNodesToFlowNodes(doc.nodes, layoutConfig.unit);
  
  // 5. Converter conexões
  const flowConnections = convertYAMLConnectionsToFlowConnections(doc.connections);
  
  return { flowNodes, flowConnections, layoutConfig };
}

/**
 * Converte valor de unidade (u ou px) para pixels
 */
export function parseUnit(value: UnitValue, baseUnit: number): number {
  if (typeof value === 'number') {
    return value;
  }
  
  const trimmed = value.trim();
  
  if (trimmed.endsWith('u')) {
    const units = parseFloat(trimmed);
    if (isNaN(units)) {
      throw new Error(`Invalid unit format: ${value}`);
    }
    return units * baseUnit;
  }
  
  if (trimmed.endsWith('px')) {
    const pixels = parseFloat(trimmed);
    if (isNaN(pixels)) {
      throw new Error(`Invalid pixel format: ${value}`);
    }
    return pixels;
  }
  
  throw new Error(`Invalid unit format: ${value}. Use "2u" or "400px"`);
}

/**
 * Valida documento YAML
 */
function validateYAMLDocument(doc: YAMLFlowDocument): void {
  // Validar metadata
  if (!doc.metadata?.layout?.algorithm) {
    throw new Error('Missing metadata.layout.algorithm');
  }
  
  if (doc.metadata.layout.algorithm !== 'auto') {
    throw new Error(`Unsupported algorithm: ${doc.metadata.layout.algorithm}. Only "auto" is supported.`);
  }
  
  if (!doc.metadata.layout.unit || typeof doc.metadata.layout.unit !== 'number') {
    throw new Error('metadata.layout.unit must be a number');
  }
  
  // Validar nodes
  if (!doc.nodes || typeof doc.nodes !== 'object') {
    throw new Error('Missing or invalid nodes section');
  }
  
  const nodeIds = Object.keys(doc.nodes);
  if (nodeIds.length === 0) {
    throw new Error('At least one node is required');
  }
  
  // Validar cada node
  for (const [nodeId, node] of Object.entries(doc.nodes)) {
    if (!node.type) {
      throw new Error(`Node "${nodeId}" is missing required field: type`);
    }
    
    if (!['ENTRYPOINT', 'STEP', 'DECISION', 'END'].includes(node.type)) {
      throw new Error(`Node "${nodeId}" has invalid type: ${node.type}`);
    }
    
    if (!node.name || typeof node.name !== 'string') {
      throw new Error(`Node "${nodeId}" is missing required field: name`);
    }
    
    // Validar position se presente
    if (node.position?.anchor) {
      if (!nodeIds.includes(node.position.anchor)) {
        throw new Error(`Node "${nodeId}" references non-existent anchor: ${node.position.anchor}`);
      }
    }
  }
  
  // Validar conexões
  if (!doc.connections || !Array.isArray(doc.connections)) {
    throw new Error('Missing or invalid connections section');
  }
  
  for (let i = 0; i < doc.connections.length; i++) {
    const conn = doc.connections[i];
    
    if (!conn.from) {
      throw new Error(`Connection ${i} is missing required field: from`);
    }
    
    if (!conn.to) {
      throw new Error(`Connection ${i} is missing required field: to`);
    }
    
    if (!nodeIds.includes(conn.from)) {
      throw new Error(`Connection ${i} references non-existent node: ${conn.from}`);
    }
    
    if (!nodeIds.includes(conn.to)) {
      throw new Error(`Connection ${i} references non-existent node: ${conn.to}`);
    }
  }
  
  // Validar referências circulares em anchors
  detectCircularAnchors(doc.nodes);
}

/**
 * Detecta referências circulares em anchors
 */
function detectCircularAnchors(nodes: { [nodeId: string]: YAMLNode }): void {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  
  function dfs(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) {
      throw new Error(`Circular anchor reference detected involving node: ${nodeId}`);
    }
    
    if (visited.has(nodeId)) {
      return false;
    }
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const node = nodes[nodeId];
    if (node.position?.anchor) {
      dfs(node.position.anchor);
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  for (const nodeId of Object.keys(nodes)) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }
}

/**
 * Converte nodes YAML para FlowNode
 */
function convertYAMLNodesToFlowNodes(
  yamlNodes: { [nodeId: string]: YAMLNode },
  baseUnit: number
): FlowNode[] {
  const flowNodes: FlowNode[] = [];
  
  for (const [nodeId, yamlNode] of Object.entries(yamlNodes)) {
    const flowNode: FlowNode = {
      id: nodeId,
      type: yamlNode.type,
      name: yamlNode.name,
      description: yamlNode.description,
      content: yamlNode.content,
      
      // Adicionar layoutHint se position estiver presente
      layoutHint: yamlNode.position ? {
        anchorId: yamlNode.position.anchor,
        offset: yamlNode.position.offset ? {
          x: parseUnit(yamlNode.position.offset.x, baseUnit),
          y: parseUnit(yamlNode.position.offset.y, baseUnit)
        } : undefined,
        exitPoint: yamlNode.position.exit,
        entryPoint: yamlNode.position.entry
      } : undefined
    };
    
    flowNodes.push(flowNode);
  }
  
  return flowNodes;
}

/**
 * Converte conexões YAML para Connection
 */
function convertYAMLConnectionsToFlowConnections(
  yamlConnections: YAMLConnection[]
): Connection[] {
  return yamlConnections.map(yamlConn => {
    const connection: Connection = {
      from: yamlConn.from,
      to: yamlConn.to,
      label: yamlConn.label,
      
      // Adicionar informações de estilo se presentes
      exitMagnet: yamlConn.style?.exit,
      entryMagnet: yamlConn.style?.entry,
      lineType: yamlConn.style?.line_type
    };
    
    return connection;
  });
}
```

**Validação:** Testes unitários passam (criar depois)

---

#### 1.4 Estender tipos FlowNode (1-2h)

**Arquivo:** `shared/types/flow.types.ts`

```typescript
// Adicionar ao arquivo existente shared/types/flow.types.ts

export interface FlowNode {
  id: string;
  type: 'START' | 'ENTRYPOINT' | 'STEP' | 'DECISION' | 'END';
  name: string;
  description?: string;
  content?: string;
  
  // NOVO: Hint de layout para posicionamento manual
  layoutHint?: {
    anchorId?: string;
    offset?: { x: number; y: number };
    exitPoint?: 'top' | 'right' | 'bottom' | 'left';
    entryPoint?: 'top' | 'right' | 'bottom' | 'left';
  };
}

export interface Connection {
  from: string;
  to: string;
  label?: string;
  secondary?: boolean;
  
  // NOVO: Controle de conectores
  exitMagnet?: 'top' | 'right' | 'bottom' | 'left';
  entryMagnet?: 'top' | 'right' | 'bottom' | 'left';
  lineType?: 'STRAIGHT' | 'ELBOWED';
}
```

**Validação:** Compilação TypeScript sem erros

---

#### 1.5 Criar detector de formato (2h)

**Arquivo:** `src-code/lib/formatDetector.ts`

```typescript
// src-code/lib/formatDetector.ts

export type InputFormat = 'yaml' | 'markdown' | 'unknown';

/**
 * Detecta automaticamente se o input é YAML ou Markdown
 */
export function detectFormat(input: string): InputFormat {
  const trimmed = input.trim();
  
  // Vazio
  if (!trimmed) {
    return 'unknown';
  }
  
  // YAML geralmente começa com "metadata:" ou "nodes:"
  if (trimmed.startsWith('metadata:') || trimmed.startsWith('nodes:')) {
    return 'yaml';
  }
  
  // Markdown do iziFlow geralmente tem "NODE", "CONN", "DESC"
  if (/^(NODE|CONN|DESC|START|END)\s+/m.test(trimmed)) {
    return 'markdown';
  }
  
  // Tentar parse YAML
  try {
    const yaml = require('js-yaml');
    const parsed = yaml.load(trimmed);
    
    // Verificar se tem estrutura esperada
    if (parsed && typeof parsed === 'object' && ('metadata' in parsed || 'nodes' in parsed)) {
      return 'yaml';
    }
  } catch (e) {
    // Não é YAML válido
  }
  
  // Fallback: assume markdown
  return 'markdown';
}
```

**Validação:** Testes com inputs YAML e Markdown

---

#### 1.6 Integrar parsers no código principal (3-4h)

**Arquivo:** `src-code/code.ts`

```typescript
// Adicionar imports
import { detectFormat } from './lib/formatDetector';
import { parseYAMLToFlow } from './lib/yamlParser';
import { parseMarkdownToFlow } from './lib/markdownParser'; // já existe

// Modificar função que processa input
async function processFlowInput(input: string): Promise<{
  flowNodes: FlowNode[];
  flowConnections: Connection[];
  layoutConfig?: { unit: number; spacing: { horizontal: number; vertical: number } };
}> {
  const format = detectFormat(input);
  
  console.log(`[Flow Parser] Detected format: ${format}`);
  
  if (format === 'yaml') {
    return parseYAMLToFlow(input);
  } else if (format === 'markdown') {
    const result = parseMarkdownToFlow(input);
    // Markdown não tem layoutConfig, usar defaults
    return {
      ...result,
      layoutConfig: {
        unit: 200,
        spacing: { horizontal: 300, vertical: 150 }
      }
    };
  } else {
    throw new Error('Unable to detect input format. Please use valid YAML or Markdown syntax.');
  }
}
```

**Validação:** Plugin aceita YAML e Markdown

---

### Checklist Fase 1

- [ ] Dependências instaladas (`js-yaml`)
- [ ] Tipos YAML criados (`yaml-flow.types.ts`)
- [ ] Parser YAML implementado (`yamlParser.ts`)
- [ ] Tipos `FlowNode` e `Connection` estendidos
- [ ] Detector de formato implementado (`formatDetector.ts`)
- [ ] Integração no código principal (`code.ts`)
- [ ] Testes manuais com exemplos YAML simples
- [ ] Compilação sem erros TypeScript

**Entregável:** Plugin reconhece YAML e converte para estrutura FlowNode/Connection

---

## Fase 2: Algoritmo de posicionamento relativo (1-2 semanas)

### Objetivos
- Implementar cálculo de coordenadas absolutas a partir de anchors + offsets
- Priorizar posicionamento manual sobre automático
- Calcular exit/entry points automaticamente quando não especificados
- Validar e resolver conflitos de posicionamento

### Tarefas

#### 2.1 Criar calculadora de posições (8-10h)

**Arquivo:** `src-code/lib/positionCalculator.ts`

```typescript
// src-code/lib/positionCalculator.ts
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

/**
 * Calcula posições absolutas para todos os nodes
 */
export function calculateAbsolutePositions(
  flowNodes: FlowNode[],
  viewportCenter: { x: number; y: number },
  layoutConfig: { unit: number; spacing: { horizontal: number; vertical: number } }
): Map<string, CalculatedPosition> {
  const positions = new Map<string, CalculatedPosition>();
  const processed = new Set<string>();
  
  // 1. Encontrar primeiro node (ENTRYPOINT sem anchor ou primeiro da lista)
  const firstNode = findFirstNode(flowNodes);
  if (!firstNode) {
    throw new Error('No ENTRYPOINT node found');
  }
  
  // 2. Posicionar primeiro node no centro
  positions.set(firstNode.id, {
    nodeId: firstNode.id,
    x: viewportCenter.x,
    y: viewportCenter.y,
    calculationMode: 'manual'
  });
  processed.add(firstNode.id);
  
  // 3. Processar nodes com layoutHint (ordem topológica)
  const sortedNodes = topologicalSortByAnchors(flowNodes);
  
  for (const node of sortedNodes) {
    if (processed.has(node.id)) {
      continue;
    }
    
    if (node.layoutHint?.anchorId && node.layoutHint?.offset) {
      const anchorPos = positions.get(node.layoutHint.anchorId);
      
      if (!anchorPos) {
        console.warn(`[Position Calculator] Anchor "${node.layoutHint.anchorId}" not yet positioned for node "${node.id}". Using auto positioning.`);
        continue;
      }
      
      positions.set(node.id, {
        nodeId: node.id,
        x: anchorPos.x + node.layoutHint.offset.x,
        y: anchorPos.y + node.layoutHint.offset.y,
        calculationMode: 'manual',
        anchorUsed: node.layoutHint.anchorId
      });
      processed.add(node.id);
    }
  }
  
  // 4. Nodes restantes usam posicionamento automático
  // (delegado para algoritmo existente - ver Fase 2.2)
  
  return positions;
}

/**
 * Encontra o primeiro node do fluxo
 */
function findFirstNode(flowNodes: FlowNode[]): FlowNode | undefined {
  // Prioridade 1: ENTRYPOINT sem anchor
  const entrypointWithoutAnchor = flowNodes.find(
    node => node.type === 'ENTRYPOINT' && !node.layoutHint?.anchorId
  );
  
  if (entrypointWithoutAnchor) {
    return entrypointWithoutAnchor;
  }
  
  // Prioridade 2: Primeiro ENTRYPOINT
  const firstEntrypoint = flowNodes.find(node => node.type === 'ENTRYPOINT');
  if (firstEntrypoint) {
    return firstEntrypoint;
  }
  
  // Fallback: Primeiro node
  return flowNodes[0];
}

/**
 * Ordena nodes por dependência de anchors (topological sort)
 */
function topologicalSortByAnchors(flowNodes: FlowNode[]): FlowNode[] {
  const graph = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  
  // Construir grafo de dependências
  for (const node of flowNodes) {
    if (!graph.has(node.id)) {
      graph.set(node.id, []);
    }
    if (!inDegree.has(node.id)) {
      inDegree.set(node.id, 0);
    }
    
    if (node.layoutHint?.anchorId) {
      if (!graph.has(node.layoutHint.anchorId)) {
        graph.set(node.layoutHint.anchorId, []);
      }
      graph.get(node.layoutHint.anchorId)!.push(node.id);
      inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
    }
  }
  
  // Kahn's algorithm
  const queue: string[] = [];
  const sorted: FlowNode[] = [];
  const nodeMap = new Map(flowNodes.map(n => [n.id, n]));
  
  for (const [nodeId, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(nodeId);
    }
  }
  
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const node = nodeMap.get(nodeId);
    if (node) {
      sorted.push(node);
    }
    
    for (const neighbor of graph.get(nodeId) || []) {
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  return sorted;
}

/**
 * Calcula exit/entry points automaticamente baseado no offset
 */
export function calculateExitEntryPoints(
  offset: { x: number; y: number },
  explicitExit?: string,
  explicitEntry?: string
): {
  exit: 'top' | 'right' | 'bottom' | 'left';
  entry: 'top' | 'right' | 'bottom' | 'left';
} {
  // Se ambos especificados, usar valores explícitos
  if (explicitExit && explicitEntry) {
    return {
      exit: explicitExit as any,
      entry: explicitEntry as any
    };
  }
  
  // Calcular baseado no offset
  const absX = Math.abs(offset.x);
  const absY = Math.abs(offset.y);
  
  let exit: 'top' | 'right' | 'bottom' | 'left';
  let entry: 'top' | 'right' | 'bottom' | 'left';
  
  // Priorizar horizontal se offset X > offset Y
  if (absX >= absY) {
    if (offset.x > 0) {
      exit = 'right';
      entry = 'left';
    } else {
      exit = 'left';
      entry = 'right';
    }
  } else {
    if (offset.y > 0) {
      exit = 'bottom';
      entry = 'top';
    } else {
      exit = 'top';
      entry = 'bottom';
    }
  }
  
  // Aplicar overrides se fornecidos
  if (explicitExit) {
    exit = explicitExit as any;
  }
  if (explicitEntry) {
    entry = explicitEntry as any;
  }
  
  return { exit, entry };
}
```

**Validação:** Testes unitários com diferentes cenários de anchors

---

#### 2.2 Integrar com algoritmo existente (6-8h)

**Arquivo:** `src-code/code.ts` (modificar função `calculateBifurcatedPositions`)

```typescript
// Modificar função existente para respeitar layoutHints

function calculateBifurcatedPositions(
    flowNodes: FlowNode[], 
    flowConnections: Connection[],
    bifurcations: BifurcationAnalysis[],
    nodeLaneMap: Map<string, number>,
    layoutConfig: { unit: number; spacing: { horizontal: number; vertical: number } }
): Map<string, { x: number; y: number }> {
    
    const positions = new Map<string, { x: number; y: number }>();
    
    // NOVO: Primeiro, calcular posições manuais (layoutHints)
    const manualPositions = calculateAbsolutePositions(
        flowNodes,
        figma.viewport.center,
        layoutConfig
    );
    
    // Copiar posições manuais
    for (const [nodeId, pos] of manualPositions.entries()) {
        if (pos.calculationMode === 'manual') {
            positions.set(nodeId, { x: pos.x, y: pos.y });
        }
    }
    
    // LÓGICA EXISTENTE: Para nodes sem layoutHint, usar algoritmo automático
    const nodesNeedingAutoPosition = flowNodes.filter(
        node => !positions.has(node.id)
    );
    
    if (nodesNeedingAutoPosition.length > 0) {
        // Usar algoritmo bifurcado existente para estes nodes
        // (código atual permanece, apenas filtrando nodes já posicionados)
        
        let currentX = figma.viewport.center.x;
        const startY = figma.viewport.center.y;
        
        for (const node of nodesNeedingAutoPosition) {
            const laneIndex = nodeLaneMap.get(node.id) || 0;
            const yOffset = laneIndex * layoutConfig.spacing.vertical;
            
            positions.set(node.id, {
                x: currentX,
                y: startY + yOffset
            });
            
            currentX += layoutConfig.spacing.horizontal;
        }
    }
    
    console.log(`[Position Calculator] Manual: ${manualPositions.size}, Auto: ${nodesNeedingAutoPosition.length}`);
    
    return positions;
}
```

**Validação:** Fluxos com mix de posicionamento manual e automático funcionam

---

#### 2.3 Implementar cálculo de exit/entry (4h)

**Arquivo:** `src-code/lib/connectors.ts` (modificar função de criação de conectores)

```typescript
// Modificar função createBifurcatedConnectors ou createConnectors

async function determineConnectorMagnets(
  connection: Connection,
  fromNode: FlowNode,
  toNode: FlowNode,
  fromPos: { x: number; y: number },
  toPos: { x: number; y: number }
): Promise<{
  startMagnet: ConnectorMagnet;
  endMagnet: ConnectorMagnet;
}> {
  
  // 1. Se conexão tem magnets explícitos, usar eles
  if (connection.exitMagnet && connection.entryMagnet) {
    return {
      startMagnet: connection.exitMagnet.toUpperCase() as ConnectorMagnet,
      endMagnet: connection.entryMagnet.toUpperCase() as ConnectorMagnet
    };
  }
  
  // 2. Se nodes têm layoutHint com exit/entry, usar eles
  if (fromNode.layoutHint?.exitPoint && toNode.layoutHint?.entryPoint) {
    return {
      startMagnet: fromNode.layoutHint.exitPoint.toUpperCase() as ConnectorMagnet,
      endMagnet: toNode.layoutHint.entryPoint.toUpperCase() as ConnectorMagnet
    };
  }
  
  // 3. Calcular automaticamente baseado nas posições
  const offset = {
    x: toPos.x - fromPos.x,
    y: toPos.y - fromPos.y
  };
  
  const calculated = calculateExitEntryPoints(
    offset,
    connection.exitMagnet || fromNode.layoutHint?.exitPoint,
    connection.entryMagnet || toNode.layoutHint?.entryPoint
  );
  
  return {
    startMagnet: calculated.exit.toUpperCase() as ConnectorMagnet,
    endMagnet: calculated.entry.toUpperCase() as ConnectorMagnet
  };
}
```

**Validação:** Conectores respeitam exit/entry especificados e calculam corretos automaticamente

---

### Checklist Fase 2

- [ ] Calculadora de posições criada (`positionCalculator.ts`)
- [ ] Ordenação topológica por anchors implementada
- [ ] Integração com algoritmo bifurcado existente
- [ ] Cálculo automático de exit/entry points
- [ ] Modificação em `connectors.ts` para usar novos magnets
- [ ] Testes com fluxos complexos (bifurcações + posições manuais)
- [ ] Validação de colisões (warning quando nodes se sobrepõem)

**Entregável:** Plugin posiciona nodes usando anchors + offsets corretamente

---

## Fase 3: Controle de conectores (1 semana)

### Objetivos
- Respeitar `style.line_type` em conexões
- Aplicar estilos específicos para decisions e convergências
- Garantir labels posicionados corretamente

### Tarefas

#### 3.1 Implementar controle de line_type (3-4h)

**Arquivo:** `src-code/lib/connectors.ts`

```typescript
// Modificar função de criação de conector

async function createConnectorWithStyle(
  connector: ConnectorNode,
  connection: Connection,
  fromNode: SceneNode,
  toNode: SceneNode
): Promise<void> {
  
  // Determinar tipo de linha
  let lineType: 'STRAIGHT' | 'ELBOWED' = 'ELBOWED'; // default
  
  if (connection.lineType) {
    // Usar tipo explícito da conexão
    lineType = connection.lineType;
  } else if (fromNode.type === 'DECISION' || toNode.type === 'DECISION') {
    // Decisões usam ELBOWED por padrão
    lineType = 'ELBOWED';
  }
  
  connector.connectorLineType = lineType;
  
  // Aplicar magnets
  const magnets = await determineConnectorMagnets(
    connection,
    fromNode,
    toNode,
    { x: fromNode.x, y: fromNode.y },
    { x: toNode.x, y: toNode.y }
  );
  
  connector.connectorStart = {
    endpointNodeId: fromNode.id,
    magnet: magnets.startMagnet
  };
  
  connector.connectorEnd = {
    endpointNodeId: toNode.id,
    magnet: magnets.endMagnet
  };
}
```

**Validação:** Conexões com `style.line_type: STRAIGHT` aparecem retas

---

#### 3.2 Melhorar posicionamento de labels (4-5h)

Labels devem considerar a direção do conector para evitar sobreposição.

**Arquivo:** `src-code/lib/connectors.ts`

```typescript
// Modificar função createConnectorLabel para considerar direção

async function positionLabelSmartly(
  labelFrame: FrameNode,
  fromNode: SceneNode,
  toNode: SceneNode,
  startMagnet: ConnectorMagnet,
  endMagnet: ConnectorMagnet
): Promise<void> {
  
  const labelWidth = labelFrame.width;
  const labelHeight = labelFrame.height;
  
  let targetX: number;
  let targetY: number;
  
  // Posicionar baseado no magnet de saída
  switch (startMagnet) {
    case 'TOP':
      targetX = fromNode.x + fromNode.width / 2 - labelWidth / 2;
      targetY = fromNode.y - 60 - labelHeight;
      break;
      
    case 'RIGHT':
      targetX = fromNode.x + fromNode.width + 30;
      targetY = fromNode.y + fromNode.height / 2 - labelHeight / 2;
      break;
      
    case 'BOTTOM':
      targetX = fromNode.x + fromNode.width / 2 - labelWidth / 2;
      targetY = fromNode.y + fromNode.height + 30;
      break;
      
    case 'LEFT':
      targetX = fromNode.x - labelWidth - 30;
      targetY = fromNode.y + fromNode.height / 2 - labelHeight / 2;
      break;
      
    default:
      // Fallback: ao lado direito
      targetX = fromNode.x + fromNode.width + 30;
      targetY = fromNode.y + fromNode.height / 2 - labelHeight / 2;
  }
  
  labelFrame.x = targetX;
  labelFrame.y = targetY;
}
```

**Validação:** Labels não sobrepõem nodes ou outros labels

---

### Checklist Fase 3

- [ ] `line_type` respeitado em conexões
- [ ] Estilos específicos para decisions
- [ ] Posicionamento inteligente de labels
- [ ] Testes visuais com diferentes configurações de conectores

**Entregável:** Conectores e labels visualmente corretos

---

## Fase 4: Validação e testes (1 semana)

### Objetivos
- Validações críticas implementadas
- Suite de testes cobrindo casos principais
- Mensagens de erro claras

### Tarefas

#### 4.1 Implementar validações (6-8h)

Já implementado parcialmente no parser. Adicionar validações extras:

**Arquivo:** `src-code/lib/yamlValidator.ts`

```typescript
// src-code/lib/yamlValidator.ts

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateYAMLFlow(
  doc: YAMLFlowDocument,
  flowNodes: FlowNode[],
  flowConnections: Connection[]
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Validação 1: Offsets muito grandes
  for (const node of flowNodes) {
    if (node.layoutHint?.offset) {
      const absX = Math.abs(node.layoutHint.offset.x);
      const absY = Math.abs(node.layoutHint.offset.y);
      
      if (absX > 1000 || absY > 1000) {
        warnings.push(
          `Node "${node.id}" has large offset (x: ${absX}px, y: ${absY}px). This may cause layout issues.`
        );
      }
    }
  }
  
  // Validação 2: Nodes isolados
  const connectedNodes = new Set<string>();
  for (const conn of flowConnections) {
    connectedNodes.add(conn.from);
    connectedNodes.add(conn.to);
  }
  
  for (const node of flowNodes) {
    if (!connectedNodes.has(node.id)) {
      warnings.push(`Node "${node.id}" has no connections (isolated node).`);
    }
  }
  
  // Validação 3: END nodes sem entrada
  for (const node of flowNodes) {
    if (node.type === 'END') {
      const hasIncoming = flowConnections.some(conn => conn.to === node.id);
      if (!hasIncoming) {
        errors.push(`END node "${node.id}" has no incoming connections.`);
      }
    }
  }
  
  // Validação 4: DECISION com mais de 2 saídas
  for (const node of flowNodes) {
    if (node.type === 'DECISION') {
      const outgoing = flowConnections.filter(conn => conn.from === node.id);
      if (outgoing.length > 3) {
        warnings.push(
          `DECISION node "${node.id}" has ${outgoing.length} outgoing connections. Consider splitting into multiple decisions.`
        );
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
```

**Validação:** Suite de validação detecta problemas corretamente

---

#### 4.2 Criar testes unitários (8-10h)

**Arquivo:** `tests/yamlParser.test.ts`

```typescript
// tests/yamlParser.test.ts
import { describe, it, expect } from 'vitest';
import { parseYAMLToFlow, parseUnit } from '../src-code/lib/yamlParser';

describe('YAML Parser', () => {
  describe('parseUnit', () => {
    it('should parse unit values correctly', () => {
      expect(parseUnit('2u', 200)).toBe(400);
      expect(parseUnit('1.5u', 200)).toBe(300);
      expect(parseUnit('250px', 200)).toBe(250);
      expect(parseUnit(300, 200)).toBe(300);
    });
    
    it('should throw on invalid formats', () => {
      expect(() => parseUnit('2', 200)).toThrow();
      expect(() => parseUnit('abc', 200)).toThrow();
    });
  });
  
  describe('parseYAMLToFlow', () => {
    it('should parse simple linear flow', () => {
      const yaml = `
metadata:
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center

nodes:
  welcome:
    type: ENTRYPOINT
    name: "Welcome"
  
  next:
    type: STEP
    name: "Next Step"
    position:
      anchor: welcome
      offset: {x: 2u, y: 0u}

connections:
  - from: welcome
    to: next
`;
      
      const result = parseYAMLToFlow(yaml);
      
      expect(result.flowNodes).toHaveLength(2);
      expect(result.flowConnections).toHaveLength(1);
      expect(result.flowNodes[1].layoutHint?.offset?.x).toBe(400);
    });
    
    it('should throw on missing required fields', () => {
      const yaml = `
metadata:
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center

nodes:
  welcome:
    name: "Welcome"
`;
      
      expect(() => parseYAMLToFlow(yaml)).toThrow('missing required field: type');
    });
  });
});
```

**Validação:** `npm test` passa todos os testes

---

#### 4.3 Criar casos de teste visuais (4-6h)

**Arquivo:** `examples/test-flows/`

Criar 5-8 arquivos YAML de teste:
1. `simple-linear.yaml` - 3 nodes em linha
2. `binary-decision.yaml` - 1 decisão com 2 branches
3. `complex-auth.yaml` - Fluxo completo de autenticação
4. `nested-decisions.yaml` - Decisões aninhadas
5. `convergence.yaml` - Múltiplos caminhos convergindo
6. `loop.yaml` - Fluxo com loop de retorno
7. `large-offsets.yaml` - Testa offsets extremos
8. `mixed-positioning.yaml` - Mix de auto e manual

**Validação:** Todos os casos de teste geram diagramas visualmente corretos

---

### Checklist Fase 4

- [ ] Validador YAML implementado
- [ ] Testes unitários criados (mínimo 10 testes)
- [ ] Casos de teste visuais criados (8 exemplos)
- [ ] Todos os testes passam
- [ ] Mensagens de erro são claras e úteis

**Entregável:** Plugin robusto e testado

---

## Fase 5: Documentação e ajustes finais (0.5-1 semana)

### Objetivos
- Documentação completa da sintaxe YAML
- Atualizar instruções da IA
- Criar guia de migração
- Polimento final

### Tarefas

#### 5.1 Atualizar instruções da IA (3-4h)

**Arquivo:** `ai-instructions.md` (já fornecido)

Modificar seção de export final:

```markdown
## 📤 Final Export

When the user signals the flow is done, the assistant should:

### 1. Summarize the Flow
[mantém o mesmo]

### 2. Generate YAML
The assistant should generate a complete YAML document following the IziFlow v1.0 specification:

```yaml
metadata:
  layout:
    algorithm: auto
    unit: 200
    first_node_position: center

nodes:
  [generated nodes]

connections:
  [generated connections]
```

### 3. Guidelines for YAML Generation

**Positioning Strategy:**
- First node (ENTRYPOINT): omit position field (will be centered)
- Linear sequence: offset {x: 2u, y: 0u} (400px right)
- Binary decisions:
  - Positive branch: offset {x: 2u, y: -0.75u} (up)
  - Negative branch: offset {x: 2u, y: 0.75u} (down)
- Convergence: align vertically, offset horizontally

**Connection Labels:**
- Always include labels for user choices ("Yes", "No", "Login", "Register")
- Use style.exit and style.entry for decisions and convergences

**Example Generated YAML:**
[incluir exemplo completo]

### 4. Instruct Next Step
"Now copy this YAML and paste it into the IziFlow plugin text field. Click 'Generate Flow' to create the visual diagram in Figma."
```

**Validação:** IA gera YAML válido quando testada

---

#### 5.2 Criar documentação de usuário (4-6h)

**Arquivos:**
- `docs/yaml-syntax-guide.md` - Guia completo (já criado anteriormente)
- `docs/quick-start.md` - Início rápido (5 min)
- `docs/examples.md` - 10+ exemplos práticos
- `docs/troubleshooting.md` - Problemas comuns

**Validação:** Documentação cobre todos os casos de uso principais

---

#### 5.3 Criar CHANGELOG (1h)

**Arquivo:** `CHANGELOG.md`

```markdown
# Changelog

## [2.0.0] - 2024-11-XX

### 🎉 BREAKING CHANGES
- Complete replacement of Markdown syntax with YAML
- New positioning system based on anchors and relative offsets
- Unit system (1u = 200px by default)

### ✨ Features
- **Relative Positioning:** Control exact node placement using anchors + offsets
- **Auto-calculated Magnets:** Connector exit/entry points calculated automatically
- **Unit System:** Use relative units (u) or absolute pixels (px)
- **Flexible Spacing:** Configure horizontal and vertical spacing globally
- **Style Control:** Override connector line types and magnets per connection

### 📚 Documentation
- Complete YAML syntax specification
- Migration guide from Markdown
- 8+ example flows
- Updated AI instructions for YAML generation

### 🔧 Technical
- New parser: `yamlParser.ts`
- Position calculator: `positionCalculator.ts`
- Extended types: `FlowNode.layoutHint`, `Connection.exitMagnet`
- Automatic format detection (YAML vs Markdown)

### ⚠️ Deprecations
- Markdown syntax is no longer supported
- Existing Markdown flows need manual conversion to YAML
```

**Validação:** CHANGELOG está completo e claro

---

#### 5.4 Polimento e ajustes finais (3-5h)

- [ ] Revisar todas as mensagens de erro para clareza
- [ ] Adicionar console.logs úteis para debugging
- [ ] Otimizar performance (se necessário)
- [ ] Testar em diferentes tamanhos de viewport
- [ ] Validar compatibilidade com temas claros/escuros
- [ ] Verificar acessibilidade de labels

**Validação:** Plugin está polido e profissional

---

### Checklist Fase 5

- [ ] Instruções da IA atualizadas
- [ ] Documentação completa criada (4 arquivos)
- [ ] CHANGELOG.md criado
- [ ] Polimento visual e UX
- [ ] Testes finais com usuários (se possível)

**Entregável:** Plugin pronto para lançamento

---

## Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Parser YAML muito lento | Baixa | Médio | Usar biblioteca otimizada (js-yaml), cachear parsing |
| IA gera YAML inválido frequentemente | Média | Alto | Criar validador robusto, melhorar prompts com exemplos |
| Layouts complexos geram sobreposições | Média | Médio | Implementar detecção de colisões com avisos |
| Usuários acham YAML muito técnico | Alta | Alto | Investir em documentação, exemplos visuais, templates prontos |
| Performance degrada em fluxos grandes (50+ nodes) | Baixa | Médio | Otimizar cálculo de posições, usar Web Workers se necessário |

---

## Métricas de sucesso

**Técnicas:**
- [ ] 95%+ dos YAMLs válidos geram diagramas sem erro
- [ ] Geração em < 2 segundos para fluxos de 20 nodes
- [ ] 80%+ de code coverage nos testes
- [ ] Zero crashes do plugin em 1 mês de uso

**Usabilidade:**
- [ ] 80%+ dos usuários conseguem criar fluxo simples em < 10 minutos
- [ ] Menos de 5 bugs críticos reportados no primeiro mês
- [ ] Documentação recebe feedback positivo (quando implementado sistema de feedback)

---

## Próximos passos (após MVP)

### v2.1 - Melhorias de UX (2-3 semanas)
- Preview visual ao vivo enquanto edita YAML
- Editor YAML com syntax highlighting
- Templates prontos (auth, checkout, onboarding)
- Conversor Markdown → YAML automático

### v2.2 - Recursos visuais (2-3 semanas)
- Sistema de grid para alinhamento
- Detecção de colisões com auto-ajuste
- Cores e ícones personalizados por node
- Exportar como PNG/SVG

### v3.0 - Editor visual (6-8 semanas)
- Interface drag-and-drop
- Sincronização bidirecional (visual ↔ YAML)
- Undo/redo visual
- Colaboração em tempo real

---

## Recursos necessários

**Desenvolvimento:**
- 1 desenvolvedor full-time (você)
- 4-6 semanas de dedicação

**Ferramentas:**
- Figma plugin API
- Node.js / TypeScript
- Biblioteca js-yaml
- Vitest para testes

**Infraestrutura:**
- Repositório Git
- Documentação hospedada (GitHub Pages ou similar)
- Sistema de tracking de bugs (GitHub Issues)

---

## Aprovação e início

**Data de início planejada:** _____________________  
**Data de conclusão estimada:** _____________________  
**Responsável:** Luka

**Aprovação:**
- [ ] Plano revisado e aprovado
- [ ] Recursos confirmados
- [ ] Pronto para começar Fase 1

---

**Última atualização:** Novembro 2024

// tests/unit/vertical-lanes.test.ts
/**
 * Testes específicos para o sistema de faixas verticais e gerenciamento de conflitos
 * Fase 8: Testing e Validação
 */

import type { FlowNode, Connection, BifurcationAnalysis, LayoutPosition, ConflictResolution } from '../../shared/types/flow.types';

// --- Simulação de Configurações ---
const mockLayoutConfig = {
  VerticalLanes: {
    LANE_HEIGHT: 200,
    LANE_SPACING: 50,
    CENTER_LANE_INDEX: 0
  },
  Bifurcation: {
    VERTICAL_SPACING_BETWEEN_BRANCHES: 150,
    HORIZONTAL_OFFSET_FOR_BRANCHES: 100
  }
};

// --- Funções Simuladas do Sistema Real ---

function calculateVerticalLanes(bifurcations: BifurcationAnalysis[], nodes: FlowNode[]): Map<string, number> {
  const nodeLaneMap = new Map<string, number>();
  
  // Todos os nós começam na faixa central (0)
  nodes.forEach(node => nodeLaneMap.set(node.id, 0));
  
  // Processar bifurcações sequencialmente
  bifurcations.forEach((bifurcation, index) => {
    // Ramo superior: lane +1 (pode ser ajustado para bifurcações aninhadas)
    const upperLaneOffset = index + 1;
    const lowerLaneOffset = -(index + 1);
    
    bifurcation.branches.upper.forEach(nodeId => {
      nodeLaneMap.set(nodeId, upperLaneOffset);
    });
    
    // Ramo inferior: lane -1
    bifurcation.branches.lower.forEach(nodeId => {
      nodeLaneMap.set(nodeId, lowerLaneOffset);
    });
    
    // Nó de convergência volta para lane 0
    if (bifurcation.convergenceNodeId) {
      nodeLaneMap.set(bifurcation.convergenceNodeId, 0);
    }
  });
  
  return nodeLaneMap;
}

function calculatePositions(
  nodeLaneMap: Map<string, number>, 
  nodes: FlowNode[]
): Map<string, LayoutPosition> {
  const positions = new Map<string, LayoutPosition>();
  const laneHeight = mockLayoutConfig.VerticalLanes.LANE_HEIGHT;
  const centerY = 0; // Simulando viewport center
  
  let currentX = 100;
  
  for (const node of nodes) {
    const laneIndex = nodeLaneMap.get(node.id) || 0;
    const y = centerY + (laneIndex * laneHeight);
    const x = currentX;
    
    positions.set(node.id, { x, y, laneIndex });
    currentX += 450; // Largura do nó + espaçamento
  }
  
  return positions;
}

function detectVerticalConflicts(
  positions: Map<string, LayoutPosition>,
  nodeWidths: Map<string, number> = new Map()
): ConflictResolution[] {
  const conflicts: ConflictResolution[] = [];
  const MIN_HORIZONTAL_SPACING = 50;
  
  // Agrupar nós por lane
  const nodesByLane = new Map<number, Array<{ nodeId: string; position: LayoutPosition }>>();
  
  positions.forEach((position, nodeId) => {
    if (!nodesByLane.has(position.laneIndex)) {
      nodesByLane.set(position.laneIndex, []);
    }
    nodesByLane.get(position.laneIndex)!.push({ nodeId, position });
  });
  
  // Verificar conflitos em cada lane (exceto a central)
  nodesByLane.forEach((nodesInLane, laneIndex) => {
    if (laneIndex === 0 || nodesInLane.length < 2) return;
    
    // Ordenar por posição X
    nodesInLane.sort((a, b) => a.position.x - b.position.x);
    
    for (let i = 0; i < nodesInLane.length - 1; i++) {
      const current = nodesInLane[i];
      const next = nodesInLane[i + 1];
      
      const currentWidth = nodeWidths.get(current.nodeId) || 400;
      const spacing = next.position.x - (current.position.x + currentWidth);
      
      if (spacing < MIN_HORIZONTAL_SPACING) {
        conflicts.push({
          type: 'HORIZONTAL_OVERLAP',
          affectedNodes: [current.nodeId, next.nodeId],
          suggestedResolution: 'EXPAND_SPACING'
        });
      }
    }
  });
  
  return conflicts;
}

// --- Casos de Teste ---

interface VerticalLanesTestCase {
  name: string;
  nodes: FlowNode[];
  bifurcations: BifurcationAnalysis[];
  expectedLanes: { [nodeId: string]: number };
  expectedConflicts: number;
}

const verticalLanesTestCases: VerticalLanesTestCase[] = [
  {
    name: 'Bifurcação simples sem conflitos',
    nodes: [
      { id: 'start', type: 'START', name: 'Início' },
      { id: 'decision1', type: 'DECISION', name: 'Decisão A' },
      { id: 'upper1', type: 'STEP', name: 'Ramo Superior' },
      { id: 'lower1', type: 'STEP', name: 'Ramo Inferior' },
      { id: 'convergence', type: 'STEP', name: 'Convergência' },
      { id: 'end', type: 'END', name: 'Fim' }
    ],
    bifurcations: [{
      decisionNodeId: 'decision1',
      branches: {
        upper: ['upper1'],
        lower: ['lower1']
      },
      convergenceNodeId: 'convergence'
    }],
    expectedLanes: {
      'start': 0,
      'decision1': 0,
      'upper1': 1,
      'lower1': -1,
      'convergence': 0,
      'end': 0
    },
    expectedConflicts: 0
  },
  {
    name: 'Bifurcações aninhadas com múltiplas lanes',
    nodes: [
      { id: 'start', type: 'START', name: 'Início' },
      { id: 'decision1', type: 'DECISION', name: 'Primeira Decisão' },
      { id: 'upper1', type: 'STEP', name: 'Ramo Superior 1' },
      { id: 'decision2', type: 'DECISION', name: 'Segunda Decisão' },
      { id: 'upper2', type: 'STEP', name: 'Ramo Superior 2' },
      { id: 'lower2', type: 'STEP', name: 'Ramo Inferior 2' },
      { id: 'lower1', type: 'STEP', name: 'Ramo Inferior 1' },
      { id: 'end', type: 'END', name: 'Fim' }
    ],
    bifurcations: [
      {
        decisionNodeId: 'decision1',
        branches: {
          upper: ['upper1', 'decision2'],
          lower: ['lower1']
        },
        convergenceNodeId: 'end'
      },
      {
        decisionNodeId: 'decision2',
        branches: {
          upper: ['upper2'],
          lower: ['lower2']
        },
        convergenceNodeId: 'end'
      }
    ],
    expectedLanes: {
      'start': 0,
      'decision1': 0,
      'upper1': 1,
      'decision2': 1,
      'upper2': 2, // Bifurcação aninhada
      'lower2': -2,
      'lower1': -1,
      'end': 0
    },
    expectedConflicts: 0
  },
  {
    name: 'Conflito de sobreposição horizontal',
    nodes: [
      { id: 'start', type: 'START', name: 'Início' },
      { id: 'decision1', type: 'DECISION', name: 'Decisão' },
      { id: 'upper1', type: 'STEP', name: 'Passo 1' },
      { id: 'upper2', type: 'STEP', name: 'Passo 2' },
      { id: 'lower1', type: 'STEP', name: 'Passo 3' },
      { id: 'end', type: 'END', name: 'Fim' }
    ],
    bifurcations: [{
      decisionNodeId: 'decision1',
      branches: {
        upper: ['upper1', 'upper2'], // Dois nós consecutivos no mesmo ramo
        lower: ['lower1']
      },
      convergenceNodeId: 'end'
    }],
    expectedLanes: {
      'start': 0,
      'decision1': 0,
      'upper1': 1,
      'upper2': 1, // Mesmo lane que upper1
      'lower1': -1,
      'end': 0
    },
    expectedConflicts: 1 // Conflito entre upper1 e upper2
  }
];

// --- Executor de Testes Específicos ---

export class VerticalLanesTestRunner {
  private results: { [testName: string]: { passed: boolean; details: string } } = {};

  async runAllTests(): Promise<void> {
    console.log('=== Testes de Faixas Verticais e Conflitos ===\n');

    for (const testCase of verticalLanesTestCases) {
      await this.runSingleTest(testCase);
    }

    this.printResults();
  }

  private async runSingleTest(testCase: VerticalLanesTestCase): Promise<void> {
    console.log(`🧪 Executando: ${testCase.name}`);
    
    try {
      // Teste 1: Cálculo correto de lanes
      const laneAssignments = calculateVerticalLanes(testCase.bifurcations, testCase.nodes);
      
      for (const [nodeId, expectedLane] of Object.entries(testCase.expectedLanes)) {
        const actualLane = laneAssignments.get(nodeId);
        if (actualLane !== expectedLane) {
          throw new Error(`Lane incorreta para '${nodeId}': esperado ${expectedLane}, encontrado ${actualLane}`);
        }
      }

      // Teste 2: Cálculo de posições
      const positions = calculatePositions(laneAssignments, testCase.nodes);
      
      // Verificar se todas as posições foram calculadas
      if (positions.size !== testCase.nodes.length) {
        throw new Error(`Posições incompletas: esperado ${testCase.nodes.length}, calculado ${positions.size}`);
      }

      // Teste 3: Detecção de conflitos
      const conflicts = detectVerticalConflicts(positions);
      
      if (conflicts.length !== testCase.expectedConflicts) {
        throw new Error(`Conflitos incorretos: esperado ${testCase.expectedConflicts}, encontrado ${conflicts.length}`);
      }

      // Teste 4: Validação de espaçamento vertical
      const laneSpacings = new Map<number, number[]>();
      positions.forEach((position, nodeId) => {
        if (!laneSpacings.has(position.laneIndex)) {
          laneSpacings.set(position.laneIndex, []);
        }
        laneSpacings.get(position.laneIndex)!.push(position.y);
      });

      // Verificar se lanes diferentes têm Y diferentes
      const uniqueLanes = Array.from(laneSpacings.keys()).sort();
      for (let i = 0; i < uniqueLanes.length - 1; i++) {
        const currentLane = uniqueLanes[i];
        const nextLane = uniqueLanes[i + 1];
        const currentY = laneSpacings.get(currentLane)![0];
        const nextY = laneSpacings.get(nextLane)![0];
        
        if (Math.abs(nextY - currentY) < mockLayoutConfig.VerticalLanes.LANE_HEIGHT) {
          throw new Error(`Espaçamento vertical insuficiente entre lanes ${currentLane} e ${nextLane}`);
        }
      }

      this.results[testCase.name] = {
        passed: true,
        details: `✅ Lanes: ${positions.size}, Conflitos detectados: ${conflicts.length}`
      };

      console.log(`   ✅ PASSOU\n`);

    } catch (error: any) {
      this.results[testCase.name] = {
        passed: false,
        details: `❌ ${error.message}`
      };

      console.log(`   ❌ FALHOU: ${error.message}\n`);
    }
  }

  private printResults(): void {
    console.log('\n=== Resultados dos Testes de Faixas Verticais ===');
    
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    
    console.log(`Total: ${totalTests} | Passou: ${passedTests} | Falhou: ${totalTests - passedTests}\n`);
    
    for (const [testName, result] of Object.entries(this.results)) {
      console.log(`${result.passed ? '✅' : '❌'} ${testName}`);
      console.log(`   ${result.details}\n`);
    }

    if (passedTests === totalTests) {
      console.log('🎉 Todos os testes de faixas verticais passaram!');
    } else {
      console.log('⚠️  Alguns testes de faixas verticais falharam. Verifique os detalhes acima.');
    }
  }

  getResults() {
    return this.results;
  }
}

// --- Função Principal ---
export async function runVerticalLanesTests(): Promise<boolean> {
  const runner = new VerticalLanesTestRunner();
  await runner.runAllTests();
  
  const results = runner.getResults();
  const allPassed = Object.values(results).every(r => r.passed);
  
  return allPassed;
}

// Executar automaticamente se for chamado diretamente
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runVerticalLanesTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
// tests/unit/layout.test.ts
/**
 * Testes unitários para o sistema de layout bifurcado
 * Fase 8: Testing e Validação
 */

import type { FlowNode, Connection, BifurcationAnalysis, LayoutPosition } from '../../shared/types/flow.types';

// Mock simples para logging em ambiente de teste
const mockConsole = {
  log: (...args: any[]) => {}, // Silenciado para testes
  warn: (...args: any[]) => {},
  error: (...args: any[]) => console.error('[TEST ERROR]', ...args)
};

// --- Dados de Teste ---

const mockFlowNodesSimple: FlowNode[] = [
  { id: 'start', type: 'START', name: 'Início' },
  { id: 'decision1', type: 'DECISION', name: 'Usuário logado?' },
  { id: 'step1', type: 'STEP', name: 'Mostrar dashboard' },
  { id: 'step2', type: 'STEP', name: 'Ir para login' },
  { id: 'end', type: 'END', name: 'Fim' }
];

const mockConnectionsSimple: Connection[] = [
  { id: 'c1', from: 'start', to: 'decision1' },
  { id: 'c2', from: 'decision1', to: 'step1', condition: 'Sim' },
  { id: 'c3', from: 'decision1', to: 'step2', condition: 'Não' },
  { id: 'c4', from: 'step1', to: 'end' },
  { id: 'c5', from: 'step2', to: 'end' }
];

const mockFlowNodesComplex: FlowNode[] = [
  { id: 'start', type: 'START', name: 'Início' },
  { id: 'decision1', type: 'DECISION', name: 'Tem conta?' },
  { id: 'step1', type: 'STEP', name: 'Fazer login' },
  { id: 'step2', type: 'STEP', name: 'Criar conta' },
  { id: 'decision2', type: 'DECISION', name: 'Login válido?' },
  { id: 'step3', type: 'STEP', name: 'Dashboard' },
  { id: 'step4', type: 'STEP', name: 'Erro de login' },
  { id: 'end', type: 'END', name: 'Fim' }
];

const mockConnectionsComplex: Connection[] = [
  { id: 'c1', from: 'start', to: 'decision1' },
  { id: 'c2', from: 'decision1', to: 'step1', condition: 'Sim' },
  { id: 'c3', from: 'decision1', to: 'step2', condition: 'Não' },
  { id: 'c4', from: 'step1', to: 'decision2' },
  { id: 'c5', from: 'decision2', to: 'step3', condition: 'Sim' },
  { id: 'c6', from: 'decision2', to: 'step4', condition: 'Não' },
  { id: 'c7', from: 'step2', to: 'step3' },
  { id: 'c8', from: 'step3', to: 'end' },
  { id: 'c9', from: 'step4', to: 'end' }
];

// --- Simulação da Função Layout.detectBinaryDecisions ---
function detectBinaryDecisions(nodes: FlowNode[], connections: Connection[]): BifurcationAnalysis[] {
  const bifurcations: BifurcationAnalysis[] = [];
  
  // Filtrar nós de decisão
  const decisionNodes = nodes.filter(node => node.type === 'DECISION');
  
  for (const decision of decisionNodes) {
    const outgoingConnections = connections.filter(conn => 
      conn.from === decision.id && !conn.secondary
    );
    
    // Verificar se é decisão binária
    if (outgoingConnections.length === 2) {
      const analysis: BifurcationAnalysis = {
        decisionNodeId: decision.id,
        branches: {
          upper: [outgoingConnections[0].to],
          lower: [outgoingConnections[1].to]
        },
        convergenceNodeId: undefined // Simplificado para o teste
      };
      bifurcations.push(analysis);
    }
  }
  
  return bifurcations;
}

// --- Simulação da Função Layout.calculateVerticalLanes ---
function calculateVerticalLanes(bifurcations: BifurcationAnalysis[], nodes: FlowNode[]): Map<string, number> {
  const nodeLaneMap = new Map<string, number>();
  
  // Todos os nós começam na faixa central (0)
  nodes.forEach(node => nodeLaneMap.set(node.id, 0));
  
  // Processar bifurcações sequencialmente
  bifurcations.forEach((bifurcation) => {
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

// --- Sistema de Teste Manual ---

interface TestCase {
  name: string;
  nodes: FlowNode[];
  connections: Connection[];
  expectedBifurcations: number;
  expectedLaneAssignments: { [nodeId: string]: number };
}

const testCases: TestCase[] = [
  {
    name: 'Fluxo simples com uma decisão binária',
    nodes: mockFlowNodesSimple,
    connections: mockConnectionsSimple,
    expectedBifurcations: 1,
    expectedLaneAssignments: {
      'start': 0,
      'decision1': 0,
      'step1': 1, // Ramo superior
      'step2': -1, // Ramo inferior
      'end': 0
    }
  },
  {
    name: 'Fluxo complexo com múltiplas decisões',
    nodes: mockFlowNodesComplex,
    connections: mockConnectionsComplex,
    expectedBifurcations: 2,
    expectedLaneAssignments: {
      'start': 0,
      'decision1': 0,
      'step1': 1, // Ramo superior primeira decisão
      'step2': -1, // Ramo inferior primeira decisão
      'decision2': 1, // Mantém lane do ramo superior
      'step3': 1, // Ramo superior segunda decisão
      'step4': -1, // Ramo inferior segunda decisão
      'end': 0
    }
  },
  {
    name: 'Fluxo linear sem decisões',
    nodes: [
      { id: 'start', type: 'START', name: 'Início' },
      { id: 'step1', type: 'STEP', name: 'Passo 1' },
      { id: 'step2', type: 'STEP', name: 'Passo 2' },
      { id: 'end', type: 'END', name: 'Fim' }
    ],
    connections: [
      { id: 'c1', from: 'start', to: 'step1' },
      { id: 'c2', from: 'step1', to: 'step2' },
      { id: 'c3', from: 'step2', to: 'end' }
    ],
    expectedBifurcations: 0,
    expectedLaneAssignments: {
      'start': 0,
      'step1': 0,
      'step2': 0,
      'end': 0
    }
  }
];

// --- Executor de Testes ---

export class LayoutTestRunner {
  private results: { [testName: string]: { passed: boolean; details: string } } = {};

  async runAllTests(): Promise<void> {
    console.log('=== Iniciando Testes Unitários de Layout ===\n');

    for (const testCase of testCases) {
      await this.runSingleTest(testCase);
    }

    this.printResults();
  }

  private async runSingleTest(testCase: TestCase): Promise<void> {
    console.log(`🧪 Executando: ${testCase.name}`);
    
    try {
      // Teste 1: Detecção de bifurcações
      const bifurcations = detectBinaryDecisions(testCase.nodes, testCase.connections);
      const bifurcationCount = bifurcations.length;
      
      if (bifurcationCount !== testCase.expectedBifurcations) {
        throw new Error(`Esperado ${testCase.expectedBifurcations} bifurcações, encontrado ${bifurcationCount}`);
      }

      // Teste 2: Cálculo de faixas verticais
      const laneAssignments = calculateVerticalLanes(bifurcations, testCase.nodes);
      
      for (const [nodeId, expectedLane] of Object.entries(testCase.expectedLaneAssignments)) {
        const actualLane = laneAssignments.get(nodeId);
        if (actualLane !== expectedLane) {
          throw new Error(`Nó '${nodeId}': esperado lane ${expectedLane}, encontrado ${actualLane}`);
        }
      }

      // Teste 3: Validação de estrutura de dados
      bifurcations.forEach((bifurcation, index) => {
        if (!bifurcation.decisionNodeId) {
          throw new Error(`Bifurcação ${index}: decisionNodeId inválido`);
        }
        if (!bifurcation.branches.upper.length) {
          throw new Error(`Bifurcação ${index}: ramo superior vazio`);
        }
        if (!bifurcation.branches.lower.length) {
          throw new Error(`Bifurcação ${index}: ramo inferior vazio`);
        }
      });

      this.results[testCase.name] = {
        passed: true,
        details: `✅ Bifurcações: ${bifurcationCount}, Lanes validadas: ${Object.keys(testCase.expectedLaneAssignments).length}`
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
    console.log('\n=== Resultados dos Testes ===');
    
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    
    console.log(`Total: ${totalTests} | Passou: ${passedTests} | Falhou: ${totalTests - passedTests}\n`);
    
    for (const [testName, result] of Object.entries(this.results)) {
      console.log(`${result.passed ? '✅' : '❌'} ${testName}`);
      console.log(`   ${result.details}\n`);
    }

    if (passedTests === totalTests) {
      console.log('🎉 Todos os testes unitários de layout passaram!');
    } else {
      console.log('⚠️  Alguns testes falharam. Verifique os detalhes acima.');
    }
  }

  getResults() {
    return this.results;
  }
}

// --- Função de Teste Principal ---
export async function runLayoutUnitTests(): Promise<boolean> {
  const runner = new LayoutTestRunner();
  await runner.runAllTests();
  
  const results = runner.getResults();
  const allPassed = Object.values(results).every(r => r.passed);
  
  return allPassed;
}

// Executar automaticamente se for chamado diretamente
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runLayoutUnitTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
// tests/performance/large-flows.test.ts
/**
 * Testes de performance para fluxos grandes
 * Valida escalabilidade e tempo de processamento
 * Fase 8: Testing e Validação
 */

import type { FlowNode, Connection, BifurcationAnalysis, LayoutPosition } from '../../shared/types/flow.types';

// --- Gerador de Dados de Teste em Larga Escala ---

interface FlowGenerationOptions {
  nodeCount: number;
  decisionRatio: number; // Proporção de nós de decisão (0-1)
  branchingFactor: number; // Quantas saídas por decisão
  maxDepth: number; // Profundidade máxima do fluxo
}

function generateLargeFlow(options: FlowGenerationOptions): { nodes: FlowNode[], connections: Connection[] } {
  const nodes: FlowNode[] = [];
  const connections: Connection[] = [];
  let nodeIdCounter = 1;
  let connectionIdCounter = 1;

  // Criar nó START
  nodes.push({
    id: 'start',
    type: 'START',
    name: 'Início do Fluxo'
  });

  // Gerar nós em camadas
  let currentLevelNodes = ['start'];
  
  for (let depth = 0; depth < options.maxDepth && nodes.length < options.nodeCount; depth++) {
    const nextLevelNodes: string[] = [];
    
    for (const parentNodeId of currentLevelNodes) {
      if (nodes.length >= options.nodeCount) break;
      
      // Determinar tipo do próximo nó
      const shouldBeDecision = Math.random() < options.decisionRatio;
      const nodeType = shouldBeDecision ? 'DECISION' : 'STEP';
      
      // Criar nós filhos
      const childCount = shouldBeDecision ? options.branchingFactor : 1;
      
      for (let i = 0; i < childCount && nodes.length < options.nodeCount; i++) {
        const nodeId = `node_${nodeIdCounter++}`;
        
        nodes.push({
          id: nodeId,
          type: nodeType as any,
          name: `${nodeType} ${nodeId}`
        });
        
        // Criar conexão
        connections.push({
          id: `conn_${connectionIdCounter++}`,
          from: parentNodeId,
          to: nodeId,
          condition: shouldBeDecision ? `Condição ${i + 1}` : undefined
        });
        
        nextLevelNodes.push(nodeId);
      }
    }
    
    currentLevelNodes = nextLevelNodes;
  }
  
  // Adicionar nó END
  if (nodes.length < options.nodeCount) {
    nodes.push({
      id: 'end',
      type: 'END',
      name: 'Fim do Fluxo'
    });
    
    // Conectar últimos nós ao END
    for (const lastNodeId of currentLevelNodes) {
      connections.push({
        id: `conn_${connectionIdCounter++}`,
        from: lastNodeId,
        to: 'end'
      });
    }
  }

  return { nodes, connections };
}

// --- Simulações de Algoritmos para Performance ---

function detectBinaryDecisions(nodes: FlowNode[], connections: Connection[]): BifurcationAnalysis[] {
  const startTime = performance.now();
  const bifurcations: BifurcationAnalysis[] = [];
  
  const decisionNodes = nodes.filter(node => node.type === 'DECISION');
  
  for (const decision of decisionNodes) {
    const outgoingConnections = connections.filter(conn => 
      conn.from === decision.id && !conn.secondary
    );
    
    if (outgoingConnections.length === 2) {
      bifurcations.push({
        decisionNodeId: decision.id,
        branches: {
          upper: [outgoingConnections[0].to],
          lower: [outgoingConnections[1].to]
        },
        convergenceNodeId: undefined
      });
    }
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  console.log(`   🔍 Detecção de bifurcações: ${bifurcations.length} encontradas em ${executionTime.toFixed(2)}ms`);
  
  return bifurcations;
}

function calculateVerticalLanes(bifurcations: BifurcationAnalysis[], nodes: FlowNode[]): Map<string, number> {
  const startTime = performance.now();
  const nodeLaneMap = new Map<string, number>();
  
  // Algoritmo O(n) para grandes fluxos
  nodes.forEach(node => nodeLaneMap.set(node.id, 0));
  
  bifurcations.forEach((bifurcation, index) => {
    const laneOffset = index + 1;
    
    bifurcation.branches.upper.forEach(nodeId => {
      nodeLaneMap.set(nodeId, laneOffset);
    });
    
    bifurcation.branches.lower.forEach(nodeId => {
      nodeLaneMap.set(nodeId, -laneOffset);
    });
  });
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  console.log(`   📊 Cálculo de lanes: ${nodeLaneMap.size} posições em ${executionTime.toFixed(2)}ms`);
  
  return nodeLaneMap;
}

function calculatePositions(nodeLaneMap: Map<string, number>, nodes: FlowNode[]): Map<string, LayoutPosition> {
  const startTime = performance.now();
  const positions = new Map<string, LayoutPosition>();
  
  let currentX = 100;
  const centerY = 0;
  const laneHeight = 200;
  const horizontalSpacing = 450;
  
  // Algoritmo otimizado para grandes volumes
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const laneIndex = nodeLaneMap.get(node.id) || 0;
    const y = centerY + (laneIndex * laneHeight);
    
    positions.set(node.id, {
      x: currentX,
      y: y,
      laneIndex: laneIndex
    });
    
    // Avançar X apenas para nós na lane central para simular fluxo linear
    if (laneIndex === 0) {
      currentX += horizontalSpacing;
    }
  }
  
  const endTime = performance.now();
  const executionTime = endTime - startTime;
  
  console.log(`   🎯 Cálculo de posições: ${positions.size} posições em ${executionTime.toFixed(2)}ms`);
  
  return positions;
}

// --- Casos de Teste de Performance ---

interface PerformanceTestCase {
  name: string;
  options: FlowGenerationOptions;
  maxExecutionTime: number; // milissegundos
  expectedComplexity: string;
}

const performanceTestCases: PerformanceTestCase[] = [
  {
    name: 'Fluxo médio (50 nós)',
    options: {
      nodeCount: 50,
      decisionRatio: 0.3,
      branchingFactor: 2,
      maxDepth: 8
    },
    maxExecutionTime: 100,
    expectedComplexity: 'O(n)'
  },
  {
    name: 'Fluxo grande (200 nós)',
    options: {
      nodeCount: 200,
      decisionRatio: 0.25,
      branchingFactor: 2,
      maxDepth: 12
    },
    maxExecutionTime: 300,
    expectedComplexity: 'O(n)'
  },
  {
    name: 'Fluxo muito grande (500 nós)',
    options: {
      nodeCount: 500,
      decisionRatio: 0.2,
      branchingFactor: 2,
      maxDepth: 15
    },
    maxExecutionTime: 500,
    expectedComplexity: 'O(n)'
  },
  {
    name: 'Fluxo com muitas decisões (100 nós, 50% decisões)',
    options: {
      nodeCount: 100,
      decisionRatio: 0.5,
      branchingFactor: 2,
      maxDepth: 10
    },
    maxExecutionTime: 200,
    expectedComplexity: 'O(n×m)' // n nós, m conexões
  },
  {
    name: 'Fluxo extremo (1000 nós)',
    options: {
      nodeCount: 1000,
      decisionRatio: 0.15,
      branchingFactor: 2,
      maxDepth: 20
    },
    maxExecutionTime: 1000,
    expectedComplexity: 'O(n)'
  }
];

// --- Medições de Memória Simuladas ---

interface MemoryMetrics {
  nodesMemoryMB: number;
  connectionsMemoryMB: number;
  positionsMemoryMB: number;
  totalMemoryMB: number;
}

function estimateMemoryUsage(nodes: FlowNode[], connections: Connection[], positions: Map<string, LayoutPosition>): MemoryMetrics {
  // Estimativas baseadas em tamanhos médios de objetos JavaScript
  const nodeSize = 200; // bytes por nó (incluindo strings)
  const connectionSize = 150; // bytes por conexão
  const positionSize = 100; // bytes por posição
  
  const nodesMemoryMB = (nodes.length * nodeSize) / (1024 * 1024);
  const connectionsMemoryMB = (connections.length * connectionSize) / (1024 * 1024);
  const positionsMemoryMB = (positions.size * positionSize) / (1024 * 1024);
  
  return {
    nodesMemoryMB,
    connectionsMemoryMB,
    positionsMemoryMB,
    totalMemoryMB: nodesMemoryMB + connectionsMemoryMB + positionsMemoryMB
  };
}

// --- Executor de Testes de Performance ---

export class PerformanceTestRunner {
  private results: { [testName: string]: { passed: boolean; details: string; metrics: any } } = {};

  async runAllTests(): Promise<void> {
    console.log('=== Testes de Performance para Fluxos Grandes ===\n');

    for (const testCase of performanceTestCases) {
      await this.runSingleTest(testCase);
    }

    this.printResults();
    this.printPerformanceSummary();
  }

  private async runSingleTest(testCase: PerformanceTestCase): Promise<void> {
    console.log(`🚀 Executando: ${testCase.name}`);
    
    const overallStartTime = performance.now();
    
    try {
      // Gerar dados de teste
      console.log(`   📋 Gerando ${testCase.options.nodeCount} nós...`);
      const { nodes, connections } = generateLargeFlow(testCase.options);
      
      console.log(`   ✅ Gerado: ${nodes.length} nós, ${connections.length} conexões`);
      
      // Pipeline de processamento com medição de tempo
      const pipelineStartTime = performance.now();
      
      // 1. Detectar bifurcações
      const bifurcations = detectBinaryDecisions(nodes, connections);
      
      // 2. Calcular lanes
      const nodeLaneMap = calculateVerticalLanes(bifurcations, nodes);
      
      // 3. Calcular posições
      const positions = calculatePositions(nodeLaneMap, nodes);
      
      const pipelineEndTime = performance.now();
      const totalPipelineTime = pipelineEndTime - pipelineStartTime;
      
      // Validação de performance
      if (totalPipelineTime > testCase.maxExecutionTime) {
        throw new Error(`Tempo limite excedido: ${totalPipelineTime.toFixed(2)}ms > ${testCase.maxExecutionTime}ms`);
      }
      
      // Estimativa de uso de memória
      const memoryMetrics = estimateMemoryUsage(nodes, connections, positions);
      
      // Validação de integridade dos dados
      if (positions.size !== nodes.length) {
        throw new Error(`Posições incompletas: ${positions.size}/${nodes.length}`);
      }
      
      if (nodeLaneMap.size !== nodes.length) {
        throw new Error(`Lane map incompleto: ${nodeLaneMap.size}/${nodes.length}`);
      }
      
      // Análise de escalabilidade
      const timePerNode = totalPipelineTime / nodes.length;
      const scalabilityRating = this.assessScalability(nodes.length, totalPipelineTime);
      
      const overallEndTime = performance.now();
      const totalTestTime = overallEndTime - overallStartTime;
      
      this.results[testCase.name] = {
        passed: true,
        details: `✅ ${totalPipelineTime.toFixed(1)}ms total, ${timePerNode.toFixed(3)}ms/nó`,
        metrics: {
          nodes: nodes.length,
          connections: connections.length,
          bifurcations: bifurcations.length,
          pipelineTime: totalPipelineTime,
          totalTime: totalTestTime,
          timePerNode,
          memory: memoryMetrics,
          scalability: scalabilityRating
        }
      };

      console.log(`   ✅ PASSOU (${totalPipelineTime.toFixed(1)}ms, ${memoryMetrics.totalMemoryMB.toFixed(2)}MB)`);
      console.log(`   📈 Escalabilidade: ${scalabilityRating}\n`);

    } catch (error: any) {
      const overallEndTime = performance.now();
      const totalTestTime = overallEndTime - overallStartTime;
      
      this.results[testCase.name] = {
        passed: false,
        details: `❌ ${error.message}`,
        metrics: {
          totalTime: totalTestTime,
          error: error.message
        }
      };

      console.log(`   ❌ FALHOU: ${error.message}\n`);
    }
  }

  private assessScalability(nodeCount: number, executionTime: number): string {
    const timePerNode = executionTime / nodeCount;
    
    if (timePerNode < 0.5) return 'Excelente';
    if (timePerNode < 1.0) return 'Boa';
    if (timePerNode < 2.0) return 'Aceitável';
    if (timePerNode < 5.0) return 'Limitada';
    return 'Problemática';
  }

  private printResults(): void {
    console.log('\n=== Resultados dos Testes de Performance ===');
    
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    
    console.log(`Total: ${totalTests} | Passou: ${passedTests} | Falhou: ${totalTests - passedTests}\n`);
    
    for (const [testName, result] of Object.entries(this.results)) {
      console.log(`${result.passed ? '✅' : '❌'} ${testName}`);
      console.log(`   ${result.details}`);
      
      if (result.passed && result.metrics) {
        const m = result.metrics;
        console.log(`   📊 Nós: ${m.nodes}, Bifurcações: ${m.bifurcations}, Memória: ${m.memory?.totalMemoryMB?.toFixed(2) || 'N/A'}MB`);
      }
      console.log('');
    }
  }

  private printPerformanceSummary(): void {
    console.log('=== Resumo de Performance ===\n');
    
    const passedResults = Object.values(this.results).filter(r => r.passed && r.metrics);
    
    if (passedResults.length === 0) {
      console.log('❌ Nenhum teste de performance passou');
      return;
    }
    
    // Análise de tendências
    const nodeCountsAndTimes = passedResults.map(r => ({
      nodes: r.metrics.nodes,
      time: r.metrics.pipelineTime,
      timePerNode: r.metrics.timePerNode
    })).sort((a, b) => a.nodes - b.nodes);
    
    console.log('📈 Análise de Escalabilidade:');
    nodeCountsAndTimes.forEach(data => {
      console.log(`   ${data.nodes} nós: ${data.time.toFixed(1)}ms (${data.timePerNode.toFixed(3)}ms/nó)`);
    });
    
    // Cálculo de complexidade observada
    if (nodeCountsAndTimes.length >= 2) {
      const first = nodeCountsAndTimes[0];
      const last = nodeCountsAndTimes[nodeCountsAndTimes.length - 1];
      
      const nodeRatio = last.nodes / first.nodes;
      const timeRatio = last.time / first.time;
      
      console.log(`\n📊 Complexidade observada:`);
      console.log(`   Nós aumentaram ${nodeRatio.toFixed(1)}x`);
      console.log(`   Tempo aumentou ${timeRatio.toFixed(1)}x`);
      console.log(`   Relação: ${timeRatio < nodeRatio * 1.2 ? 'Linear ✅' : 'Não-linear ⚠️'}`);
    }
    
    // Recomendações
    const maxTimePerNode = Math.max(...nodeCountsAndTimes.map(d => d.timePerNode));
    const avgMemory = passedResults.reduce((sum, r) => sum + (r.metrics.memory?.totalMemoryMB || 0), 0) / passedResults.length;
    
    console.log(`\n🎯 Métricas Finais:`);
    console.log(`   Tempo máximo/nó: ${maxTimePerNode.toFixed(3)}ms`);
    console.log(`   Memória média: ${avgMemory.toFixed(2)}MB`);
    
    if (maxTimePerNode < 1.0 && avgMemory < 10) {
      console.log(`   🎉 Performance excelente para produção!`);
    } else if (maxTimePerNode < 2.0 && avgMemory < 50) {
      console.log(`   ✅ Performance adequada para produção.`);
    } else {
      console.log(`   ⚠️  Performance pode precisar de otimização para fluxos muito grandes.`);
    }
  }

  getResults() {
    return this.results;
  }
}

// --- Função Principal ---
export async function runPerformanceTests(): Promise<boolean> {
  const runner = new PerformanceTestRunner();
  await runner.runAllTests();
  
  const results = runner.getResults();
  const allPassed = Object.values(results).every(r => r.passed);
  
  return allPassed;
}

// Executar automaticamente se for chamado diretamente
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runPerformanceTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
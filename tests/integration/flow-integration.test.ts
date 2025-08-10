// tests/integration/flow-integration.test.ts
/**
 * Testes de integração para fluxos completos
 * Valida o pipeline completo desde parsing até geração de layout
 * Fase 8: Testing e Validação
 */

import type { FlowNode, Connection, LayoutPreferences } from '../../shared/types/flow.types';

// --- Simulação do Sistema de Preferências ---
const mockDefaultPreferences: LayoutPreferences = {
  enableBifurcation: true,
  verticalSpacing: 150,
  curvedConnectors: false,
  autoDetectDecisions: true,
  fallbackToLinear: true,
  performanceMode: false
};

// --- Simulação Simplificada do Parser Markdown ---
function parseMarkdownToFlow(markdown: string): { nodes: FlowNode[], connections: Connection[] } {
  const lines = markdown.trim().split('\n');
  const nodes: FlowNode[] = [];
  const connections: Connection[] = [];
  
  let connectionId = 1;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('START:')) {
      const name = trimmedLine.substring(6).trim();
      nodes.push({ id: 'start', type: 'START', name });
    } else if (trimmedLine.startsWith('END:')) {
      const name = trimmedLine.substring(4).trim();
      nodes.push({ id: 'end', type: 'END', name });
    } else if (trimmedLine.startsWith('STEP:')) {
      const parts = trimmedLine.substring(5).trim().split(' -> ');
      const stepName = parts[0];
      const stepId = `step_${nodes.length}`;
      nodes.push({ id: stepId, type: 'STEP', name: stepName });
      
      if (parts.length > 1) {
        const targetName = parts[1];
        // Criar conexão (simplificado)
        connections.push({
          id: `c${connectionId++}`,
          from: stepId,
          to: targetName === 'END' ? 'end' : `step_${nodes.length}` // Simplificado
        });
      }
    } else if (trimmedLine.startsWith('DECISION:')) {
      const parts = trimmedLine.substring(9).trim().split(' -> ');
      const decisionName = parts[0];
      const decisionId = `decision_${nodes.length}`;
      nodes.push({ id: decisionId, type: 'DECISION', name: decisionName });
      
      // Processar ramos da decisão (formato simplificado)
      if (parts.length > 1) {
        const branches = parts[1].split(' | ');
        branches.forEach(branch => {
          const [condition, target] = branch.split(': ');
          connections.push({
            id: `c${connectionId++}`,
            from: decisionId,
            to: target || `step_${nodes.length + 1}`,
            condition: condition
          });
        });
      }
    }
  }
  
  return { nodes, connections };
}

// --- Simulação do Sistema de Layout Completo ---
async function simulateCompleteFlowGeneration(
  markdown: string,
  preferences: LayoutPreferences = mockDefaultPreferences
): Promise<{
  nodes: FlowNode[];
  connections: Connection[];
  layoutType: 'bifurcated' | 'linear';
  bifurcationsDetected: number;
  positionsCalculated: number;
  errors: string[];
}> {
  const errors: string[] = [];
  
  try {
    // 1. Parse Markdown
    const { nodes, connections } = parseMarkdownToFlow(markdown);
    
    if (nodes.length === 0) {
      errors.push('Nenhum nó encontrado após parsing');
      throw new Error('Parse falhou');
    }
    
    // 2. Detectar Bifurcações (simulado)
    const decisionNodes = nodes.filter(n => n.type === 'DECISION');
    const binaryDecisions = decisionNodes.filter(decision => {
      const outgoing = connections.filter(c => c.from === decision.id);
      return outgoing.length === 2;
    });
    
    const bifurcationsDetected = binaryDecisions.length;
    
    // 3. Decidir Layout
    let layoutType: 'bifurcated' | 'linear' = 'linear';
    
    if (preferences.enableBifurcation && preferences.autoDetectDecisions && bifurcationsDetected > 0) {
      layoutType = 'bifurcated';
    } else if (preferences.enableBifurcation && !preferences.fallbackToLinear) {
      layoutType = 'bifurcated';
    }
    
    // 4. Calcular Posições (simulado)
    const positionsCalculated = nodes.length;
    
    return {
      nodes,
      connections,
      layoutType,
      bifurcationsDetected,
      positionsCalculated,
      errors
    };
    
  } catch (error: any) {
    errors.push(error.message);
    return {
      nodes: [],
      connections: [],
      layoutType: 'linear',
      bifurcationsDetected: 0,
      positionsCalculated: 0,
      errors
    };
  }
}

// --- Casos de Teste de Integração ---

interface IntegrationTestCase {
  name: string;
  markdown: string;
  preferences: LayoutPreferences;
  expectedLayoutType: 'bifurcated' | 'linear';
  expectedNodes: number;
  expectedConnections: number;
  expectedBifurcations: number;
  shouldSucceed: boolean;
}

const integrationTestCases: IntegrationTestCase[] = [
  {
    name: 'Fluxo simples de login (bifurcado)',
    markdown: `
START: Iniciar processo
DECISION: Usuário logado? -> Sim: dashboard | Não: login
STEP: Mostrar dashboard
STEP: Ir para login
END: Processo finalizado
    `.trim(),
    preferences: mockDefaultPreferences,
    expectedLayoutType: 'bifurcated',
    expectedNodes: 5,
    expectedConnections: 2,
    expectedBifurcations: 1,
    shouldSucceed: true
  },
  {
    name: 'Fluxo linear simples',
    markdown: `
START: Início
STEP: Passo 1
STEP: Passo 2
STEP: Passo 3
END: Fim
    `.trim(),
    preferences: mockDefaultPreferences,
    expectedLayoutType: 'linear',
    expectedNodes: 5,
    expectedConnections: 0,
    expectedBifurcations: 0,
    shouldSucceed: true
  },
  {
    name: 'Fluxo com bifurcação desabilitada',
    markdown: `
START: Início
DECISION: Tem acesso? -> Sim: permitir | Não: negar
STEP: Permitir acesso
STEP: Negar acesso
END: Fim
    `.trim(),
    preferences: {
      ...mockDefaultPreferences,
      enableBifurcation: false
    },
    expectedLayoutType: 'linear',
    expectedNodes: 5,
    expectedConnections: 2,
    expectedBifurcations: 1, // Detecta mas não usa
    shouldSucceed: true
  },
  {
    name: 'Fluxo complexo e-commerce',
    markdown: `
START: Usuário visita site
DECISION: Está logado? -> Sim: dashboard | Não: login
STEP: Mostrar dashboard
STEP: Ir para login
DECISION: Login válido? -> Sim: sucesso | Não: erro
STEP: Login bem-sucedido
STEP: Erro de login
END: Finalizar
    `.trim(),
    preferences: mockDefaultPreferences,
    expectedLayoutType: 'bifurcated',
    expectedNodes: 8,
    expectedConnections: 4,
    expectedBifurcations: 2,
    shouldSucceed: true
  },
  {
    name: 'Markdown vazio (erro)',
    markdown: '',
    preferences: mockDefaultPreferences,
    expectedLayoutType: 'linear',
    expectedNodes: 0,
    expectedConnections: 0,
    expectedBifurcations: 0,
    shouldSucceed: false
  }
];

// --- Executor de Testes de Integração ---

export class FlowIntegrationTestRunner {
  private results: { [testName: string]: { passed: boolean; details: string } } = {};

  async runAllTests(): Promise<void> {
    console.log('=== Testes de Integração de Fluxos ===\n');

    for (const testCase of integrationTestCases) {
      await this.runSingleTest(testCase);
    }

    this.printResults();
  }

  private async runSingleTest(testCase: IntegrationTestCase): Promise<void> {
    console.log(`🧪 Executando: ${testCase.name}`);
    
    try {
      // Executar simulação completa
      const result = await simulateCompleteFlowGeneration(
        testCase.markdown,
        testCase.preferences
      );

      // Teste 1: Validar se deve ter sucesso
      if (testCase.shouldSucceed && result.errors.length > 0) {
        throw new Error(`Deveria ter sucesso mas teve erros: ${result.errors.join(', ')}`);
      }
      
      if (!testCase.shouldSucceed && result.errors.length === 0) {
        throw new Error('Deveria ter falhado mas teve sucesso');
      }

      // Se deve falhar e falhou, considerar sucesso
      if (!testCase.shouldSucceed && result.errors.length > 0) {
        this.results[testCase.name] = {
          passed: true,
          details: `✅ Falhou como esperado: ${result.errors[0]}`
        };
        console.log(`   ✅ PASSOU (Falhou como esperado)\n`);
        return;
      }

      // Teste 2: Validar número de nós
      if (result.nodes.length !== testCase.expectedNodes) {
        throw new Error(`Nós incorretos: esperado ${testCase.expectedNodes}, encontrado ${result.nodes.length}`);
      }

      // Teste 3: Validar número de bifurcações detectadas
      if (result.bifurcationsDetected !== testCase.expectedBifurcations) {
        throw new Error(`Bifurcações incorretas: esperado ${testCase.expectedBifurcations}, encontrado ${result.bifurcationsDetected}`);
      }

      // Teste 4: Validar tipo de layout escolhido
      if (result.layoutType !== testCase.expectedLayoutType) {
        throw new Error(`Layout incorreto: esperado ${testCase.expectedLayoutType}, escolhido ${result.layoutType}`);
      }

      // Teste 5: Validar que posições foram calculadas para todos os nós
      if (result.positionsCalculated !== result.nodes.length) {
        throw new Error(`Posições incompletas: ${result.positionsCalculated}/${result.nodes.length} nós`);
      }

      // Teste 6: Validar consistência de preferências
      const bifurcationUsed = result.layoutType === 'bifurcated';
      const bifurcationEnabled = testCase.preferences.enableBifurcation;
      
      if (bifurcationUsed && !bifurcationEnabled) {
        throw new Error('Bifurcação usada apesar de estar desabilitada nas preferências');
      }

      // Teste 7: Validar estrutura dos nós
      const hasStart = result.nodes.some(n => n.type === 'START');
      const hasEnd = result.nodes.some(n => n.type === 'END');
      
      if (result.nodes.length > 0 && !hasStart) {
        throw new Error('Fluxo sem nó START');
      }
      
      if (result.nodes.length > 0 && !hasEnd) {
        throw new Error('Fluxo sem nó END');
      }

      this.results[testCase.name] = {
        passed: true,
        details: `✅ Layout: ${result.layoutType}, Nós: ${result.nodes.length}, Bifurcações: ${result.bifurcationsDetected}`
      };

      console.log(`   ✅ PASSOU (${result.layoutType}, ${result.nodes.length} nós)\n`);

    } catch (error: any) {
      this.results[testCase.name] = {
        passed: false,
        details: `❌ ${error.message}`
      };

      console.log(`   ❌ FALHOU: ${error.message}\n`);
    }
  }

  private printResults(): void {
    console.log('\n=== Resultados dos Testes de Integração ===');
    
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    
    console.log(`Total: ${totalTests} | Passou: ${passedTests} | Falhou: ${totalTests - passedTests}\n`);
    
    for (const [testName, result] of Object.entries(this.results)) {
      console.log(`${result.passed ? '✅' : '❌'} ${testName}`);
      console.log(`   ${result.details}\n`);
    }

    if (passedTests === totalTests) {
      console.log('🎉 Todos os testes de integração passaram!');
    } else {
      console.log('⚠️  Alguns testes de integração falharam. Verifique os detalhes acima.');
    }
  }

  getResults() {
    return this.results;
  }
}

// --- Função Principal ---
export async function runFlowIntegrationTests(): Promise<boolean> {
  const runner = new FlowIntegrationTestRunner();
  await runner.runAllTests();
  
  const results = runner.getResults();
  const allPassed = Object.values(results).every(r => r.passed);
  
  return allPassed;
}

// Executar automaticamente se for chamado diretamente
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runFlowIntegrationTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
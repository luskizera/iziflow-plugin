// tests/test-runner.ts
/**
 * Executor principal de todos os testes
 * Fase 8: Testing e Validação - Sistema Completo
 */

// --- Imports dos Módulos de Teste ---
import { runLayoutUnitTests } from './unit/layout.test';
import { runVerticalLanesTests } from './unit/vertical-lanes.test';
import { runConvergenceGeometryTests } from './unit/convergence-geometry.test';
import { runFlowIntegrationTests } from './integration/flow-integration.test';
import { runPreferencesTests } from './unit/preferences.test';
import { runPerformanceTests } from './performance/large-flows.test';

// --- Configuração de Testes ---
interface TestSuite {
  name: string;
  description: string;
  runner: () => Promise<boolean>;
  critical: boolean; // Se verdadeiro, falha interrompe a execução
  category: 'unit' | 'integration' | 'performance';
}

const testSuites: TestSuite[] = [
  {
    name: 'Layout Unit Tests',
    description: 'Testes unitários para detecção de decisões binárias',
    runner: runLayoutUnitTests,
    critical: true,
    category: 'unit'
  },
  {
    name: 'Vertical Lanes Tests',
    description: 'Testes para cálculo de faixas verticais e conflitos',
    runner: runVerticalLanesTests,
    critical: true,
    category: 'unit'
  },
  {
    name: 'Convergence Geometry Tests',
    description: 'Testes para geometria de convergência e curvas',
    runner: runConvergenceGeometryTests,
    critical: false, // Não crítico pois ainda está em desenvolvimento
    category: 'unit'
  },
  {
    name: 'Flow Integration Tests',
    description: 'Testes de integração para fluxos completos',
    runner: runFlowIntegrationTests,
    critical: true,
    category: 'integration'
  },
  {
    name: 'Preferences Tests',
    description: 'Testes do sistema de preferências de usuário',
    runner: runPreferencesTests,
    critical: true,
    category: 'unit'
  },
  {
    name: 'Performance Tests',
    description: 'Testes de performance para fluxos grandes',
    runner: runPerformanceTests,
    critical: false, // Não crítico mas importante para produção
    category: 'performance'
  }
];

// --- Relatório de Cobertura ---
interface CoverageReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  criticalFailures: number;
  coverageByCategory: Record<string, { total: number; passed: number }>;
  executionTime: number;
  recommendations: string[];
}

// --- Executor Principal ---
export class MasterTestRunner {
  private results: { [suiteName: string]: { passed: boolean; critical: boolean; time: number; error?: string } } = {};
  private startTime = 0;

  async runAllTests(options: {
    runPerformanceTests?: boolean;
    stopOnCriticalFailure?: boolean;
    verbose?: boolean;
  } = {}): Promise<CoverageReport> {
    
    const {
      runPerformanceTests: includePerformance = true,
      stopOnCriticalFailure = true,
      verbose = true
    } = options;

    this.startTime = Date.now();

    if (verbose) {
      console.log('🚀 === IziFlow - Executor de Testes da Fase 8 ===');
      console.log('📋 Sistema de Layout Bifurcado - Validação Completa\n');
    }

    // Filtrar testes baseado nas opções
    const suitesToRun = testSuites.filter(suite => 
      includePerformance || suite.category !== 'performance'
    );

    let criticalFailures = 0;

    for (const suite of suitesToRun) {
      await this.runSingleSuite(suite, verbose);
      
      if (!this.results[suite.name].passed && suite.critical) {
        criticalFailures++;
        
        if (stopOnCriticalFailure) {
          if (verbose) {
            console.log(`🛑 Parando execução devido a falha crítica em: ${suite.name}\n`);
          }
          break;
        }
      }
    }

    return this.generateCoverageReport(verbose);
  }

  private async runSingleSuite(suite: TestSuite, verbose: boolean): Promise<void> {
    if (verbose) {
      console.log(`🧪 ${suite.name}`);
      console.log(`   ${suite.description}`);
    }

    const suiteStartTime = Date.now();
    
    try {
      const passed = await suite.runner();
      const executionTime = Date.now() - suiteStartTime;
      
      this.results[suite.name] = {
        passed,
        critical: suite.critical,
        time: executionTime
      };

      if (verbose) {
        const status = passed ? '✅ PASSOU' : '❌ FALHOU';
        const criticalLabel = suite.critical ? ' (CRÍTICO)' : '';
        console.log(`   ${status}${criticalLabel} - ${executionTime}ms\n`);
      }

    } catch (error: any) {
      const executionTime = Date.now() - suiteStartTime;
      
      this.results[suite.name] = {
        passed: false,
        critical: suite.critical,
        time: executionTime,
        error: error.message
      };

      if (verbose) {
        const criticalLabel = suite.critical ? ' (CRÍTICO)' : '';
        console.log(`   ❌ ERRO${criticalLabel}: ${error.message} - ${executionTime}ms\n`);
      }
    }
  }

  private generateCoverageReport(verbose: boolean): CoverageReport {
    const totalExecutionTime = Date.now() - this.startTime;
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const criticalFailures = Object.values(this.results).filter(r => !r.passed && r.critical).length;

    // Agrupar por categoria
    const coverageByCategory: Record<string, { total: number; passed: number }> = {};
    
    for (const suite of testSuites) {
      const result = this.results[suite.name];
      if (!result) continue;
      
      if (!coverageByCategory[suite.category]) {
        coverageByCategory[suite.category] = { total: 0, passed: 0 };
      }
      
      coverageByCategory[suite.category].total++;
      if (result.passed) {
        coverageByCategory[suite.category].passed++;
      }
    }

    // Gerar recomendações
    const recommendations: string[] = [];
    
    if (criticalFailures > 0) {
      recommendations.push(`🚨 ${criticalFailures} falha(s) crítica(s) devem ser corrigidas antes do deployment`);
    }
    
    if (passedTests === totalTests) {
      recommendations.push('🎉 Todos os testes passaram! Sistema pronto para produção');
    } else if (criticalFailures === 0) {
      recommendations.push('✅ Funcionalidades críticas funcionando, falhas não-críticas podem ser abordadas em iterações futuras');
    }
    
    const performanceResult = this.results['Performance Tests'];
    if (performanceResult && !performanceResult.passed) {
      recommendations.push('⚡ Considere otimizações de performance para fluxos muito grandes');
    }
    
    const geometryResult = this.results['Convergence Geometry Tests'];
    if (geometryResult && !geometryResult.passed) {
      recommendations.push('🔄 Geometria de convergência precisa de refinamento para conectores curvos');
    }

    const report: CoverageReport = {
      totalTests,
      passedTests,
      failedTests,
      criticalFailures,
      coverageByCategory,
      executionTime: totalExecutionTime,
      recommendations
    };

    if (verbose) {
      this.printDetailedReport(report);
    }

    return report;
  }

  private printDetailedReport(report: CoverageReport): void {
    console.log('📊 === RELATÓRIO FINAL DE TESTES ===\n');
    
    // Resumo geral
    console.log('🎯 Resumo Geral:');
    console.log(`   Total: ${report.totalTests} testes`);
    console.log(`   Passou: ${report.passedTests} (${((report.passedTests/report.totalTests)*100).toFixed(1)}%)`);
    console.log(`   Falhou: ${report.failedTests} (${((report.failedTests/report.totalTests)*100).toFixed(1)}%)`);
    console.log(`   Críticas: ${report.criticalFailures} falhas críticas`);
    console.log(`   Tempo: ${(report.executionTime/1000).toFixed(1)}s\n`);
    
    // Cobertura por categoria
    console.log('📋 Cobertura por Categoria:');
    for (const [category, data] of Object.entries(report.coverageByCategory)) {
      const percentage = (data.passed / data.total) * 100;
      const status = percentage === 100 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
      console.log(`   ${status} ${category.toUpperCase()}: ${data.passed}/${data.total} (${percentage.toFixed(1)}%)`);
    }
    console.log('');

    // Detalhamento por suite
    console.log('🔍 Detalhes por Suite:');
    for (const [suiteName, result] of Object.entries(this.results)) {
      const status = result.passed ? '✅' : '❌';
      const criticalLabel = result.critical ? ' [CRÍTICO]' : '';
      const timeLabel = `${result.time}ms`;
      
      console.log(`   ${status} ${suiteName}${criticalLabel} - ${timeLabel}`);
      if (result.error) {
        console.log(`       Erro: ${result.error}`);
      }
    }
    console.log('');

    // Recomendações
    console.log('💡 Recomendações:');
    report.recommendations.forEach(rec => console.log(`   ${rec}`));
    console.log('');

    // Status final
    if (report.criticalFailures === 0 && report.passedTests === report.totalTests) {
      console.log('🎉 STATUS: TODOS OS TESTES PASSARAM - SISTEMA PRONTO PARA PRODUÇÃO! 🎉');
    } else if (report.criticalFailures === 0) {
      console.log('✅ STATUS: FUNCIONALIDADES CRÍTICAS OK - PRONTO PARA PRODUÇÃO COM OBSERVAÇÕES');
    } else {
      console.log('❌ STATUS: FALHAS CRÍTICAS DETECTADAS - CORREÇÕES NECESSÁRIAS ANTES DO DEPLOYMENT');
    }
  }

  // Método para executar apenas testes críticos (para CI/CD)
  async runCriticalTests(): Promise<boolean> {
    const criticalSuites = testSuites.filter(suite => suite.critical);
    
    console.log('🔥 Executando apenas testes críticos para CI/CD...\n');
    
    for (const suite of criticalSuites) {
      await this.runSingleSuite(suite, false);
      
      if (!this.results[suite.name].passed) {
        console.log(`❌ Teste crítico falhou: ${suite.name}`);
        return false;
      }
    }
    
    console.log('✅ Todos os testes críticos passaram!');
    return true;
  }

  getResults() {
    return this.results;
  }
}

// --- Função Principal de Entrada ---
export async function runAllBifurcationTests(options?: {
  runPerformanceTests?: boolean;
  stopOnCriticalFailure?: boolean;
  verbose?: boolean;
  criticalOnly?: boolean;
}): Promise<boolean> {
  
  const runner = new MasterTestRunner();
  
  if (options?.criticalOnly) {
    return await runner.runCriticalTests();
  }
  
  const report = await runner.runAllTests(options);
  
  // Retorna true apenas se não houver falhas críticas
  return report.criticalFailures === 0;
}

// --- Execução Automática ---
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  const args = process.argv.slice(2);
  const criticalOnly = args.includes('--critical');
  const includePerformance = !args.includes('--no-performance');
  const verbose = !args.includes('--quiet');
  
  runAllBifurcationTests({
    criticalOnly,
    runPerformanceTests: includePerformance,
    verbose
  }).then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Erro fatal durante execução dos testes:', error);
    process.exit(1);
  });
}
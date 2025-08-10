// tests/unit/preferences.test.ts
/**
 * Testes para o sistema de preferências de usuário
 * Valida carregamento, salvamento e aplicação de configurações
 * Fase 8: Testing e Validação
 */

import type { LayoutPreferences } from '../../shared/types/flow.types';

// --- Mock do clientStorage do Figma ---
class MockClientStorage {
  private storage = new Map<string, string>();

  async getAsync(key: string): Promise<string | undefined> {
    return this.storage.get(key);
  }

  async setAsync(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async deleteAsync(key: string): Promise<void> {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  getAll(): Record<string, string> {
    return Object.fromEntries(this.storage);
  }
}

// --- Simulação do Sistema de Preferências ---
const LAYOUT_PREFERENCES_KEY = 'iziflow_layout_preferences';
const mockClientStorage = new MockClientStorage();

const DefaultPreferences: LayoutPreferences = {
  enableBifurcation: true,
  verticalSpacing: 150,
  curvedConnectors: false,
  autoDetectDecisions: true,
  fallbackToLinear: true,
  performanceMode: false
};

// Simulação das funções de preferências
const mockUserPreferences = {
  async load(): Promise<LayoutPreferences> {
    try {
      const stored = await mockClientStorage.getAsync(LAYOUT_PREFERENCES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DefaultPreferences, ...parsed };
      }
    } catch (error) {
      console.warn('[MockPreferences] Erro ao carregar, usando padrões:', error);
    }
    return DefaultPreferences;
  },

  async save(preferences: LayoutPreferences): Promise<void> {
    try {
      await mockClientStorage.setAsync(LAYOUT_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('[MockPreferences] Erro ao salvar:', error);
      throw error;
    }
  },

  async reset(): Promise<LayoutPreferences> {
    await this.save(DefaultPreferences);
    return DefaultPreferences;
  },

  // Simulação da aplicação das preferências (sem efeitos colaterais)
  applyToLayout(preferences: LayoutPreferences): Record<string, any> {
    return {
      bifurcationEnabled: preferences.enableBifurcation,
      verticalSpacing: preferences.verticalSpacing,
      laneHeight: preferences.verticalSpacing + 50,
      autoDetect: preferences.autoDetectDecisions,
      fallback: preferences.fallbackToLinear,
      performance: preferences.performanceMode
    };
  }
};

// --- Casos de Teste ---

interface PreferencesTestCase {
  name: string;
  initialPreferences?: LayoutPreferences;
  testPreferences: LayoutPreferences;
  expectedBehavior: string;
  shouldPersist: boolean;
}

const preferencesTestCases: PreferencesTestCase[] = [
  {
    name: 'Salvar e carregar preferências padrão',
    testPreferences: DefaultPreferences,
    expectedBehavior: 'Deve carregar configurações padrão',
    shouldPersist: true
  },
  {
    name: 'Salvar preferências personalizadas',
    testPreferences: {
      enableBifurcation: false,
      verticalSpacing: 200,
      curvedConnectors: true,
      autoDetectDecisions: false,
      fallbackToLinear: false,
      performanceMode: true
    },
    expectedBehavior: 'Deve salvar e carregar configurações personalizadas',
    shouldPersist: true
  },
  {
    name: 'Merge com configurações padrão (dados incompletos)',
    testPreferences: {
      enableBifurcation: false,
      verticalSpacing: 300
    } as LayoutPreferences, // Dados parciais
    expectedBehavior: 'Deve fazer merge com configurações padrão',
    shouldPersist: true
  },
  {
    name: 'Reset para configurações padrão',
    initialPreferences: {
      enableBifurcation: false,
      verticalSpacing: 300,
      curvedConnectors: true,
      autoDetectDecisions: false,
      fallbackToLinear: false,
      performanceMode: true
    },
    testPreferences: DefaultPreferences, // Será resetado
    expectedBehavior: 'Deve resetar para configurações padrão',
    shouldPersist: true
  },
  {
    name: 'Valores extremos de espaçamento',
    testPreferences: {
      ...DefaultPreferences,
      verticalSpacing: 500 // Valor alto
    },
    expectedBehavior: 'Deve aceitar valores extremos válidos',
    shouldPersist: true
  },
  {
    name: 'Combinações lógicas específicas',
    testPreferences: {
      enableBifurcation: true,
      verticalSpacing: 100,
      curvedConnectors: false,
      autoDetectDecisions: false, // Detecção manual
      fallbackToLinear: false, // Sempre bifurcado
      performanceMode: false
    },
    expectedBehavior: 'Deve funcionar com detecção manual e sem fallback',
    shouldPersist: true
  }
];

// --- Executor de Testes de Preferências ---

export class PreferencesTestRunner {
  private results: { [testName: string]: { passed: boolean; details: string } } = {};

  async runAllTests(): Promise<void> {
    console.log('=== Testes do Sistema de Preferências ===\n');

    // Limpar storage antes dos testes
    mockClientStorage.clear();

    for (const testCase of preferencesTestCases) {
      await this.runSingleTest(testCase);
    }

    this.printResults();
  }

  private async runSingleTest(testCase: PreferencesTestCase): Promise<void> {
    console.log(`🧪 Executando: ${testCase.name}`);
    
    try {
      // Setup: configurar preferências iniciais se especificadas
      if (testCase.initialPreferences) {
        await mockUserPreferences.save(testCase.initialPreferences);
      }

      // Teste 1: Salvar preferências
      await mockUserPreferences.save(testCase.testPreferences);
      
      // Teste 2: Carregar preferências
      const loadedPreferences = await mockUserPreferences.load();
      
      // Teste 3: Validar persistência
      if (testCase.shouldPersist) {
        // Verificar se todas as propriedades essenciais foram salvas/carregadas corretamente
        const requiredKeys: (keyof LayoutPreferences)[] = [
          'enableBifurcation',
          'verticalSpacing', 
          'curvedConnectors',
          'autoDetectDecisions',
          'fallbackToLinear',
          'performanceMode'
        ];

        for (const key of requiredKeys) {
          const expected = testCase.testPreferences[key] ?? DefaultPreferences[key];
          const actual = loadedPreferences[key];
          
          if (actual !== expected) {
            throw new Error(`Propriedade '${key}' não persistiu: esperado ${expected}, encontrado ${actual}`);
          }
        }
      }

      // Teste 4: Validar aplicação de configurações
      const appliedConfig = mockUserPreferences.applyToLayout(loadedPreferences);
      
      // Verificar se as configurações são aplicadas corretamente
      if (appliedConfig.bifurcationEnabled !== loadedPreferences.enableBifurcation) {
        throw new Error('Configuração de bifurcação não aplicada corretamente');
      }
      
      if (appliedConfig.verticalSpacing !== loadedPreferences.verticalSpacing) {
        throw new Error('Configuração de espaçamento vertical não aplicada corretamente');
      }

      // Teste 5: Validar lógica de configurações
      const expectedLaneHeight = loadedPreferences.verticalSpacing + 50;
      if (appliedConfig.laneHeight !== expectedLaneHeight) {
        throw new Error(`Altura de lane incorreta: esperado ${expectedLaneHeight}, encontrado ${appliedConfig.laneHeight}`);
      }

      // Teste 6: Validar valores dentro de ranges esperados
      if (loadedPreferences.verticalSpacing < 50 || loadedPreferences.verticalSpacing > 1000) {
        throw new Error(`Espaçamento vertical fora do range esperado: ${loadedPreferences.verticalSpacing}`);
      }

      // Teste 7: Validar combinações lógicas
      if (loadedPreferences.enableBifurcation === false && loadedPreferences.autoDetectDecisions === true) {
        // Esta combinação é válida mas não terá efeito prático
        console.log('   ℹ️  Aviso: autoDetectDecisions=true com enableBifurcation=false não terá efeito');
      }

      // Teste 8: Verificar se o reset funciona (se aplicável)
      if (testCase.name.includes('Reset')) {
        const resetPreferences = await mockUserPreferences.reset();
        
        for (const [key, value] of Object.entries(DefaultPreferences)) {
          if (resetPreferences[key as keyof LayoutPreferences] !== value) {
            throw new Error(`Reset falhou para '${key}': esperado ${value}, encontrado ${resetPreferences[key as keyof LayoutPreferences]}`);
          }
        }
      }

      this.results[testCase.name] = {
        passed: true,
        details: `✅ Bifurcação: ${loadedPreferences.enableBifurcation}, Espaçamento: ${loadedPreferences.verticalSpacing}`
      };

      console.log(`   ✅ PASSOU (${testCase.expectedBehavior})\n`);

    } catch (error: any) {
      this.results[testCase.name] = {
        passed: false,
        details: `❌ ${error.message}`
      };

      console.log(`   ❌ FALHOU: ${error.message}\n`);
    }

    // Cleanup: limpar storage após cada teste
    mockClientStorage.clear();
  }

  private printResults(): void {
    console.log('\n=== Resultados dos Testes de Preferências ===');
    
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    
    console.log(`Total: ${totalTests} | Passou: ${passedTests} | Falhou: ${totalTests - passedTests}\n`);
    
    for (const [testName, result] of Object.entries(this.results)) {
      console.log(`${result.passed ? '✅' : '❌'} ${testName}`);
      console.log(`   ${result.details}\n`);
    }

    // Teste adicional: Verificar integridade do storage
    const storageState = mockClientStorage.getAll();
    if (Object.keys(storageState).length > 0) {
      console.log('⚠️  Aviso: Storage não foi completamente limpo após os testes');
    } else {
      console.log('🧹 Storage limpo após testes');
    }

    if (passedTests === totalTests) {
      console.log('\n🎉 Todos os testes de preferências passaram!');
    } else {
      console.log('\n⚠️  Alguns testes de preferências falharam. Verifique os detalhes acima.');
    }
  }

  getResults() {
    return this.results;
  }
}

// --- Testes Específicos de Edge Cases ---

export async function runPreferencesEdgeCaseTests(): Promise<boolean> {
  console.log('\n=== Testes de Casos Extremos de Preferências ===\n');
  
  const edgeCases = [
    {
      name: 'JSON malformado no storage',
      test: async () => {
        await mockClientStorage.setAsync(LAYOUT_PREFERENCES_KEY, '{ invalid json');
        const prefs = await mockUserPreferences.load();
        return JSON.stringify(prefs) === JSON.stringify(DefaultPreferences);
      }
    },
    {
      name: 'Valores null/undefined',
      test: async () => {
        const badPrefs = { 
          enableBifurcation: null, 
          verticalSpacing: undefined 
        } as any;
        await mockUserPreferences.save(badPrefs);
        const loaded = await mockUserPreferences.load();
        return loaded.enableBifurcation === DefaultPreferences.enableBifurcation &&
               loaded.verticalSpacing === DefaultPreferences.verticalSpacing;
      }
    },
    {
      name: 'Storage completo vazio',
      test: async () => {
        mockClientStorage.clear();
        const prefs = await mockUserPreferences.load();
        return JSON.stringify(prefs) === JSON.stringify(DefaultPreferences);
      }
    }
  ];

  let passedEdgeCases = 0;
  for (const edgeCase of edgeCases) {
    try {
      const passed = await edgeCase.test();
      if (passed) {
        console.log(`✅ ${edgeCase.name}`);
        passedEdgeCases++;
      } else {
        console.log(`❌ ${edgeCase.name} - Falhou na validação`);
      }
    } catch (error: any) {
      console.log(`❌ ${edgeCase.name} - Erro: ${error.message}`);
    }
    mockClientStorage.clear();
  }

  console.log(`\nCasos extremos: ${passedEdgeCases}/${edgeCases.length} passaram\n`);
  return passedEdgeCases === edgeCases.length;
}

// --- Função Principal ---
export async function runPreferencesTests(): Promise<boolean> {
  const runner = new PreferencesTestRunner();
  await runner.runAllTests();
  
  const results = runner.getResults();
  const allMainTestsPassed = Object.values(results).every(r => r.passed);
  
  const edgeTestsPassed = await runPreferencesEdgeCaseTests();
  
  return allMainTestsPassed && edgeTestsPassed;
}

// Executar automaticamente se for chamado diretamente
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runPreferencesTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
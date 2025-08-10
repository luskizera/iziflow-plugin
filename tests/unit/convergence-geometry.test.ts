// tests/unit/convergence-geometry.test.ts
/**
 * Testes para geometria de convergência e conectores curvos
 * Fase 8: Testing e Validação
 */

import type { Point2D, BezierPathConfig, ConvergenceGeometry, LayoutPosition } from '../../shared/types/flow.types';

// --- Funções Utilitárias para Geometria ---

function calculateDistance(point1: Point2D, point2: Point2D): number {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}

function calculateMidpoint(point1: Point2D, point2: Point2D): Point2D {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2
  };
}

function calculateAngle(from: Point2D, to: Point2D): number {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
}

// --- Simulação das Funções de Convergência ---

function calculateConvergenceGeometry(
  upperBranchEndNode: LayoutPosition,
  lowerBranchEndNode: LayoutPosition,
  convergenceNode: LayoutPosition
): ConvergenceGeometry {
  
  // Calcular pontos de controle para curvas suaves
  const controlOffset = 50;
  const upperControlPoint: Point2D = {
    x: convergenceNode.x - controlOffset,
    y: upperBranchEndNode.y + (convergenceNode.y - upperBranchEndNode.y) * 0.7
  };
  
  const lowerControlPoint: Point2D = {
    x: convergenceNode.x - controlOffset,
    y: lowerBranchEndNode.y + (convergenceNode.y - lowerBranchEndNode.y) * 0.7
  };
  
  // Calcular ângulo de convergência
  const upperAngle = calculateAngle(upperBranchEndNode, convergenceNode);
  const lowerAngle = calculateAngle(lowerBranchEndNode, convergenceNode);
  const convergenceAngle = Math.abs(upperAngle - lowerAngle);
  
  return {
    upperPath: {
      startPoint: { x: upperBranchEndNode.x, y: upperBranchEndNode.y },
      controlPoint: upperControlPoint,
      endPoint: { x: convergenceNode.x, y: convergenceNode.y },
      tension: 0.5
    },
    lowerPath: {
      startPoint: { x: lowerBranchEndNode.x, y: lowerBranchEndNode.y },
      controlPoint: lowerControlPoint,
      endPoint: { x: convergenceNode.x, y: convergenceNode.y },
      tension: 0.5
    },
    convergenceAngle,
    upperControlPoint,
    lowerControlPoint
  };
}

function validateBezierPath(path: BezierPathConfig): boolean {
  // Validar que todos os pontos existem
  if (!path.startPoint || !path.controlPoint || !path.endPoint) {
    return false;
  }
  
  // Validar que as coordenadas são números válidos
  const points = [path.startPoint, path.controlPoint, path.endPoint];
  for (const point of points) {
    if (typeof point.x !== 'number' || typeof point.y !== 'number' ||
        isNaN(point.x) || isNaN(point.y)) {
      return false;
    }
  }
  
  // Validar tensão (se especificada)
  if (path.tension !== undefined) {
    if (typeof path.tension !== 'number' || path.tension < 0 || path.tension > 1) {
      return false;
    }
  }
  
  return true;
}

function calculateOptimalControlPoint(
  startPoint: Point2D,
  endPoint: Point2D,
  curvature: number = 0.5
): Point2D {
  const midpoint = calculateMidpoint(startPoint, endPoint);
  const distance = calculateDistance(startPoint, endPoint);
  const offset = distance * curvature * 0.3;
  
  // Calcular ponto de controle perpendicular à linha de conexão
  const angle = calculateAngle(startPoint, endPoint);
  const perpendicularAngle = angle + 90;
  
  return {
    x: midpoint.x + Math.cos(perpendicularAngle * Math.PI / 180) * offset,
    y: midpoint.y + Math.sin(perpendicularAngle * Math.PI / 180) * offset
  };
}

// --- Casos de Teste para Geometria de Convergência ---

interface ConvergenceTestCase {
  name: string;
  upperBranchEnd: LayoutPosition;
  lowerBranchEnd: LayoutPosition;
  convergencePoint: LayoutPosition;
  expectedMinAngle: number;
  expectedMaxAngle: number;
  shouldHaveSmoothCurves: boolean;
}

const convergenceTestCases: ConvergenceTestCase[] = [
  {
    name: 'Convergência simétrica com ângulo ideal',
    upperBranchEnd: { x: 400, y: -100, laneIndex: 1 },
    lowerBranchEnd: { x: 400, y: 100, laneIndex: -1 },
    convergencePoint: { x: 600, y: 0, laneIndex: 0 },
    expectedMinAngle: 30,
    expectedMaxAngle: 60,
    shouldHaveSmoothCurves: true
  },
  {
    name: 'Convergência assimétrica com distâncias diferentes',
    upperBranchEnd: { x: 300, y: -150, laneIndex: 1 },
    lowerBranchEnd: { x: 450, y: 75, laneIndex: -1 },
    convergencePoint: { x: 700, y: 0, laneIndex: 0 },
    expectedMinAngle: 20,
    expectedMaxAngle: 80,
    shouldHaveSmoothCurves: true
  },
  {
    name: 'Convergência com ramos muito próximos',
    upperBranchEnd: { x: 500, y: -25, laneIndex: 1 },
    lowerBranchEnd: { x: 500, y: 25, laneIndex: -1 },
    convergencePoint: { x: 600, y: 0, laneIndex: 0 },
    expectedMinAngle: 10,
    expectedMaxAngle: 30,
    shouldHaveSmoothCurves: true
  },
  {
    name: 'Convergência com distância longa',
    upperBranchEnd: { x: 200, y: -200, laneIndex: 1 },
    lowerBranchEnd: { x: 200, y: 200, laneIndex: -1 },
    convergencePoint: { x: 800, y: 0, laneIndex: 0 },
    expectedMinAngle: 40,
    expectedMaxAngle: 80,
    shouldHaveSmoothCurves: true
  }
];

// --- Executor de Testes de Geometria ---

export class ConvergenceGeometryTestRunner {
  private results: { [testName: string]: { passed: boolean; details: string } } = {};

  async runAllTests(): Promise<void> {
    console.log('=== Testes de Geometria de Convergência ===\n');

    for (const testCase of convergenceTestCases) {
      await this.runSingleTest(testCase);
    }

    this.printResults();
  }

  private async runSingleTest(testCase: ConvergenceTestCase): Promise<void> {
    console.log(`🧪 Executando: ${testCase.name}`);
    
    try {
      // Teste 1: Calcular geometria de convergência
      const geometry = calculateConvergenceGeometry(
        testCase.upperBranchEnd,
        testCase.lowerBranchEnd,
        testCase.convergencePoint
      );

      // Teste 2: Validar ângulo de convergência
      if (geometry.convergenceAngle < testCase.expectedMinAngle || 
          geometry.convergenceAngle > testCase.expectedMaxAngle) {
        throw new Error(
          `Ângulo de convergência fora do esperado: ${geometry.convergenceAngle.toFixed(1)}°, ` +
          `esperado entre ${testCase.expectedMinAngle}° e ${testCase.expectedMaxAngle}°`
        );
      }

      // Teste 3: Validar caminhos Bézier
      if (!validateBezierPath(geometry.upperPath)) {
        throw new Error('Caminho Bézier superior inválido');
      }

      if (!validateBezierPath(geometry.lowerPath)) {
        throw new Error('Caminho Bézier inferior inválido');
      }

      // Teste 4: Verificar suavidade das curvas
      if (testCase.shouldHaveSmoothCurves) {
        const upperDistance = calculateDistance(geometry.upperPath.startPoint, geometry.upperPath.endPoint);
        const upperControlDistance = calculateDistance(geometry.upperPath.startPoint, geometry.upperPath.controlPoint);
        
        // Ponto de controle não deve estar muito próximo nem muito distante
        const controlRatio = upperControlDistance / upperDistance;
        if (controlRatio < 0.1 || controlRatio > 0.9) {
          throw new Error(`Ponto de controle superior mal posicionado: ratio ${controlRatio.toFixed(2)}`);
        }

        const lowerDistance = calculateDistance(geometry.lowerPath.startPoint, geometry.lowerPath.endPoint);
        const lowerControlDistance = calculateDistance(geometry.lowerPath.startPoint, geometry.lowerPath.controlPoint);
        
        const lowerControlRatio = lowerControlDistance / lowerDistance;
        if (lowerControlRatio < 0.1 || lowerControlRatio > 0.9) {
          throw new Error(`Ponto de controle inferior mal posicionado: ratio ${lowerControlRatio.toFixed(2)}`);
        }
      }

      // Teste 5: Verificar simetria quando apropriado
      const upperBranchY = testCase.upperBranchEnd.y;
      const lowerBranchY = testCase.lowerBranchEnd.y;
      const convergenceY = testCase.convergencePoint.y;
      
      if (Math.abs(upperBranchY + lowerBranchY - 2 * convergenceY) < 10) {
        // Configuração simétrica - verificar se pontos de controle são simétricos
        const upperControlY = geometry.upperControlPoint.y;
        const lowerControlY = geometry.lowerControlPoint.y;
        const controlSymmetryError = Math.abs(upperControlY + lowerControlY - 2 * convergenceY);
        
        if (controlSymmetryError > 20) {
          throw new Error(`Falta de simetria nos pontos de controle: erro de ${controlSymmetryError.toFixed(1)}px`);
        }
      }

      // Teste 6: Validar que curvas não se cruzam inapropriadamente
      const upperMidY = (geometry.upperPath.startPoint.y + geometry.upperControlPoint.y) / 2;
      const lowerMidY = (geometry.lowerPath.startPoint.y + geometry.lowerControlPoint.y) / 2;
      
      if (upperBranchY > lowerBranchY && upperMidY > lowerMidY) {
        throw new Error('Curvas podem estar se cruzando inapropriadamente');
      }

      this.results[testCase.name] = {
        passed: true,
        details: `✅ Ângulo: ${geometry.convergenceAngle.toFixed(1)}°, Curvas válidas: Sim`
      };

      console.log(`   ✅ PASSOU (Ângulo: ${geometry.convergenceAngle.toFixed(1)}°)\n`);

    } catch (error: any) {
      this.results[testCase.name] = {
        passed: false,
        details: `❌ ${error.message}`
      };

      console.log(`   ❌ FALHOU: ${error.message}\n`);
    }
  }

  private printResults(): void {
    console.log('\n=== Resultados dos Testes de Geometria de Convergência ===');
    
    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(r => r.passed).length;
    
    console.log(`Total: ${totalTests} | Passou: ${passedTests} | Falhou: ${totalTests - passedTests}\n`);
    
    for (const [testName, result] of Object.entries(this.results)) {
      console.log(`${result.passed ? '✅' : '❌'} ${testName}`);
      console.log(`   ${result.details}\n`);
    }

    if (passedTests === totalTests) {
      console.log('🎉 Todos os testes de geometria de convergência passaram!');
    } else {
      console.log('⚠️  Alguns testes de geometria falharam. Verifique os detalhes acima.');
    }
  }

  getResults() {
    return this.results;
  }
}

// --- Função Principal ---
export async function runConvergenceGeometryTests(): Promise<boolean> {
  const runner = new ConvergenceGeometryTestRunner();
  await runner.runAllTests();
  
  const results = runner.getResults();
  const allPassed = Object.values(results).every(r => r.passed);
  
  return allPassed;
}

// Executar automaticamente se for chamado diretamente
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  runConvergenceGeometryTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}
/// <reference types="@figma/plugin-typings" />
// src-code/code.ts
import { listenTS } from "./utils/code-utils"; // Assumindo que code-utils usa messaging.types
import { Layout } from './lib/layout';
import { Frames } from './lib/frames'; // Temporário, será substituído por nodeFactory
import { Connectors } from './lib/connectors';
import { nodeCache } from './utils/nodeCache'; // Para pré-carregar fontes

// 👇 CORREÇÃO: Usar o alias e o nome correto do arquivo de tipos
import type { NodeData, FlowData, Connection, FlowNode, Flow } from '@shared/types/flow.types';

// Importar Configurações
import * as StyleConfig from "./config/styles.config";
import * as LayoutConfig from "./config/layout.config";

// Debug mode para desenvolvimento
figma.showUI(__html__, {
  width: 624,
  height: 550,
  themeColors: true,
  title: 'IziFlow V2'
});

// Função auxiliar para debug (mantida)
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  console.log(formattedMessage, data || '');
  // Opcional: Enviar logs para a UI para debug visual
  // try {
  //   figma.ui.postMessage({
  //     type: 'debug',
  //     message: formattedMessage,
  //     data: data ? JSON.stringify(data, null, 2) : ''
  //   });
  // } catch (e) {
  //   console.warn("Falha ao enviar log de debug para UI:", e)
  // }
}

// Pré-carregador de fontes (função reutilizável)
async function preloadFonts() {
    debugLog('FontLoader', 'Iniciando pré-carregamento de fontes...');
    try {
        const fontsToLoad = StyleConfig.FontsToLoad; // Usar a lista do config
        await Promise.all(
            fontsToLoad.map(font => nodeCache.loadFont(font.family, font.style))
        );
        debugLog('FontLoader', `Fontes pré-carregadas: ${fontsToLoad.length}`);
    } catch (e: any) { // Tratar erro 'unknown'
        debugLog('FontLoader', 'Erro ao pré-carregar fontes:', e);
        figma.notify(`Erro ao carregar fontes: ${e?.message || e}`, { error: true });
        throw new Error("Falha no carregamento de fontes essenciais."); // Parar execução se fontes falharem
    }
}

// --- Lógica Principal ---
figma.ui.onmessage = async (msg: { type: string, [key: string]: any }) => {
  debugLog('Plugin', 'Mensagem recebida:', msg);

  if (msg.type === 'console') { // Se a UI envia logs para cá
    debugLog('UI', msg.message);
    return;
  }

  if (msg.type === 'generate-flow') {
    try {
      debugLog('Flow', 'Iniciando geração do fluxo...');

      // 1. Validação de Entrada (JSON string)
      if (typeof msg.json !== 'string' || msg.json.trim() === '') {
        throw new Error("Entrada JSON inválida: não é uma string ou está vazia.");
      }

      // 2. Parsing do JSON
      let jsonData: FlowData;
      try {
        jsonData = JSON.parse(msg.json);
      } catch (parseError: any) { // Tratar erro 'unknown'
         throw new Error(`Erro ao interpretar JSON: ${parseError?.message || parseError}`);
      }
      debugLog('Flow', 'JSON parseado com sucesso.');

      // 3. Determinar o Fluxo a ser Usado
      // Permite tanto { flows: [...] } quanto um objeto Flow na raiz
      const flow: Flow | undefined = jsonData.flows?.[0] || (jsonData.nodes && jsonData.connections ? jsonData as Flow : undefined);

      if (!flow || !Array.isArray(flow.nodes) || !Array.isArray(flow.connections)) {
        throw new Error("Estrutura JSON inválida: 'nodes' e 'connections' são obrigatórios dentro de um fluxo válido.");
      }
      const flowName = flow.flowName || 'Fluxo Sem Nome';
      debugLog('Flow', `Processando Flow: ${flowName}`);

      const flowNodes: FlowNode[] = flow.nodes;
      const flowConnections: Connection[] = flow.connections;

      if (flowNodes.length === 0) {
          throw new Error("O fluxo selecionado não contém nós.");
      }
      debugLog('Flow', `Nodes recebidos: ${flowNodes.length}, Conexões: ${flowConnections.length}`);

      // 4. Pré-carregar fontes (essencial antes de criar texto)
      await preloadFonts();

      // 5. Construir estrutura de dados interna (grafo)
      debugLog('Flow', 'Construindo grafo e mapa de dados...');
      const graph = Layout.buildGraph(flowNodes, flowConnections);
      const { adjacencyList, inDegree } = graph;
      const nodeDataMap: { [id: string]: NodeData } = {};
      flowNodes.forEach(node => { nodeDataMap[node.id] = node; });
      debugLog('Flow', 'Grafo e mapa de dados construídos.');

      // 6. Calcular Layout (níveis e posições)
      debugLog('Flow', 'Calculando layout...');
      let startNodeIds = flowNodes.filter(n => n.type === "START").map(n => n.id);
      if (startNodeIds.length === 0) {
        startNodeIds = flowNodes.filter(n => (inDegree[n.id] || 0) === 0).map(n => n.id);
        if (startNodeIds.length === 0 && flowNodes.length > 0) {
          startNodeIds = [flowNodes[0].id];
          debugLog('Flow', 'Nenhum nó START ou com inDegree 0. Usando o primeiro nó como fallback.', startNodeIds[0]);
        } else if (startNodeIds.length === 0) {
           throw new Error("Nenhum nó encontrado para iniciar o layout.");
        }
      }
      debugLog('Flow', 'Nós iniciais para layout:', startNodeIds);

      const nodeLevel: { [id: string]: number } = {};
      const queue: string[] = [...startNodeIds];
      startNodeIds.forEach(id => nodeLevel[id] = 0);
      let visitedCount = 0;
      const maxVisits = flowNodes.length * 2; // Limite para evitar loop infinito

      while (queue.length > 0 && visitedCount < maxVisits) {
        visitedCount++;
        const currentId = queue.shift()!;
        const currentLevel = nodeLevel[currentId];

        (adjacencyList[currentId] || []).forEach((nextId: string) => {
          if (nodeDataMap[nextId] && nodeLevel[nextId] === undefined) {
             nodeLevel[nextId] = currentLevel + 1;
             queue.push(nextId);
          }
        });
      }
      if (visitedCount >= maxVisits) { console.warn("[Flow] Limite de visitas atingido no cálculo de níveis. Possível ciclo ou nós desconectados."); }

      flowNodes.forEach(node => {
          if(nodeLevel[node.id] === undefined) {
              nodeLevel[node.id] = 0;
              debugLog('Flow', `Nó órfão '${node.name}' (ID: ${node.id}) atribuído ao nível 0.`);
          }
      });
      debugLog('Flow', 'Níveis calculados.', nodeLevel);

      const levelToNodes: { [level: number]: string[] } = {};
      Object.keys(nodeLevel).forEach((nodeId: string) => {
        const lvl = nodeLevel[nodeId];
        if (!levelToNodes[lvl]) levelToNodes[lvl] = [];
        levelToNodes[lvl].push(nodeId);
      });
      const sortedLevels = Object.keys(levelToNodes).map(n => parseInt(n, 10)).sort((a, b) => a - b);
      debugLog('Flow', 'Nós agrupados por nível.', levelToNodes);

      // 7. Criar e Posicionar Nós Figma
      debugLog('Flow', 'Criando e posicionando nós Figma...');
      const nodeMap: { [id: string]: SceneNode } = {};
      let currentX = 100;
      const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;
      const initialY = figma.viewport.center.y - 200; // Ajustar conforme necessário

      for (const level of sortedLevels) {
        debugLog('Flow', `Processando nível de layout ${level}`);
        const nodesAtLevel = levelToNodes[level];
        let levelMaxHeight = 0;
        let currentY = initialY; // Reset Y para cada nível

        for (const nodeId of nodesAtLevel) {
          const nodeData = nodeDataMap[nodeId];
          if (!nodeData) {
            console.warn(`[Flow] Dados não encontrados para nodeId ${nodeId} no nível ${level}. Pulando criação.`);
            continue;
          }

          debugLog('Flow', `Criando nó Figma para ${nodeId} (${nodeData.type})`);
          let frame: FrameNode | null = null;
          try {
            // Usar a factory de frames
            switch (nodeData.type) {
              case "START": frame = await Frames.createStartNode(nodeData); break;
              case "END": frame = await Frames.createEndNode(nodeData); break;
              case "STEP": case "ENTRYPOINT": frame = await Frames.createStepNode(nodeData); break;
              case "DECISION": frame = await Frames.createDecisionNode(nodeData); break;
              default:
                 console.warn(`[Flow] Tipo de nó desconhecido '${nodeData.type}'. Usando StepNode.`);
                 frame = await Frames.createStepNode(nodeData);
            }

            if (!frame) throw new Error(`Falha ao criar frame para nó ${nodeId}`);

            // Posicionamento (Layout Horizontal, Vertical dentro do nível)
            frame.x = currentX;
            frame.y = currentY;
            currentY += frame.height + LayoutConfig.Nodes.VERTICAL_SPACING;
            levelMaxHeight = Math.max(levelMaxHeight, frame.height);

            nodeMap[nodeId] = frame; // Armazena o nó criado
            figma.currentPage.appendChild(frame); // Adiciona o nó à página
            debugLog('Flow', `Nó ${nodeId} criado e posicionado em (${frame.x}, ${frame.y}). ID Figma: ${frame.id}`);

          } catch (nodeCreationError: any) { // Tratar erro 'unknown'
            const errorMsg = nodeCreationError?.message || nodeCreationError;
            debugLog('Error', `Erro ao criar ou posicionar nó ${nodeId}: ${errorMsg}`, nodeCreationError);
            figma.notify(`Erro ao criar nó '${nodeData.name || nodeId}': ${errorMsg}`, { error: true });
            // Continuar para outros nós
          }
        }
        // Avança X para o próximo nível baseado na largura máxima do nível atual
        let levelMaxWidth = 0;
         nodesAtLevel.forEach(nodeId => {
             if (nodeMap[nodeId]) { levelMaxWidth = Math.max(levelMaxWidth, nodeMap[nodeId].width); }
         });
        currentX += levelMaxWidth + horizontalSpacing;
      }
      debugLog('Flow', 'Posicionamento de nós concluído.');

      // 8. Criar Conexões Figma
      if (Object.keys(nodeMap).length > 0 && flowConnections.length > 0) {
          debugLog('Flow', 'Criando conexões Figma...');
          // Passa o nodeDataMap para a função de conectores
          await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap);
          debugLog('Flow', 'Criação de conexões concluída.');
      } else {
          debugLog('Flow', 'Pulando criação de conexões (sem nós criados ou sem conexões definidas).');
      }

      // 9. Finalização
      const allNodes = Object.values(nodeMap);
      if(allNodes.length > 0) {
          figma.viewport.scrollAndZoomIntoView(allNodes);
      }

      figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
      debugLog('Flow', 'Geração completa.');

    } catch (error: any) { // Erro geral do try principal
      console.error('[Flow] Erro fatal na geração:', error);
      const errorMessage = (error instanceof Error) ? error.message : String(error);
      debugLog('Error', `Falha GERAL na geração: ${errorMessage}`, error?.stack);
      figma.notify(`Erro fatal ao gerar fluxo: ${errorMessage}`, { error: true, timeout: 5000 });
    }
  } else {
    debugLog('Plugin', 'Tipo de mensagem desconhecido recebido da UI:', msg.type);
  }
};

// Listener para fechar o plugin (mantido)
listenTS("closePlugin", () => {
  figma.closePlugin();
});
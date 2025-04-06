import { listenTS } from "./utils/code-utils";
import { Layout } from './lib/layout';
import { Frames } from './lib/frames'; // Temporário, será substituído por nodeFactory
import { Connectors } from './lib/connectors';
import { nodeCache } from './utils/nodeCache'; // Para pré-carregar fontes

// Importar Tipos Centralizados
import type { NodeData, FlowData, Connection, FlowNode, Flow } from '../src/lib/types'; // Ajuste o caminho se necessário

// Importar Configurações
import * as StyleConfig from "./config/styles.config"; // Importa todas as exportações de estilos
import * as LayoutConfig from "./config/layout.config"; // Importa todas as exportações de layout

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
  figma.ui.postMessage({
    type: 'debug',
    message: formattedMessage,
    data: data ? JSON.stringify(data, null, 2) : ''
  });
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
    } catch (e) {
        debugLog('FontLoader', 'Erro ao pré-carregar fontes:', e);
        figma.notify("Erro ao carregar fontes necessárias para o plugin.", { error: true });
        // Considerar lançar o erro para impedir a execução se as fontes forem críticas
        // throw new Error("Falha no carregamento de fontes.");
    }
}

// --- Lógica Principal ---
figma.ui.onmessage = async (msg: { type: string, [key: string]: any }) => {
  debugLog('Plugin', 'Mensagem recebida:', msg);

  if (msg.type === 'console') {
    debugLog('UI', msg.message);
    return;
  }

  if (msg.type === 'generate-flow') {
    try {
      debugLog('Flow', 'Iniciando geração do fluxo...');

      if (typeof msg.json !== 'string' || msg.json.trim() === '') {
        throw new Error("Entrada JSON inválida: deve ser uma string não vazia.");
      }

      let jsonData: FlowData;
      try {
        jsonData = JSON.parse(msg.json);
      } catch (e) {
         throw new Error(`Erro ao parsear JSON: ${e.message}`);
      }

      debugLog('Flow', 'JSON parseado com sucesso.');

      // Determina qual fluxo usar (do array 'flows' ou do nível raiz)
      const flow: Flow | undefined = jsonData.flows?.[0] || (jsonData.nodes && jsonData.connections ? jsonData as Flow : undefined);

      if (!flow || !Array.isArray(flow.nodes) || !Array.isArray(flow.connections)) {
        throw new Error("Estrutura JSON inválida: 'nodes' e 'connections' são obrigatórios dentro de um fluxo.");
      }
      debugLog('Flow', `Flow selecionado: ${flow.flowName || 'Sem Nome'}`);

      // Usa os tipos importados
      const flowNodes: FlowNode[] = flow.nodes;
      const flowConnections: Connection[] = flow.connections;

      if (flowNodes.length === 0) {
          throw new Error("O fluxo não contém nós.");
      }

      debugLog('Flow', `Nodes recebidos: ${flowNodes.length}`);
      debugLog('Flow', `Connections recebidas: ${flowConnections.length}`);

      // 1. Pré-carregar fontes ANTES de criar qualquer nó de texto
      await preloadFonts();

      // 2. Construir estrutura de dados interna
      debugLog('Flow', 'Construindo grafo...');
      const graph = Layout.buildGraph(flowNodes, flowConnections);
      const { adjacencyList, inDegree } = graph;
      debugLog('Flow', 'Grafo construído.');

      // 3. Mapear dados dos nós por ID (necessário para conectores)
      const nodeDataMap: { [id: string]: NodeData } = {};
      flowNodes.forEach(node => {
        nodeDataMap[node.id] = node; // Usa o tipo NodeData importado
      });

      // 4. Calcular Layout (níveis e posições)
      debugLog('Flow', 'Calculando layout...');
      // Identificar nós iniciais
      let startNodeIds = flowNodes.filter(n => n.type === "START").map(n => n.id);
      if (startNodeIds.length === 0) {
        startNodeIds = flowNodes.filter(n => (inDegree[n.id] || 0) === 0).map(n => n.id);
      }
      if (startNodeIds.length === 0 && flowNodes.length > 0) {
         // Fallback: se não encontrar nós iniciais, pega o primeiro nó da lista
         startNodeIds = [flowNodes[0].id];
         debugLog('Flow', 'Nenhum nó inicial encontrado (START ou inDegree 0). Usando o primeiro nó como fallback.', startNodeIds[0]);
      } else if (startNodeIds.length === 0) {
         throw new Error("Nenhum nó encontrado para iniciar o cálculo de layout.");
      }
      debugLog('Flow', 'Nós iniciais para layout:', startNodeIds);

      // Calcular níveis (BFS)
      const nodeLevel: { [id: string]: number } = {};
      const queue: string[] = [...startNodeIds];
      startNodeIds.forEach(id => nodeLevel[id] = 0);

      let visitedCount = 0; // Para detectar ciclos ou nós desconectados
      const maxVisits = flowNodes.length * 2; // Limite generoso

      while (queue.length > 0 && visitedCount < maxVisits) {
        visitedCount++;
        const currentId = queue.shift()!;
        const currentLevel = nodeLevel[currentId];

        (adjacencyList[currentId] || []).forEach((nextId: string) => {
          // Processa apenas se o próximo nó existe e não foi nivelado ainda OU
          // se encontramos um caminho mais curto (embora BFS garanta isso na primeira visita)
          if (nodeDataMap[nextId] && nodeLevel[nextId] === undefined) {
             nodeLevel[nextId] = currentLevel + 1;
             queue.push(nextId);
          }
        });
      }

       if(visitedCount >= maxVisits) {
           console.warn("[Flow] Possível ciclo ou nós desconectados detectados durante o cálculo de níveis.");
       }

      // Atribuir nível 0 a nós não alcançados (órfãos)
      flowNodes.forEach(node => {
          if(nodeLevel[node.id] === undefined) {
              nodeLevel[node.id] = 0;
              debugLog('Flow', `Nó órfão '${node.name}' (ID: ${node.id}) atribuído ao nível 0.`);
          }
      });

      debugLog('Flow', 'Níveis calculados:', nodeLevel);

      // Agrupar nós por nível
      const levelToNodes: { [level: number]: string[] } = {};
      Object.keys(nodeLevel).forEach((nodeId: string) => {
        const lvl = nodeLevel[nodeId];
        if (!levelToNodes[lvl]) levelToNodes[lvl] = [];
        levelToNodes[lvl].push(nodeId);
      });
      debugLog('Flow', 'Nós agrupados por nível:', levelToNodes);

      const sortedLevels = Object.keys(levelToNodes)
            .map(n => parseInt(n, 10))
            .sort((a, b) => a - b);

      // 5. Criar e Posicionar Nós Figma
      debugLog('Flow', 'Criando e posicionando nós Figma...');
      const nodeMap: { [id: string]: SceneNode } = {}; // Mapeia ID para SceneNode criado
      let currentX = 100; // Posição inicial X
      const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING; // Usar config
      const initialY = figma.viewport.center.y - 200; // Ajustar Y inicial se necessário

      for (const level of sortedLevels) {
        debugLog('Flow', `Processando nível de layout ${level}`);
        const nodesAtLevel = levelToNodes[level];
        let levelMaxHeight = 0; // Para calcular o Y do próximo nível, se necessário
        let currentY = initialY; // Resetar Y para cada nível (ou ajustar se quiser layout vertical)

        // Nós dentro do mesmo nível são posicionados verticalmente por enquanto
        // (Pode ser ajustado para usar LayoutConfig.Nodes.VERTICAL_SPACING)
        for (const nodeId of nodesAtLevel) {
          const nodeData = nodeDataMap[nodeId];
          if (!nodeData) {
            console.warn(`[Flow] Dados não encontrados para nodeId ${nodeId} no nível ${level}. Pulando criação.`);
            continue;
          }

          debugLog('Flow', `Criando nó Figma para ${nodeId} (${nodeData.type})`);
          let frame: FrameNode | null = null;
          try {
            // Usar a factory de frames (substituir pelo nodeFactory quando implementado)
            switch (nodeData.type) {
              case "START": frame = await Frames.createStartNode(nodeData); break;
              case "END": frame = await Frames.createEndNode(nodeData); break;
              case "STEP": case "ENTRYPOINT": frame = await Frames.createStepNode(nodeData); break;
              case "DECISION": frame = await Frames.createDecisionNode(nodeData); break;
              default:
                 console.warn(`[Flow] Tipo de nó desconhecido '${nodeData.type}'. Usando StepNode como fallback.`);
                 frame = await Frames.createStepNode(nodeData);
            }

            if (!frame) throw new Error(`Falha ao criar frame para nó ${nodeId}`);

            // Posicionamento
            frame.x = currentX;
            // Ajuste Y para centralizar verticalmente no nível (ou empilhar)
            // Esta lógica simples empilha verticalmente dentro do nível
            frame.y = currentY;
            currentY += frame.height + LayoutConfig.Nodes.VERTICAL_SPACING; // Empilha com espaçamento vertical
            levelMaxHeight = Math.max(levelMaxHeight, frame.height); // Guarda a maior altura (útil se centralizar)

            nodeMap[nodeId] = frame; // Armazena o nó criado
            debugLog('Flow', `Nó ${nodeId} criado e posicionado. ID Figma: ${frame.id}`);

          } catch (error) {
            debugLog('Error', `Erro ao criar ou posicionar nó ${nodeId}`, error);
            // Continuar para outros nós, mas registrar o erro
             figma.notify(`Erro ao criar nó '${nodeData.name || nodeId}'.`, { error: true });
          }
        }
        // Avança X para o próximo nível
        // Encontra a largura máxima do nível atual para um espaçamento consistente
        let levelMaxWidth = 0;
         nodesAtLevel.forEach(nodeId => {
             if (nodeMap[nodeId]) {
                 levelMaxWidth = Math.max(levelMaxWidth, nodeMap[nodeId].width);
             }
         });
        currentX += levelMaxWidth + horizontalSpacing;
      }
      debugLog('Flow', 'Posicionamento de nós concluído.');


      // 6. Criar Conexões Figma
      if (Object.keys(nodeMap).length > 0 && flowConnections.length > 0) {
          debugLog('Flow', 'Criando conexões Figma...');
          // Passa o nodeDataMap para a função de conectores
          await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap);
          debugLog('Flow', 'Criação de conexões concluída.');
      } else {
          debugLog('Flow', 'Pulando criação de conexões (sem nós criados ou sem conexões definidas).');
      }

      // 7. Finalização
      // Centralizar a viewport no fluxo gerado (opcional)
      const allNodes = Object.values(nodeMap);
      if(allNodes.length > 0) {
          figma.viewport.scrollAndZoomIntoView(allNodes);
      }

      figma.notify("Fluxo gerado com sucesso!");
      debugLog('Flow', 'Geração completa.');

    } catch (error: any) {
      console.error('[Flow] Erro geral na geração:', error);
      debugLog('Error', `Falha na geração: ${error.message}`, error.stack);
      figma.notify(`Erro ao gerar fluxo: ${error.message}`, { error: true, timeout: 5000 });
    }
  } else {
    debugLog('Plugin', 'Tipo de mensagem desconhecido recebido da UI:', msg.type);
  }
};

// Listener para fechar o plugin (mantido)
listenTS("closePlugin", () => {
  figma.closePlugin();
});
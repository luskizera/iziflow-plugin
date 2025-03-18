import { listenTS } from "./utils/code-utils";
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';

// Debug mode para desenvolvimento
figma.showUI(__html__, { 
  width: 624, 
  height: 550,
  themeColors: true,
  title: 'IziFlow V2 (Debug Mode)'
});

// Função auxiliar para debug
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  console.log(formattedMessage, data || '');
  figma.ui.postMessage({ 
    type: 'debug', 
    message: formattedMessage,
    data: data ? JSON.stringify(data, null, 2) : ''
  });
}

figma.ui.onmessage = async (msg) => {
  debugLog('Plugin', 'Mensagem recebida:', msg);

  if (msg.type === 'console') {
    debugLog('UI', msg.message);
    return;
  }
  
  if (msg.type === 'generate-flow') {
    try {
      debugLog('Flow', 'Iniciando geração');
      
      if (typeof msg.json !== 'string') {
        throw new Error("JSON inválido: deve ser uma string");
      }

      const jsonData = JSON.parse(msg.json);
      debugLog('Flow', 'JSON parseado', jsonData);
      
      const flow = jsonData.flows?.[0] || jsonData;
      debugLog('Flow', 'Flow selecionado', flow);

      if (!flow.nodes || !flow.connections) {
        throw new Error("JSON inválido: faltam 'nodes' ou 'connections'.");
      }

      const { nodes, connections } = flow;
      debugLog('Flow', 'Nodes', nodes);
      debugLog('Flow', 'Connections', connections);

      // Carregar fontes
      debugLog('Flow', 'Carregando fontes...');
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Regular" }),
        figma.loadFontAsync({ family: "Inter", style: "Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Medium" })
      ]);
      debugLog('Flow', 'Fontes carregadas');

      // Construir grafo
      debugLog('Flow', 'Construindo grafo...');
      const graph = Layout.buildGraph(nodes, connections);
      const { adjacencyList, inDegree } = graph;
      debugLog('Flow', 'Grafo construído', graph);

      // Identificar nós iniciais
      let startNodes = nodes.filter((n: any) => n.type === "START");
      if (startNodes.length === 0) {
        startNodes = nodes.filter((n: any) => inDegree[n.id] === 0);
      }
      debugLog('Flow', 'Nós iniciais', startNodes);

      // Calcular níveis
      const nodeLevel: { [id: string]: number } = {};
      const queue: string[] = [];
      startNodes.forEach((n: any) => {
        nodeLevel[n.id] = 0;
        queue.push(n.id);
      });

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentLevel = nodeLevel[current];
        adjacencyList[current].forEach((nextId: string) => {
          if (nodeLevel[nextId] === undefined) {
            nodeLevel[nextId] = currentLevel + 1;
            queue.push(nextId);
          }
        });
      }
      debugLog('Flow', 'Níveis calculados', nodeLevel);

      // Agrupar nós
      const levelToNodes: { [level: number]: string[] } = {};
      Object.keys(nodeLevel).forEach((nodeId: string) => {
        const lvl = nodeLevel[nodeId];
        if (!levelToNodes[lvl]) {
          levelToNodes[lvl] = [];
        }
        levelToNodes[lvl].push(nodeId);
      });
      debugLog('Flow', 'Nós agrupados por nível', levelToNodes);

      const sortedLevels = Layout.getSortedLevels(levelToNodes);
      const nodeMap: { [id: string]: SceneNode } = {};

      // Criar e posicionar nós
      let currentX = 100;
      const centerY = figma.viewport.center.y;

      for (const level of sortedLevels) {
        debugLog('Flow', `Processando nível ${level}`);
        const nodesAtLevel = levelToNodes[level];
        for (const nodeId of nodesAtLevel) {
          const nodeData = nodes.find((n: any) => n.id === nodeId);
          
          debugLog('Flow', `Criando nó ${nodeId}`, {
            id: nodeData.id,
            name: nodeData.name,
            type: nodeData.type,
            metadata: nodeData.metadata || {}
          });
          
          let frame: FrameNode | null = null;
          
          try {
            switch (nodeData.type) {
              case "START":
                frame = await Frames.createStartNode(nodeData);
                break;
              case "END":
                frame = await Frames.createEndNode(nodeData);
                break;
              case "STEP":
              case "ENTRYPOINT":
                frame = await Frames.createStepNode(nodeData);
                break;
              case "DECISION":
                frame = await Frames.createDecisionNode(nodeData);
                break;
              default:
                frame = await Frames.createStepNode(nodeData);
            }

            if (!frame) throw new Error(`Falha ao criar nó ${nodeId}`);
            
            frame.x = currentX;
            frame.y = centerY - frame.height / 2;
            currentX += frame.width + 300;
            nodeMap[nodeId] = frame;
            
            debugLog('Flow', `Nó ${nodeId} criado`, { frameId: frame.id });
          } catch (error) {
            debugLog('Error', `Erro ao criar nó ${nodeId}`, error);
            throw error;
          }
        }
      }

      // Criar conexões
      debugLog('Flow', 'Criando conexões...');
      Connectors.createConnectors(connections, nodeMap);
      debugLog('Flow', 'Conexões criadas');

      figma.notify("Fluxo gerado com sucesso!");
      debugLog('Flow', 'Geração concluída com sucesso');
    } catch (error) {
      console.error('Erro:', error);
      figma.notify(`Erro: ${error.message}`);
    }
  } else {
    debugLog('Plugin', 'Tipo de mensagem desconhecido', msg.type);
  }
};

listenTS("closePlugin", () => {
  figma.closePlugin();
});

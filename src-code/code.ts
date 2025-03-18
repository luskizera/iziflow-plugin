import { listenTS } from "./utils/code-utils";
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';
import { Logger } from './utils/logger';

export interface EventTS {
  'generate-flow': {
    json: string;
  };
  closePlugin: {};
}

figma.showUI(__html__, { 
  width: 624, 
  height: 550, // Ajuste este valor conforme necessário
  themeColors: true 
});

figma.ui.onmessage = async (msg) => {
  Logger.info('Plugin', 'Mensagem recebida', msg);

  if (msg.type === 'console') {
    Logger.debug('UI', msg.message);
    return;
  }
  
  if (msg.type === 'generate-flow') {
    try {
      Logger.info('Flow', 'Iniciando geração');
      
      if (typeof msg.json !== 'string') {
        throw new Error("JSON inválido: deve ser uma string");
      }

      const jsonData = JSON.parse(msg.json);
      Logger.debug('Flow', 'JSON parseado', jsonData);
      
      const flow = jsonData.flows?.[0] || jsonData;
      Logger.debug('Flow', 'Flow selecionado', flow);

      if (!flow.nodes || !flow.connections) {
        throw new Error("JSON inválido: faltam 'nodes' ou 'connections'.");
      }

      const { nodes, connections } = flow;
      Logger.debug('Flow', 'Nodes', nodes);
      Logger.debug('Flow', 'Connections', connections);

      // Carregar fontes
      Logger.info('Flow', 'Carregando fontes...');
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Regular" }),
        figma.loadFontAsync({ family: "Inter", style: "Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Medium" })
      ]);
      Logger.info('Flow', 'Fontes carregadas');

      // Construir grafo
      Logger.info('Flow', 'Construindo grafo...');
      const graph = Layout.buildGraph(nodes, connections);
      const { adjacencyList, inDegree } = graph;
      Logger.debug('Flow', 'Grafo construído', graph);

      // Identificar nós iniciais
      let startNodes = nodes.filter((n: any) => n.type === "START");
      if (startNodes.length === 0) {
        startNodes = nodes.filter((n: any) => inDegree[n.id] === 0);
      }
      Logger.debug('Flow', 'Nós iniciais', startNodes);

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
      Logger.debug('Flow', 'Níveis calculados', nodeLevel);

      // Agrupar nós
      const levelToNodes: { [level: number]: string[] } = {};
      Object.keys(nodeLevel).forEach((nodeId: string) => {
        const lvl = nodeLevel[nodeId];
        if (!levelToNodes[lvl]) {
          levelToNodes[lvl] = [];
        }
        levelToNodes[lvl].push(nodeId);
      });
      Logger.debug('Flow', 'Nós agrupados por nível', levelToNodes);

      const sortedLevels = Layout.getSortedLevels(levelToNodes);
      const nodeMap: { [id: string]: SceneNode } = {};

      // Criar e posicionar nós
      let currentX = 100;
      const centerY = figma.viewport.center.y;

      for (const level of sortedLevels) {
        Logger.info('Flow', `Processando nível ${level}`);
        const nodesAtLevel = levelToNodes[level];
        for (const nodeId of nodesAtLevel) {
          const nodeData = nodes.find((n: any) => n.id === nodeId);
          Logger.debug('Flow', `Criando nó ${nodeId}`, nodeData);
          
          let frame: FrameNode;
          switch (nodeData.type) {
            case "START":
              frame = await Frames.createStartNode(nodeData);
              break;
            case "END":
              frame = await Frames.createEndNode(nodeData);
              break;
            case "STEP":
              frame = await Frames.createStepNode(nodeData);
              break;
            case "DECISION":
              frame = await Frames.createDecisionNode(nodeData);
              break;
            default:
              frame = await Frames.createStepNode(nodeData);
          }

          frame.x = currentX;
          frame.y = centerY - frame.height / 2;
          currentX += frame.width + 300;
          nodeMap[nodeId] = frame;
          Logger.debug('Flow', `Nó ${nodeId} criado e posicionado`, frame);
        }
      }

      // Criar conexões
      Logger.info('Flow', 'Criando conexões...');
      Connectors.createConnectors(connections, nodeMap);
      Logger.info('Flow', 'Conexões criadas');

      figma.notify("Fluxo gerado com sucesso!");
      Logger.success('Flow', 'Geração concluída com sucesso');
    } catch (error) {
      Logger.error('Flow', 'Erro na geração', error);
      figma.notify(`Erro: ${error.message}`);
    }
  } else {
    Logger.warn('Plugin', 'Tipo de mensagem desconhecido', msg.type);
  }
};

listenTS("closePlugin", () => {
  figma.closePlugin();
});

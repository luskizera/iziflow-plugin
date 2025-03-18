import { listenTS } from "./utils/code-utils";
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';

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
  console.log("1. Plugin recebeu mensagem:", msg);
  
  if (msg.type === 'generate-flow') {
    try {
      console.log("2. Iniciando geração do fluxo");
      console.log("3. Dados recebidos:", msg.json);
      
      const jsonData = JSON.parse(msg.json);
      console.log('D. JSON parseado:', jsonData);
      
      const flow = jsonData.flows?.[0] || jsonData;
      console.log('3. Flow selecionado:', flow);

      if (!flow.nodes || !flow.connections) {
        throw new Error("JSON inválido: faltam 'nodes' ou 'connections'.");
      }

      const { nodes, connections } = flow;
      console.log('4. Nodes:', nodes);
      console.log('5. Connections:', connections);

      // Carregar fontes
      console.log('6. Carregando fontes...');
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Regular" }),
        figma.loadFontAsync({ family: "Inter", style: "Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Medium" })
      ]);
      console.log('7. Fontes carregadas');

      // Construir grafo
      console.log('8. Construindo grafo...');
      const graph = Layout.buildGraph(nodes, connections);
      const { adjacencyList, inDegree } = graph;
      console.log('9. Grafo construído:', graph);

      // Identificar nós iniciais
      let startNodes = nodes.filter((n: any) => n.type === "START");
      if (startNodes.length === 0) {
        startNodes = nodes.filter((n: any) => inDegree[n.id] === 0);
      }
      console.log('10. Nós iniciais:', startNodes);

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
      console.log('11. Níveis calculados:', nodeLevel);

      // Agrupar nós
      const levelToNodes: { [level: number]: string[] } = {};
      Object.keys(nodeLevel).forEach((nodeId: string) => {
        const lvl = nodeLevel[nodeId];
        if (!levelToNodes[lvl]) {
          levelToNodes[lvl] = [];
        }
        levelToNodes[lvl].push(nodeId);
      });
      console.log('12. Nós agrupados por nível:', levelToNodes);

      const sortedLevels = Layout.getSortedLevels(levelToNodes);
      const nodeMap: { [id: string]: SceneNode } = {};

      // Criar e posicionar nós
      let currentX = 100;
      const centerY = figma.viewport.center.y;

      for (const level of sortedLevels) {
        console.log(`13. Processando nível ${level}`);
        const nodesAtLevel = levelToNodes[level];
        for (const nodeId of nodesAtLevel) {
          const nodeData = nodes.find((n: any) => n.id === nodeId);
          console.log(`14. Criando nó ${nodeId}:`, nodeData);
          
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
          console.log(`15. Nó ${nodeId} criado e posicionado:`, frame);
        }
      }

      // Criar conexões
      console.log('16. Criando conexões...');
      Connectors.createConnectors(connections, nodeMap);
      console.log('17. Conexões criadas');

      figma.notify("Fluxo gerado com sucesso!");
    } catch (error) {
      console.error('Erro no plugin:', error);
      figma.notify(`Erro: ${error.message}`);
    }
  } else {
    console.log('Tipo de mensagem desconhecido:', msg.type);
  }
};

listenTS("closePlugin", () => {
  figma.closePlugin();
});

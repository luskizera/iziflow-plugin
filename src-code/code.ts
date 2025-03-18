import { listenTS } from "./utils/code-utils";
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';

figma.showUI(__html__, { width: 624, height: 550 });

figma.ui.onmessage = async (msg: any) => {
  if (msg.type === 'generate-flow') {
    try {
      const jsonData = JSON.parse(msg.json);
      const flow = jsonData.flows?.[0] || jsonData;

      if (!flow.nodes || !flow.connections) {
        throw new Error("JSON inválido: faltam 'nodes' ou 'connections'.");
      }

      const { nodes, connections } = flow;

      // Carregar fontes
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Regular" }),
        figma.loadFontAsync({ family: "Inter", style: "Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
        figma.loadFontAsync({ family: "Inter", style: "Medium" })
      ]);

      // Construir grafo e calcular níveis
      const graph = Layout.buildGraph(nodes, connections);
      const { adjacencyList, inDegree } = graph;

      // Identificar nós iniciais
      let startNodes = nodes.filter((n: any) => n.type === "START");
      if (startNodes.length === 0) {
        startNodes = nodes.filter((n: any) => inDegree[n.id] === 0);
      }

      // Calcular níveis dos nós usando BFS
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

      // Agrupar nós por nível
      const levelToNodes: { [level: number]: string[] } = {};
      Object.keys(nodeLevel).forEach((nodeId: string) => {
        const lvl = nodeLevel[nodeId];
        if (!levelToNodes[lvl]) {
          levelToNodes[lvl] = [];
        }
        levelToNodes[lvl].push(nodeId);
      });

      const sortedLevels = Layout.getSortedLevels(levelToNodes);
      const nodeMap: { [id: string]: SceneNode } = {};

      // Posicionar nós
      let currentX = 100;
      const centerY = figma.viewport.center.y;

      for (const level of sortedLevels) {
        const nodesAtLevel = levelToNodes[level];
        for (const nodeId of nodesAtLevel) {
          const nodeData = nodes.find((n: any) => n.id === nodeId);
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
        }
      }

      // Criar conexões
      Connectors.createConnectors(connections, nodeMap);

      figma.notify("Fluxo gerado com sucesso!");
    } catch (error: any) {
      figma.notify(`Erro: ${error.message}`);
    }
  }
};

listenTS("closePlugin", () => {
  figma.closePlugin();
});

// code.ts
// Tipos básicos (substitua pelos seus tipos reais de parser.ts, layout.ts, connectors.ts)
interface FlowJSON {
  nodes: { id: string; label: string }[];
  connections: { from: string; to: string }[];
}

interface NodeData {
  node: SceneNode;
  // Outros campos conforme necessário
}

// Funções simuladas (copie o conteúdo real de parser.ts, layout.ts, connectors.ts aqui)
function parseJSON(flowData: FlowJSON): Map<string, NodeData> {
  const nodeMap = new Map<string, NodeData>();
  for (const node of flowData.nodes) {
    const sceneNode = figma.createRectangle(); // Exemplo, ajuste conforme seu código
    sceneNode.name = node.label;
    nodeMap.set(node.id, { node: sceneNode });
  }
  return nodeMap;
}

function layoutNodes(nodes: Map<string, SceneNode>, connections: { from: string; to: string }[], spacing: number) {
  let x = 0;
  for (const node of nodes.values()) {
    node.x = x;
    node.y = 0;
    x += spacing;
  }
}

function createConnectors(connections: { from: string; to: string }[], nodeMap: Map<string, NodeData>) {
  for (const conn of connections) {
    const fromNode = nodeMap.get(conn.from)?.node;
    const toNode = nodeMap.get(conn.to)?.node;
    if (fromNode && toNode) {
      const line = figma.createLine();
      line.x = fromNode.x;
      line.y = fromNode.y;
      // Ajuste conforme sua lógica real
    }
  }
}

// Código principal do plugin
figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate-flow") {
    try {
      const flowData: FlowJSON = JSON.parse(msg.json);
      const nodeMap = await parseJSON(flowData);

      const sceneNodeMap = new Map<string, SceneNode>([...nodeMap].map(([id, data]) => [id, data.node]));
      layoutNodes(sceneNodeMap, flowData.connections, 300);
      createConnectors(flowData.connections, nodeMap);

      figma.viewport.scrollAndZoomIntoView([...sceneNodeMap.values()]);
      figma.notify("Fluxo criado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao gerar o fluxo:", error.message);
        figma.notify(`Erro: ${error.message}`);
      } else {
        console.error("Erro desconhecido", error);
        figma.notify("Ocorreu um erro desconhecido.");
      }
    } finally {
      figma.closePlugin();
    }
  }
};
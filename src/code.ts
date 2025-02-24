figma.showUI(__html__, { width: 624, height: 400 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate-flow") {
    try {
      const flowData: Parser.FlowJSON = JSON.parse(msg.json);
      const nodeMap = await Parser.parseJSON(flowData);

      const sceneNodeMap = new Map<string, SceneNode>(
        [...nodeMap].map(([id, data]) => [id, data.node])
      );

      Layout.layoutNodes(sceneNodeMap, flowData.connections, 300);
      Connectors.createConnectors(flowData.connections, nodeMap);

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

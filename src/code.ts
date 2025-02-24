import { createConnectors } from "./core/connectors";
import { layoutNodes } from "./core/layout";
import { FlowJSON, parseJSON } from "./core/parser";

figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  console.log("Mensagem recebida do UI:", msg); // Log para verificar a mensagem recebida

  if (msg.type === "generate-flow") {
    try {
      const flowData: FlowJSON = JSON.parse(msg.json);
      console.log("JSON recebido:", flowData); // Loga o JSON para validação

      const nodeMap = await parseJSON(flowData); // Função que cria os nós
      layoutNodes(new Map([...nodeMap].map(([id, data]) => [id, data.node])), flowData.connections, 300);
      createConnectors(flowData.connections, nodeMap);

      figma.notify("Fluxo criado com sucesso!");
      figma.closePlugin();
    } catch (error) {
      console.error("Erro ao gerar o fluxo:", error); // Captura e exibe erros
      figma.notify(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      figma.closePlugin();
    }
  }
};


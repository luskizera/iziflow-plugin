import { createDecisionNode } from "./nodes/decisionNode"; // Ajuste o caminho para "./core/decisionNode" se necessário

interface FlowJSON {
  flowName: string;
  // Adicione outros campos conforme necessário
}

figma.ui.onmessage = async (msg) => {
  console.log("Mensagem recebida:", msg); // Log para debug
  if (msg.type === "generate-flow") {
    try {
      const flowData: FlowJSON = JSON.parse(msg.json);
      console.log("Dados do fluxo:", flowData); // Log para debug
      const frame = createDecisionNode({ name: flowData.flowName || "Meu Fluxo" });
      figma.currentPage.appendChild(frame);
      figma.viewport.scrollAndZoomIntoView([frame]);
      figma.notify(`Fluxo "${flowData.flowName}" criado com sucesso!`);
    } catch (error) {
      figma.notify("Erro ao gerar o fluxo: JSON inválido ou formato incorreto");
      console.error("Erro detalhado:", error);
    } finally {
      figma.closePlugin(); // Garante que o plugin feche após a execução
    }
  }
};
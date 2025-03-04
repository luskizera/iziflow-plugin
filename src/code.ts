import { parseJSON, FlowJSON } from "./core/parser";
import { layoutNodes } from "./core/layout";
import { createConnectors } from "./core/connectors";

// Injeção de HTML via esbuild
declare const __html__: string;

async function loadFonts() {
    try {
        await figma.loadFontAsync({ family: "Inter", style: "Regular" });
        await figma.loadFontAsync({ family: "Inter", style: "Medium" });
        await figma.loadFontAsync({ family: "Inter", style: "Bold" });
        await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    } catch (error) {
        console.error("Erro ao carregar fontes:", error);
        figma.notify("Erro ao carregar fontes.");
        throw error;
    }
}

figma.showUI(__html__, { width: 624, height: 400 });

figma.ui.onmessage = async (msg: { type: string; json?: string }) => {
    if (msg.type === "generate-flow" && msg.json) {
        try {
            await loadFonts();

            const flowData: FlowJSON = JSON.parse(msg.json);
            const nodeMap = await parseJSON(flowData);

            const sceneNodeMap = new Map(
                [...nodeMap].map(([id, data]) => [id, data.node])
            );

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
        }
    }
};

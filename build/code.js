"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function parseJSON(flowData) {
    const nodeMap = new Map();
    for (const node of flowData.nodes) {
        const sceneNode = figma.createRectangle();
        sceneNode.name = node.label;
        nodeMap.set(node.id, { node: sceneNode });
    }
    return nodeMap;
}
function layoutNodes(nodes, connections, spacing) {
    let x = 0;
    for (const node of nodes.values()) {
        node.x = x;
        node.y = 0;
        x += spacing;
    }
}
function createConnectors(connections, nodeMap) {
    var _a, _b;
    for (const conn of connections) {
        const fromNode = (_a = nodeMap.get(conn.from)) === null || _a === void 0 ? void 0 : _a.node;
        const toNode = (_b = nodeMap.get(conn.to)) === null || _b === void 0 ? void 0 : _b.node;
        if (fromNode && toNode) {
            const line = figma.createLine();
            line.x = fromNode.x;
            line.y = fromNode.y;
        }
    }
}
figma.showUI(__html__);
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === "generate-flow") {
        try {
            const flowData = JSON.parse(msg.json);
            const nodeMap = yield parseJSON(flowData);
            const sceneNodeMap = new Map([...nodeMap].map(([id, data]) => [id, data.node]));
            layoutNodes(sceneNodeMap, flowData.connections, 300);
            createConnectors(flowData.connections, nodeMap);
            figma.viewport.scrollAndZoomIntoView([...sceneNodeMap.values()]);
            figma.notify("Fluxo criado com sucesso!");
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Erro ao gerar o fluxo:", error.message);
                figma.notify(`Erro: ${error.message}`);
            }
            else {
                console.error("Erro desconhecido", error);
                figma.notify("Ocorreu um erro desconhecido.");
            }
        }
        finally {
            figma.closePlugin();
        }
    }
});

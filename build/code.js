var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("nodes/decisionNode", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function createDecisionNode(dataOrNode) {
        const name = "name" in dataOrNode ? dataOrNode.name : dataOrNode.name;
        const frame = figma.createFrame();
        frame.name = name || "DECISION";
        frame.resize(300, 200);
        frame.layoutMode = "VERTICAL";
        frame.counterAxisSizingMode = "AUTO";
        frame.primaryAxisAlignItems = "CENTER";
        frame.primaryAxisSizingMode = "AUTO";
        frame.paddingTop = 16;
        frame.paddingBottom = 16;
        frame.paddingLeft = 16;
        frame.paddingRight = 16;
        const polygon = figma.createPolygon();
        polygon.pointCount = 4;
        polygon.resize(200, 300);
        polygon.rotation = 90;
        polygon.fills = [{ type: "SOLID", color: hexToRgb("#A3A3A3") }];
        polygon.name = "Polygon";
        const text = figma.createText();
        frame.appendChild(polygon);
        frame.appendChild(text);
        return frame;
    }
    exports_1("createDecisionNode", createDecisionNode);
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
    }
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("nodes/endNode", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    function createEndNode(nodeData) {
        const endNode = figma.createFrame();
        endNode.name = nodeData.name || "END";
        endNode.resize(140, 140);
        endNode.cornerRadius = 400;
        endNode.layoutMode = "VERTICAL";
        endNode.counterAxisSizingMode = "AUTO";
        endNode.primaryAxisAlignItems = "CENTER";
        endNode.primaryAxisSizingMode = "AUTO";
        endNode.paddingTop = 55.5;
        endNode.paddingBottom = 55.5;
        endNode.paddingLeft = 30;
        endNode.paddingRight = 30;
        endNode.fills = [{
                type: 'SOLID',
                color: hexToRGB('#18181B')
            }];
        const textNode = figma.createText();
        figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
            textNode.characters = "END";
            textNode.fontSize = 24;
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.textAlignHorizontal = "CENTER";
            textNode.textAlignVertical = "CENTER";
            textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }];
            endNode.appendChild(textNode);
        });
        return endNode;
    }
    exports_2("createEndNode", createEndNode);
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("nodes/chipNode", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function createChipNode(type) {
        const chip = figma.createFrame();
        chip.layoutMode = 'HORIZONTAL';
        chip.counterAxisSizingMode = 'AUTO';
        chip.primaryAxisSizingMode = 'AUTO';
        chip.paddingLeft = 16;
        chip.paddingRight = 16;
        chip.paddingTop = 2;
        chip.paddingBottom = 2;
        chip.cornerRadius = 8;
        chip.strokeWeight = 0;
        chip.fills = [{
                type: 'SOLID',
                color: hexToRGB('#18181B')
            }];
        const textNode = figma.createText();
        textNode.characters = type.toUpperCase();
        textNode.fontSize = 12;
        textNode.fontName = { family: "Inter", style: "Bold" };
        textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }];
        chip.appendChild(textNode);
        return chip;
    }
    exports_3("createChipNode", createChipNode);
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("nodes/entrypointNode", ["nodes/chipNode"], function (exports_4, context_4) {
    "use strict";
    var chipNode_1;
    var __moduleName = context_4 && context_4.id;
    function createEntryPointNode(nodeData) {
        const entryNode = figma.createFrame();
        entryNode.name = nodeData.name || "ENTRYPOINT";
        entryNode.layoutMode = "VERTICAL";
        entryNode.primaryAxisAlignItems = "MIN";
        entryNode.counterAxisSizingMode = "FIXED";
        entryNode.primaryAxisSizingMode = "AUTO";
        entryNode.resize(400, 0);
        entryNode.paddingTop = 24;
        entryNode.paddingBottom = 24;
        entryNode.paddingLeft = 24;
        entryNode.paddingRight = 24;
        entryNode.cornerRadius = 24;
        entryNode.strokeWeight = 2;
        entryNode.fills = [{ type: 'SOLID', color: hexToRGB('#F4F4F5') }];
        entryNode.strokes = [{
                type: "SOLID",
                color: hexToRGB("#A1A1AA")
            }];
        entryNode.dashPattern = [4, 4];
        entryNode.itemSpacing = 8;
        const chip = chipNode_1.createChipNode("ENTRYPOINT");
        entryNode.appendChild(chip);
        const nameText = figma.createText();
        figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }).then(() => {
            nameText.characters = nodeData.name;
            nameText.fontSize = 24;
            nameText.fontName = { family: "Inter", style: "Semi Bold" };
            nameText.textAlignHorizontal = "LEFT";
            nameText.textAlignVertical = "TOP";
            nameText.fills = [{ type: 'SOLID', color: hexToRGB('#09090B') }];
            nameText.resizeWithoutConstraints(352, nameText.height);
            nameText.textAutoResize = "HEIGHT";
            entryNode.appendChild(nameText);
        });
        return entryNode;
    }
    exports_4("createEntryPointNode", createEntryPointNode);
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
    return {
        setters: [
            function (chipNode_1_1) {
                chipNode_1 = chipNode_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("nodes/startNode", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function createStartNode(nodeData) {
        const startNode = figma.createFrame();
        startNode.name = nodeData.name || "START";
        startNode.resize(140, 140);
        startNode.cornerRadius = 400;
        startNode.layoutMode = "VERTICAL";
        startNode.counterAxisSizingMode = "AUTO";
        startNode.primaryAxisAlignItems = "CENTER";
        startNode.primaryAxisSizingMode = "AUTO";
        startNode.paddingTop = 55.5;
        startNode.paddingBottom = 55.5;
        startNode.paddingLeft = 30;
        startNode.paddingRight = 30;
        startNode.fills = [{
                type: 'SOLID',
                color: hexToRGB('#18181B')
            }];
        const textNode = figma.createText();
        figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
            textNode.characters = "START";
            textNode.fontSize = 24;
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.textAlignHorizontal = "CENTER";
            textNode.textAlignVertical = "CENTER";
            textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }];
            startNode.appendChild(textNode);
        });
        return startNode;
    }
    exports_5("createStartNode", createStartNode);
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("nodes/stepNode", ["nodes/chipNode"], function (exports_6, context_6) {
    "use strict";
    var chipNode_2;
    var __moduleName = context_6 && context_6.id;
    function createStepNode(nodeData) {
        const stepNode = figma.createFrame();
        stepNode.name = nodeData.name;
        stepNode.layoutMode = "VERTICAL";
        stepNode.counterAxisSizingMode = "FIXED";
        stepNode.primaryAxisSizingMode = "AUTO";
        stepNode.resize(400, 0);
        stepNode.paddingTop = 16;
        stepNode.paddingBottom = 16;
        stepNode.paddingLeft = 16;
        stepNode.paddingRight = 16;
        stepNode.primaryAxisAlignItems = "MIN";
        stepNode.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.96 } }];
        stepNode.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
        stepNode.strokeWeight = 2;
        stepNode.itemSpacing = 16;
        const chip = chipNode_2.createChipNode("STEP");
        stepNode.appendChild(chip);
        const title = figma.createText();
        title.characters = nodeData.name;
        title.fontSize = 24;
        title.fontName = { family: "Inter", style: "Bold" };
        title.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        stepNode.appendChild(title);
        const addSection = (label, content) => {
            const section = figma.createFrame();
            section.layoutMode = "VERTICAL";
            section.counterAxisSizingMode = "AUTO";
            section.primaryAxisSizingMode = "AUTO";
            section.paddingTop = 8;
            section.paddingBottom = 8;
            section.itemSpacing = 4;
            const labelText = figma.createText();
            labelText.characters = label.toUpperCase();
            labelText.fontSize = 12;
            labelText.fontName = { family: "Inter", style: "Bold" };
            labelText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
            section.appendChild(labelText);
            const contentArray = Array.isArray(content) ? content : [content];
            contentArray.forEach(item => {
                const itemText = figma.createText();
                itemText.characters = item;
                itemText.fontSize = 14;
                itemText.fontName = { family: "Inter", style: "Regular" };
                itemText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                section.appendChild(itemText);
            });
            stepNode.appendChild(section);
        };
        if (nodeData.description) {
            console.log("🟢 Descrição encontrada para:", nodeData.name, nodeData.description);
            if (nodeData.description.action)
                addSection("Action", nodeData.description.action);
            if (nodeData.description.inputs)
                addSection("Inputs", nodeData.description.inputs);
            if (nodeData.description.outputs)
                addSection("Outputs", nodeData.description.outputs);
            if (nodeData.description.errors)
                addSection("Errors", nodeData.description.errors);
        }
        else {
            console.warn(`⚠️ Nenhuma descrição encontrada para STEP Node: ${nodeData.name}`);
        }
        return stepNode;
    }
    exports_6("createStepNode", createStepNode);
    return {
        setters: [
            function (chipNode_2_1) {
                chipNode_2 = chipNode_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("core/layout", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function buildGraph(nodes, connections) {
        const adjacencyList = {};
        const inDegree = {};
        nodes.forEach(node => {
            adjacencyList[node.id] = [];
            inDegree[node.id] = 0;
        });
        connections.forEach(conn => {
            adjacencyList[conn.from].push(conn.to);
            inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
        });
        return { adjacencyList, inDegree };
    }
    exports_7("buildGraph", buildGraph);
    function getSortedLevels(_, connections) {
        return [0];
    }
    exports_7("getSortedLevels", getSortedLevels);
    function layoutNodes(nodes, connections, spacing = 300) {
        let x = 0;
        const startNode = Array.from(nodes.entries()).find(([_, node]) => node.name === 'Start');
        if (!startNode) {
            console.error("No START node found.");
            return;
        }
        const [startId, startNodeObj] = startNode;
        startNodeObj.x = 0;
        startNodeObj.y = 0;
        let maxHeight = startNodeObj.height;
        const positionedNodes = new Set([startId]);
        const queue = [startId];
        while (queue.length > 0) {
            const currentId = queue.shift();
            const currentNode = nodes.get(currentId);
            if (!currentNode)
                continue;
            const outgoingConnections = connections.filter(conn => conn.from === currentId);
            outgoingConnections.forEach(conn => {
                const targetId = conn.to;
                if (!positionedNodes.has(targetId)) {
                    const targetNode = nodes.get(targetId);
                    if (targetNode) {
                        targetNode.x = x + currentNode.width + spacing;
                        targetNode.y = 0;
                        maxHeight = Math.max(maxHeight, targetNode.height);
                        x = targetNode.x + targetNode.width;
                        positionedNodes.add(targetId);
                        queue.push(targetId);
                    }
                }
            });
        }
        for (const node of [...nodes.values()]) {
            node.y = (maxHeight - node.height) / 2;
        }
    }
    exports_7("layoutNodes", layoutNodes);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("core/parser", ["nodes/decisionNode", "nodes/endNode", "nodes/entrypointNode", "nodes/startNode", "nodes/stepNode", "core/layout"], function (exports_8, context_8) {
    "use strict";
    var decisionNode_1, endNode_1, entrypointNode_1, startNode_1, stepNode_1, layout_1;
    var __moduleName = context_8 && context_8.id;
    function parseJSON(json) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = new Map();
            const connections = json.connections || [];
            if (!json.nodes || json.nodes.length === 0) {
                console.error("Nenhum nó encontrado no JSON.");
                return nodes;
            }
            for (const nodeData of json.nodes) {
                let figmaNode;
                try {
                    console.log(`🟡 Criando nó: ${nodeData.name} (${nodeData.type})`);
                    console.log("🔵 Descrição do nó:", nodeData.description);
                    switch (nodeData.type) {
                        case 'START':
                            figmaNode = yield startNode_1.createStartNode(nodeData);
                            break;
                        case 'ENTRYPOINT':
                            figmaNode = yield entrypointNode_1.createEntryPointNode(nodeData);
                            break;
                        case 'STEP':
                            figmaNode = yield stepNode_1.createStepNode(nodeData);
                            break;
                        case 'DECISION':
                            figmaNode = yield decisionNode_1.createDecisionNode(nodeData);
                            break;
                        case 'END':
                            figmaNode = yield endNode_1.createEndNode(nodeData);
                            break;
                        default:
                            console.error(`❌ Tipo de nó desconhecido: ${nodeData.type}`);
                    }
                    if (figmaNode) {
                        nodes.set(nodeData.id, { node: figmaNode, type: nodeData.type });
                        console.log(`✅ Nó criado: ${nodeData.name}`);
                    }
                    else {
                        console.warn(`⚠️ Nó não criado para: ${nodeData.name}`);
                    }
                }
                catch (error) {
                    console.error(`🔥 Erro ao criar nó ${nodeData.id}:`, error);
                }
            }
            layout_1.layoutNodes(new Map([...nodes].map(([id, data]) => [id, data.node])), connections, 300);
            return nodes;
        });
    }
    exports_8("parseJSON", parseJSON);
    return {
        setters: [
            function (decisionNode_1_1) {
                decisionNode_1 = decisionNode_1_1;
            },
            function (endNode_1_1) {
                endNode_1 = endNode_1_1;
            },
            function (entrypointNode_1_1) {
                entrypointNode_1 = entrypointNode_1_1;
            },
            function (startNode_1_1) {
                startNode_1 = startNode_1_1;
            },
            function (stepNode_1_1) {
                stepNode_1 = stepNode_1_1;
            },
            function (layout_1_1) {
                layout_1 = layout_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("core/connectors", [], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    function createConnectors(connections, nodes) {
        for (const conn of connections) {
            const fromNodeData = nodes.get(conn.from);
            const toNodeData = nodes.get(conn.to);
            if (fromNodeData && toNodeData) {
                const fromNode = fromNodeData.node;
                const toNode = toNodeData.node;
                const isDecisionNode = fromNodeData.type === "DECISION";
                const connector = figma.createConnector();
                connector.connectorStart = { endpointNodeId: fromNode.id, magnet: 'AUTO' };
                connector.connectorEnd = { endpointNodeId: toNode.id, magnet: 'AUTO' };
                if (isDecisionNode) {
                    connector.connectorLineType = 'ELBOWED';
                }
                else {
                    connector.connectorLineType = 'STRAIGHT';
                }
                connector.connectorEndStrokeCap = 'ARROW_LINES';
                connector.strokeWeight = 2;
                connector.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                if (isDecisionNode) {
                    if (conn.conditionType === "negative") {
                        connector.dashPattern = [4, 4];
                    }
                    else {
                        connector.dashPattern = [];
                    }
                }
                figma.currentPage.appendChild(connector);
                if (conn.conditionLabel) {
                    figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
                        var _a;
                        const label = figma.createText();
                        label.characters = (_a = conn.conditionLabel) !== null && _a !== void 0 ? _a : "";
                        label.fontSize = 12;
                        label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                        label.x = (fromNode.x + fromNode.width + toNode.x) / 2 - (label.width / 2);
                        label.y = Math.min(fromNode.y, toNode.y) - 20;
                        figma.currentPage.appendChild(label);
                    });
                }
            }
        }
    }
    exports_9("createConnectors", createConnectors);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("code", ["core/connectors", "core/layout", "core/parser"], function (exports_10, context_10) {
    "use strict";
    var connectors_1, layout_2, parser_1;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (connectors_1_1) {
                connectors_1 = connectors_1_1;
            },
            function (layout_2_1) {
                layout_2 = layout_2_1;
            },
            function (parser_1_1) {
                parser_1 = parser_1_1;
            }
        ],
        execute: function () {
            figma.showUI(__html__, { width: 400, height: 300 });
            figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
                console.log("Mensagem recebida do UI:", msg);
                if (msg.type === "generate-flow") {
                    try {
                        const flowData = JSON.parse(msg.json);
                        console.log("JSON recebido:", flowData);
                        const nodeMap = yield parser_1.parseJSON(flowData);
                        layout_2.layoutNodes(new Map([...nodeMap].map(([id, data]) => [id, data.node])), flowData.connections, 300);
                        connectors_1.createConnectors(flowData.connections, nodeMap);
                        figma.notify("Fluxo criado com sucesso!");
                        figma.closePlugin();
                    }
                    catch (error) {
                        console.error("Erro ao gerar o fluxo:", error);
                        figma.notify(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
                        figma.closePlugin();
                    }
                }
            });
        }
    };
});

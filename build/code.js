var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define("nodes/decisionNode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createDecisionNode = createDecisionNode;
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
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
    }
});
define("nodes/endNode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createEndNode = createEndNode;
    /**
     * Cria o End Node no Figma com formato circular
     * Exibe o texto "END" centralizado
     * @param nodeData Dados do nó
     * @returns FrameNode estilizado
     */
    function createEndNode(nodeData) {
        // Cria o frame principal do End Node
        const endNode = figma.createFrame();
        endNode.name = nodeData.name || "END";
        endNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
        endNode.cornerRadius = 400; // Para deixar o nó totalmente circular
        endNode.layoutMode = "VERTICAL";
        endNode.counterAxisSizingMode = "AUTO";
        endNode.primaryAxisAlignItems = "CENTER";
        endNode.primaryAxisSizingMode = "AUTO";
        endNode.paddingTop = 55.5; // Ajuste para centralizar o texto
        endNode.paddingBottom = 55.5;
        endNode.paddingLeft = 30; // Ajuste para centralizar o texto
        endNode.paddingRight = 30;
        // Define o preenchimento do nó (cor de fundo): #18181B (preto)
        endNode.fills = [{
                type: 'SOLID',
                color: hexToRGB('#18181B')
            }];
        // Cria o texto "END"
        const textNode = figma.createText();
        figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
            textNode.characters = "END";
            textNode.fontSize = 24; // Mantém a fonte original
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.textAlignHorizontal = "CENTER";
            textNode.textAlignVertical = "CENTER";
            textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
            endNode.appendChild(textNode);
        });
        return endNode;
    }
    /**
     * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
     * @param hex - Código hexadecimal da cor (ex.: #18181B)
     * @returns RGBColor
     */
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
});
define("nodes/chipNode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createChipNode = createChipNode;
    /**
     * @param type - O tipo do nó (STEP, ENTRYPOINT, etc.)
     * @returns FrameNode estilizado
     */
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
        // Define cor fixa do chip: #18181B (preto)
        chip.fills = [{
                type: 'SOLID',
                color: hexToRGB('#18181B')
            }];
        // Cria o texto dentro do chip
        const textNode = figma.createText();
        textNode.characters = type.toUpperCase(); // Mostra o tipo (ex.: STEP, ENTRY POINT)
        textNode.fontSize = 12;
        textNode.fontName = { family: "Inter", style: "Bold" };
        textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Branco
        // Adiciona o texto ao chip
        chip.appendChild(textNode);
        return chip;
    }
    /**
     * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
     * @param hex - Código hexadecimal da cor (ex.: #18181B)
     * @returns RGB
     */
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
});
define("nodes/entrypointNode", ["require", "exports", "nodes/chipNode"], function (require, exports, chipNode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createEntryPointNode = createEntryPointNode;
    /**
     * Cria um EntryPoint Node no Figma
     * @param nodeData Dados do nó do tipo NodeData
     * @returns FrameNode criado
     */
    function createEntryPointNode(nodeData) {
        const entryNode = figma.createFrame();
        entryNode.name = nodeData.name || "ENTRYPOINT";
        entryNode.layoutMode = "VERTICAL";
        entryNode.primaryAxisAlignItems = "MIN";
        entryNode.counterAxisSizingMode = "FIXED"; // Largura fixa
        entryNode.primaryAxisSizingMode = "AUTO"; // Altura variável
        entryNode.resize(400, 0); // Define largura fixa de 400px, altura ajustada automaticamente
        entryNode.paddingTop = 24;
        entryNode.paddingBottom = 24;
        entryNode.paddingLeft = 24;
        entryNode.paddingRight = 24;
        entryNode.cornerRadius = 24;
        entryNode.strokeWeight = 2;
        entryNode.fills = [{ type: 'SOLID', color: hexToRGB('#F4F4F5') }]; // Fundo cinza claro
        entryNode.strokes = [{
                type: "SOLID",
                color: hexToRGB("#A1A1AA")
            }];
        entryNode.dashPattern = [4, 4];
        entryNode.itemSpacing = 8; // Espaço entre o chip e o texto
        // Chip com o tipo do nó (usando createChipNode para "ENTRYPOINT")
        const chip = (0, chipNode_1.createChipNode)("ENTRYPOINT");
        entryNode.appendChild(chip);
        // Texto do nome do nó
        const nameText = figma.createText();
        figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }).then(() => {
            nameText.characters = nodeData.name;
            nameText.fontSize = 24;
            nameText.fontName = { family: "Inter", style: "Semi Bold" };
            nameText.textAlignHorizontal = "LEFT";
            nameText.textAlignVertical = "TOP";
            nameText.fills = [{ type: 'SOLID', color: hexToRGB('#09090B') }]; // Texto preto
            nameText.resizeWithoutConstraints(352, nameText.height); // Limita a largura interna, mas permite altura variável
            nameText.textAutoResize = "HEIGHT";
            entryNode.appendChild(nameText);
        });
        return entryNode;
    }
    /**
     * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
     * @param hex Cor no formato HEX
     * @returns RGBColor
     */
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
});
define("nodes/startNode", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createStartNode = createStartNode;
    /**
     * Cria o Start Node no Figma com formato circular
     * Exibe o texto "START" centralizado
     * @param nodeData Dados do nó
     * @returns FrameNode estilizado
     */
    function createStartNode(nodeData) {
        const startNode = figma.createFrame();
        startNode.name = nodeData.name || "START";
        startNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
        startNode.cornerRadius = 400; // Para deixar o nó totalmente circular
        startNode.layoutMode = "VERTICAL";
        startNode.counterAxisSizingMode = "AUTO";
        startNode.primaryAxisAlignItems = "CENTER";
        startNode.primaryAxisSizingMode = "AUTO";
        startNode.paddingTop = 55.5; // Ajuste para centralizar o texto
        startNode.paddingBottom = 55.5;
        startNode.paddingLeft = 30; // Ajuste para centralizar o texto
        startNode.paddingRight = 30;
        // Define o preenchimento do nó (cor de fundo): #18181B (preto)
        startNode.fills = [{
                type: 'SOLID',
                color: hexToRGB('#18181B')
            }];
        // Cria o texto "START"
        const textNode = figma.createText();
        figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
            textNode.characters = "START";
            textNode.fontSize = 24; // Mantém a fonte original
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.textAlignHorizontal = "CENTER";
            textNode.textAlignVertical = "CENTER";
            textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
            startNode.appendChild(textNode);
        });
        return startNode;
    }
    /**
     * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma
     * @param hex - Código hexadecimal da cor (ex.: #18181B)
     * @returns RGBColor
     */
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace('#', '');
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255
        };
    }
});
define("nodes/stepNode", ["require", "exports", "nodes/chipNode"], function (require, exports, chipNode_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createStepNode = createStepNode;
    function createStepNode(nodeData) {
        const stepNode = figma.createFrame();
        stepNode.name = nodeData.name;
        stepNode.layoutMode = "VERTICAL";
        stepNode.counterAxisSizingMode = "FIXED";
        stepNode.primaryAxisSizingMode = "AUTO";
        stepNode.resize(400, 0); // Largura fixa
        stepNode.paddingTop = 16;
        stepNode.paddingBottom = 16;
        stepNode.paddingLeft = 16;
        stepNode.paddingRight = 16;
        stepNode.primaryAxisAlignItems = "MIN";
        stepNode.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.96 } }];
        stepNode.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
        stepNode.strokeWeight = 2;
        stepNode.itemSpacing = 16;
        // Adiciona o chip STEP
        const chip = (0, chipNode_2.createChipNode)("STEP");
        stepNode.appendChild(chip);
        // Título do Nó
        const title = figma.createText();
        title.characters = nodeData.name;
        title.fontSize = 24;
        title.fontName = { family: "Inter", style: "Bold" };
        title.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
        stepNode.appendChild(title);
        // ✅ Função para adicionar seções de descrição
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
        // ✅ Verifica e adiciona as descrições
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
});
define("core/layout", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildGraph = buildGraph;
    exports.getSortedLevels = getSortedLevels;
    exports.layoutNodes = layoutNodes;
    /**
     * Constrói o grafo com a lista de adjacências e grau de entrada.
     */
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
    /**
     * Retorna os níveis ordenados do grafo (simplificado para layout horizontal).
     */
    function getSortedLevels(_, connections) {
        // Para um layout horizontal simples, retornamos apenas [0] para indicar um único nível
        return [0];
    }
    /**
     * Posiciona os nós no layout em uma linha horizontal uniforme.
     */
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
                        // Ajusta o X com base na largura do nó atual mais o espaçamento
                        targetNode.x = x + currentNode.width + spacing;
                        targetNode.y = 0; // Alinhamento horizontal fixo
                        maxHeight = Math.max(maxHeight, targetNode.height);
                        x = targetNode.x + targetNode.width;
                        positionedNodes.add(targetId);
                        queue.push(targetId);
                    }
                }
            });
        }
        // Centraliza verticalmente todos os nós com base na altura máxima
        for (const node of [...nodes.values()]) { // Usamos spread operator para evitar o erro
            node.y = (maxHeight - node.height) / 2;
        }
    }
});
define("core/parser", ["require", "exports", "nodes/decisionNode", "nodes/endNode", "nodes/entrypointNode", "nodes/startNode", "nodes/stepNode", "core/layout"], function (require, exports, decisionNode_1, endNode_1, entrypointNode_1, startNode_1, stepNode_1, layout_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseJSON = parseJSON;
    /**
     * Função principal que interpreta o JSON e cria os nós no Figma.
     * @param json O JSON com o fluxo de usuário.
     * @returns Um mapa contendo os nós criados com seus tipos.
     */
    function parseJSON(json) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = new Map();
            const connections = json.connections || [];
            // ✅ Verifica se há nós no JSON
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
                            figmaNode = yield (0, startNode_1.createStartNode)(nodeData);
                            break;
                        case 'ENTRYPOINT':
                            figmaNode = yield (0, entrypointNode_1.createEntryPointNode)(nodeData);
                            break;
                        case 'STEP':
                            figmaNode = yield (0, stepNode_1.createStepNode)(nodeData);
                            break;
                        case 'DECISION':
                            figmaNode = yield (0, decisionNode_1.createDecisionNode)(nodeData);
                            break;
                        case 'END':
                            figmaNode = yield (0, endNode_1.createEndNode)(nodeData);
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
            // 📐 Layout dos nós no Figma
            (0, layout_1.layoutNodes)(new Map([...nodes].map(([id, data]) => [id, data.node])), connections, 300 // Espaçamento entre nós
            );
            return nodes;
        });
    }
});
define("core/connectors", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createConnectors = createConnectors;
    function createConnectors(connections, nodes) {
        for (const conn of connections) {
            const fromNodeData = nodes.get(conn.from);
            const toNodeData = nodes.get(conn.to);
            if (fromNodeData && toNodeData) {
                const fromNode = fromNodeData.node;
                const toNode = toNodeData.node;
                const isDecisionNode = fromNodeData.type === "DECISION";
                // Usa ConnectorNode para todas as conexões
                const connector = figma.createConnector();
                connector.connectorStart = { endpointNodeId: fromNode.id, magnet: 'AUTO' };
                connector.connectorEnd = { endpointNodeId: toNode.id, magnet: 'AUTO' };
                if (isDecisionNode) {
                    // Conector ELBOWED para decisionNodes
                    connector.connectorLineType = 'ELBOWED';
                }
                else {
                    // Conector STRAIGHT para outros nós
                    connector.connectorLineType = 'STRAIGHT';
                }
                connector.connectorEndStrokeCap = 'ARROW_LINES';
                connector.strokeWeight = 2;
                connector.strokes = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
                // Aplica estilo baseado no conditionType (somente para decisionNodes)
                if (isDecisionNode) {
                    if (conn.conditionType === "negative") {
                        connector.dashPattern = [4, 4]; // Linha tracejada para negativa
                    }
                    else {
                        connector.dashPattern = []; // Linha normal para positiva
                    }
                }
                figma.currentPage.appendChild(connector);
                // Adiciona o rótulo se houver conditionLabel (trata string | undefined)
                if (conn.conditionLabel) {
                    figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
                        var _a;
                        const label = figma.createText();
                        label.characters = (_a = conn.conditionLabel) !== null && _a !== void 0 ? _a : ""; // TypeScript agora aceita, pois verificamos com if
                        label.fontSize = 12;
                        label.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]; // Preto
                        // Posiciona o rótulo acima da conexão, ajustado para evitar sobreposição
                        label.x = (fromNode.x + fromNode.width + toNode.x) / 2 - (label.width / 2);
                        label.y = Math.min(fromNode.y, toNode.y) - 20; // Acima da linha, ajustado manualmente
                        figma.currentPage.appendChild(label);
                    });
                }
            }
        }
    }
});
define("code", ["require", "exports", "core/connectors", "core/layout", "core/parser", "systemjs"], function (require, exports, connectors_1, layout_2, parser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    figma.showUI(__html__, { width: 400, height: 300 });
    figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Mensagem recebida do UI:", msg); // Log para verificar a mensagem recebida
        if (msg.type === "generate-flow") {
            try {
                const flowData = JSON.parse(msg.json);
                console.log("JSON recebido:", flowData); // Loga o JSON para validação
                const nodeMap = yield (0, parser_1.parseJSON)(flowData); // Função que cria os nós
                (0, layout_2.layoutNodes)(new Map([...nodeMap].map(([id, data]) => [id, data.node])), flowData.connections, 300);
                (0, connectors_1.createConnectors)(flowData.connections, nodeMap);
                figma.notify("Fluxo criado com sucesso!");
                figma.closePlugin();
            }
            catch (error) {
                console.error("Erro ao gerar o fluxo:", error); // Captura e exibe erros
                figma.notify(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
                figma.closePlugin();
            }
        }
    });
});

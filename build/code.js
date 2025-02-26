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
function loadFonts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
            yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
            yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
            yield figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
            console.log("✔️ Fontes carregadas com sucesso.");
        }
        catch (error) {
            console.error("❌ Erro ao carregar as fontes:", error);
        }
    });
}
figma.showUI(__html__, { width: 624, height: 400 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === "generate-flow") {
        try {
            yield loadFonts();
            const flowData = JSON.parse(msg.json);
            const nodeMap = yield Parser.parseJSON(flowData);
            const sceneNodeMap = new Map([...nodeMap].map(([id, data]) => [id, data.node]));
            Layout.layoutNodes(sceneNodeMap, flowData.connections, 300);
            Connectors.createConnectors(flowData.connections, nodeMap);
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
    }
});
var Connectors;
(function (Connectors) {
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
    Connectors.createConnectors = createConnectors;
})(Connectors || (Connectors = {}));
var Layout;
(function (Layout) {
    function buildGraph(nodes, connections) {
        const adjacencyList = {};
        const inDegree = {};
        console.log("📊 Construindo grafo de conexões...");
        nodes.forEach(node => {
            adjacencyList[node.id] = [];
            inDegree[node.id] = 0;
        });
        connections.forEach(conn => {
            adjacencyList[conn.from].push(conn.to);
            inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
        });
        console.log("🔗 Lista de adjacências:", adjacencyList);
        console.log("📊 Grau de entrada:", inDegree);
        return { adjacencyList, inDegree };
    }
    Layout.buildGraph = buildGraph;
    function getSortedLevels(_, connections) {
        console.log("📐 Definindo níveis do layout...");
        return [0]; // Simples layout horizontal
    }
    Layout.getSortedLevels = getSortedLevels;
    function layoutNodes(nodes, connections, spacing = 300) {
        console.log("🔄 Iniciando layout dos nós...");
        let x = 0;
        const startNode = Array.from(nodes.entries()).find(([_, node]) => node.name === 'Start');
        if (!startNode) {
            console.error("🚨 No START node found.");
            return;
        }
        const [startId, startNodeObj] = startNode;
        startNodeObj.x = 0;
        startNodeObj.y = 0;
        let maxHeight = startNodeObj.height;
        console.log(`📍 START node posicionado em (${startNodeObj.x}, ${startNodeObj.y})`);
        const positionedNodes = new Set([startId]);
        const queue = [startId];
        while (queue.length > 0) {
            const currentId = queue.shift();
            const currentNode = nodes.get(currentId);
            if (!currentNode)
                continue;
            console.log(`🔀 Processando conexões a partir de: ${currentNode.name}`);
            const outgoingConnections = connections.filter(conn => conn.from === currentId);
            outgoingConnections.forEach(conn => {
                const targetId = conn.to;
                if (!positionedNodes.has(targetId)) {
                    const targetNode = nodes.get(targetId);
                    if (targetNode) {
                        targetNode.x = x + currentNode.width + spacing;
                        targetNode.y = 0;
                        console.log(`➡️ Posicionando ${targetNode.name} em (${targetNode.x}, ${targetNode.y})`);
                        maxHeight = Math.max(maxHeight, targetNode.height);
                        x = targetNode.x + targetNode.width;
                        positionedNodes.add(targetId);
                        queue.push(targetId);
                    }
                    else {
                        console.warn(`⚠️ Nó de destino não encontrado: ${targetId}`);
                    }
                }
            });
        }
        for (const node of [...nodes.values()]) {
            node.y = (maxHeight - node.height) / 2;
            console.log(`🎯 Centralizando ${node.name} em Y: ${node.y}`);
        }
        console.log("✅ Layout finalizado.");
    }
    Layout.layoutNodes = layoutNodes;
})(Layout || (Layout = {}));
var Parser;
(function (Parser) {
    /**
     * Função principal que interpreta o JSON e cria os nós no Figma.
     * @param json O JSON com o fluxo de usuário.
     * @returns Um mapa contendo os nós criados com seus tipos.
     */
    function parseJSON(json) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = new Map();
            const connections = json.connections || [];
            console.log("📊 Iniciando parse do JSON");
            console.log("🌐 Nome do fluxo:", json.flowName);
            console.log("🔄 Total de nós:", json.nodes.length);
            console.log("🔗 Total de conexões:", connections.length);
            if (!json.nodes || json.nodes.length === 0) {
                console.error("🚨 Nenhum nó encontrado no JSON.");
                return nodes;
            }
            for (const nodeData of json.nodes) {
                let figmaNode;
                try {
                    console.log(`🟡 Criando nó: ${nodeData.name} (${nodeData.type})`);
                    console.log("🔵 Descrição do nó:", nodeData.description);
                    switch (nodeData.type) {
                        case 'START':
                            figmaNode = yield StartNode.createStartNode(nodeData);
                            break;
                        case 'ENTRYPOINT':
                            figmaNode = yield EntrypointNode.createEntryPointNode(nodeData);
                            break;
                        case 'STEP':
                            figmaNode = yield StepNode.createStepNode(nodeData);
                            break;
                        case 'DECISION':
                            figmaNode = yield DecisionNode.createDecisionNode(nodeData);
                            break;
                        case 'END':
                            figmaNode = yield EndNode.createEndNode(nodeData);
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
            console.log("📐 Realizando layout dos nós...");
            Layout.layoutNodes(new Map([...nodes].map(([id, data]) => [id, data.node])), connections, 300 // Espaçamento
            );
            console.log("✅ Todos os nós criados e posicionados.");
            return nodes;
        });
    }
    Parser.parseJSON = parseJSON;
})(Parser || (Parser = {}));
var ChipNode;
(function (ChipNode) {
    function createChipNode(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const chip = figma.createFrame();
            chip.layoutMode = "HORIZONTAL";
            chip.primaryAxisSizingMode = "AUTO";
            chip.counterAxisSizingMode = "AUTO";
            chip.paddingLeft = 16;
            chip.paddingRight = 16;
            chip.paddingTop = 4;
            chip.paddingBottom = 4;
            chip.cornerRadius = 8;
            chip.strokeWeight = 0;
            chip.fills = [{ type: "SOLID", color: hexToRGB("#18181B") }];
            // Fonte já carregada no nível superior, mas mantemos a criação do texto
            const textNode = figma.createText();
            textNode.characters = type.toUpperCase();
            textNode.fontSize = 14;
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.fills = [{ type: "SOLID", color: hexToRGB("#FAFAFA") }];
            textNode.textAutoResize = "WIDTH_AND_HEIGHT";
            chip.appendChild(textNode);
            return chip;
        });
    }
    ChipNode.createChipNode = createChipNode;
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace("#", "");
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255,
        };
    }
    ChipNode.hexToRGB = hexToRGB;
})(ChipNode || (ChipNode = {}));
var DecisionNode;
(function (DecisionNode) {
    function createDecisionNode(dataOrNode) {
        const name = "name" in dataOrNode ? dataOrNode.name : dataOrNode.name;
        const frame = figma.createFrame();
        frame.name = name || "DECISION";
        frame.resize(300, 200);
        frame.layoutMode = "VERTICAL";
        frame.counterAxisSizingMode = "AUTO";
        frame.primaryAxisAlignItems = "CENTER";
        frame.primaryAxisSizingMode = "AUTO";
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
    DecisionNode.createDecisionNode = createDecisionNode;
    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
    }
    DecisionNode.hexToRgb = hexToRgb;
})(DecisionNode || (DecisionNode = {}));
var EndNode;
(function (EndNode) {
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
    EndNode.createEndNode = createEndNode;
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
    EndNode.hexToRGB = hexToRGB;
})(EndNode || (EndNode = {}));
var EntrypointNode;
(function (EntrypointNode) {
    /**
     * Cria um frame no Figma representando um nó de entrada (EntryPoint) com Auto Layout,
     * contendo um chip e um texto com o nome do nó.
     * @param nodeData Objeto com dados do nó, incluindo o nome (propriedade `name`)
     * @returns O FrameNode configurado com largura fixa de 400px e altura dinâmica
     */
    function createEntryPointNode(nodeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const entryNode = figma.createFrame();
            entryNode.name = nodeData.name || "ENTRYPOINT";
            // Configuração do Auto Layout para largura fixa e altura dinâmica
            entryNode.layoutMode = "VERTICAL";
            entryNode.primaryAxisSizingMode = "AUTO"; // Deve ajustar altura ao conteúdo
            entryNode.counterAxisSizingMode = "FIXED"; // Largura fixa em 400px
            entryNode.resize(400, 1); // Altura inicial mínima
            entryNode.paddingTop = 24;
            entryNode.paddingBottom = 24;
            entryNode.paddingLeft = 24;
            entryNode.paddingRight = 24;
            entryNode.cornerRadius = 24;
            entryNode.strokeWeight = 2;
            entryNode.itemSpacing = 8;
            entryNode.fills = [{ type: "SOLID", color: ChipNode.hexToRGB("#F4F4F5") }];
            entryNode.strokes = [{ type: "SOLID", color: ChipNode.hexToRGB("#A1A1AA") }];
            entryNode.dashPattern = [4, 4];
            // Carrega todas as fontes necessárias de uma vez
            yield Promise.all([
                figma.loadFontAsync({ family: "Inter", style: "Bold" }), // Para o chip
                figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }), // Para o texto
            ]);
            // Adiciona o chip
            const chip = yield ChipNode.createChipNode("ENTRYPOINT");
            entryNode.appendChild(chip);
            console.log("Altura do chip após adicionar:", chip.height);
            // Adiciona o texto
            const nameText = figma.createText();
            nameText.characters = nodeData.name || "ENTRYPOINT";
            nameText.fontSize = 24;
            nameText.fontName = { family: "Inter", style: "Semi Bold" };
            nameText.textAlignHorizontal = "LEFT";
            nameText.textAlignVertical = "TOP";
            nameText.fills = [{ type: "SOLID", color: ChipNode.hexToRGB("#09090B") }];
            nameText.textAutoResize = "HEIGHT";
            nameText.resize(352, nameText.height); // 400 - 24*2 padding
            entryNode.appendChild(nameText);
            console.log("Altura do texto após adicionar:", nameText.height);
            console.log("Altura do entryNode antes de ajuste:", entryNode.height);
            // Calcula a altura total manualmente como fallback
            const totalHeight = chip.height + nameText.height + entryNode.itemSpacing + entryNode.paddingTop + entryNode.paddingBottom;
            entryNode.resize(400, totalHeight);
            console.log("Altura ajustada manualmente:", totalHeight);
            // Adiciona um pequeno atraso pra garantir que o Figma processe o layout
            yield new Promise((resolve) => setTimeout(resolve, 0));
            console.log("Altura final do entryNode após tick:", entryNode.height);
            return entryNode;
        });
    }
    EntrypointNode.createEntryPointNode = createEntryPointNode;
})(EntrypointNode || (EntrypointNode = {}));
var StartNode;
(function (StartNode) {
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
    StartNode.createStartNode = createStartNode;
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
    StartNode.hexToRGB = hexToRGB;
})(StartNode || (StartNode = {}));
var StepNode;
(function (StepNode) {
    /**
     * Cria um nó STEP no Figma com Auto Layout, contendo um chip, título e seções de descrição.
     * @param nodeData Dados do nó, incluindo `name` e opcionalmente `description` com ações, entradas, saídas e erros
     * @returns FrameNode configurado com largura fixa de 400px e altura dinâmica
     */
    function createStepNode(nodeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const stepNode = figma.createFrame();
            stepNode.name = nodeData.name || "Unnamed Step";
            stepNode.layoutMode = "VERTICAL"; // Empilha chip, título e seções verticalmente
            stepNode.counterAxisSizingMode = "FIXED"; // Largura fixa em 400px
            stepNode.primaryAxisSizingMode = "AUTO"; // Altura ajustada ao conteúdo
            stepNode.resize(400, 1); // Largura fixa, altura inicial mínima
            stepNode.paddingTop = 16;
            stepNode.paddingBottom = 16;
            stepNode.paddingLeft = 16;
            stepNode.paddingRight = 16;
            stepNode.primaryAxisAlignItems = "MIN"; // Alinha itens ao topo
            stepNode.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.96 } }]; // Fundo cinza claro
            stepNode.strokes = [{ type: "SOLID", color: { r: 0.7, g: 0.7, b: 0.7 } }]; // Borda cinza
            stepNode.strokeWeight = 2;
            stepNode.itemSpacing = 16; // Espaço entre chip, título e seções
            // Carrega fontes necessárias
            yield Promise.all([
                figma.loadFontAsync({ family: "Inter", style: "Bold" }), // Para chip e título
                figma.loadFontAsync({ family: "Inter", style: "Regular" }), // Para seções
            ]);
            // Adiciona o chip STEP
            const chip = yield ChipNode.createChipNode("STEP");
            stepNode.appendChild(chip);
            // Título do Nó
            const title = figma.createText();
            title.characters = nodeData.name || "Unnamed Step"; // Nome ou fallback
            title.fontSize = 24;
            title.fontName = { family: "Inter", style: "Bold" };
            title.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; // Preto
            title.textAutoResize = "HEIGHT"; // Altura ajustada ao conteúdo
            title.resize(368, title.height); // Largura fixa (400 - 16*2 padding)
            stepNode.appendChild(title);
            // Função para adicionar seções de descrição
            const addSection = (label, content) => {
                const section = figma.createFrame();
                section.layoutMode = "VERTICAL";
                section.counterAxisSizingMode = "AUTO"; // Largura ajustada ao conteúdo
                section.primaryAxisSizingMode = "AUTO"; // Altura ajustada ao conteúdo
                section.paddingTop = 8;
                section.paddingBottom = 8;
                section.itemSpacing = 4;
                const labelText = figma.createText();
                labelText.characters = label.toUpperCase();
                labelText.fontSize = 12;
                labelText.fontName = { family: "Inter", style: "Bold" };
                labelText.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }]; // Cinza escuro
                section.appendChild(labelText);
                const contentArray = Array.isArray(content) ? content : [content];
                contentArray.forEach((item) => {
                    const itemText = figma.createText();
                    itemText.characters = item;
                    itemText.fontSize = 14;
                    itemText.fontName = { family: "Inter", style: "Regular" };
                    itemText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; // Preto
                    section.appendChild(itemText);
                });
                stepNode.appendChild(section);
            };
            // Verifica e adiciona as descrições
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
            // Força recálculo da altura após adicionar todos os filhos
            stepNode.resize(400, stepNode.height);
            return stepNode;
        });
    }
    StepNode.createStepNode = createStepNode;
})(StepNode || (StepNode = {}));

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
    /**
     * Cria um chip padrão com texto indicando o tipo do nó (ex.: "STEP", "ENTRYPOINT").
     * Características: fundo #18181B, texto #FAFAFA, fonte 14px "Inter Bold", padding 16px/4px.
     * @param type - O tipo do chip (ex.: "STEP", "ENTRYPOINT")
     * @returns FrameNode estilizado com largura e altura ajustadas ao conteúdo
     */
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
            // Carrega a fonte "Inter Bold" (assumindo que o nó chamante pode carregar, mas aqui garantimos)
            yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
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
    /**
     * Cria um chip de descrição (ex.: "ACTION", "INPUTS") com estilo específico para o StepNode.
     * Características: fundo #F4F4F5, texto #3F3F46, fonte 12px "Inter Bold", padding lateral 12px, padding vertical 2px.
     * @param label - O label do chip (ex.: "Action", "Inputs")
     * @returns FrameNode estilizado com largura e altura ajustadas ao conteúdo
     */
    function createDescriptionChip(label) {
        return __awaiter(this, void 0, void 0, function* () {
            const chip = figma.createFrame();
            chip.layoutMode = "HORIZONTAL";
            chip.primaryAxisSizingMode = "AUTO";
            chip.counterAxisSizingMode = "AUTO";
            chip.paddingLeft = 12; // Padding lateral de 12px
            chip.paddingRight = 12;
            chip.paddingTop = 2; // Padding vertical de 2px
            chip.paddingBottom = 2;
            chip.cornerRadius = 8;
            chip.strokeWeight = 0;
            chip.fills = [{ type: "SOLID", color: hexToRGB("#F4F4F5") }];
            // Carrega a fonte "Inter Bold" (assumindo compatibilidade com o nó chamante)
            yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
            const textNode = figma.createText();
            textNode.characters = label.toUpperCase(); // Mantém em maiúsculas por padrão
            textNode.fontSize = 12;
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.fills = [{ type: "SOLID", color: hexToRGB("#3F3F46") }];
            textNode.textAutoResize = "WIDTH_AND_HEIGHT";
            chip.appendChild(textNode);
            return chip;
        });
    }
    ChipNode.createDescriptionChip = createDescriptionChip;
    /**
     * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma.
     * @param hex - Código hexadecimal da cor (ex.: "#18181B")
     * @returns RGB
     */
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
// decisionNode.ts
var DecisionNode;
(function (DecisionNode) {
    /**
     * Cria um nó Decision no Figma representando uma decisão com um losango cinza e texto centralizado.
     * O frame é transparente (300x200px) com layoutMode: "NONE", contendo um polígono de 300x200px (#A3A3A3) e texto preto.
     * @param data Dados do nó, incluindo o nome opcional
     * @returns Promise<SceneNode> Frame configurado como nó Decision
     * @throws Error se houver falha ao carregar fontes ou criar elementos
     */
    function createDecisionNode(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extrai o nome do nó (padrão "DECISION" se não fornecido)
                const name = "name" in data ? data.name : data.name || "DECISION";
                // Cria o frame principal
                const frame = figma.createFrame();
                frame.name = "decisionNode";
                frame.resize(300, 200); // Dimensões fixas de 300x200px
                frame.fills = []; // Frame transparente, sem preenchimento
                frame.strokes = []; // Sem bordas
                frame.strokeWeight = 1; // Peso da borda (0 para nenhuma borda visível, mas mantido por consistência)
                frame.cornerRadius = 0; // Cantos retos
                frame.layoutMode = "NONE"; // Sem Auto Layout, posicionamento manual
                frame.primaryAxisAlignItems = "CENTER"; // Centralização vertical (ignorado com layoutMode: "NONE")
                frame.counterAxisAlignItems = "CENTER"; // Centralização horizontal (ignorado com layoutMode: "NONE")
                frame.paddingLeft = 0;
                frame.paddingRight = 0;
                frame.paddingTop = 0;
                frame.paddingBottom = 0;
                frame.itemSpacing = 0; // Sem espaçamento entre filhos (ignorado com layoutMode: "NONE")
                frame.clipsContent = true; // Recorta conteúdo que ultrapasse o frame
                // Carrega a fonte "Inter Semi Bold" necessária para o texto
                yield figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }).catch((error) => {
                    throw new Error(`Falha ao carregar a fonte Inter Semi Bold: ${error.message}`);
                });
                // Cria o polígono (losango) preenchendo todo o frame
                const polygon = figma.createPolygon();
                polygon.name = "Polygon";
                polygon.pointCount = 4; // Quadrilátero
                polygon.resize(300, 200); // O losango ocupa todo o frame
                polygon.fills = [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        blendMode: "NORMAL",
                        color: {
                            r: 0.6392157077789307, // #A3A3A3 em RGB normalizado
                            g: 0.6392157077789307,
                            b: 0.6392157077789307,
                        },
                    },
                ];
                polygon.strokes = []; // Sem bordas
                polygon.strokeWeight = 1; // Peso da borda (0 para nenhuma borda visível, mas mantido por consistência)
                polygon.cornerRadius = 0; // Cantos retos
                // Posiciona o polígono no frame (x: 0, y: 0 como especificado)
                polygon.x = 0;
                polygon.y = 0;
                // Cria e configura o texto
                const text = figma.createText();
                text.name = "name";
                text.characters = "Is Phone Verification\nSuccessful?"; // Texto específico da configuração
                text.fontSize = 18;
                text.fontName = { family: "Inter", style: "Semi Bold" };
                text.textAlignHorizontal = "CENTER";
                text.textAlignVertical = "CENTER";
                text.fills = [
                    {
                        type: "SOLID",
                        visible: true,
                        opacity: 1,
                        blendMode: "NORMAL",
                        color: {
                            r: 0.03529411926865578, // #09090B em RGB normalizado (preto escuro)
                            g: 0.03529411926865578,
                            b: 0.04313725605607033,
                        },
                    },
                ];
                text.strokes = []; // Sem bordas
                text.strokeWeight = 1; // Peso da borda (0 para nenhuma borda visível, mas mantido por consistência)
                text.textAutoResize = "WIDTH_AND_HEIGHT"; // Ajusta automaticamente ao conteúdo
                // Ajusta o tamanho do texto para corresponder à configuração (180x44px)
                text.resize(180, 44); // Dimensões fixas conforme a configuração
                // Posiciona o texto no frame nas coordenadas especificadas
                text.x = 60; // Centralizado horizontalmente (60px no frame de 300px)
                text.y = 78; // Centralizado verticalmente (78px no frame de 200px)
                // Adiciona os elementos ao frame
                frame.appendChild(polygon);
                frame.appendChild(text);
                // Posiciona o frame nas coordenadas especificadas
                frame.x = 2891;
                frame.y = 6336;
                // Adiciona o frame à página para garantir renderização e cálculo de layout
                figma.currentPage.appendChild(frame);
                // Força um pequeno atraso para garantir que o Figma processe o layout
                yield new Promise((resolve) => setTimeout(resolve, 0));
                return frame;
            }
            catch (error) {
                console.error("Erro ao criar o nó Decision:", error);
                throw error;
            }
        });
    }
    DecisionNode.createDecisionNode = createDecisionNode;
    /**
     * Converte uma cor HEX para o formato RGB normalizado (0-1) usado pelo Figma.
     * @param hex String HEX da cor (ex.: "#A3A3A3")
     * @returns Objeto com valores RGB normalizados
     */
    function hexToRgb(hex) {
        const sanitizedHex = hex.replace("#", "");
        const r = parseInt(sanitizedHex.slice(0, 2), 16) / 255;
        const g = parseInt(sanitizedHex.slice(2, 4), 16) / 255;
        const b = parseInt(sanitizedHex.slice(4, 6), 16) / 255;
        return { r, g, b };
    }
    DecisionNode.hexToRgb = hexToRgb;
})(DecisionNode || (DecisionNode = {}));
var EndNode;
(function (EndNode) {
    /**
     * Cria o End Node no Figma com formato circular
     * Exibe o texto "End" centralizado manualmente em um frame de 140x140px
     * @param nodeData Dados do nó
     * @returns FrameNode estilizado
     */
    function createEndNode(nodeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const endNode = figma.createFrame();
            endNode.name = nodeData.name || "End";
            endNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
            endNode.cornerRadius = 400; // Para deixar o nó totalmente circular
            endNode.layoutMode = "NONE"; // Remove Auto Layout, posicionamento manual
            endNode.fills = [{
                    type: 'SOLID',
                    color: hexToRGB('#18181B')
                }];
            // Carrega a fonte e cria o texto
            yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
            const textNode = figma.createText();
            textNode.characters = "End";
            textNode.fontSize = 24; // Mantém a fonte original
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.textAlignHorizontal = "CENTER";
            textNode.textAlignVertical = "CENTER";
            textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
            textNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Ajusta automaticamente ao conteúdo
            // Ajusta o tamanho do texto para garantir centralização
            const textWidth = Math.min(80, textNode.width); // Limita a largura para caber no círculo
            const textHeight = textNode.height;
            textNode.resize(textWidth, textHeight);
            // Centraliza o texto manualmente no frame de 140x140px
            textNode.x = (endNode.width - textWidth) / 2; // Centraliza horizontalmente (30px)
            textNode.y = (endNode.height - textHeight) / 2; // Centraliza verticalmente (~58px)
            // Adiciona o texto ao frame
            endNode.appendChild(textNode);
            // Força a renderização completa e adiciona à página
            figma.currentPage.appendChild(endNode);
            // Força um pequeno atraso para garantir que o Figma processe o layout
            yield new Promise((resolve) => setTimeout(resolve, 0));
            return endNode;
        });
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
     * Exibe o texto "START" centralizado manualmente em um frame de 140x140px
     * @param nodeData Dados do nó
     * @returns FrameNode estilizado
     */
    function createStartNode(nodeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const startNode = figma.createFrame();
            startNode.name = nodeData.name || "START";
            startNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
            startNode.cornerRadius = 400; // Para deixar o nó totalmente circular
            startNode.layoutMode = "NONE"; // Remove Auto Layout, posicionamento manual
            startNode.fills = [{
                    type: 'SOLID',
                    color: hexToRGB('#18181B')
                }];
            // Carrega a fonte e cria o texto
            yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
            const textNode = figma.createText();
            textNode.characters = "START";
            textNode.fontSize = 24; // Mantém a fonte original
            textNode.fontName = { family: "Inter", style: "Bold" };
            textNode.textAlignHorizontal = "CENTER";
            textNode.textAlignVertical = "CENTER";
            textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }]; // Texto branco
            textNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Ajusta automaticamente ao conteúdo
            // Ajusta o tamanho do texto para garantir centralização
            const textWidth = Math.min(100, textNode.width); // Limita a largura para caber no círculo (START é mais largo que End)
            const textHeight = textNode.height;
            textNode.resize(textWidth, textHeight);
            // Centraliza o texto manualmente no frame de 140x140px
            textNode.x = (startNode.width - textWidth) / 2; // Centraliza horizontalmente (~20px)
            textNode.y = (startNode.height - textHeight) / 2; // Centraliza verticalmente (~58px)
            // Adiciona o texto ao frame
            startNode.appendChild(textNode);
            // Força a renderização completa e adiciona à página
            figma.currentPage.appendChild(startNode);
            // Força um pequeno atraso para garantir que o Figma processe o layout
            yield new Promise((resolve) => setTimeout(resolve, 0));
            return startNode;
        });
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
     * Cria um nó STEP no Figma com Auto Layout, separando título e descrição em dois blocos.
     * @param nodeData Dados do nó, incluindo `name` e opcionalmente `description` com ações, entradas, saídas e erros.
     * @returns FrameNode configurado corretamente.
     */
    function createStepNode(nodeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const stepNode = figma.createFrame();
            stepNode.name = nodeData.name || "Unnamed Step";
            stepNode.layoutMode = "VERTICAL";
            stepNode.counterAxisSizingMode = "FIXED";
            stepNode.primaryAxisSizingMode = "AUTO";
            stepNode.resize(400, 1);
            stepNode.primaryAxisAlignItems = "MIN";
            stepNode.fills = [];
            stepNode.strokes = [];
            stepNode.strokeWeight = 2;
            stepNode.itemSpacing = 16;
            // Carrega fontes necessárias
            yield Promise.all([
                figma.loadFontAsync({ family: "Inter", style: "Bold" }),
                figma.loadFontAsync({ family: "Inter", style: "Regular" }),
            ]);
            // Bloco do título
            const titleBlock = figma.createFrame();
            titleBlock.layoutMode = "VERTICAL";
            titleBlock.counterAxisSizingMode = "FIXED";
            titleBlock.primaryAxisSizingMode = "AUTO";
            titleBlock.resize(400, 1);
            titleBlock.paddingTop = 24;
            titleBlock.paddingBottom = 24;
            titleBlock.paddingLeft = 24;
            titleBlock.paddingRight = 24;
            titleBlock.cornerRadius = 24;
            titleBlock.fills = [{ type: "SOLID", color: hexToRGB("#F4F4F5") }];
            titleBlock.itemSpacing = 8;
            titleBlock.strokes = [{ type: "SOLID", color: hexToRGB("#A1A1AA") }];
            titleBlock.strokeWeight = 2;
            const chip = yield ChipNode.createChipNode("STEP");
            titleBlock.appendChild(chip);
            const title = figma.createText();
            title.characters = nodeData.name || "Unnamed Step";
            title.fontSize = 24;
            title.fontName = { family: "Inter", style: "Bold" };
            title.fills = [{ type: "SOLID", color: hexToRGB("#09090B") }];
            title.textAutoResize = "HEIGHT";
            title.resize(368, title.height);
            titleBlock.appendChild(title);
            stepNode.appendChild(titleBlock);
            // Bloco da descrição
            const descBlock = figma.createFrame();
            descBlock.layoutMode = "VERTICAL";
            descBlock.counterAxisSizingMode = "FIXED";
            descBlock.primaryAxisSizingMode = "AUTO";
            descBlock.resize(400, 1);
            descBlock.paddingTop = 24;
            descBlock.paddingBottom = 24;
            descBlock.paddingLeft = 24;
            descBlock.paddingRight = 24;
            descBlock.cornerRadius = 24;
            descBlock.fills = [{ type: "SOLID", color: hexToRGB("#FFFFFF") }];
            descBlock.itemSpacing = 8;
            descBlock.strokes = [{ type: "SOLID", color: hexToRGB("#E4E4E7") }];
            descBlock.strokeWeight = 2;
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
                labelText.fills = [{ type: "SOLID", color: hexToRGB("#3F3F46") }];
                section.appendChild(labelText);
                const contentArray = Array.isArray(content) ? content : [content];
                contentArray.forEach((item) => {
                    const itemText = figma.createText();
                    itemText.characters = item;
                    itemText.fontSize = 14;
                    itemText.fontName = { family: "Inter", style: "Regular" };
                    itemText.fills = [{ type: "SOLID", color: hexToRGB("#09090B") }];
                    section.appendChild(itemText);
                });
                descBlock.appendChild(section);
            };
            if (nodeData.description) {
                if (nodeData.description.action)
                    addSection("Action", nodeData.description.action);
                if (nodeData.description.inputs)
                    addSection("Inputs", nodeData.description.inputs);
                if (nodeData.description.outputs)
                    addSection("Outputs", nodeData.description.outputs);
                if (nodeData.description.errors)
                    addSection("Errors", nodeData.description.errors);
            }
            stepNode.appendChild(descBlock);
            return stepNode;
        });
    }
    StepNode.createStepNode = createStepNode;
    /**
     * Converte uma cor HEX para RGB normalizado usado pelo Figma
     * @param hex Cor no formato HEX
     * @returns RGBColor
     */
    function hexToRGB(hex) {
        const sanitizedHex = hex.replace("#", "");
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255,
        };
    }
})(StepNode || (StepNode = {}));

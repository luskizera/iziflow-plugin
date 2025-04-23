// src-code/code.ts
/// <reference types="@figma/plugin-typings" />

// Imports de Utilitários e Tipos
import { nodeCache } from './utils/nodeCache';
import { parseMarkdownToFlow } from './lib/markdownParser';
import type { NodeData, Connection, FlowNode } from '@shared/types/flow.types';
import type { EventTS } from '@shared/types/messaging.types';
import type { RGB } from './config/theme.config';
import { getThemeColors, FontsToLoad } from './config/theme.config';
import * as LayoutConfig from "./config/layout.config";
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';
import { dispatchTS } from './utils/code-utils'; // Para enviar mensagens à UI
// <<< IMPORTAR DO NOVO UTILITÁRIO DE HISTÓRICO >>>
import { getHistory, addHistoryEntry, clearHistory } from './utils/historyStorage';

// --- Debug Log (com envio para UI) ---
// (Função debugLog existente inalterada)
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  console.log(formattedMessage, data || ''); // Usar console.log pois console.debug pode não estar disponível
  try {
    figma.ui.postMessage({
        pluginMessage: {
            type: 'debug',
            message: formattedMessage,
            data: data ? JSON.stringify(data) : undefined
        }
    });
  } catch(e) { /* Ignora erro */ }
}

// --- Preload Fonts ---
// (Função preloadFonts existente inalterada)
async function preloadFonts() {
    debugLog('FontLoader', 'Iniciando pré-carregamento de fontes...');
    try {
        await Promise.all(
            FontsToLoad.map(font => {
                debugLog('FontLoader', `Carregando fonte: ${font.family} - ${font.style}`);
                return nodeCache.enqueueTask(() => figma.loadFontAsync(font));
            })
        );
        debugLog('FontLoader', `Fontes pré-carregadas: ${FontsToLoad.length}`);
    } catch (e: any) {
        debugLog('FontLoader', 'Erro ao pré-carregar fontes:', e);
        figma.notify(`Erro ao carregar fontes essenciais: ${e?.message || e}`, { error: true });
    }
     debugLog('FontLoader', `Pré-carregamento de fontes concluído.`);
}

// --- Função auxiliar para calcular níveis de layout ---
// (Função calculateLayoutLevels existente inalterada)
function calculateLayoutLevels(flowNodes: FlowNode[], adjacencyList: Record<string, string[]>, inDegree: Record<string, number>) {
    debugLog('Layout', 'Calculando níveis de layout...');
    let startNodeIds = flowNodes.filter(n => n.type === "START").map(n => n.id);
    if (startNodeIds.length === 0) {
        startNodeIds = flowNodes.filter(n => (inDegree[n.id] || 0) === 0).map(n => n.id);
        if (startNodeIds.length === 0 && flowNodes.length > 0) {
            startNodeIds = [flowNodes[0].id];
            debugLog('Layout', 'Aviso: Nenhum nó START/inDegree 0. Usando o primeiro nó.');
        } else if (startNodeIds.length === 0) {
            throw new Error("Nenhum nó encontrado para iniciar o layout.");
        }
    }
    const nodeLevel: { [id: string]: number } = {};
    const queue: string[] = [...startNodeIds];
    startNodeIds.forEach(id => nodeLevel[id] = 0);
    let visitedCount = 0;
    const maxVisits = flowNodes.length * 2;
    while (queue.length > 0 && visitedCount < maxVisits) {
        visitedCount++;
        const currentId = queue.shift()!;
        const currentLevel = nodeLevel[currentId];
        (adjacencyList[currentId] || []).forEach((nextId: string) => {
            if (nodeLevel[nextId] === undefined) {
               nodeLevel[nextId] = currentLevel + 1;
               queue.push(nextId);
            }
        });
    }
    if (visitedCount >= maxVisits) {
       console.warn(`[Layout] Limite de visitas atingido.`);
       figma.notify("Aviso: Fluxo complexo, layout pode não ser ideal.", { timeout: 5000 });
    }
    flowNodes.forEach(node => { if(nodeLevel[node.id] === undefined) nodeLevel[node.id] = 0; });
    const levelToNodes: { [level: number]: string[] } = {};
    Object.keys(nodeLevel).forEach((nodeId: string) => {
        const lvl = nodeLevel[nodeId];
        if (!levelToNodes[lvl]) levelToNodes[lvl] = [];
        levelToNodes[lvl].push(nodeId);
    });
    const sortedLevels = Object.keys(levelToNodes).map(n => parseInt(n, 10)).sort((a, b) => a - b);
    debugLog('Layout', `Layout calculado. Níveis: ${sortedLevels.length}`);
    return { sortedLevels, levelToNodes };
}

// --- UI e Listener principal ---
figma.showUI(__html__, { width: 624, height: 500, themeColors: true, title: 'IziFlow Plugin' });

type ReceivedMessagePayload = { type: keyof EventTS } & any; // Tipo genérico para mensagem recebida

figma.ui.onmessage = async (msg: ReceivedMessagePayload | any) => {

    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') {
        debugLog('Plugin', 'Mensagem inválida ou sem tipo recebida.', msg);
        return;
    }

    const messageType = msg.type as keyof EventTS;
    const payload = msg; // msg é o payload

    debugLog('Plugin', `Mensagem recebida: ${messageType}`, payload);

    // --- Handler para 'generate-flow' ---
    if (messageType === 'generate-flow') {
        const { markdown: markdownInput, mode, accentColor } = payload as EventTS['generate-flow'];
        const generationId = Date.now();
        debugLog('Flow', `[ID: ${generationId}] Iniciando geração... (Modo: ${mode}, Accent: ${accentColor})`);

        let flowDataResult: { nodes: FlowNode[], connections: Connection[] } | null = null;
        let nodeMap: { [id: string]: SceneNode } = {};
        let createdFrames: SceneNode[] = [];

        try {
            // 1. Calcular Cores
            const finalColors = getThemeColors(mode, accentColor);
            debugLog('Flow', `[ID: ${generationId}] Cores calculadas.`);

            // 2. Validar Input
            if (typeof markdownInput !== 'string' || markdownInput.trim() === '') {
                throw new Error("Entrada Markdown inválida ou vazia.");
            }

            // 3. Parsear Markdown
            debugLog('Flow', `[ID: ${generationId}] Parsing Markdown...`);
            try {
                 flowDataResult = await parseMarkdownToFlow(markdownInput);
                 debugLog('Flow', `[ID: ${generationId}] Parsing concluído.`);
            } catch (parseError: any) {
                 debugLog('Error', `[ID: ${generationId}] Erro no Parsing: ${parseError.message}`, parseError);
                 const lineNumberMatch = parseError.message?.match(/linha (\d+)/);
                 const lineNumber = lineNumberMatch ? parseInt(lineNumberMatch[1], 10) : undefined;
                 // Envia erro de parse para UI (Formato correto sem wrapper extra)
                 figma.ui.postMessage({ type: 'parse-error', message: `Erro ao ler Markdown: ${parseError.message}`, lineNumber });
                 debugLog('Flow', `[ID: ${generationId}] Mensagem 'parse-error' enviada.`);
                 return; // Para execução
            }

            // 4. Validar Resultado do Parsing
             if (!flowDataResult || !flowDataResult.nodes || flowDataResult.nodes.length === 0) {
                 throw new Error("Nenhum nó válido encontrado após o parsing.");
             }
             const { nodes: flowNodes, connections: flowConnections } = flowDataResult;
             debugLog('Flow', `[ID: ${generationId}] Parsing OK. Nodes: ${flowNodes.length}, Conns: ${flowConnections.length}`);

             // 5. Pré-carregar Fontes
             debugLog('Flow', `[ID: ${generationId}] Carregando fontes...`);
             await preloadFonts();
             debugLog('Flow', `[ID: ${generationId}] Fontes carregadas.`);

             // 6. Construir Grafo e Mapa
             debugLog('Flow', `[ID: ${generationId}] Construindo grafo...`);
             const graph = Layout.buildGraph(flowNodes, flowConnections);
             const nodeDataMap: { [id: string]: NodeData } = {};
             flowNodes.forEach(node => { nodeDataMap[node.id] = node; });
             debugLog('Flow', `[ID: ${generationId}] Grafo construído.`);

             // 7. Calcular Layout
             debugLog('Flow', `[ID: ${generationId}] Calculando layout...`);
             const { sortedLevels, levelToNodes } = calculateLayoutLevels(flowNodes, graph.adjacencyList, graph.inDegree);
             debugLog('Flow', `[ID: ${generationId}] Layout calculado.`);

             // 8. Criar e Posicionar Nós
             debugLog('Flow', `[ID: ${generationId}] Criando nós Figma...`);
             nodeMap = {};
             createdFrames = [];
             let currentX = 100;
             const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;
             const verticalSpacing = LayoutConfig.Nodes.VERTICAL_SPACING;
             // Calcular Y inicial (lógica existente inalterada)
             let totalEstimatedHeight = 0;
             sortedLevels.forEach(level => { /* ... cálculo de totalEstimatedHeight ... */ });
             const initialY = figma.viewport.center.y - (totalEstimatedHeight / 2);

             for (const level of sortedLevels) {
                // (Lógica interna do loop de criação de nós inalterada)
                 debugLog('Flow', `[ID: ${generationId}] Processando nível ${level}`);
                 const nodesAtLevel = levelToNodes[level];
                 let currentY = initialY; // Ajustar isso se quiser centralizar por nível
                 let levelMaxHeight = 0;
                 let nodesInLevelCount = 0;

                 for (const nodeId of nodesAtLevel) {
                     const nodeData = nodeDataMap[nodeId];
                     if (!nodeData) continue;
                     let frame: FrameNode | null = null;
                     debugLog('Flow', `[ID: ${generationId}] Criando nó ${nodeId} (${nodeData.type})...`);
                     try {
                         switch (nodeData.type) {
                            case "START": frame = await Frames.createStartNode(nodeData, finalColors); break;
                            case "END": frame = await Frames.createEndNode(nodeData, finalColors); break;
                            case "STEP": frame = await Frames.createStepNode(nodeData, finalColors); break;
                            case "ENTRYPOINT": frame = await Frames.createEntrypointNode(nodeData, finalColors); break;
                            case "DECISION": frame = await Frames.createDecisionNode(nodeData, finalColors); break;
                            default:
                                console.warn(`[Flow] Tipo desconhecido '${nodeData.type}'. Usando STEP.`);
                                frame = await Frames.createStepNode(nodeData, finalColors); break;
                         }
                         if (!frame || frame.removed) throw new Error(`Frame não criado ou removido.`);
                         frame.x = currentX;
                         frame.y = currentY;
                         await new Promise(resolve => setTimeout(resolve, 0));
                         currentY += frame.height + verticalSpacing;
                         levelMaxHeight = Math.max(levelMaxHeight, frame.height);
                         nodeMap[nodeId] = frame;
                         createdFrames.push(frame);
                         nodesInLevelCount++;
                         debugLog('Flow', `[ID: ${generationId}] Nó ${nodeId} CRIADO: ${frame.id}`);
                     } catch (nodeCreationError: any) {
                         debugLog('Error', `[ID: ${generationId}] FALHA ao criar nó ${nodeId}: ${nodeCreationError?.message}`, nodeCreationError?.stack);
                         figma.notify(`Erro nó '${nodeData.name || nodeId}': ${nodeCreationError?.message}`, { error: true });
                     }
                 }
                 let levelMaxWidth = 0;
                 nodesAtLevel.forEach(nodeId => { if (nodeMap[nodeId]) { levelMaxWidth = Math.max(levelMaxWidth, nodeMap[nodeId].width); } });
                 if (nodesInLevelCount > 0) { currentX += levelMaxWidth + horizontalSpacing; }
                 else { debugLog('Flow', `[ID: ${generationId}] Nenhum nó criado no nível ${level}.`); }
             }

             // Adicionar nós à página
             if (createdFrames.length > 0) {
                 createdFrames.forEach(f => figma.currentPage.appendChild(f));
                 await new Promise(resolve => setTimeout(resolve, 50));
                 debugLog('Flow', `[ID: ${generationId}] Nós adicionados: ${createdFrames.length}`);
             } else {
                  throw new Error("Falha: Nenhum nó do fluxo foi criado com sucesso.");
             }

             // 9. Criar Conexões
             debugLog('Flow', `[ID: ${generationId}] Criando conexões...`);
             if (Object.keys(nodeMap).length > 0 && flowConnections && flowConnections.length > 0) {
                 await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap, finalColors);
                 debugLog('Flow', `[ID: ${generationId}] Conexões criadas.`);
             } else {
                 debugLog('Flow', `[ID: ${generationId}] Pulando conexões.`);
             }

             // 10. Finalização
             debugLog('Flow', `[ID: ${generationId}] Finalizando...`);
             const allNodes = Object.values(nodeMap);
             if(allNodes.length > 0) {
                 const group = figma.group(allNodes, figma.currentPage);
                 group.name = "Fluxo Gerado IziFlow";
                 await new Promise(resolve => setTimeout(resolve, 100));
                 figma.viewport.scrollAndZoomIntoView(allNodes);
             }

             // <<< ADICIONAR AO HISTÓRICO APÓS SUCESSO >>>
             await addHistoryEntry(markdownInput); // Chama a função importada

             // Envia sucesso para UI
             figma.ui.postMessage({ type: 'generation-success', message: 'Fluxo gerado com sucesso!' });
             figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
             debugLog('Flow', `[ID: ${generationId}] Geração COMPLETA.`);

        } catch (error: any) { // Captura erros gerais pós-parsing
             console.error(`[Flow] [ID: ${generationId}] Erro GERAL na geração:`, error);
             const errorMessage = (error instanceof Error) ? error.message : String(error);
             debugLog('Error', `[ID: ${generationId}] Falha na geração: ${errorMessage}`, error?.stack);
             // Envia erro geral para UI
             figma.ui.postMessage({ type: 'generation-error', message: `Erro durante geração: ${errorMessage}` });
             debugLog('Flow', `[ID: ${generationId}] Mensagem 'generation-error' enviada.`);
             figma.notify(`Erro na geração: ${errorMessage}`, { error: true, timeout: 5000 });
        }
    }
    // --- Handler para 'get-history' ---
    else if (messageType === 'get-history') {
         console.log("[Plugin] Recebido pedido 'get-history'.");
         // <<< CHAMAR A FUNÇÃO IMPORTADA >>>
         const history = await getHistory();
         console.log("[Plugin] Enviando 'history-data' com", history.length, "itens.");
         dispatchTS('history-data', { history }); // Usa dispatchTS para tipagem
    }
    // --- Handler Opcional para Limpar Histórico (se UI implementar botão) ---
    // else if (messageType === 'clear-history-request') {
    //     console.log("[Plugin] Recebido pedido 'clear-history-request'.");
    //     await clearHistory(); // Chama a função importada
    //     // Envia confirmação ou histórico vazio para UI
    //     dispatchTS('history-data', { history: [] });
    //     figma.notify("Histórico limpo.", { timeout: 2000 });
    // }
    // --- Handler para 'closePlugin' ---
    else if (messageType === 'closePlugin') {
        figma.closePlugin();
    }
    // --- Handler para outros tipos ---
    else {
        debugLog('Plugin', `Tipo de mensagem não tratado: ${messageType}`);
    }
};

// REMOVIDO: Definições locais de HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS, getHistory, addHistoryEntry, clearHistory
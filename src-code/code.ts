// src-code/code.ts
/// <reference types="@figma/plugin-typings" />

// Imports de Utilitários e Tipos
import { nodeCache } from './utils/nodeCache';
import { parseMarkdownToFlow } from './lib/markdownParser';
import type { NodeData, Connection, FlowNode } from '@shared/types/flow.types';
import type { EventTS } from '@shared/types/messaging.types';
import type { RGB } from './config/theme.config';
import { getThemeColors, FontsToLoad } from './config/theme.config';
import * as StyleConfig from './config/styles.config';
import * as LayoutConfig from "./config/layout.config";
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';
// import { dispatchTS } from './utils/code-utils'; // Não usado para enviar neste arquivo
import { getHistory, addHistoryEntry, clearHistory } from './utils/historyStorage';

// --- Debug Log (com envio para UI) ---
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  console.log(formattedMessage, data || ''); // Usar console.log
  try {
    // Tenta enviar log para a UI
    figma.ui.postMessage({
        // Mensagens do plugin para UI NÃO precisam do wrapper 'pluginMessage'
        type: 'debug',
        message: formattedMessage,
        data: data ? JSON.stringify(data) : undefined
    });
  } catch(e) { /* Ignora erro se UI não estiver pronta */ }
}

// --- Preload Fonts ---
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
    const maxVisits = flowNodes.length * 5; // Limite aumentado para grafos maiores/cíclicos
    while (queue.length > 0 && visitedCount < maxVisits) {
        visitedCount++;
        const currentId = queue.shift()!;
        const currentLevel = nodeLevel[currentId];
        (adjacencyList[currentId] || []).forEach((nextId: string) => {
             // Apenas atualiza e enfileira se o nó não foi visitado ou se encontrarmos um caminho mais longo
             if (nodeLevel[nextId] === undefined || nodeLevel[nextId] < currentLevel + 1) {
                nodeLevel[nextId] = currentLevel + 1;
                if (!queue.includes(nextId)) { // Evita ciclos infinitos simples
                    queue.push(nextId);
                }
             }
        });
    }
    if (visitedCount >= maxVisits) {
       console.warn(`[Layout] Limite de visitas (${maxVisits}) atingido. Layout pode não ser ideal.`);
       figma.notify("Aviso: Fluxo complexo detectado, layout pode precisar de ajustes.", { timeout: 6000 });
    }
    flowNodes.forEach(node => { if(nodeLevel[node.id] === undefined) nodeLevel[node.id] = 0; }); // Garante nível para ilhas
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

// <<< Listener principal CORRIGIDO para esperar mensagem desembrulhada >>>
figma.ui.onmessage = async (msg: any) => { // Recebe a mensagem DESEMBRULHADA pelo Figma

    // <<< CORREÇÃO: Valida a mensagem DESEMBRULHADA (sem pluginMessage) >>>
    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') {
        // Log ligeiramente diferente para indicar o ponto da falha
        debugLog('Plugin', 'Mensagem recebida da UI inválida ou sem propriedade type.', msg);
        return;
    }

    // <<< CORREÇÃO: A mensagem recebida 'msg' JÁ É o payload interno >>>
    const messageType = msg.type as keyof EventTS;
    const payload = msg; // msg é o payload desembrulhado { type: ..., data... }

    debugLog('Plugin', `Mensagem da UI recebida (desembrulhada): ${messageType}`, payload);

    // --- Handler para 'generate-flow' ---
    if (messageType === 'generate-flow') {
        // <<< Acessa diretamente as propriedades do payload >>>
        const { markdown: markdownInput, mode, accentColor } = payload;
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
                 // Envia erro de parse para UI (SEM wrapper)
                 figma.ui.postMessage({ type: 'parse-error', message: `${parseError.message}`, lineNumber });
                 debugLog('Flow', `[ID: ${generationId}] Mensagem 'parse-error' enviada.`);
                 return;
            }

            // 4. Validar Resultado
             if (!flowDataResult || !flowDataResult.nodes || flowDataResult.nodes.length === 0) {
                 throw new Error("Nenhum nó válido encontrado após o parsing.");
             }
             const { nodes: flowNodes, connections: flowConnections } = flowDataResult;
             debugLog('Flow', `[ID: ${generationId}] Parsing OK. Nodes: ${flowNodes.length}, Conns: ${flowConnections.length}`);

             // 5. Carregar Fontes
             debugLog('Flow', `[ID: ${generationId}] Carregando fontes...`);
             await preloadFonts();
             debugLog('Flow', `[ID: ${generationId}] Fontes carregadas.`);

             // 6. Construir Grafo/Mapa
             debugLog('Flow', `[ID: ${generationId}] Construindo grafo...`);
             const graph = Layout.buildGraph(flowNodes, flowConnections);
             const nodeDataMap: { [id: string]: NodeData } = {};
             flowNodes.forEach(node => { nodeDataMap[node.id] = node; });
             debugLog('Flow', `[ID: ${generationId}] Grafo construído.`);

             // 7. Calcular Layout
             debugLog('Flow', `[ID: ${generationId}] Calculando layout...`);
             const { sortedLevels, levelToNodes } = calculateLayoutLevels(flowNodes, graph.adjacencyList, graph.inDegree);
             debugLog('Flow', `[ID: ${generationId}] Layout calculado.`);

             // 8. Criar/Posicionar Nós
             debugLog('Flow', `[ID: ${generationId}] Criando nós Figma...`);
             nodeMap = {}; createdFrames = [];
             let currentX = 100;
             const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;
             const verticalSpacing = LayoutConfig.Nodes.VERTICAL_SPACING;
             let totalEstimatedHeight = 0;
             let maxLevelWidth = 0; // Para calcular largura total estimada
             sortedLevels.forEach(level => {
                 let currentLevelHeight = 0;
                 let currentLevelWidth = 0;
                 const nodesAtLevel = levelToNodes[level];
                 nodesAtLevel.forEach(nodeId => {
                     const nodeData = nodeDataMap[nodeId];
                     // Estimativa de altura incluindo Decision
                     const estimatedHeight = (nodeData?.type === 'STEP' || nodeData?.type === 'ENTRYPOINT' || nodeData?.type === 'DECISION' ? 250 : 150);
                     const estimatedWidth = (nodeData?.type === 'START' || nodeData?.type === 'END' ? StyleConfig.Nodes.START_END.SIZE : StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH);
                     currentLevelHeight += estimatedHeight;
                     currentLevelWidth = Math.max(currentLevelWidth, estimatedWidth); // Largura do nível é a do nó mais largo
                     if (nodesAtLevel.length > 1 && nodeId !== nodesAtLevel[nodesAtLevel.length -1]) {
                         currentLevelHeight += verticalSpacing; // Adiciona espaçamento vertical entre nós no mesmo nível
                     }
                 });
                 totalEstimatedHeight = Math.max(totalEstimatedHeight, currentLevelHeight); // Altura total é a do nível mais alto
                 maxLevelWidth += currentLevelWidth; // Soma larguras dos níveis
                 if (level < sortedLevels.length - 1) maxLevelWidth += horizontalSpacing; // Adiciona espaçamento horizontal entre níveis
             });
             // Ajusta Y inicial para centralizar verticalmente
             const initialY = figma.viewport.center.y - (totalEstimatedHeight / 2);
             // Manter X inicial fixo por simplicidade por enquanto
             currentX = 100;

             for (const level of sortedLevels) {
                 debugLog('Flow', `[ID: ${generationId}] Processando nível ${level}`);
                 const nodesAtLevel = levelToNodes[level];
                 // Calcular Y inicial para centralizar verticalmente *dentro* do nível
                 let levelHeightSum = 0;
                 nodesAtLevel.forEach(nodeId => {
                     const nodeData = nodeDataMap[nodeId];
                     levelHeightSum += (nodeData?.type === 'STEP' || nodeData?.type === 'ENTRYPOINT' || nodeData?.type === 'DECISION' ? 250 : 150); // Re-estimar
                 });
                 levelHeightSum += Math.max(0, nodesAtLevel.length - 1) * verticalSpacing;
                 let currentY = initialY + (totalEstimatedHeight - levelHeightSum) / 2; // Ajusta Y para centralizar o bloco do nível

                 let levelMaxNodeWidth = 0; // Para calcular próximo X
                 let nodesInLevelCount = 0;

                 for (const nodeId of nodesAtLevel) {
                     const nodeData = nodeDataMap[nodeId];
                     if (!nodeData) continue;
                     let frame: SceneNode | null = null; // Usa SceneNode
                     debugLog('Flow', `[ID: ${generationId}] Criando nó ${nodeId} (${nodeData.type})...`);
                     try {
                         switch (nodeData.type) {
                            case "START": frame = await Frames.createStartNode(nodeData, finalColors); break;
                            case "END": frame = await Frames.createEndNode(nodeData, finalColors); break;
                            case "STEP": frame = await Frames.createStepNode(nodeData, finalColors); break;
                            case "ENTRYPOINT": frame = await Frames.createEntrypointNode(nodeData, finalColors); break;
                            case "DECISION": frame = await Frames.createDecisionNode(nodeData, finalColors); break;
                            default: frame = await Frames.createStepNode(nodeData, finalColors); break; // Fallback
                         }
                         if (!frame || frame.removed) throw new Error(`Frame nulo/removido.`);

                         frame.x = currentX;
                         frame.y = currentY;
                         await new Promise(resolve => setTimeout(resolve, 50)); // Pausa maior para layout complexo
                         currentY += frame.height + verticalSpacing;
                         levelMaxNodeWidth = Math.max(levelMaxNodeWidth, frame.width); // Usa largura real
                         nodeMap[nodeId] = frame;
                         createdFrames.push(frame);
                         nodesInLevelCount++;
                         debugLog('Flow', `[ID: ${generationId}] Nó ${nodeId} CRIADO: ${frame.id}, H:${frame.height.toFixed(0)}`);
                     } catch (nodeCreationError: any) {
                          debugLog('Error', `[ID: ${generationId}] FALHA nó ${nodeId}: ${nodeCreationError?.message}`, nodeCreationError?.stack);
                          figma.notify(`Erro nó '${nodeData.name || nodeId}': ${nodeCreationError?.message}`, { error: true });
                     }
                 }
                 if (nodesInLevelCount > 0) {
                      currentX += levelMaxNodeWidth + horizontalSpacing; // Avança X pela largura máxima do nível
                 } else {
                     debugLog('Flow', `[ID: ${generationId}] Nenhum nó criado no nível ${level}.`);
                 }
             }

             // Adicionar à Página
             if (createdFrames.length > 0) {
                 createdFrames.forEach(f => figma.currentPage.appendChild(f));
                 await new Promise(resolve => setTimeout(resolve, 100)); // Pausa maior
                 debugLog('Flow', `[ID: ${generationId}] Nós adicionados: ${createdFrames.length}`);
             } else { throw new Error("Falha: Nenhum nó criado."); }

             // 9. Criar Conexões
             debugLog('Flow', `[ID: ${generationId}] Criando conexões...`);
             if (Object.keys(nodeMap).length > 0 && flowConnections?.length > 0) {
                 await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap, finalColors);
                 debugLog('Flow', `[ID: ${generationId}] Conexões criadas.`);
             } else { debugLog('Flow', `[ID: ${generationId}] Pulando conexões.`); }

             // 10. Finalização (Agrupar, Centralizar, Zoom)
             debugLog('Flow', `[ID: ${generationId}] Finalizando...`);
             const allCreatedNodes = Object.values(nodeMap);
             if (allCreatedNodes.length > 0) {
                 const group = figma.group(allCreatedNodes, figma.currentPage);
                 group.name = "Fluxo Gerado IziFlow";
                 debugLog('Flow', `[ID: ${generationId}] Nós agrupados: ${group.name}`);
                 try {
                    await new Promise(resolve => setTimeout(resolve, 100)); // Pausa para renderizar grupo
                    const groupCenterX = group.x + group.width / 2;
                    const groupCenterY = group.y + group.height / 2;
                    const viewportCenterX = figma.viewport.center.x;
                    const viewportCenterY = figma.viewport.center.y;
                    const deltaX = viewportCenterX - groupCenterX;
                    const deltaY = viewportCenterY - groupCenterY;
                    group.x += deltaX; group.y += deltaY;
                    debugLog('Flow', `[ID: ${generationId}] Grupo centralizado.`);
                    figma.viewport.scrollAndZoomIntoView([group]);
                 } catch (centerError: any) {
                     console.error(`[Flow] [ID: ${generationId}] Erro ao centralizar:`, centerError);
                     figma.viewport.scrollAndZoomIntoView(allCreatedNodes); // Fallback
                 }
             }

             // <<< ADICIONAR AO HISTÓRICO >>>
             await addHistoryEntry(payload.markdown); // Usa payload.markdown direto

             // Envia sucesso para UI (SEM wrapper)
             figma.ui.postMessage({ type: 'generation-success', message: 'Fluxo gerado com sucesso!' });
             figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
             debugLog('Flow', `[ID: ${generationId}] Geração COMPLETA.`);

        } catch (error: any) {
             console.error(`[Flow] [ID: ${generationId}] Erro GERAL na geração:`, error);
             const errorMessage = (error instanceof Error) ? error.message : String(error);
             // Envia erro para UI (SEM wrapper)
             figma.ui.postMessage({ type: 'generation-error', message: `Erro durante geração: ${errorMessage}` });
             figma.notify(`Erro na geração: ${errorMessage}`, { error: true, timeout: 5000 });
        }
    }
    // --- Handler para 'get-history' ---
    else if (messageType === 'get-history') {
        // payload aqui é { type: 'get-history' }
        console.log("[Plugin] Recebido pedido 'get-history'.");
        const history = await getHistory();
        console.log("[Plugin] Enviando 'history-data' com", history.length, "itens.");
        // Envio Plugin -> UI não precisa de wrapper
        figma.ui.postMessage({ type: 'history-data', history: history });
   }
   // --- Handler para 'clear-history-request' ---
   else if (messageType === 'clear-history-request') {
        // payload aqui é { type: 'clear-history-request' }
        console.log("[Plugin] Recebido pedido 'clear-history-request'.");
        await clearHistory();
        const updatedHistory = await getHistory();
        console.log("[Plugin] Enviando histórico vazio após limpeza.");
        // Envio Plugin -> UI não precisa de wrapper
        figma.ui.postMessage({ type: 'history-data', history: updatedHistory });
        figma.notify("Histórico limpo.", { timeout: 2000 });
   }
   // --- Handler para 'closePlugin' ---
   else if (messageType === 'closePlugin') {
       figma.closePlugin();
   }
    // --- Handler para outros tipos ---
    else {
        debugLog('Plugin', `Tipo de mensagem não tratado: ${messageType}`);
    }
};
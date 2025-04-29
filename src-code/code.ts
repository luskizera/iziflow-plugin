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
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';
import { getHistory, addHistoryEntry, clearHistory } from './utils/historyStorage';

// Chave para o clientStorage (deve ser a mesma na UI)
const GENERATION_STATUS_KEY = 'iziflow_generation_status';

// --- Debug Log (com envio para UI) ---
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  // console.log(formattedMessage, data || ''); // Descomente para logs verbosos no console do plugin
  try {
    figma.ui.postMessage({
        type: 'debug',
        message: formattedMessage,
        data: data ? JSON.stringify(data) : undefined
    });
  } catch(e) { /* Ignora erro */ }
}

// --- Preload Fonts ---
async function preloadFonts() {
    // Logs comentados para limpeza
    // debugLog('FontLoader', 'Iniciando pré-carregamento de fontes...');
    try {
        await Promise.all(
            FontsToLoad.map(font => {
                // debugLog('FontLoader', `Carregando fonte: ${font.family} - ${font.style}`);
                return nodeCache.enqueueTask(() => figma.loadFontAsync(font));
            })
        );
        // debugLog('FontLoader', `Fontes pré-carregadas: ${FontsToLoad.length}`);
    } catch (e: any) {
        console.error('[FontLoader] Erro ao pré-carregar fontes:', e);
        figma.notify(`Erro ao carregar fontes essenciais: ${e?.message || e}`, { error: true });
    }
     // debugLog('FontLoader', `Pré-carregamento de fontes concluído.`);
}

// --- Função calculateLayoutLevels REMOVIDA ---

// --- UI e Listener principal ---
figma.showUI(__html__, { width: 624, height: 500, themeColors: true, title: 'IziFlow Plugin' });

// Listener principal
figma.ui.onmessage = async (msg: any) => { // Recebe a mensagem DESEMBRULHADA pelo Figma

    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') {
        console.warn('[Plugin] Mensagem recebida da UI inválida ou sem propriedade type.', msg);
        return;
    }

    const messageType = msg.type as keyof EventTS;
    const payload = msg;

    console.log(`[Plugin] Mensagem da UI recebida: ${messageType}`); // Log principal mantido

    // --- Handler para 'generate-flow' ---
    if (messageType === 'generate-flow') {
        const { markdown: markdownInput, mode, accentColor } = payload;
        const generationId = Date.now(); // Usado para associar status
        console.log(`[Flow ID: ${generationId}] Iniciando geração... (Modo: ${mode}, Accent: ${accentColor})`);

        try { // Adicionado try/catch em volta da limpeza/definição inicial do storage
            // <<< LINHA ADICIONADA AQUI >>>
            // Limpa o status antigo ANTES de definir como loading
            await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
            console.log(`[Flow ID: ${generationId}] Chave de status antiga limpa (se existia).`);

            // Define status inicial como 'loading' no clientStorage
            await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'loading', id: generationId, timestamp: Date.now() }));
            console.log(`[Flow ID: ${generationId}] Status 'loading' salvo no clientStorage.`);
        } catch(storageError) {
            console.error(`[Flow ID: ${generationId}] Erro ao inicializar status no clientStorage:`, storageError);
            // Decide se continua ou notifica erro aqui. Por ora, tenta continuar.
        }
        let flowDataResult: { nodes: FlowNode[], connections: Connection[] } | null = null;
        let nodeMap: { [id: string]: SceneNode } = {};
        let createdFrames: SceneNode[] = [];

        try {
            // 1. Calcular Cores
            const finalColors = getThemeColors(mode, accentColor);

            // 2. Validar Input
            if (typeof markdownInput !== 'string' || markdownInput.trim() === '') {
                throw new Error("Entrada Markdown inválida ou vazia.");
            }

            // 3. Parsear Markdown
            try {
                 flowDataResult = await parseMarkdownToFlow(markdownInput);
            } catch (parseError: any) {
                 console.error(`[Flow ID: ${generationId}] Erro no Parsing: ${parseError.message}`, parseError);
                 const lineNumberMatch = parseError.message?.match(/linha (\d+)/);
                 const lineNumber = lineNumberMatch ? parseInt(lineNumberMatch[1], 10) : undefined;
                 // <<< Define status ERRO (parse) no clientStorage >>>
                 await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'error', id: generationId, message: `Erro de Parsing: ${parseError.message}`, timestamp: Date.now() }));
                 console.log(`[Flow ID: ${generationId}] Status 'error' (parse) salvo no clientStorage.`);
                 // Tenta enviar a mensagem de erro de parse para UI
                 figma.ui.postMessage({ type: 'parse-error', message: `${parseError.message}`, lineNumber });
                 return;
            }

            // 4. Validar Resultado do Parse
             if (!flowDataResult || !flowDataResult.nodes || flowDataResult.nodes.length === 0) {
                 throw new Error("Nenhum nó válido encontrado após o parsing.");
             }
             const { nodes: flowNodes, connections: flowConnections } = flowDataResult;
             console.log(`[Flow ID: ${generationId}] Parsing OK. Nodes: ${flowNodes.length}, Conns: ${flowConnections.length}`);

             // 5. Carregar Fontes
             await preloadFonts();

             // 6. Construir Mapa de Dados
             const nodeDataMap: { [id: string]: NodeData } = {};
             flowNodes.forEach(node => { nodeDataMap[node.id] = node; });

             // 7. Layout Sequencial Horizontal e Criação/Posicionamento de Nós
             console.log(`[Flow ID: ${generationId}] Criando e posicionando nós sequencialmente...`);
             nodeMap = {}; createdFrames = [];
             let currentX = 100;
             const startY = figma.viewport.center.y;
             const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;

             for (const nodeData of flowNodes) {
                 const nodeId = nodeData.id;
                 let frame: SceneNode | null = null;
                 try {
                     switch (nodeData.type) {
                        case "START": frame = await Frames.createStartNode(nodeData, finalColors); break;
                        case "END": frame = await Frames.createEndNode(nodeData, finalColors); break;
                        case "STEP": frame = await Frames.createStepNode(nodeData, finalColors); break;
                        case "ENTRYPOINT": frame = await Frames.createEntrypointNode(nodeData, finalColors); break;
                        case "DECISION": frame = await Frames.createDecisionNode(nodeData, finalColors); break;
                        default: frame = await Frames.createStepNode(nodeData, finalColors); break;
                     }
                     if (!frame || frame.removed) throw new Error(`Frame nulo/removido para ${nodeId}.`);
                     await new Promise(resolve => setTimeout(resolve, 50));
                     frame.x = currentX;
                     frame.y = startY - frame.height / 2;
                     currentX += frame.width + horizontalSpacing;
                     nodeMap[nodeId] = frame;
                     createdFrames.push(frame);
                 } catch (nodeCreationError: any) {
                      console.error(`[Flow ID: ${generationId}] FALHA ao criar nó ${nodeId}: ${nodeCreationError?.message}`, nodeCreationError?.stack);
                      figma.notify(`Erro ao criar nó '${nodeData.name || nodeId}': ${nodeCreationError?.message}`, { error: true });
                      // Considerar lançar o erro para parar a geração aqui
                      // throw nodeCreationError;
                 }
             }

             // 8. Adicionar Nós à Página
             if (createdFrames.length === 0) {
                 throw new Error("Falha: Nenhum nó foi criado com sucesso.");
             }
             createdFrames.forEach(f => figma.currentPage.appendChild(f));
             await new Promise(resolve => setTimeout(resolve, 100));
             console.log(`[Flow ID: ${generationId}] Nós adicionados à página: ${createdFrames.length}`);

             // 9. Criar Conexões
             if (Object.keys(nodeMap).length > 0 && flowConnections?.length > 0) {
                 await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap, finalColors);
             } else {
                 console.log(`[Flow ID: ${generationId}] Pulando criação de conexões.`);
             }

             // 10. Finalização (Agrupar, Centralizar, Zoom)
             const allCreatedNodes = Object.values(nodeMap);
             if (allCreatedNodes.length > 0) {
                 const nodesToGroup = [...allCreatedNodes];
                 figma.currentPage.findAll(n => n.type === 'CONNECTOR' && nodesToGroup.some(f => f.id === (n as ConnectorNode).connectorStart?.endpointNodeId || f.id === (n as ConnectorNode).connectorEnd?.endpointNodeId ))
                    .forEach(conn => nodesToGroup.push(conn));

                 if (nodesToGroup.length > 0) {
                    const group = figma.group(nodesToGroup, figma.currentPage);
                    group.name = "Fluxo Gerado IziFlow";
                    try {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        const groupCenterX = group.x + group.width / 2;
                        const groupCenterY = group.y + group.height / 2;
                        group.x += figma.viewport.center.x - groupCenterX;
                        group.y += figma.viewport.center.y - groupCenterY;
                        figma.viewport.scrollAndZoomIntoView([group]);
                    } catch (centerError: any) {
                        console.error(`[Flow ID: ${generationId}] Erro ao centralizar/zoom:`, centerError);
                        figma.viewport.scrollAndZoomIntoView(nodesToGroup);
                    }
                 }
             }

             // --- SUCESSO ---
             await addHistoryEntry(payload.markdown);

             // <<< Define status SUCESSO no clientStorage >>>
             await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'success', id: generationId, timestamp: Date.now() }));
             console.log(`[Flow ID: ${generationId}] Status 'success' salvo no clientStorage.`);

             // Tenta enviar a mensagem (best effort)
             figma.ui.postMessage({ type: 'generation-success', message: 'Fluxo gerado com sucesso!' });
             console.log(">>> PLUGIN: Mensagem 'generation-success' ENVIADA para UI (confiabilidade depende do clientStorage agora).");

             figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
             console.log(`[Flow ID: ${generationId}] Geração COMPLETA.`);

        } catch (error: any) {
             // --- ERRO ---
             console.error(`[Flow ID: ${generationId}] Erro GERAL na geração:`, error);
             const errorMessage = (error instanceof Error) ? error.message : String(error);

             // <<< Define status ERRO no clientStorage >>>
             await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'error', id: generationId, message: errorMessage, timestamp: Date.now() }));
             console.log(`[Flow ID: ${generationId}] Status 'error' salvo no clientStorage.`);

             // Tenta enviar a mensagem de erro (best effort)
             figma.ui.postMessage({ type: 'generation-error', message: `Erro durante geração: ${errorMessage}` });
             console.log(">>> PLUGIN: Mensagem 'generation-error' ENVIADA para UI (confiabilidade depende do clientStorage agora).");

             figma.notify(`Erro na geração: ${errorMessage}`, { error: true, timeout: 5000 });
        }
    }
    // --- Handlers para outras mensagens (histórico, etc.) ---
    else if (messageType === 'get-history') {
        console.log("[Plugin] Recebido pedido 'get-history'.");
        const history = await getHistory();
        console.log("[Plugin] Enviando 'history-data' com", history.length, "itens.");
        figma.ui.postMessage({ type: 'history-data', history: history });
   }
   else if (messageType === 'clear-history-request') {
        console.log("[Plugin] Recebido pedido 'clear-history-request'.");
        await clearHistory();
        const updatedHistory = await getHistory();
        console.log("[Plugin] Enviando histórico vazio após limpeza.");
        figma.ui.postMessage({ type: 'history-data', history: updatedHistory });
        figma.notify("Histórico limpo.", { timeout: 2000 });
   }
   else if (messageType === 'remove-history-entry') {
        const { markdown: markdownToRemove } = payload;
        if (typeof markdownToRemove === 'string') {
            console.log(`[Plugin] Recebido pedido 'remove-history-entry'.`);
            try {
                const currentHistory = await getHistory();
                const filteredHistory = currentHistory.filter(item => item !== markdownToRemove);
                if (filteredHistory.length < currentHistory.length) {
                    await figma.clientStorage.setAsync('markdownHistory', JSON.stringify(filteredHistory));
                    console.log("[Plugin] Item removido e histórico salvo.");
                } else {
                     console.log("[Plugin] Item a ser removido não encontrado no histórico.");
                }
            } catch (error) {
                 console.error("[Plugin] Erro ao remover item do histórico:", error);
                 figma.notify("Erro ao remover item do histórico.", { error: true });
            }
        } else {
             console.warn("[Plugin] Payload inválido para 'remove-history-entry'.", payload);
        }
   }
   else if (messageType === 'closePlugin') {
       figma.closePlugin();
   }
    else {
        console.warn(`[Plugin] Tipo de mensagem não tratado: ${messageType}`);
    }
};
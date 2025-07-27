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
// import { Layout } from './lib/layout'; // Não usamos mais buildGraph ou calculateLayoutLevels
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';
import { getHistory, addHistoryEntry, clearHistory, removeHistoryEntry } from './utils/historyStorage';

// Chave para o clientStorage (deve ser a mesma na UI)
const GENERATION_STATUS_KEY = 'iziflow_generation_status';

// --- Debug Log (com envio para UI) ---
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  // Comentado para reduzir ruído, descomente se precisar depurar logs específicos
  // console.log(formattedMessage, data || '');
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
        console.error('[FontLoader] Erro ao pré-carregar fontes:', e); // Mantém erros
        figma.notify(`Erro ao carregar fontes essenciais: ${e?.message || e}`, { error: true });
    }
     // debugLog('FontLoader', `Pré-carregamento de fontes concluído.`);
}

// --- Função calculateLayoutLevels REMOVIDA ---

// --- UI e Listener principal ---
figma.showUI(__html__, { width: 624, height: 500, themeColors: true, title: 'IziFlow Plugin' });

// Listener principal
figma.ui.onmessage = async (msg: any) => { // Recebe a mensagem DESEMBRULHADA pelo Figma
    console.log('[Plugin] Mensagem RAW recebida da UI:', msg);

    // Verifica se a mensagem vem encapsulada em pluginMessage
    let actualMessage = msg;
    if (msg && msg.pluginMessage && typeof msg.pluginMessage === 'object') {
        console.log('[Plugin] Mensagem tem wrapper pluginMessage, extraindo...');
        actualMessage = msg.pluginMessage;
    }

    // Valida a mensagem DESEMBRULHADA
    if (!actualMessage || typeof actualMessage !== 'object' || typeof actualMessage.type !== 'string') {
        console.warn('[Plugin] Mensagem recebida da UI inválida ou sem propriedade type.', actualMessage); // Usa warn para diferenciar
        return;
    }

    const messageType = actualMessage.type as keyof EventTS;
    const payload = actualMessage; // actualMessage é o payload desembrulhado { type: ..., data... }

    console.log(`[Plugin] Mensagem da UI recebida: ${messageType}`); // Log principal mantido

    // --- Handler para 'generate-flow' ---
    if (messageType === 'generate-flow') {
        const { markdown: markdownInput, mode, accentColor } = payload;
        const generationId = Date.now(); // Usado para associar status
        console.log(`[Flow ID: ${generationId}] Iniciando geração... (Modo: ${mode}, Accent: ${accentColor})`);

        try {
            // <<< Limpa o status antigo ANTES de definir como loading >>>
            await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
            console.log(`[Flow ID: ${generationId}] Chave de status antiga limpa (se existia).`);

            // <<< Define status inicial como 'loading' no clientStorage >>>
            await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'loading', id: generationId, timestamp: Date.now() }));
            console.log(`[Flow ID: ${generationId}] Status 'loading' salvo no clientStorage.`);
        } catch(storageError) {
            console.error(`[Flow ID: ${generationId}] Erro ao inicializar status no clientStorage:`, storageError);
            // Notifica a UI sobre o erro de storage inicial (pode não chegar, mas tentamos)
            figma.ui.postMessage({ type: 'generation-error', message: `Erro interno ao preparar geração (storage).` });
            figma.notify("Erro interno ao preparar geração.", { error: true });
            return; // Para a execução se não puder definir o status inicial
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
                 const errorMessage = `Erro de Parsing: ${parseError.message}`;
                 console.error(`[Flow ID: ${generationId}] ${errorMessage}`, parseError);
                 const lineNumberMatch = parseError.message?.match(/linha (\d+)/);
                 const lineNumber = lineNumberMatch ? parseInt(lineNumberMatch[1], 10) : undefined;
                 // <<< Define status ERRO (parse) no clientStorage >>>
                 await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'error', id: generationId, message: errorMessage, timestamp: Date.now() }));
                 console.log(`[Flow ID: ${generationId}] Status 'error' (parse) salvo no clientStorage.`);
                 // Tenta enviar a mensagem de erro de parse para UI
                 figma.ui.postMessage({ type: 'parse-error', message: `${parseError.message}`, lineNumber });
                 return; // Para a execução
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
                      // Lança o erro para ser pego pelo catch principal e definir o status de erro
                      throw new Error(`Falha ao criar nó '${nodeData.name || nodeId}': ${nodeCreationError.message}`);
                 }
             }

             // 8. Adicionar Nós à Página
             if (createdFrames.length === 0) {
                 throw new Error("Falha: Nenhum nó foi criado com sucesso."); // Será pego pelo catch principal
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
                // Tenta incluir conectores recém-criados no grupo
                figma.currentPage.findAll(n => {
                    if (n.type === 'CONNECTOR') {
                        const connector = n as ConnectorNode;
                        // Verifica se os endpoints do conector estão entre os nós criados
                        return allCreatedNodes.some(f => f.id === connector.connectorStart?.endpointNodeId) &&
                               allCreatedNodes.some(f => f.id === connector.connectorEnd?.endpointNodeId);
                    }
                    return false;
                }).forEach(conn => nodesToGroup.push(conn));


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
             console.log(`[Flow ID: ${generationId}] Tentando adicionar ao histórico...`);
             await addHistoryEntry(payload.markdown);
             console.log(`[Flow ID: ${generationId}] Adicionado ao histórico com sucesso.`);

             // <<< ATUALIZA A UI COM O NOVO HISTÓRICO >>>
             const updatedHistory = await getHistory();
             console.log(`[Flow ID: ${generationId}] Histórico atualizado obtido com ${updatedHistory.length} itens:`, updatedHistory);
             figma.ui.postMessage({ type: 'history-updated', history: updatedHistory });
             console.log(`[Flow ID: ${generationId}] Mensagem 'history-updated' enviada para UI.`);

             // <<< Define status SUCESSO no clientStorage >>>
             await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'success', id: generationId, timestamp: Date.now() }));
             console.log(`[Flow ID: ${generationId}] Status 'success' salvo no clientStorage.`);

             // Tenta enviar a mensagem (best effort, a UI vai usar o clientStorage para isLoading)
             figma.ui.postMessage({ type: 'generation-success', message: 'Fluxo gerado com sucesso!' });
             console.log(">>> PLUGIN: Mensagem 'generation-success' ENVIADA para UI (UI usará clientStorage para estado de loading).");

             figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
             console.log(`[Flow ID: ${generationId}] Geração COMPLETA.`);

        } catch (error: any) {
             // --- ERRO GERAL ---
             console.error(`[Flow ID: ${generationId}] Erro GERAL na geração:`, error);
             const errorMessage = (error instanceof Error) ? error.message : String(error);
             // <<< Define status ERRO no clientStorage >>>
             try {
                 await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'error', id: generationId, message: errorMessage, timestamp: Date.now() }));
                 console.log(`[Flow ID: ${generationId}] Status 'error' salvo no clientStorage.`);
             } catch (storageError) {
                  console.error(`[Flow ID: ${generationId}] Erro ao salvar status de ERRO no clientStorage:`, storageError);
             }
             // Tenta enviar a mensagem de erro (best effort)
             figma.ui.postMessage({ type: 'generation-error', message: `Erro durante geração: ${errorMessage}` });
             console.log(">>> PLUGIN: Mensagem 'generation-error' ENVIADA para UI (UI usará clientStorage para estado de loading).");
             figma.notify(`Erro na geração: ${errorMessage}`, { error: true, timeout: 5000 });
        }
    }
    // --- Handlers para o Histórico ---
    else if (messageType === 'get-history') {
        console.log("[Plugin] Recebido pedido 'get-history'.");
        const history = await getHistory();
        console.log(`[Plugin] Enviando 'history-updated' com ${history.length} itens.`);
        figma.ui.postMessage({ type: 'history-updated', history: history });
   }
   else if (messageType === 'clear-history-request') {
        console.log("[Plugin] Recebido pedido 'clear-history-request'.");
        await clearHistory();
        const updatedHistory = await getHistory(); // Deve retornar []
        figma.ui.postMessage({ type: 'history-updated', history: updatedHistory });
        figma.notify("Histórico limpo.", { timeout: 2000 });
   }
   else if (messageType === 'remove-history-entry') {
        const { id: idToRemove } = payload;
        if (typeof idToRemove === 'string') {
            console.log(`[Plugin] Recebido pedido para remover item com ID: ${idToRemove}`);
            await removeHistoryEntry(idToRemove);
            const updatedHistory = await getHistory();
            figma.ui.postMessage({ type: 'history-updated', history: updatedHistory });
        } else {
             console.warn("[Plugin] Payload inválido para 'remove-history-entry', ID não encontrado.", payload);
        }
   }
   else if (messageType === 'closePlugin') {
       figma.closePlugin();
   }
    else {
        console.warn(`[Plugin] Tipo de mensagem não tratado: ${messageType}`);
    }
};
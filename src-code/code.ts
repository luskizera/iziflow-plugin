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

// --- Sistema de Layout Bifurcado ---

/**
 * Gera fluxo com layout bifurcado
 */
async function generateFlowWithBifurcatedLayout(
    flowNodes: FlowNode[],
    flowConnections: Connection[],
    finalColors: Record<string, RGB>
): Promise<{ nodeMap: { [id: string]: SceneNode }, createdFrames: SceneNode[] }> {
    
    // 1. Análise estrutural
    const bifurcations = Layout.detectBinaryDecisions(flowNodes, flowConnections);
    const nodeLaneMap = Layout.calculateVerticalLanes(bifurcations, flowNodes);
    
    console.log(`[Bifurcated Layout] Detectadas ${bifurcations.length} bifurcações`);
    console.log(`[Bifurcated Layout] Mapa de lanes:`, Object.fromEntries(nodeLaneMap));
    
    // 2. Calcular posições para todos os nós
    const nodePositions = calculateBifurcatedPositions(
        flowNodes, 
        flowConnections,
        bifurcations, 
        nodeLaneMap
    );
    
    // 3. Criar nós com posições calculadas
    const nodeMap: { [id: string]: SceneNode } = {};
    const createdFrames: SceneNode[] = [];
    const nodeDataMap: { [id: string]: NodeData } = {};
    flowNodes.forEach(node => { nodeDataMap[node.id] = node; });
    
    for (const nodeData of flowNodes) {
        let frame: SceneNode | null = null;
        try {
            frame = await createNodeByType(nodeData, finalColors);
            if (!frame || frame.removed) {
                throw new Error(`Frame nulo/removido para ${nodeData.id}.`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
            const position = nodePositions.get(nodeData.id)!;
            frame.x = position.x;
            frame.y = position.y;
            
            nodeMap[nodeData.id] = frame;
            createdFrames.push(frame);
            
        } catch (nodeCreationError: any) {
            throw new Error(`Falha ao criar nó '${nodeData.name || nodeData.id}': ${nodeCreationError.message}`);
        }
    }
    
    // 4. Adicionar nós à página
    if (createdFrames.length === 0) {
        throw new Error("Falha: Nenhum nó foi criado com sucesso.");
    }
    createdFrames.forEach(f => figma.currentPage.appendChild(f));
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 5. Criar conectores com lógica bifurcada
    if (Object.keys(nodeMap).length > 0 && flowConnections?.length > 0) {
        await createBifurcatedConnectors(flowConnections, bifurcations, nodeMap, nodeDataMap, finalColors);
    }
    
    return { nodeMap, createdFrames };
}

/**
 * Função auxiliar para criar nó por tipo
 */
async function createNodeByType(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<SceneNode> {
    switch (nodeData.type) {
        case "START": return await Frames.createStartNode(nodeData, finalColors);
        case "END": return await Frames.createEndNode(nodeData, finalColors);
        case "STEP": return await Frames.createStepNode(nodeData, finalColors);
        case "ENTRYPOINT": return await Frames.createEntrypointNode(nodeData, finalColors);
        case "DECISION": return await Frames.createDecisionNode(nodeData, finalColors);
        default: return await Frames.createStepNode(nodeData, finalColors);
    }
}

/**
 * Calcula posições bifurcadas para todos os nós
 */
function calculateBifurcatedPositions(
    nodes: FlowNode[],
    connections: Connection[],
    bifurcations: import('@shared/types/flow.types').BifurcationAnalysis[],
    nodeLaneMap: Map<string, number>
): Map<string, import('@shared/types/flow.types').LayoutPosition> {
    const positions = new Map<string, import('@shared/types/flow.types').LayoutPosition>();
    const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;
    const laneHeight = LayoutConfig.VerticalLanes.LANE_HEIGHT;
    
    let currentX = 100;
    const centerY = figma.viewport.center.y;
    
    // Processar nós em ordem topológica
    const sortedNodes = Layout.topologicalSort(nodes, connections);
    
    for (const node of sortedNodes) {
        const laneIndex = nodeLaneMap.get(node.id) || 0;
        const y = centerY + (laneIndex * laneHeight);
        
        // Ajustar X baseado em bifurcações
        const x = calculateXPosition(node, currentX, bifurcations, nodeLaneMap);
        
        positions.set(node.id, { x, y, laneIndex });
        
        // Avançar posição horizontal apenas para nós na lane central
        if (laneIndex === 0) {
            currentX = x + 400 + horizontalSpacing; // 400 = largura típica do nó
        }
    }
    
    // Aplicar gerenciamento vertical para resolver conflitos
    console.log(`[Bifurcated Layout] Aplicando gerenciamento vertical...`);
    
    // Criar mapas de dimensões dos nós (estimativas)
    const nodeWidths = new Map<string, number>();
    const nodeHeights = new Map<string, number>();
    
    nodes.forEach(node => {
        // Estimativas baseadas no tipo de nó
        let width = 400, height = 100; // Valores padrão
        
        switch (node.type) {
            case 'START':
            case 'END':
                width = 120;
                height = 50;
                break;
            case 'DECISION':
                width = 350;
                height = 120;
                break;
            case 'ENTRYPOINT':
                width = 450;
                height = 130;
                break;
            case 'STEP':
                width = 400;
                height = 100;
                break;
        }
        
        nodeWidths.set(node.id, width);
        nodeHeights.set(node.id, height);
    });
    
    // Aplicar gerenciamento vertical
    const managedPositions = Layout.manageVerticalLayout(
        positions,
        bifurcations,
        nodeWidths,
        nodeHeights
    );
    
    console.log(`[Bifurcated Layout] Posições finais calculadas para ${managedPositions.size} nós`);
    return managedPositions;
}

/**
 * Calcula posição X inteligente baseada em bifurcações
 */
function calculateXPosition(
    node: FlowNode,
    baseX: number,
    bifurcations: import('@shared/types/flow.types').BifurcationAnalysis[],
    nodeLaneMap: Map<string, number>
): number {
    const laneIndex = nodeLaneMap.get(node.id) || 0;
    
    // Para nós na lane central, usa posição base
    if (laneIndex === 0) {
        return baseX;
    }
    
    // Para nós em lanes laterais, adiciona offset horizontal
    const horizontalOffset = LayoutConfig.Bifurcation.HORIZONTAL_OFFSET_FOR_BRANCHES;
    
    // Procurar a bifurcação que contém este nó
    for (const bifurcation of bifurcations) {
        const isInUpperBranch = bifurcation.branches.upper.includes(node.id);
        const isInLowerBranch = bifurcation.branches.lower.includes(node.id);
        
        if (isInUpperBranch || isInLowerBranch) {
            return baseX + horizontalOffset;
        }
    }
    
    return baseX;
}

/**
 * Cria conectores considerando bifurcações
 */
async function createBifurcatedConnectors(
    connections: Connection[],
    bifurcations: import('@shared/types/flow.types').BifurcationAnalysis[],
    nodeMap: { [id: string]: SceneNode },
    nodeDataMap: { [id: string]: NodeData },
    finalColors: Record<string, RGB>
): Promise<void> {
    await Connectors.createBifurcatedConnectors(connections, bifurcations, nodeMap, nodeDataMap, finalColors);
}

/**
 * Gera fluxo com layout linear (fallback)
 */
async function generateFlowWithLinearLayout(
    flowNodes: FlowNode[],
    flowConnections: Connection[],
    finalColors: Record<string, RGB>
): Promise<{ nodeMap: { [id: string]: SceneNode }, createdFrames: SceneNode[] }> {
    const nodeMap: { [id: string]: SceneNode } = {};
    const createdFrames: SceneNode[] = [];
    
    let currentX = 100;
    const startY = figma.viewport.center.y;
    const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;
    const nodeDataMap: { [id: string]: NodeData } = {};
    flowNodes.forEach(node => { nodeDataMap[node.id] = node; });

    for (const nodeData of flowNodes) {
        let frame: SceneNode | null = null;
        try {
            frame = await createNodeByType(nodeData, finalColors);
            if (!frame || frame.removed) throw new Error(`Frame nulo/removido para ${nodeData.id}.`);
            
            await new Promise(resolve => setTimeout(resolve, 50));
            frame.x = currentX;
            frame.y = startY - frame.height / 2;
            currentX += frame.width + horizontalSpacing;
            nodeMap[nodeData.id] = frame;
            createdFrames.push(frame);
        } catch (nodeCreationError: any) {
            throw new Error(`Falha ao criar nó '${nodeData.name || nodeData.id}': ${nodeCreationError.message}`);
        }
    }

    if (createdFrames.length === 0) {
        throw new Error("Falha: Nenhum nó foi criado com sucesso.");
    }
    createdFrames.forEach(f => figma.currentPage.appendChild(f));
    await new Promise(resolve => setTimeout(resolve, 100));

    if (Object.keys(nodeMap).length > 0 && flowConnections?.length > 0) {
        await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap, finalColors);
    }

    return { nodeMap, createdFrames };
}

/**
 * Função principal que escolhe o layout apropriado
 */
async function generateFlowWithSmartLayout(
    flowNodes: FlowNode[],
    flowConnections: Connection[],
    finalColors: Record<string, RGB>
): Promise<{ nodeMap: { [id: string]: SceneNode }, createdFrames: SceneNode[] }> {
    
    try {
        // Tentar layout bifurcado se habilitado e aplicável
        if (LayoutConfig.Bifurcation.ENABLED) {
            const bifurcations = Layout.detectBinaryDecisions(flowNodes, flowConnections);
            
            if (bifurcations.length > 0) {
                console.log(`[Smart Layout] Usando layout bifurcado (${bifurcations.length} bifurcações detectadas)`);
                return await generateFlowWithBifurcatedLayout(flowNodes, flowConnections, finalColors);
            }
        }
        
        // Fallback para layout linear original
        console.log(`[Smart Layout] Usando layout linear (fallback)`);
        return await generateFlowWithLinearLayout(flowNodes, flowConnections, finalColors);
        
    } catch (error) {
        console.warn('[Smart Layout] Layout bifurcado falhou, usando linear:', error);
        return await generateFlowWithLinearLayout(flowNodes, flowConnections, finalColors);
    }
}

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

             // 6. Geração com Layout Inteligente (Bifurcado ou Linear)
             console.log(`[Flow ID: ${generationId}] Iniciando geração com layout inteligente...`);
             const layoutResult = await generateFlowWithSmartLayout(flowNodes, flowConnections, finalColors);
             nodeMap = layoutResult.nodeMap;
             createdFrames = layoutResult.createdFrames;
             
             console.log(`[Flow ID: ${generationId}] Layout concluído. Nós criados: ${createdFrames.length}`);

             // 7. Finalização (Agrupar, Centralizar, Zoom)
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
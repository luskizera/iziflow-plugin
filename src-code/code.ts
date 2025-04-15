// src-code/code.ts
/// <reference types="@figma/plugin-typings" /> // Manter a referência

import { listenTS } from "./utils/code-utils"; // Verifique o caminho e se usa a EventTS correta
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';
import { nodeCache } from './utils/nodeCache';
import { parseMarkdownToFlow } from './lib/markdownParser'; // Importar o parser Markdown
// 👇 Tipos compartilhados ainda são necessários para a *saída* do parser
import type { NodeData, FlowData, Connection, FlowNode, Flow } from '@shared/types/flow.types';
// 👇 Tipos de mensagem atualizados (garanta que o caminho está correto)
import type { EventTS } from '@shared/types/messaging.types';
import * as StyleConfig from "./config/styles.config";
import * as LayoutConfig from "./config/layout.config";

// --- Debug Log (com envio para UI) ---
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  console.log(formattedMessage, data || '');
  try { // Tentar enviar para UI, mas não falhar se não der
    figma.ui.postMessage({
      type: 'debug',
      message: formattedMessage,
      data: data ? JSON.stringify(data, null, 2) : ''
    });
  } catch(e) { console.warn("Falha ao enviar log debug para UI", e)}
}

// --- Preload Fonts ---
async function preloadFonts() {
    debugLog('FontLoader', 'Iniciando pré-carregamento de fontes...');
    try {
        const fontsToLoad = StyleConfig.FontsToLoad;
        await Promise.all(
            fontsToLoad.map(font => nodeCache.loadFont(font.family, font.style))
        );
        debugLog('FontLoader', `Fontes pré-carregadas: ${fontsToLoad.length}`);
    } catch (e: any) {
        debugLog('FontLoader', 'Erro ao pré-carregar fontes:', e);
        figma.notify(`Erro ao carregar fontes: ${e?.message || e}`, { error: true });
        throw new Error("Falha no carregamento de fontes essenciais.");
    }
     debugLog('FontLoader', `Fontes pré-carregadas concluído.`); // Log de conclusão
}

// --- UI e Listener principal ---
figma.showUI(__html__, { width: 624, height: 550, themeColors: true, title: 'IziFlow (Markdown)' });

// Tipagem mais específica da mensagem esperada
type PluginMessagePayload = EventTS[keyof EventTS] & { type: keyof EventTS };

figma.ui.onmessage = async (msg: PluginMessagePayload | any) => { // Usar any temporariamente se a tipagem exata for complexa
    // Adicionar checagem inicial para garantir estrutura mínima
    if (!msg || typeof msg.type !== 'string') {
        debugLog('Plugin', 'Mensagem inválida ou sem tipo recebida.', msg);
        return;
    }

    debugLog('Plugin', `Mensagem recebida: ${msg.type}`, msg);

    if (msg.type === 'console') {
        debugLog('UI', msg.message); // Loga mensagens vindas do console.log da UI se necessário
        return;
    }

    if (msg.type === 'generate-flow') {
        // Agora esperamos 'markdown'
        const markdownInput = (msg as EventTS['generate-flow']).markdown;
        let flowDataResult: { nodes: FlowNode[], connections: Connection[] } | null = null;
        let nodeMap: { [id: string]: SceneNode } = {}; // Declarar fora do try para escopo
        const flowName: string = "Fluxo Gerado (Markdown)";
        const generationId = Date.now(); // ID para rastrear esta execução específica
        debugLog('Flow', `[ID: ${generationId}] Iniciando geração via Markdown...`);

        try {
            // 1. Validar Input Markdown
            if (typeof markdownInput !== 'string' || markdownInput.trim() === '') {
                throw new Error("Entrada Markdown inválida ou vazia.");
            }

            // 2. Parsear Markdown
            debugLog('Flow', `[ID: ${generationId}] Chamando parseMarkdownToFlow...`);
            try {
                 flowDataResult = await parseMarkdownToFlow(markdownInput);
                 debugLog('Flow', `[ID: ${generationId}] parseMarkdownToFlow CONCLUÍDO com sucesso.`);
            } catch (parseError: any) {
                 debugLog('Error', `[ID: ${generationId}] ERRO durante parseMarkdownToFlow: ${parseError.message}`, parseError);
                 const lineNumberMatch = parseError.message?.match(/linha (\d+)/);
                 const lineNumber = lineNumberMatch ? parseInt(lineNumberMatch[1], 10) : undefined;
                 figma.ui.postMessage({ type: 'parse-error', message: `Erro ao ler Markdown: ${parseError.message}`, lineNumber });
                 debugLog('Flow', `[ID: ${generationId}] Mensagem 'parse-error' enviada para UI.`);
                 return; // Para a execução aqui
            }

            // 3. Validar Resultado do Parsing
            if (!flowDataResult || flowDataResult.nodes.length === 0) {
                 throw new Error("Nenhum nó válido encontrado após o parsing do Markdown.");
            }
            debugLog('Flow', `[ID: ${generationId}] Parsing OK. Nodes: ${flowDataResult.nodes.length}, Conexões: ${flowDataResult.connections.length}`);
            const { nodes: flowNodes, connections: flowConnections } = flowDataResult;

            // 4. Pré-carregar Fontes
            debugLog('Flow', `[ID: ${generationId}] Chamando preloadFonts...`);
            await preloadFonts(); // Pode lançar erro se falhar
            debugLog('Flow', `[ID: ${generationId}] preloadFonts CONCLUÍDO.`);

            // 5. Construir Grafo e Mapa de Dados
            debugLog('Flow', `[ID: ${generationId}] Construindo grafo e mapa de dados...`);
            const graph = Layout.buildGraph(flowNodes, flowConnections);
            const { adjacencyList, inDegree } = graph;
            const nodeDataMap: { [id: string]: NodeData } = {};
            flowNodes.forEach(node => { nodeDataMap[node.id] = node; });
            debugLog('Flow', `[ID: ${generationId}] Grafo e mapa de dados construídos.`);

            // 6. Calcular Layout (Níveis e Posições)
            debugLog('Flow', `[ID: ${generationId}] Calculando layout...`);
            let startNodeIds = flowNodes.filter(n => n.type === "START").map(n => n.id);
            if (startNodeIds.length === 0) {
              startNodeIds = flowNodes.filter(n => (inDegree[n.id] || 0) === 0).map(n => n.id);
              if (startNodeIds.length === 0 && flowNodes.length > 0) {
                 startNodeIds = [flowNodes[0].id]; // Fallback
                 debugLog('Flow', `[ID: ${generationId}] Warning: Nenhum nó START/inDegree 0. Usando primeiro nó.`);
              } else if (startNodeIds.length === 0) {
                 throw new Error("Nenhum nó encontrado para iniciar o layout.");
              }
            }
            const nodeLevel: { [id: string]: number } = {};
            const queue: string[] = [...startNodeIds];
            startNodeIds.forEach(id => nodeLevel[id] = 0);
            let visitedCount = 0;
            const maxVisits = flowNodes.length * 2;
            while (queue.length > 0 && visitedCount < maxVisits) { /* ... (BFS igual anterior) ... */
               visitedCount++;
               const currentId = queue.shift()!;
               const currentLevel = nodeLevel[currentId];
               (adjacencyList[currentId] || []).forEach((nextId: string) => {
                 if (nodeDataMap[nextId] && nodeLevel[nextId] === undefined) {
                    nodeLevel[nextId] = currentLevel + 1;
                    queue.push(nextId);
                 }
               });
            }
             if (visitedCount >= maxVisits) { console.warn(`[Flow] [ID: ${generationId}] Limite de visitas atingido no cálculo de níveis.`); }
            flowNodes.forEach(node => { if(nodeLevel[node.id] === undefined) nodeLevel[node.id] = 0; });
            const levelToNodes: { [level: number]: string[] } = {};
            Object.keys(nodeLevel).forEach((nodeId: string) => { /* ... (Agrupar por nível igual anterior) ... */
               const lvl = nodeLevel[nodeId];
               if (!levelToNodes[lvl]) levelToNodes[lvl] = [];
               levelToNodes[lvl].push(nodeId);
            });
            const sortedLevels = Object.keys(levelToNodes).map(n => parseInt(n, 10)).sort((a, b) => a - b);
            debugLog('Flow', `[ID: ${generationId}] Layout calculado. Níveis: ${sortedLevels.length}`);

            // 7. Criar e Posicionar Nós Figma (com tratamento de erro refinado)
            debugLog('Flow', `[ID: ${generationId}] Iniciando criação de nós Figma...`);
            nodeMap = {}; // Resetar nodeMap antes de preencher
            const createdFrames: SceneNode[] = [];
            let currentX = 100;
            const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;
            const initialY = figma.viewport.center.y - 200;

            for (const level of sortedLevels) {
                debugLog('Flow', `[ID: ${generationId}] Processando nível ${level}`);
                const nodesAtLevel = levelToNodes[level];
                let currentY = initialY;
                let levelMaxHeight = 0;

                for (const nodeId of nodesAtLevel) {
                    const nodeData = nodeDataMap[nodeId];
                    if (!nodeData) {
                         debugLog('Warn', `[ID: ${generationId}] Dados não encontrados para nodeId ${nodeId} no nível ${level}. Pulando.`);
                         continue;
                    }

                    let frame: FrameNode | null = null;
                    debugLog('Flow', `[ID: ${generationId}] Tentando criar nó ${nodeId} (${nodeData.type})...`);
                    try {
                        switch (nodeData.type) {
                            case "START": frame = await Frames.createStartNode(nodeData); break;
                            case "END": frame = await Frames.createEndNode(nodeData); break;
                            case "STEP": case "ENTRYPOINT": frame = await Frames.createStepNode(nodeData); break;
                            case "DECISION": frame = await Frames.createDecisionNode(nodeData); break;
                            default:
                                console.warn(`[Flow] [ID: ${generationId}] Tipo de nó desconhecido '${nodeData.type}'. Usando StepNode.`);
                                frame = await Frames.createStepNode(nodeData);
                                break;
                        }

                        if (!frame || frame.removed) {
                            throw new Error(`Frame para nó ${nodeId} não foi criado ou foi removido.`);
                        }

                        frame.x = currentX;
                        frame.y = currentY;
                        currentY += frame.height + LayoutConfig.Nodes.VERTICAL_SPACING;
                        levelMaxHeight = Math.max(levelMaxHeight, frame.height);

                        nodeMap[nodeId] = frame; // Adiciona ao mapa SE sucesso
                        createdFrames.push(frame); // Adiciona à lista para append posterior
                        debugLog('Flow', `[ID: ${generationId}] Nó ${nodeId} CRIADO com sucesso. ID Figma: ${frame.id}. Adicionado ao nodeMap.`);

                    } catch (nodeCreationError: any) {
                        const errorMsg = nodeCreationError?.message || nodeCreationError;
                        debugLog('Error', `[ID: ${generationId}] FALHA ao criar/posicionar nó ${nodeId}: ${errorMsg}`, nodeCreationError);
                        figma.notify(`Erro ao criar nó '${nodeData.name || nodeId}': ${errorMsg}`, { error: true });
                        // NÃO adicionar ao nodeMap. Loop continua.
                    }
                } // Fim loop nós no nível

                let levelMaxWidth = 0;
                nodesAtLevel.forEach(nodeId => {
                    if (nodeMap[nodeId]) { levelMaxWidth = Math.max(levelMaxWidth, nodeMap[nodeId].width); }
                });
                currentX += levelMaxWidth + horizontalSpacing;
            } // Fim loop níveis

            createdFrames.forEach(f => figma.currentPage.appendChild(f)); // Adiciona nós válidos à página
            debugLog('Flow', `[ID: ${generationId}] Criação de nós CONCLUÍDA. Total no nodeMap: ${Object.keys(nodeMap).length}`);

            // 8. Criar Conexões Figma
            debugLog('Flow', `[ID: ${generationId}] Checando condição para criar conexões: nodeMap keys=${Object.keys(nodeMap).length}, connections=${flowConnections.length}`);
            if (Object.keys(nodeMap).length > 0 && flowConnections.length > 0) {
                debugLog('Flow', `[ID: ${generationId}] Chamando Connectors.createConnectors...`);
                // Passa o nodeMap que contém APENAS os nós criados com sucesso
                await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap);
                debugLog('Flow', `[ID: ${generationId}] Connectors.createConnectors CONCLUÍDO.`);
            } else {
                debugLog('Flow', `[ID: ${generationId}] Pulando criação de conexões (condição não atendida).`);
            }

            // 9. Finalização
            debugLog('Flow', `[ID: ${generationId}] Finalizando e enviando sucesso...`);
            const allNodes = Object.values(nodeMap); // Nós realmente criados
            if(allNodes.length > 0) {
                figma.viewport.scrollAndZoomIntoView(allNodes);
            }

            figma.ui.postMessage({ type: 'generation-success', message: 'Fluxo gerado com sucesso!' });
            figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
            debugLog('Flow', `[ID: ${generationId}] Geração COMPLETA.`);

        } catch (error: any) { // Erro geral PÓS-parsing
            console.error(`[Flow] [ID: ${generationId}] Erro GERAL na geração (pós-parsing):`, error);
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            debugLog('Error', `[ID: ${generationId}] Falha na geração (pós-parsing): ${errorMessage}`, error?.stack);
            figma.ui.postMessage({ type: 'generation-error', message: `Erro durante geração: ${errorMessage}` });
            debugLog('Flow', `[ID: ${generationId}] Mensagem 'generation-error' enviada para UI.`);
            // A notificação figma.notify já está sendo chamada aqui no log acima
        }
    } else {
        debugLog('Plugin', `Tipo de mensagem não tratado: ${msg.type}`);
    }
};

// Listener para fechar plugin (sem mudanças)
listenTS("closePlugin", () => {
    figma.closePlugin();
});
// src-code/code.ts
/// <reference types="@figma/plugin-typings" />

// Imports de Utilitários e Tipos
// Certifique-se que o caminho para code-utils.ts está correto, ele deve estar dentro de src-code
import { nodeCache } from './utils/nodeCache';
import { parseMarkdownToFlow } from './lib/markdownParser';
import type { NodeData, Connection, FlowNode } from '@shared/types/flow.types';
import type { EventTS } from '@shared/types/messaging.types';
import type { RGB } from './config/theme.config'; // Importa tipo RGB
// Importa a função principal do tema e as fontes a carregar
import { getThemeColors, FontsToLoad } from './config/theme.config';
import * as LayoutConfig from "./config/layout.config";
// Importa os namespaces das bibliotecas de criação/layout
import { Layout } from './lib/layout';
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';

// --- Debug Log (com envio para UI) ---
// Esta função envia logs para o console E para a UI para debug
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  console.log(formattedMessage, data || '');
  try {
    // Envia mensagem encapsulada no formato esperado pela UI
    figma.ui.postMessage({
        pluginMessage: {
            type: 'debug', // Usa 'type' para consistência com EventTS
            message: formattedMessage,
            data: data ? JSON.stringify(data) : undefined // Converte dados para string JSON
        }
    });
  } catch(e) { /* Ignora erro se não conseguir postar mensagem para UI */ }
}

// --- Preload Fonts ---
// Carrega as fontes necessárias antes de criar elementos de texto
async function preloadFonts() {
    debugLog('FontLoader', 'Iniciando pré-carregamento de fontes...');
    try {
        // Itera sobre as fontes definidas em theme.config.ts (ou onde quer que estejam)
        await Promise.all(
            FontsToLoad.map(font => {
                debugLog('FontLoader', `Carregando fonte: ${font.family} - ${font.style}`);
                return nodeCache.enqueueTask(() => figma.loadFontAsync(font)); // Usa cache/fila para carregar
            })
        );
        debugLog('FontLoader', `Fontes pré-carregadas: ${FontsToLoad.length}`);
    } catch (e: any) {
        debugLog('FontLoader', 'Erro ao pré-carregar fontes:', e);
        // Notifica o usuário Figma se houver erro no carregamento das fontes essenciais
        figma.notify(`Erro ao carregar fontes essenciais: ${e?.message || e}`, { error: true });
        // Pode lançar um erro para parar a geração se as fontes forem críticas
        // throw new Error("Falha no carregamento de fontes essenciais.");
    }
     debugLog('FontLoader', `Pré-carregamento de fontes concluído.`);
}


// --- Função auxiliar para calcular níveis de layout ---
// Extraída do código principal para melhor organização
function calculateLayoutLevels(flowNodes: FlowNode[], adjacencyList: Record<string, string[]>, inDegree: Record<string, number>) {
     debugLog('Layout', 'Calculando níveis de layout...');
     let startNodeIds = flowNodes.filter(n => n.type === "START").map(n => n.id);
     // Fallback: se não houver START, procura nós com in-degree 0
     if (startNodeIds.length === 0) {
         startNodeIds = flowNodes.filter(n => (inDegree[n.id] || 0) === 0).map(n => n.id);
         // Fallback final: se ainda não houver, usa o primeiro nó encontrado
         if (startNodeIds.length === 0 && flowNodes.length > 0) {
             startNodeIds = [flowNodes[0].id];
             debugLog('Layout', 'Aviso: Nenhum nó START/inDegree 0. Usando o primeiro nó para iniciar o layout.');
         } else if (startNodeIds.length === 0) {
             // Se não houver nenhum nó, lança erro
             throw new Error("Nenhum nó encontrado para iniciar o layout.");
         }
     }

     const nodeLevel: { [id: string]: number } = {};
     const queue: string[] = [...startNodeIds];
     startNodeIds.forEach(id => nodeLevel[id] = 0); // Nós iniciais estão no nível 0

     let visitedCount = 0;
     const maxVisits = flowNodes.length * 2; // Limite para evitar loops infinitos em grafos cíclicos
     while (queue.length > 0 && visitedCount < maxVisits) {
         visitedCount++;
         const currentId = queue.shift()!;
         const currentLevel = nodeLevel[currentId];
         (adjacencyList[currentId] || []).forEach((nextId: string) => {
             // Avança para o próximo nível apenas se o nó ainda não foi visitado
             if (nodeLevel[nextId] === undefined) {
                nodeLevel[nextId] = currentLevel + 1;
                queue.push(nextId);
             }
             // Poderia adicionar lógica aqui para lidar com ciclos, se necessário (ex: não processar arestas de volta)
         });
     }
     if (visitedCount >= maxVisits) {
        console.warn(`[Layout] Limite de visitas (${maxVisits}) atingido no cálculo de níveis. O fluxo pode conter ciclos ou ser muito complexo.`);
        figma.notify("Aviso: Fluxo complexo, o layout pode não ser ideal.", { timeout: 5000, error: false });
     }

     // Garante que nós que não foram alcançados pela BFS (ex: ilhas) ainda recebam um nível (0)
     flowNodes.forEach(node => { if(nodeLevel[node.id] === undefined) nodeLevel[node.id] = 0; });

     // Agrupa nós por nível
     const levelToNodes: { [level: number]: string[] } = {};
     Object.keys(nodeLevel).forEach((nodeId: string) => {
         const lvl = nodeLevel[nodeId];
         if (!levelToNodes[lvl]) levelToNodes[lvl] = [];
         levelToNodes[lvl].push(nodeId);
     });

     // Ordena os níveis
     const sortedLevels = Object.keys(levelToNodes).map(n => parseInt(n, 10)).sort((a, b) => a - b);
     debugLog('Layout', `Layout calculado. Níveis encontrados: ${sortedLevels.length}`);

     return { sortedLevels, levelToNodes };
}


// --- UI e Listener principal ---
// Define o tamanho inicial da janela do plugin
figma.showUI(__html__, { width: 624, height: 500, themeColors: true, title: 'IziFlow Plugin' });

// Tipagem para mensagens recebidas - Corrigida para refletir a estrutura real do log
// A mensagem recebida é o payload direto, não envolto em 'pluginMessage'
type ReceivedMessagePayload = { type: keyof EventTS } & any;

// Handler principal para todas as mensagens recebidas da UI
// O parâmetro 'msg' É o payload direto, como visto nos logs.
figma.ui.onmessage = async (msg: ReceivedMessagePayload | any) => {

    // --- CORREÇÃO DA CHECAGEM INICIAL ---
    // Verifica se 'msg' existe, é um objeto e tem a propriedade 'type' como string.
    // Esta checagem agora está correta para o formato de mensagem que está chegando.
    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') {
        debugLog('Plugin', 'Mensagem inválida ou sem tipo recebida.', msg);
        return; // Ignora a mensagem inválida
    }
    // --- FIM DA CORREÇÃO ---

    // 'msg' é o próprio payload da mensagem
    const messageType = msg.type as keyof EventTS;
    const payload = msg; // payload é o próprio msg

    debugLog('Plugin', `Mensagem recebida e válida: ${messageType}`, payload);

    // Handler para a mensagem 'generate-flow' (principal funcionalidade)
    if (messageType === 'generate-flow') {
        // Extrai dados diretamente do payload
        // Note que accentColor AGORA É USADO na chamada getThemeColors
        const { markdown: markdownInput, mode, accentColor } = payload as EventTS['generate-flow'];

        let flowDataResult: { nodes: FlowNode[], connections: Connection[] } | null = null;
        let nodeMap: { [id: string]: SceneNode } = {}; // Mapa para armazenar os nós Figma criados
        const generationId = Date.now(); // ID único para rastrear esta geração específica
        debugLog('Flow', `[ID: ${generationId}] Iniciando geração via Markdown (Modo: ${mode}, Accent: ${accentColor})...`);


        try {
            // --- 1. Calcular Cores do Tema ---
            // Chama a função getThemeColors com o modo e a cor de destaque da UI
            const finalColors = getThemeColors(mode, accentColor);
            debugLog('Flow', `[ID: ${generationId}] Cores calculadas para modo ${mode}.`);

            // --- 2. Validar Input Markdown ---
            if (typeof markdownInput !== 'string' || markdownInput.trim() === '') {
                throw new Error("Entrada Markdown inválida ou vazia.");
            }

            // --- 3. Parsear Markdown ---
            debugLog('Flow', `[ID: ${generationId}] Chamando parseMarkdownToFlow...`);
            try {
                 // Chama o parser para converter Markdown em estrutura de dados Flow
                 flowDataResult = await parseMarkdownToFlow(markdownInput);
                 debugLog('Flow', `[ID: ${generationId}] parseMarkdownToFlow CONCLUÍDO.`);
            } catch (parseError: any) {
                 // Se houver erro no parsing, loga e envia mensagem de erro para UI
                 debugLog('Error', `[ID: ${generationId}] ERRO durante parseMarkdownToFlow: ${parseError.message}`, parseError);
                 const lineNumberMatch = parseError.message?.match(/linha (\d+)/);
                 const lineNumber = lineNumberMatch ? parseInt(lineNumberMatch[1], 10) : undefined;
                 // <<< Envia a mensagem de erro corretamente (sem wrapper pluginMessage) >>>
                 figma.ui.postMessage({ type: 'parse-error', message: `Erro ao ler Markdown: ${parseError.message}`, lineNumber });
                 debugLog('Flow', `[ID: ${generationId}] Mensagem 'parse-error' enviada para UI.`);
                 return; // Para a execução se o parsing falhou
            }

            // --- 4. Validar Resultado do Parsing ---
             // Verifica se o resultado do parsing contém nós válidos
             if (!flowDataResult || !flowDataResult.nodes || flowDataResult.nodes.length === 0) {
                 throw new Error("Nenhum nó válido encontrado após o parsing do Markdown.");
             }
             const { nodes: flowNodes, connections: flowConnections } = flowDataResult;
             debugLog('Flow', `[ID: ${generationId}] Parsing OK. Nodes: ${flowNodes.length}, Conexões: ${flowConnections.length}`);

             // --- 5. Pré-carregar Fontes ---
             debugLog('Flow', `[ID: ${generationId}] Chamando preloadFonts...`);
             await preloadFonts(); // Certifica que as fontes estão carregadas
             debugLog('Flow', `[ID: ${generationId}] preloadFonts CONCLUÍDO.`);

             // --- 6. Construir Grafo e Mapa de Dados ---
             debugLog('Flow', `[ID: ${generationId}] Construindo grafo e mapa de dados...`);
             // Constrói a lista de adjacência e graus de entrada para cálculo de layout
             const graph = Layout.buildGraph(flowNodes, flowConnections);
             const { adjacencyList, inDegree } = graph;
             const nodeDataMap: { [id: string]: NodeData } = {};
             flowNodes.forEach(node => { nodeDataMap[node.id] = node; }); // Mapa de ID do nó para seus dados
             debugLog('Flow', `[ID: ${generationId}] Grafo e mapa de dados construídos.`);

             // --- 7. Calcular Layout (Níveis e Posições) ---
             debugLog('Flow', `[ID: ${generationId}] Calculando layout...`);
             // Calcula os níveis dos nós e os agrupa por nível
             const { sortedLevels, levelToNodes } = calculateLayoutLevels(flowNodes, adjacencyList, inDegree); // Usa a função auxiliar
             debugLog('Flow', `[ID: ${generationId}] Layout calculado. Níveis: ${sortedLevels.length}`);

             // --- 8. Criar e Posicionar Nós Figma ---
             debugLog('Flow', `[ID: ${generationId}] Iniciando criação de nós Figma...`);
             nodeMap = {}; // Reinicia o mapa de nós Figma criados
             const createdFrames: SceneNode[] = []; // Lista dos nós Figma criados com sucesso
             let currentX = 100; // Posição X inicial
             const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;
             const verticalSpacing = LayoutConfig.Nodes.VERTICAL_SPACING;
             // Calcula uma posição Y inicial para tentar centralizar o fluxo no viewport
             let totalEstimatedHeight = 0;
             sortedLevels.forEach(level => {
                const nodesAtLevel = levelToNodes[level];
                let maxNodeHeightInLevel = 0; // Precisaria estimar ou calcular a altura máxima
                // Estimar a altura máxima de forma grosseira ou iterar sobre nodesAtLevel para estimar
                nodesAtLevel.forEach(nodeId => {
                    const nodeData = nodeDataMap[nodeId];
                    // Estimativa simplificada
                    const estimatedHeight = (nodeData?.type === 'STEP' || nodeData?.type === 'ENTRYPOINT' ? 250 : 150);
                    maxNodeHeightInLevel = Math.max(maxNodeHeightInLevel, estimatedHeight);
                });
                totalEstimatedHeight += maxNodeHeightInLevel;
                if (level < sortedLevels.length - 1) totalEstimatedHeight += verticalSpacing;
             });
             const initialY = figma.viewport.center.y - (totalEstimatedHeight / 2);


             for (const level of sortedLevels) {
                 debugLog('Flow', `[ID: ${generationId}] Processando nível ${level}`);
                 const nodesAtLevel = levelToNodes[level];
                 let currentY = initialY; // Começa do Y calculado para este nível
                 let levelMaxHeight = 0; // Rastreia a altura máxima dos nós criados neste nível
                 let nodesInLevelCount = 0; // Conta quantos nós foram criados com sucesso neste nível

                 // Opcional: Recalcular Y inicial para este nível específico para melhor centralização vertical dentro dele
                 let estimatedLevelHeight = 0;
                 nodesAtLevel.forEach(nodeId => {
                    const nodeData = nodeDataMap[nodeId];
                    if (nodeData) { estimatedLevelHeight += (nodeData.type === 'STEP' || nodeData.type === 'ENTRYPOINT' ? 250 : 150); } // Estimativa
                 });
                 estimatedLevelHeight += Math.max(0, nodesAtLevel.length - 1) * verticalSpacing;
                 // currentY = figma.viewport.center.y - (estimatedLevelHeight / 2); // Pode centralizar cada nível, mas pode bagunçar a relação entre eles

                 for (const nodeId of nodesAtLevel) {
                     const nodeData = nodeDataMap[nodeId];
                     if (!nodeData) { continue; } // Pula se não houver dados (não deveria acontecer após parsing válido)

                     let frame: FrameNode | null = null;
                     debugLog('Flow', `[ID: ${generationId}] Tentando criar nó ${nodeId} (${nodeData.type})...`);
                     try {
                         // Chama as funções de criação de Frames, passando os dados do nó E as cores finais
                         switch (nodeData.type) {
                            case "START": frame = await Frames.createStartNode(nodeData, finalColors); break;
                            case "END": frame = await Frames.createEndNode(nodeData, finalColors); break;
                            case "STEP": frame = await Frames.createStepNode(nodeData, finalColors); break;
                            case "ENTRYPOINT": frame = await Frames.createEntrypointNode(nodeData, finalColors); break;
                            case "DECISION": frame = await Frames.createDecisionNode(nodeData, finalColors); break;
                            default:
                                // Fallback para tipo desconhecido (usa StepNode)
                                console.warn(`[Flow] [ID: ${generationId}] Tipo de nó desconhecido '${nodeData.type}'. Usando StepNode.`);
                                frame = await Frames.createStepNode(nodeData, finalColors);
                                break;
                         }

                         // Verifica se o frame foi criado com sucesso e não foi removido
                         if (!frame || frame.removed) { throw new Error(`Frame para nó ${nodeId} não foi criado ou foi removido.`); }

                         // Define a posição do frame
                         frame.x = currentX;
                         frame.y = currentY;
                         // Uma pequena pausa pode ajudar o Auto Layout a calcular a altura final
                         await new Promise(resolve => setTimeout(resolve, 0));
                         // Atualiza a posição Y para o próximo nó no mesmo nível
                         currentY += frame.height + verticalSpacing;
                         // Rastreia a altura máxima no nível para calcular o avanço X
                         levelMaxHeight = Math.max(levelMaxHeight, frame.height);

                         nodeMap[nodeId] = frame; // Adiciona o nó Figma criado ao mapa
                         createdFrames.push(frame); // Adiciona à lista para adicionar à página
                         nodesInLevelCount++; // Incrementa contador de nós criados neste nível
                         debugLog('Flow', `[ID: ${generationId}] Nó ${nodeId} CRIADO. ID Figma: ${frame.id}. Pos: (${frame.x.toFixed(0)}, ${frame.y.toFixed(0)}), Size: (${frame.width.toFixed(0)}, ${frame.height.toFixed(0)})`);

                     } catch (nodeCreationError: any) {
                         // Loga e notifica se falhar a criação/posicionamento de um nó específico
                         const errorMsg = nodeCreationError?.message || nodeCreationError;
                         debugLog('Error', `[ID: ${generationId}] FALHA ao criar/posicionar nó ${nodeId}: ${errorMsg}`, nodeCreationError?.stack);
                         figma.notify(`Erro ao criar nó '${nodeData.name || nodeId}': ${errorMsg}`, { error: true });
                         // Continua processando os outros nós mesmo se um falhar
                     }
                 } // Fim do loop pelos nós no nível atual

                 // Calcula a largura máxima dos nós CRIADOS com sucesso neste nível
                 let levelMaxWidth = 0;
                 nodesAtLevel.forEach(nodeId => {
                     // Acessa pelo nodeMap para garantir que o nó foi criado
                     if (nodeMap[nodeId]) { levelMaxWidth = Math.max(levelMaxWidth, nodeMap[nodeId].width); }
                 });

                 // Avança a posição X para o próximo nível apenas se algum nó foi criado neste nível
                 if (nodesInLevelCount > 0) {
                    currentX += levelMaxWidth + horizontalSpacing;
                 } else {
                     debugLog('Flow', `[ID: ${generationId}] Nenhum nó válido criado no nível ${level}. Não avançando X.`);
                 }

             } // Fim do loop pelos níveis de layout

             // Adiciona todos os nós criados com sucesso à página atual do Figma
             if (createdFrames.length > 0) {
                 // Adicionar à página de forma mais eficiente
                 createdFrames.forEach(f => figma.currentPage.appendChild(f));
                 // Pequena pausa para dar tempo ao Figma de renderizar antes de agrupar/zoom
                 await new Promise(resolve => setTimeout(resolve, 50));
                 debugLog('Flow', `[ID: ${generationId}] Nós adicionados à página: ${createdFrames.length}`);
             } else {
                  // Se nenhum nó foi criado, lança um erro geral de falha
                  debugLog('Flow', `[ID: ${generationId}] Nenhum nó foi criado com sucesso.`);
                  throw new Error("Falha ao criar os nós do fluxo.");
             }


             // --- 9. Criar Conexões Figma ---
             debugLog('Flow', `[ID: ${generationId}] Verificando condições para criar conexões...`);
             // Cria as conexões SOMENTE se houver nós criados e conexões definidas no parsing
             if (Object.keys(nodeMap).length > 0 && flowConnections && flowConnections.length > 0) {
                 debugLog('Flow', `[ID: ${generationId}] Chamando Connectors.createConnectors...`);
                 // Chama a função de criação de conectores, passando as conexões, o mapa de nós criados E as cores finais
                 await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap, finalColors);
                 debugLog('Flow', `[ID: ${generationId}] Connectors.createConnectors CONCLUÍDO.`);
             } else {
                 debugLog('Flow', `[ID: ${generationId}] Pulando criação de conexões (Map: ${Object.keys(nodeMap).length}, Conns: ${flowConnections?.length || 0}).`);
             }

             // --- 10. Finalização ---
             debugLog('Flow', `[ID: ${generationId}] Finalizando e enviando sucesso...`);
             const allNodes = Object.values(nodeMap); // Pega todos os nós que foram realmente criados
             if(allNodes.length > 0) {
                 // Agrupa os nós criados para manter o fluxo organizado
                 const group = figma.group(allNodes, figma.currentPage);
                 group.name = "Fluxo Gerado IziFlow"; // Define um nome para o grupo
                 // Pequena pausa antes de focar a visualização
                 await new Promise(resolve => setTimeout(resolve, 100));
                 // Ajusta o viewport do Figma para mostrar todos os nós criados
                 figma.viewport.scrollAndZoomIntoView(allNodes);
             }

             // Envia mensagem de sucesso para a UI (sem wrapper pluginMessage, conforme observado no log)
             figma.ui.postMessage({ type: 'generation-success', message: 'Fluxo gerado com sucesso!' });
             // Notifica o usuário no Figma
             figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
             debugLog('Flow', `[ID: ${generationId}] Geração COMPLETA.`);

         } catch (error: any) { // Captura quaisquer erros que ocorram durante a geração (pós-parsing)
             console.error(`[Flow] [ID: ${generationId}] Erro GERAL na geração (pós-parsing):`, error);
             const errorMessage = (error instanceof Error) ? error.message : String(error);
             debugLog('Error', `[ID: ${generationId}] Falha na geração (pós-parsing): ${errorMessage}`, error?.stack);
             // Envia mensagem de erro geral para a UI (sem wrapper pluginMessage)
             figma.ui.postMessage({ type: 'generation-error', message: `Erro durante geração: ${errorMessage}` });
             debugLog('Flow', `[ID: ${generationId}] Mensagem 'generation-error' enviada para UI.`);
             // Notifica o usuário no Figma
             figma.notify(`Erro na geração: ${errorMessage}`, { error: true, timeout: 5000 });
         }
     } else if (messageType === 'closePlugin') {
         // Handler para fechar o plugin, se a UI enviar essa mensagem
         figma.closePlugin();
     }
      else {
         // Loga mensagens de tipos desconhecidos
         debugLog('Plugin', `Tipo de mensagem não tratado: ${messageType}`);
     }
 };

// Função auxiliar calculateLayoutLevels definida fora do onmessage
// (Movida para fora para melhor organização)
// Já definida acima no código.

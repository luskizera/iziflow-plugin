// src-code/utils/historyStorage.ts
/// <reference types="@figma/plugin-typings" />

const HISTORY_STORAGE_KEY = 'markdownHistory';
const MAX_HISTORY_ITEMS = 20;

/**
 * Lê o histórico do clientStorage com logs detalhados.
 */
export async function getHistory(): Promise<string[]> {
    // console.log('[HistoryStorage] Iniciando getHistory...'); // Log início da função
    try {
        const historyJson = await figma.clientStorage.getAsync(HISTORY_STORAGE_KEY);
        // console.log('[HistoryStorage] Raw data lido do storage:', historyJson); // Log do dado bruto

        if (typeof historyJson === 'string' && historyJson.length > 0) {
             try {
                 const parsed = JSON.parse(historyJson);
                 // console.log('[HistoryStorage] JSON parseado com sucesso:', parsed); // Log do dado parseado

                 if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                     // console.log('[HistoryStorage] Dado parseado é um array de strings válido.');
                     return parsed;
                 } else {
                      // console.warn("[HistoryStorage] Dado parseado NÃO é um array de strings. Retornando vazio. Dado:", parsed);
                      // await clearHistory(); // Opcional: Limpar storage inválido
                      return [];
                 }
             } catch (parseError) {
                 // console.error("[HistoryStorage] Erro ao fazer parse do JSON do histórico:", parseError, "JSON Bruto:", historyJson);
                 // await clearHistory(); // Opcional: Limpar storage inválido
                 return [];
             }
        } else {
             // console.log("[HistoryStorage] Nenhum dado encontrado ou dado não é string. Retornando vazio.");
             return [];
        }
    } catch (error) {
        // console.error("[HistoryStorage] Erro GERAL ao ler histórico do clientStorage:", error);
        return [];
    }
}

/**
 * Adiciona uma nova entrada de markdown ao histórico com logs.
 */
export async function addHistoryEntry(markdownToAdd: string): Promise<void> {
    // console.log('[HistoryStorage] Iniciando addHistoryEntry...');
    if (typeof markdownToAdd !== 'string' || !markdownToAdd.trim()) {
        // console.warn("[HistoryStorage] Tentativa de adicionar entrada vazia/inválida.");
        return;
    }
    // console.log('[HistoryStorage] Tentando adicionar:', markdownToAdd.substring(0, 50) + "..."); // Log do que será adicionado

    try {
        let history = await getHistory(); // Chama a versão com logs
        // console.log('[HistoryStorage] Histórico lido antes de adicionar:', history);

        history = history.filter(entry => entry !== markdownToAdd); // Remove duplicatas
        history.unshift(markdownToAdd); // Adiciona no início

        if (history.length > MAX_HISTORY_ITEMS) {
            console.log(`[HistoryStorage] Histórico excedeu ${MAX_HISTORY_ITEMS} itens. Limitando...`);
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        await figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, JSON.stringify(history));
        // console.log("[HistoryStorage] Histórico salvo com sucesso. Novo tamanho:", history.length);

    } catch (error) {
        // console.error("[HistoryStorage] Erro ao adicionar entrada no histórico:", error);
    }
}

/**
 * Remove todo o histórico do clientStorage com logs.
 */
export async function clearHistory(): Promise<void> {
     // console.log('[HistoryStorage] Iniciando clearHistory...');
     try {
        await figma.clientStorage.deleteAsync(HISTORY_STORAGE_KEY);
        // console.log("[HistoryStorage] Histórico limpo com sucesso via deleteAsync.");
     } catch (error) {
          // console.error("[HistoryStorage] Erro ao limpar histórico:", error);
     }
}
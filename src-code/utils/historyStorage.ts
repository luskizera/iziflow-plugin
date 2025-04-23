// src-code/utils/historyStorage.ts
/// <reference types="@figma/plugin-typings" />

const HISTORY_STORAGE_KEY = 'markdownHistory';
const MAX_HISTORY_ITEMS = 20; // Defina quantos itens guardar

/**
 * Lê o histórico do clientStorage.
 * Retorna um array de strings (histórico) ou um array vazio em caso de erro ou se não houver histórico.
 */
export async function getHistory(): Promise<string[]> {
    try {
        const historyJson = await figma.clientStorage.getAsync(HISTORY_STORAGE_KEY);
        // Verifica se historyJson é uma string válida antes de fazer o parse
        if (typeof historyJson === 'string' && historyJson.length > 0) {
            // Tenta fazer o parse, retorna array vazio se falhar
             try {
                 const parsed = JSON.parse(historyJson);
                 // Garante que é um array de strings
                 if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                     return parsed;
                 } else {
                      console.warn("[History] Dado armazenado não é um array de strings. Retornando vazio.");
                      // Opcional: Limpar o storage inválido
                      // await clearHistory();
                      return [];
                 }
             } catch (parseError) {
                 console.error("[History] Erro ao fazer parse do JSON do histórico:", parseError);
                 // Opcional: Limpar o storage inválido
                 // await clearHistory();
                 return [];
             }
        }
        return []; // Retorna vazio se não houver nada ou não for string
    } catch (error) {
        console.error("[History] Erro ao ler histórico do clientStorage:", error);
        return [];
    }
}

/**
 * Adiciona uma nova entrada de markdown ao início do histórico,
 * evitando duplicatas e limitando o tamanho máximo.
 * @param markdownToAdd A string markdown a ser adicionada.
 */
export async function addHistoryEntry(markdownToAdd: string): Promise<void> {
    // Validação básica da entrada
    if (typeof markdownToAdd !== 'string' || !markdownToAdd.trim()) {
        console.warn("[History] Tentativa de adicionar entrada vazia ou inválida ao histórico.");
        return;
    }

    try {
        let history = await getHistory(); // Já retorna array vazio em caso de erro

        // Remove a entrada exata se já existir para movê-la para o topo
        history = history.filter(entry => entry !== markdownToAdd);

        // Adiciona a nova entrada no início
        history.unshift(markdownToAdd);

        // Limita o tamanho do histórico
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        // Salva o histórico atualizado de volta no storage
        await figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, JSON.stringify(history));
        console.log("[History] Entrada adicionada/movida para o topo. Tamanho atual:", history.length);

    } catch (error) {
        console.error("[History] Erro ao adicionar entrada no histórico:", error);
        // Considerar notificar o usuário sobre a falha em salvar no histórico?
        // figma.notify("Erro ao salvar no histórico.", { error: true, timeout: 2000 });
    }
}

/**
 * Remove todo o histórico do clientStorage.
 */
export async function clearHistory(): Promise<void> {
     try {
        await figma.clientStorage.deleteAsync(HISTORY_STORAGE_KEY);
        console.log("[History] Histórico limpo com sucesso.");
     } catch (error) {
          console.error("[History] Erro ao limpar histórico:", error);
          // Notificar o usuário sobre a falha?
          // figma.notify("Erro ao limpar histórico.", { error: true, timeout: 2000 });
     }
}
// src-code/utils/historyStorage.ts
/// <reference types="@figma/plugin-typings" />

import type { HistoryEntry } from '@shared/types/flow.types';

const HISTORY_STORAGE_KEY = 'iziflow_history_v2'; // Nova chave para evitar conflitos
const MAX_HISTORY_ITEMS = 50;

// --- Funções Auxiliares ---

/**
 * Resolve o nome do fluxo usando o valor informado pelo parser ou heurísticas legadas.
 */
function resolveFlowName(flowInput: string, parsedName?: string): string {
    const sanitizedParsed = parsedName?.trim();
    if (sanitizedParsed) {
        return sanitizedParsed;
    }

    if (!flowInput) return "Untitled Flow";

    const lines = flowInput.split('\n');
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('# Flow Name:')) {
            return trimmedLine.substring('# Flow Name:'.length).trim() || "Untitled Flow";
        }
    }

    return "Untitled Flow";
}

/**
 * Valida se um objeto se parece com uma HistoryEntry.
 * @param obj O objeto a ser validado.
 * @returns True se o objeto for válido, false caso contrário.
 */
function isValidHistoryEntry(obj: any): obj is HistoryEntry {
    return obj &&
           typeof obj.id === 'string' &&
           typeof obj.name === 'string' &&
           typeof obj.markdown === 'string' &&
           typeof obj.createdAt === 'string';
}


// --- Funções Principais de Armazenamento ---

/**
 * Lê o histórico do clientStorage e garante que os dados sejam válidos.
 * @returns Uma Promise que resolve para um array de HistoryEntry.
 */
export async function getHistory(): Promise<HistoryEntry[]> {
    console.log('[HistoryStorage] Iniciando getHistory...');
    try {
        const historyJson = await figma.clientStorage.getAsync(HISTORY_STORAGE_KEY);
        console.log('[HistoryStorage] Raw data lido do storage:', historyJson);
        if (!historyJson) {
            console.log('[HistoryStorage] Nenhum histórico encontrado.');
            return [];
        }

        const parsed = JSON.parse(historyJson);
        if (Array.isArray(parsed) && parsed.every(isValidHistoryEntry)) {
            console.log(`[HistoryStorage] Histórico válido encontrado com ${parsed.length} itens.`);
            return parsed;
        } else {
            console.warn('[HistoryStorage] Dados de histórico corrompidos encontrados. Limpando.');
            await clearHistory();
            return [];
        }
    } catch (error) {
        console.error("[HistoryStorage] Erro ao ler ou parsear o histórico:", error);
        return [];
    }
}

/**
 * Adiciona uma nova entrada de markdown ao histórico.
 * @param markdownToAdd O conteúdo markdown do fluxo a ser adicionado.
 */
export async function addHistoryEntry(markdownToAdd: string, parsedName?: string): Promise<void> {
    console.log('[HistoryStorage] Iniciando addHistoryEntry...');
    if (typeof markdownToAdd !== 'string' || !markdownToAdd.trim()) {
        console.warn("[HistoryStorage] Tentativa de adicionar entrada de histórico vazia/inválida.");
        return;
    }

    try {
        let history = await getHistory();
        console.log(`[HistoryStorage] Histórico atual possui ${history.length} itens.`);

        // Criar a nova entrada
        const newEntry: HistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: resolveFlowName(markdownToAdd, parsedName),
            markdown: markdownToAdd,
            createdAt: new Date().toISOString()
        };
        console.log('[HistoryStorage] Nova entrada criada:', newEntry);

        // Adiciona a nova entrada no início
        history.unshift(newEntry);

        // Limita o tamanho do histórico
        if (history.length > MAX_HISTORY_ITEMS) {
            console.log(`[HistoryStorage] Histórico excedeu ${MAX_HISTORY_ITEMS} itens. Limitando...`);
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        await figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, JSON.stringify(history));
        console.log(`[HistoryStorage] Histórico salvo com sucesso. Novo tamanho: ${history.length}`);
    } catch (error) {
        console.error("[HistoryStorage] Erro ao adicionar entrada no histórico:", error);
    }
}

/**
 * Remove uma entrada do histórico pelo seu ID.
 * @param idToRemove O ID da entrada a ser removida.
 */
export async function removeHistoryEntry(idToRemove: string): Promise<void> {
    console.log(`[HistoryStorage] Iniciando removeHistoryEntry para o ID: ${idToRemove}`);
    try {
        let history = await getHistory();
        const newHistory = history.filter(entry => entry.id !== idToRemove);

        if (newHistory.length < history.length) {
            await figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
            console.log(`[HistoryStorage] Entrada com ID ${idToRemove} removida. Novo tamanho: ${newHistory.length}`);
        } else {
            console.warn(`[HistoryStorage] Nenhuma entrada encontrada com o ID ${idToRemove} para remover.`);
        }
    } catch (error) {
        console.error(`[HistoryStorage] Erro ao remover entrada com ID ${idToRemove}:`, error);
    }
}

/**
 * Remove todo o histórico do clientStorage.
 */
export async function clearHistory(): Promise<void> {
     console.log('[HistoryStorage] Iniciando clearHistory...');
     try {
        await figma.clientStorage.deleteAsync(HISTORY_STORAGE_KEY);
        console.log("[HistoryStorage] Histórico limpo com sucesso.");
     } catch (error) {
          console.error("[HistoryStorage] Erro ao limpar histórico:", error);
     }
}

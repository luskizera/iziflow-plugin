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
           typeof obj.yaml === 'string' &&
           typeof obj.createdAt === 'string';
}


// --- Funções Principais de Armazenamento ---

/**
 * Lê o histórico do clientStorage e garante que os dados sejam válidos.
 * @returns Uma Promise que resolve para um array de HistoryEntry.
 */
export async function getHistory(): Promise<HistoryEntry[]> {
    try {
        const historyJson = await figma.clientStorage.getAsync(HISTORY_STORAGE_KEY);
        if (!historyJson) {
            return [];
        }

        const parsed = JSON.parse(historyJson);
        if (Array.isArray(parsed) && parsed.every(isValidHistoryEntry)) {
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
 * Adiciona uma nova entrada de yaml ao histórico.
 * @param yamlToAdd O conteúdo yaml do fluxo a ser adicionado.
 */
export async function addHistoryEntry(yamlToAdd: string, parsedName?: string): Promise<void> {
    if (typeof yamlToAdd !== 'string' || !yamlToAdd.trim()) {
        console.warn("[HistoryStorage] Tentativa de adicionar entrada de histórico vazia/inválida.");
        return;
    }

    try {
        let history = await getHistory();

        // Criar a nova entrada
        const newEntry: HistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: resolveFlowName(yamlToAdd, parsedName),
            yaml: yamlToAdd,
            createdAt: new Date().toISOString()
        };

        // Adiciona a nova entrada no início
        history.unshift(newEntry);

        // Limita o tamanho do histórico
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        await figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.error("[HistoryStorage] Erro ao adicionar entrada no histórico:", error);
    }
}

/**
 * Remove uma entrada do histórico pelo seu ID.
 * @param idToRemove O ID da entrada a ser removida.
 */
export async function removeHistoryEntry(idToRemove: string): Promise<void> {
    try {
        let history = await getHistory();
        const newHistory = history.filter(entry => entry.id !== idToRemove);

        if (newHistory.length < history.length) {
            await figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
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
     try {
        await figma.clientStorage.deleteAsync(HISTORY_STORAGE_KEY);
     } catch (error) {
          console.error("[HistoryStorage] Erro ao limpar histórico:", error);
     }
}

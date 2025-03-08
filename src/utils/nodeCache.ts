import { NodeData } from "../core/parser";

/**
 * Classe singleton para gerenciar cache de recursos do plugin
 */
class NodeCache {
    private static instance: NodeCache;
    private loadedFonts: Set<string>;
    private processingQueue: Promise<void>;

    private constructor() {
        this.loadedFonts = new Set();
        this.processingQueue = Promise.resolve();
    }

    public static getInstance(): NodeCache {
        if (!NodeCache.instance) {
            NodeCache.instance = new NodeCache();
        }
        return NodeCache.instance;
    }

    /**
     * Carrega uma fonte de forma otimizada, usando cache
     */
    public async loadFont(family: string, style: string): Promise<void> {
        const fontKey = `${family}-${style}`;
        if (!this.loadedFonts.has(fontKey)) {
            await figma.loadFontAsync({ family, style });
            this.loadedFonts.add(fontKey);
        }
    }

    /**
     * Adiciona uma tarefa à fila de processamento
     */
    public async enqueueTask<T>(task: () => Promise<T>): Promise<T> {
        const result = this.processingQueue.then(() => task());
        this.processingQueue = result.then(() => {});
        return result;
    }

    /**
     * Limpa o cache de fontes
     */
    public clearFontCache(): void {
        this.loadedFonts.clear();
    }
}

export const nodeCache = NodeCache.getInstance(); 
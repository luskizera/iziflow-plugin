/**
 * Cache otimizado para recursos do IziFlow
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

    public async loadFont(family: string, style: string): Promise<void> {
        const fontKey = `${family}-${style}`;
        if (!this.loadedFonts.has(fontKey)) {
            await figma.loadFontAsync({ family, style });
            this.loadedFonts.add(fontKey);
        }
    }

    public async enqueueTask<T>(task: () => Promise<T>): Promise<T> {
        const result = this.processingQueue.then(() => task());
        this.processingQueue = result.then(() => {});
        return result;
    }

    public clearFontCache(): void {
        this.loadedFonts.clear();
    }
}

export const nodeCache = NodeCache.getInstance();
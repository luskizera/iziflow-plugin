/**
 * Cache otimizado para recursos do IziFlow
 */
class NodeCache {
    private static instance: NodeCache;
    private taskQueue: Array<() => Promise<any>>;
    private isProcessing: boolean;

    private constructor() {
        this.taskQueue = [];
        this.isProcessing = false;
    }

    static getInstance() {
        if (!NodeCache.instance) {
            NodeCache.instance = new NodeCache();
        }
        return NodeCache.instance;
    }

    async loadFont(family: string, style: string) {
        return figma.loadFontAsync({ family, style });
    }

    async enqueueTask<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.taskQueue.push(async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    console.error("Erro na execução da task:", error);
                    reject(error);
                }
            });

            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    private async processQueue() {
        if (this.isProcessing || this.taskQueue.length === 0) return;

        this.isProcessing = true;

        try {
            while (this.taskQueue.length > 0) {
                const task = this.taskQueue.shift();
                if (task) {
                    await task();
                }
            }
        } catch (error) {
            console.error("Erro no processamento da fila:", error);
        } finally {
            this.isProcessing = false;
        }
    }
}

export const nodeCache = NodeCache.getInstance();
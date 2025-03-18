
/**
 * Gerenciador de layout otimizado para o plugin IziFlow
 */
class LayoutManager {
    private static instance: LayoutManager;
    private layoutQueue: Array<() => Promise<void>>;
    private isProcessing: boolean;

    private constructor() {
        this.layoutQueue = [];
        this.isProcessing = false;
    }

    public static getInstance(): LayoutManager {
        if (!LayoutManager.instance) {
            LayoutManager.instance = new LayoutManager();
        }
        return LayoutManager.instance;
    }

    public async processLayout(node: SceneNode): Promise<void> {
        return new Promise((resolve) => {
            this.layoutQueue.push(async () => {
                try {
                    node.setRelaunchData({ relaunch: '' });
                    resolve();
                } catch (error) {
                    console.error(`Erro ao processar layout: ${node.name}`, error);
                    resolve();
                }
            });

            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.layoutQueue.length === 0) return;

        this.isProcessing = true;

        while (this.layoutQueue.length > 0) {
            const task = this.layoutQueue.shift();
            if (task) await task();
        }

        this.isProcessing = false;
    }

    public clearQueue(): void {
        this.layoutQueue = [];
        this.isProcessing = false;
    }
}

export const layoutManager = LayoutManager.getInstance();
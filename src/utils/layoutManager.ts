import { nodeCache } from "./nodeCache";

/**
 * Classe para gerenciar o layout dos nós de forma otimizada
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

    /**
     * Processa o layout de um nó de forma otimizada
     */
    public async processLayout(node: SceneNode): Promise<void> {
        return new Promise((resolve) => {
            this.layoutQueue.push(async () => {
                try {
                    // Força o Figma a recalcular o layout
                    node.setRelaunchData({ relaunch: '' });
                    
                    // Notifica o Figma que o nó foi modificado
                    figma.notify(`Layout processado: ${node.name}`);
                    
                    resolve();
                } catch (error) {
                    console.error(`Erro ao processar layout do nó ${node.name}:`, error);
                    resolve();
                }
            });

            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    /**
     * Processa a fila de layouts pendentes
     */
    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.layoutQueue.length === 0) {
            return;
        }

        this.isProcessing = true;

        while (this.layoutQueue.length > 0) {
            const task = this.layoutQueue.shift();
            if (task) {
                await task();
            }
        }

        this.isProcessing = false;
    }

    /**
     * Limpa a fila de layouts
     */
    public clearQueue(): void {
        this.layoutQueue = [];
        this.isProcessing = false;
    }
}

export const layoutManager = LayoutManager.getInstance(); 
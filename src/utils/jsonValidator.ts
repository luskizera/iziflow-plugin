import { FlowJSON, NodeData, ConnectionData } from "../core/parser";

/**
 * Classe para validar a estrutura do JSON de fluxo
 */
class JSONValidator {
    private static instance: JSONValidator;

    private constructor() {}

    public static getInstance(): JSONValidator {
        if (!JSONValidator.instance) {
            JSONValidator.instance = new JSONValidator();
        }
        return JSONValidator.instance;
    }

    /**
     * Valida a estrutura básica do JSON
     */
    public validateStructure(json: any): json is FlowJSON {
        if (!json || typeof json !== 'object') {
            throw new Error('JSON inválido: deve ser um objeto');
        }

        if (!json.name || typeof json.name !== 'string') {
            throw new Error('JSON inválido: propriedade "name" ausente ou inválida');
        }

        if (!Array.isArray(json.nodes)) {
            throw new Error('JSON inválido: propriedade "nodes" deve ser um array');
        }

        if (!Array.isArray(json.connections)) {
            throw new Error('JSON inválido: propriedade "connections" deve ser um array');
        }

        return true;
    }

    /**
     * Valida um nó individual
     */
    public validateNode(node: any): node is NodeData {
        if (!node.id || typeof node.id !== 'string') {
            throw new Error(`Nó inválido: propriedade "id" ausente ou inválida`);
        }

        if (!node.type || typeof node.type !== 'string') {
            throw new Error(`Nó inválido: propriedade "type" ausente ou inválida para o nó ${node.id}`);
        }

        const validTypes = ['START', 'END', 'STEP', 'DECISION', 'ENTRYPOINT'];
        if (!validTypes.includes(node.type)) {
            throw new Error(`Nó inválido: tipo "${node.type}" não suportado para o nó ${node.id}`);
        }

        if (!node.name || typeof node.name !== 'string') {
            throw new Error(`Nó inválido: propriedade "name" ausente ou inválida para o nó ${node.id}`);
        }

        return true;
    }

    /**
     * Valida uma conexão individual
     */
    public validateConnection(connection: any, nodes: Map<string, any>): connection is ConnectionData {
        if (!connection.source || typeof connection.source !== 'string') {
            throw new Error('Conexão inválida: propriedade "source" ausente ou inválida');
        }

        if (!connection.target || typeof connection.target !== 'string') {
            throw new Error('Conexão inválida: propriedade "target" ausente ou inválida');
        }

        if (!nodes.has(connection.source)) {
            throw new Error(`Conexão inválida: nó fonte "${connection.source}" não encontrado`);
        }

        if (!nodes.has(connection.target)) {
            throw new Error(`Conexão inválida: nó alvo "${connection.target}" não encontrado`);
        }

        return true;
    }

    /**
     * Valida o JSON completo do fluxo
     */
    public validateFlow(json: any): boolean {
        try {
            // Valida a estrutura básica
            this.validateStructure(json);

            // Cria um Map para armazenar os nós
            const nodes = new Map();

            // Valida cada nó
            for (const node of json.nodes) {
                this.validateNode(node);
                nodes.set(node.id, node);
            }

            // Valida cada conexão
            for (const connection of json.connections) {
                this.validateConnection(connection, nodes);
            }

            // Valida se existe exatamente um nó START
            const startNodes = json.nodes.filter(node => node.type === 'START');
            if (startNodes.length !== 1) {
                throw new Error('JSON inválido: deve haver exatamente um nó do tipo START');
            }

            // Valida se existe pelo menos um nó END
            const endNodes = json.nodes.filter(node => node.type === 'END');
            if (endNodes.length === 0) {
                throw new Error('JSON inválido: deve haver pelo menos um nó do tipo END');
            }

            return true;
        } catch (error) {
            console.error('Erro na validação do JSON:', error);
            throw error;
        }
    }
}

export const jsonValidator = JSONValidator.getInstance(); 
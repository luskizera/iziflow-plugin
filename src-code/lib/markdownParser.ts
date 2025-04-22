// src-code/lib/markdownParser.ts
/// <reference types="@figma/plugin-typings" />

import type { FlowNode, Connection, DescriptionField, NodeData } from '@shared/types/flow.types';

type ParserState = {
    nodes: FlowNode[];
    connections: Connection[];
    currentNodeId: string | null;
    lineNumber: number;
};

// Helper para remover comentários e trimar
function cleanLine(rawLine: string): string {
    return rawLine.split('#')[0].trim();
}

export async function parseMarkdownToFlow(markdown: string): Promise<{ nodes: FlowNode[], connections: Connection[] }> {
    const lines = markdown.split('\n');
    const state: ParserState = {
        nodes: [],
        connections: [],
        currentNodeId: null,
        lineNumber: 0,
    };
    const nodeMap: { [id: string]: FlowNode } = {};

    for (const rawLine of lines) {
        state.lineNumber++;
        const line = cleanLine(rawLine); // Usa a linha limpa para a maioria das verificações

        if (line === '') {
            state.currentNodeId = null;
            continue;
        }

        try {
            // Passa a linha limpa OU a linha original para funções que precisam de indentação
            if (parseNodeLine(line, state, nodeMap)) continue;
            if (parseMetaLine(rawLine, state, nodeMap)) continue; // Precisa da original para indentação
            if (parseDescLine(rawLine, state, nodeMap)) continue; // Precisa da original para indentação
            if (parseConnLine(line, state)) continue; // Usa a linha limpa

            throw new Error(`Sintaxe inválida ou desconhecida.`);

        } catch (error: any) {
            // Inclui a linha original no erro para contexto
            throw new Error(`Erro na linha ${state.lineNumber}: ${error.message}\n-> ${rawLine.trim()}`);
        }
    }

    // Validação final das conexões
    state.connections.forEach(conn => {
        if (!nodeMap[conn.from]) throw new Error(`Erro de Conexão: Nó de origem '${conn.from}' não definido.`);
        if (!nodeMap[conn.to]) throw new Error(`Erro de Conexão: Nó de destino '${conn.to}' não definido.`);
    });


    return { nodes: state.nodes, connections: state.connections };
}

// --- Funções Auxiliares de Parsing ---

function parseNodeLine(line: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean {
    const nodeRegex = /^NODE\s+(\S+)\s+(START|END|STEP|DECISION|ENTRYPOINT)\s+"([^"]+)"$/i;
    const match = line.match(nodeRegex); // Já usa linha limpa

    if (match) {
        const [, id, type, name] = match;
        const nodeType = type.toUpperCase() as FlowNode['type'];

        if (nodeMap[id]) {
            throw new Error(`ID de nó duplicado: '${id}'`);
        }

        const newNode: FlowNode = {
            id,
            type: nodeType,
            name,
             metadata: {},
             description: { fields: [] }
        };
        state.nodes.push(newNode);
        nodeMap[id] = newNode;
        state.currentNodeId = id;
        return true;
    }
    return false;
}

function parseMetaLine(rawLine: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean {
     const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
     if (indent === 0) return false;

    const line = cleanLine(rawLine); // Limpa APÓS checar indentação
    const metaRegex = /^META\s+(\S+):\s*(.*)$/i;
    const match = line.match(metaRegex);

    if (match && state.currentNodeId) {
        const [, key, value] = match;
        const currentNode = nodeMap[state.currentNodeId];
        if (!currentNode.metadata) {
            currentNode.metadata = {};
        }
        currentNode.metadata[key] = value; // Value já está trimado por cleanLine
        return true;
    } else if (match && !state.currentNodeId) {
        throw new Error(`'META' definido sem um 'NODE' precedente.`);
    }
    return false;
}

function parseDescLine(rawLine: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean {
     const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
     if (indent === 0) return false;

    const line = cleanLine(rawLine); // Limpa APÓS checar indentação
    const descRegex = /^DESC\s+([^:]+):\s*(.*)$/i; // Content captura tudo após ':'
    const match = line.match(descRegex);

    if (match && state.currentNodeId) {
        const [, label, content] = match;
        const currentNode = nodeMap[state.currentNodeId];
        if (!currentNode.description) {
            currentNode.description = { fields: [] };
        }
        // Salva o label trimado, mas o content como foi capturado (preserva espaços internos)
        currentNode.description.fields.push({
            label: label.trim(),
            content: content
        });
        return true;
    } else if (match && !state.currentNodeId) {
         throw new Error(`'DESC' definido sem um 'NODE' precedente.`);
    }
    return false;
}

// 👇 CORRIGIDO para usar a linha limpa
function parseConnLine(line: string, state: ParserState): boolean {
    // A linha já vem limpa (sem comentário e trimada) da chamada principal
    const connRegex = /^CONN\s+(\S+)\s*->\s*(\S+)\s+"([^"]*)"(\s+\[SECONDARY\])?$/i;
    const match = line.match(connRegex);

    if (match) {
        const [, from, to, conditionLabel, secondaryFlag] = match;
        state.connections.push({
            from,
            to,
            conditionLabel: conditionLabel.trim(), // Label pode ter espaços extras nas aspas
            secondary: !!secondaryFlag
        });
        state.currentNodeId = null;
        return true;
    }
    return false;
}
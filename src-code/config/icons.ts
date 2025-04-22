// src-code/config/icons.ts

// Importa o CONTEÚDO dos arquivos SVG como strings usando ?raw
// Certifique-se que o caminho relativo está correto a partir DESTE arquivo.
import entrypointIconSvgString from '../assets/icons/entrypoint.svg?raw';
import stepIconSvgString from '../assets/icons/step.svg?raw';
import decisionIconSvgString from '../assets/icons/decision.svg?raw';

// Mapeamento do tipo de nó para a string SVG correspondente
const nodeTypeToSvgMap: Record<string, string | undefined> = {
    // Chaves em MAIÚSCULAS para corresponder a nodeData.type
    ENTRYPOINT: entrypointIconSvgString,
    STEP: stepIconSvgString,
    DECISION: decisionIconSvgString,
    // START e END não têm ícones definidos neste mapeamento
};

/**
 * Obtém a string SVG para um determinado tipo de nó.
 * Retorna undefined se nenhum ícone for mapeado para o tipo.
 * @param nodeType - O tipo do nó (ex: 'STEP', 'DECISION', 'ENTRYPOINT').
 * @returns A string SVG ou undefined.
 */
export function getIconSvgStringForNodeType(nodeType: string): string | undefined {
    return nodeTypeToSvgMap[nodeType.toUpperCase()]; // Garante comparação case-insensitive
}
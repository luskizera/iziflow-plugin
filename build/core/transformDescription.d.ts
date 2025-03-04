import { NodeData } from "./parser";
/**
 * Converte a descrição do nodeData para um formato normalizado { label, content }[]
 * Isso garante que o StepNode (ou outros nós) possam consumir esse formato padronizado.
 * @param description Original description dentro de NodeData
 * @returns Lista normalizada com labels e conteúdos
 */
export declare function transformDescription(description: NodeData["description"]): {
    label: string;
    content: string | string[];
}[];

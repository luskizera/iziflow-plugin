// transformDescription.ts

import { NodeData } from "./parser";

/**
 * Converte a descrição do nodeData para um formato normalizado { label, content }[]
 * Isso garante que o StepNode (ou outros nós) possam consumir esse formato padronizado.
 * @param description Original description dentro de NodeData
 * @returns Lista normalizada com labels e conteúdos
 */
export function transformDescription(
    description: NodeData["description"]
): { label: string; content: string | string[] }[] {
    const transformed: { label: string; content: string | string[] }[] = [];

    if (Array.isArray(description)) {
        // Caso a descrição já esteja no formato de array de {label, content}
        return description;
    }

    if (description && typeof description === "object") {
        if (description.action) {
            transformed.push({ label: "Action", content: description.action });
        }
        if (description.inputs) {
            transformed.push({ label: "Inputs", content: description.inputs });
        }
        if (description.outputs) {
            transformed.push({ label: "Outputs", content: description.outputs });
        }
        if (description.errors) {
            transformed.push({ label: "Errors", content: description.errors });
        }
    }

    return transformed;
}

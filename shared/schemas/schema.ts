// src/lib/schema.ts
import { z } from "zod";

// Define o schema para DescriptionField primeiro
// Note o z.union para 'content' para flexibilidade
const DescriptionFieldSchema = z.object({
  label: z.string(),
  content: z.union([
    z.string(),
    z.array(z.string()),
    z.record(z.string()), // Para objeto chave-valor simples
  ]),
  // Você pode adicionar .passthrough() ou definir outros campos opcionais aqui
  // se DescriptionField puder ter outras propriedades desconhecidas
}).passthrough(); // Permite campos extras se necessário

// Define o schema para FlowNode usando o DescriptionFieldSchema
export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["START", "END", "STEP", "DECISION", "ENTRYPOINT"]),
  name: z.string(),
  metadata: z.object({
    category: z.string().optional(),
    createdBy: z.string().optional(),
    // .passthrough() permite outros campos não definidos em metadata
  }).passthrough().optional(),
  /**
   * CORREÇÃO: 'description' agora é um objeto opcional
   * que CONTÉM a propriedade 'fields' (que é o array).
   */
  description: z.object({ // <--- description é um objeto...
    fields: z.array(DescriptionFieldSchema), // <--- ...contendo 'fields' que é um array de DescriptionFieldSchema
    // Adicione validação para outros campos dentro de description aqui, se houver
    // title: z.string().optional(),
  }).passthrough() // Permite outros campos dentro de description se necessário
    .optional() // <--- O objeto 'description' inteiro é opcional
});

// Define o schema para Connection
export const ConnectionSchema = z.object({
  id: z.string().optional(), // ID da conexão também pode ser opcional
  from: z.string(),
  to: z.string(),
  condition: z.string().optional(),
  conditionLabel: z.string().optional(), // Mantido
  secondary: z.boolean().optional()
});

// Define o schema para Flow usando os schemas anteriores
export const FlowSchema = z.object({
  flowName: z.string().optional(), // flowName também pode ser opcional
  nodes: z.array(FlowNodeSchema),
  connections: z.array(ConnectionSchema)
});

// Define o schema principal FlowData
// Aceita tanto um objeto Flow diretamente quanto um objeto com a chave 'flows'
export const FlowDataSchema = z.object({
    flowName: z.string().optional(), // Incluído para cobrir o caso raiz Flow
    nodes: z.array(FlowNodeSchema).optional(), // Incluído para cobrir o caso raiz Flow
    connections: z.array(ConnectionSchema).optional(), // Incluído para cobrir o caso raiz Flow
    flows: z.array(FlowSchema).optional() // Opcional array de flows
})
.refine(data => data.flows || (data.nodes && data.connections), {
    message: "O JSON deve conter a chave 'flows' com um array de fluxos, ou as chaves 'nodes' e 'connections' no nível raiz.",
    // Path pode ser ajustado se necessário, mas valida a estrutura geral
});

// Você pode querer exportar todos para facilitar importações
export { DescriptionFieldSchema };
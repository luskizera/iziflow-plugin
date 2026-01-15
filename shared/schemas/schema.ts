// shared/schemas/schema.ts
import { z } from "zod";

// Define o schema para DescriptionField primeiro
// Note o z.union para 'content' para flexibilidade
// Zod 4: z.looseObject() permite campos extras (substitui .passthrough())
const DescriptionFieldSchema = z.looseObject({
  label: z.string(),
  content: z.union([
    z.string(),
    z.array(z.string()),
    z.record(z.string(), z.string()), // Zod 4: record requer dois argumentos
  ]),
});

// Define o schema para FlowNode usando o DescriptionFieldSchema
// Zod 4: z.looseObject() permite campos extras não definidos
export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["START", "END", "STEP", "DECISION", "ENTRYPOINT"]),
  name: z.string(),
  metadata: z.looseObject({
    category: z.string().optional(),
    createdBy: z.string().optional(),
  }).optional(),
  /**
   * CORREÇÃO: 'description' agora é um objeto opcional
   * que CONTÉM a propriedade 'fields' (que é o array).
   */
  description: z.looseObject({
    fields: z.array(DescriptionFieldSchema),
  }).optional(),
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
import { z } from "zod";

export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["START", "END", "STEP", "DECISION"]),
  name: z.string(),
  description: z.array(z.object({
    label: z.string(),
    content: z.string()
  })).optional()
});

export const ConnectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  condition: z.string().optional(),
  secondary: z.boolean().optional()
});

export const FlowSchema = z.object({
  nodes: z.array(FlowNodeSchema),
  connections: z.array(ConnectionSchema)
});

export const FlowDataSchema = z.object({
  flows: z.array(FlowSchema).optional()
}).or(FlowSchema);

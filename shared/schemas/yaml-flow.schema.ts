// shared/schemas/yaml-flow.schema.ts
import { z } from "zod";

export const ConnectorAnchorSchema = z.enum(["top", "right", "bottom", "left"]);

export const UnitValueSchema = z.union([z.string(), z.number()]);

export const OffsetValueSchema = z.object({
  x: UnitValueSchema,
  y: UnitValueSchema,
});

export const YAMLNodePositionSchema = z.object({
  anchor: z.string().optional(),
  offset: OffsetValueSchema.optional(),
  exit: ConnectorAnchorSchema.optional(),
  entry: ConnectorAnchorSchema.optional(),
});

export const YAMLNodeTypeSchema = z.enum([
  "ENTRYPOINT",
  "STEP",
  "DECISION",
  "END",
  "START", // Suporte adicional caso o usuário use START no lugar de ENTRYPOINT
]);

export const YAMLNodeSchema = z.object({
  type: YAMLNodeTypeSchema,
  name: z.string().min(1, "Node name cannot be empty"),
  description: z.string().optional(),
  content: z.string().optional(),
  position: YAMLNodePositionSchema.optional(),
});

export const ConnectionStyleSchema = z.object({
  line_type: z.enum(["STRAIGHT", "ELBOWED"]).optional(),
  exit: ConnectorAnchorSchema.optional(),
  entry: ConnectorAnchorSchema.optional(),
});

export const YAMLConnectionSchema = z.object({
  from: z.string().min(1, "Connection 'from' is required"),
  to: z.string().min(1, "Connection 'to' is required"),
  label: z.string().optional(),
  secondary: z.boolean().optional(),
  style: ConnectionStyleSchema.optional(),
});

export const YAMLLayoutConfigSchema = z.object({
  algorithm: z.literal("auto"),
  unit: z.number().positive("metadata.layout.unit must be a positive number"),
  first_node_position: z.enum(["center"]).optional().default("center"),
  spacing: z
    .object({
      horizontal: UnitValueSchema.optional(),
      vertical: UnitValueSchema.optional(),
    })
    .optional(),
});

export const YAMLMetadataSchema = z.object({
  name: z.string().optional(),
  layout: YAMLLayoutConfigSchema,
});

export const YAMLFlowDocumentSchema = z
  .object({
    metadata: YAMLMetadataSchema,
    nodes: z.record(z.string(), YAMLNodeSchema).refine(
      (nodes) => Object.keys(nodes).length > 0,
      "At least one node must be defined in 'nodes'"
    ),
    connections: z.array(YAMLConnectionSchema).default([]),
  })
  .superRefine((doc, ctx) => {
    const nodeIds = new Set(Object.keys(doc.nodes));

    // Validate that connection targets exist
    doc.connections.forEach((conn, index) => {
      if (!nodeIds.has(conn.from)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Connection #${index + 1} references unknown origin node "${conn.from}".`,
          path: ["connections", index, "from"],
        });
      }
      if (!nodeIds.has(conn.to)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Connection #${index + 1} references unknown destination node "${conn.to}".`,
          path: ["connections", index, "to"],
        });
      }
    });

    // Validate anchors and detect circular anchors
    const visiting = new Set<string>();
    const visited = new Set<string>();

    const checkCycle = (nodeId: string) => {
      if (visiting.has(nodeId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Circular anchor dependency detected involving node "${nodeId}".`,
          path: ["nodes", nodeId, "position", "anchor"],
        });
        return;
      }
      if (visited.has(nodeId)) return;

      visiting.add(nodeId);
      const anchor = doc.nodes[nodeId]?.position?.anchor;
      if (anchor) {
        if (!nodeIds.has(anchor)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Node "${nodeId}" references non-existent anchor "${anchor}".`,
            path: ["nodes", nodeId, "position", "anchor"],
          });
        } else {
          checkCycle(anchor);
        }
      }
      visiting.delete(nodeId);
      visited.add(nodeId);
    };

    for (const nodeId of nodeIds) {
      if (!visited.has(nodeId)) {
        checkCycle(nodeId);
      }
    }
  });

export type YAMLFlowDocumentParsed = z.infer<typeof YAMLFlowDocumentSchema>;

import { useMemo } from "react";
import ReactFlow, { 
  type Node, 
  type Edge,
  Background,
  Controls,
  ConnectionMode,
  MarkerType
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowDataSchema } from "@/lib/schema";
import type { FlowNode, Connection, Flow } from "@/lib/types";

interface FlowPreviewProps {
  json: string;
}

export function FlowPreview({ json }: FlowPreviewProps) {
  const { nodes, edges } = useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      const result = FlowDataSchema.safeParse(parsed);
      
      if (!result.success) {
        return { nodes: [], edges: [] };
      }
      
      const flowData = result.data;
      // Se a propriedade "flows" existir e tiver itens, usar o primeiro; senão, tratar flowData como Flow
      const flow: Flow = ('flows' in flowData && flowData.flows && flowData.flows.length > 0)
        ? flowData.flows[0]
        : flowData as Flow;
      
      const nodes: Node[] = flow.nodes.map((node: FlowNode) => ({
        id: node.id,
        type: node.type.toLowerCase(),
        data: { label: node.name },
        position: { x: 0, y: 0 },
      }));
      
      const edges: Edge[] = flow.connections.map((conn: Connection) => ({
        id: `${conn.from}-${conn.to}`,
        source: conn.from,
        target: conn.to,
        label: conn.condition,
        type: conn.secondary ? "step" : "default",
        markerEnd: { type: MarkerType.Arrow },
      }));
      
      return { nodes, edges };
    } catch {
      return { nodes: [], edges: [] };
    }
  }, [json]);

  return (
    <div className="h-[400px] border rounded-md">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionMode={ConnectionMode.Strict}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

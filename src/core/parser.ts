import { layoutNodes } from "./layout";
import { createStartNode } from "../nodes/startNode";
import { createEndNode } from "../nodes/endNode";
import { createEntryPointNode } from "../nodes/entrypointNode";
import { createStepNode } from "../nodes/stepNode";
import { createDecisionNode } from "../nodes/decisionNode";
import { transformDescription } from "./transformDescription";




export async function parseJSON(json: FlowJSON): Promise<Map<string, NodeWithType>> {
    const nodes = new Map<string, NodeWithType>();
    const connections = json.connections || [];

    console.log("📊 Iniciando parse do JSON");
    console.log("🌐 Nome do fluxo:", json.flowName);
    console.log("🔄 Total de nós:", json.nodes.length);
    console.log("🔗 Total de conexões:", connections.length);

    if (!json.nodes || json.nodes.length === 0) {
      console.error("🚨 Nenhum nó encontrado no JSON.");
      return nodes;
    }

    for (const nodeData of json.nodes) {
      let figmaNode: SceneNode | undefined;

      try {
        console.log(`🟡 Criando nó: ${nodeData.name} (${nodeData.type})`);
        console.log("🔵 Descrição original do nó:", nodeData.description);


        let transformedDescription: { label: string; content: string | string[] }[] | undefined = undefined;
        if (nodeData.type === "STEP" && nodeData.description) {
          transformedDescription = transformDescription(nodeData.description);
          console.log("🔵 Descrição transformada para STEP:", transformedDescription);
        }

        switch (nodeData.type) {
          case "START":
            figmaNode = await createStartNode(nodeData);
            break;
          case "ENTRYPOINT":
            figmaNode = await createEntryPointNode(nodeData);
            break;
          case "STEP":
            figmaNode = await createStepNode({ ...nodeData, description: transformedDescription });
            break;
          case "DECISION":
            figmaNode = await createDecisionNode(nodeData);
            break;
          case "END":
            figmaNode = await createEndNode(nodeData);
            break;
          default:
            console.error(`❌ Tipo de nó desconhecido: ${nodeData.type}`);
        }

        if (figmaNode) {
          nodes.set(nodeData.id, { node: figmaNode, type: nodeData.type });
          console.log(`✅ Nó criado: ${nodeData.name}`);
        } else {
          console.warn(`⚠️ Nó não criado para: ${nodeData.name}`);
        }
      } catch (error) {
        console.error(`🔥 Erro ao criar nó ${nodeData.id}:`, error);
      }
    }

    console.log("📐 Realizando layout dos nós...");
    layoutNodes(
      new Map<string, SceneNode>([...nodes].map(([id, data]) => [id, data.node])),
      connections,
      300 // Espaçamento
    );

    console.log("✅ Todos os nós criados e posicionados.");
    return nodes;
  }
export interface FlowJSON {
    flowName: string;
    nodes: NodeData[];
    connections: ConnectionData[];
  }
export interface NodeData {
    id: string;
    name?: string;
    type: string;
    metadata?: Record<string, any>;
    description?: {
      action?: string;
      inputs?: string[];
      outputs?: string[];
      errors?: string[];
    } | { label: string; content: string | string[] }[];
  }
export interface ConnectionData {
    id: string;
    from: string;
    to: string;
    conditionLabel?: string;
    conditionType?: "positive" | "negative";
  }
export interface NodeWithType {
    node: SceneNode;
    type: string;
  }
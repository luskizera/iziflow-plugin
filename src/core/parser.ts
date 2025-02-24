namespace Parser {
  export interface FlowJSON {
    flowName: string;
    nodes: NodeData[];
    connections: ConnectionData[];
  }

  export interface NodeData {
    id: string;
    name: string;
    type: string;
    metadata?: Record<string, any>;
    description?: {
      action?: string;
      inputs?: string[];
      outputs?: string[];
      errors?: string[];
    };
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

  /**
   * Função principal que interpreta o JSON e cria os nós no Figma.
   * @param json O JSON com o fluxo de usuário.
   * @returns Um mapa contendo os nós criados com seus tipos.
   */
  export async function parseJSON(json: FlowJSON): Promise<Map<string, NodeWithType>> {
    const nodes = new Map<string, NodeWithType>();
    const connections = json.connections || [];

    if (!json.nodes || json.nodes.length === 0) {
      console.error("Nenhum nó encontrado no JSON.");
      return nodes;
    }

    for (const nodeData of json.nodes) {
      let figmaNode: SceneNode | undefined;

      try {
        console.log(`🟡 Criando nó: ${nodeData.name} (${nodeData.type})`);
        console.log("🔵 Descrição do nó:", nodeData.description);

        switch (nodeData.type) {
          case 'START':
            figmaNode = await StartNode.createStartNode(nodeData);
            break;
          case 'ENTRYPOINT':
            figmaNode = await EntrypointNode.createEntryPointNode(nodeData);
            break;
          case 'STEP':
            figmaNode = await StepNode.createStepNode(nodeData);
            break;
          case 'DECISION':
            figmaNode = await DecisionNode.createDecisionNode(nodeData);
            break;
          case 'END':
            figmaNode = await EndNode.createEndNode(nodeData);
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

    Layout.layoutNodes(
      new Map<string, SceneNode>([...nodes].map(([id, data]) => [id, data.node])),
      connections,
      300
    );

    return nodes;
  }
}
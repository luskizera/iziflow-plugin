namespace StepNode {
    /**
     * Cria um nó STEP no Figma com Auto Layout, contendo um chip, título e seções de descrição.
     * @param nodeData Dados do nó, incluindo `name` e opcionalmente `description` com ações, entradas, saídas e erros
     * @returns FrameNode configurado com largura fixa de 400px e altura dinâmica
     */
    export async function createStepNode(nodeData: any): Promise<FrameNode> {
      const stepNode = figma.createFrame();
      stepNode.name = nodeData.name || "Unnamed Step";
      stepNode.layoutMode = "VERTICAL"; // Empilha chip, título e seções verticalmente
      stepNode.counterAxisSizingMode = "FIXED"; // Largura fixa em 400px
      stepNode.primaryAxisSizingMode = "AUTO"; // Altura ajustada ao conteúdo
      stepNode.resize(400, 1); // Largura fixa, altura inicial mínima
      stepNode.paddingTop = 16;
      stepNode.paddingBottom = 16;
      stepNode.paddingLeft = 16;
      stepNode.paddingRight = 16;
      stepNode.primaryAxisAlignItems = "MIN"; // Alinha itens ao topo
      stepNode.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.96 } }]; // Fundo cinza claro
      stepNode.strokes = [{ type: "SOLID", color: { r: 0.7, g: 0.7, b: 0.7 } }]; // Borda cinza
      stepNode.strokeWeight = 2;
      stepNode.itemSpacing = 16; // Espaço entre chip, título e seções
  
      // Carrega fontes necessárias
      await Promise.all([
        figma.loadFontAsync({ family: "Inter", style: "Bold" }), // Para chip e título
        figma.loadFontAsync({ family: "Inter", style: "Regular" }), // Para seções
      ]);
  
      // Adiciona o chip STEP
      const chip = await ChipNode.createChipNode("STEP");
      stepNode.appendChild(chip);
  
      // Título do Nó
      const title = figma.createText();
      title.characters = nodeData.name || "Unnamed Step"; // Nome ou fallback
      title.fontSize = 24;
      title.fontName = { family: "Inter", style: "Bold" };
      title.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; // Preto
      title.textAutoResize = "HEIGHT"; // Altura ajustada ao conteúdo
      title.resize(368, title.height); // Largura fixa (400 - 16*2 padding)
      stepNode.appendChild(title);
  
      // Função para adicionar seções de descrição
      const addSection = (label: string, content: string | string[]) => {
        const section = figma.createFrame();
        section.layoutMode = "VERTICAL";
        section.counterAxisSizingMode = "AUTO"; // Largura ajustada ao conteúdo
        section.primaryAxisSizingMode = "AUTO"; // Altura ajustada ao conteúdo
        section.paddingTop = 8;
        section.paddingBottom = 8;
        section.itemSpacing = 4;
  
        const labelText = figma.createText();
        labelText.characters = label.toUpperCase();
        labelText.fontSize = 12;
        labelText.fontName = { family: "Inter", style: "Bold" };
        labelText.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }]; // Cinza escuro
        section.appendChild(labelText);
  
        const contentArray = Array.isArray(content) ? content : [content];
        contentArray.forEach((item) => {
          const itemText = figma.createText();
          itemText.characters = item;
          itemText.fontSize = 14;
          itemText.fontName = { family: "Inter", style: "Regular" };
          itemText.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }]; // Preto
          section.appendChild(itemText);
        });
  
        stepNode.appendChild(section);
      };
  
      // Verifica e adiciona as descrições
      if (nodeData.description) {
        console.log("🟢 Descrição encontrada para:", nodeData.name, nodeData.description);
        if (nodeData.description.action) addSection("Action", nodeData.description.action);
        if (nodeData.description.inputs) addSection("Inputs", nodeData.description.inputs);
        if (nodeData.description.outputs) addSection("Outputs", nodeData.description.outputs);
        if (nodeData.description.errors) addSection("Errors", nodeData.description.errors);
      } else {
        console.warn(`⚠️ Nenhuma descrição encontrada para STEP Node: ${nodeData.name}`);
      }
  
      // Força recálculo da altura após adicionar todos os filhos
      stepNode.resize(400, stepNode.height);
  
      return stepNode;
    }
  }
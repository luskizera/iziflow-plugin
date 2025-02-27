namespace StepNode {
    interface RGBColor {
      r: number;
      g: number;
      b: number;
    }
  
    /**
     * Cria um nó STEP no Figma com layout baseado em Auto Layout.
     * A altura é ajustada dinamicamente ao conteúdo, sem fill ou stroke no frame principal.
     * @param nodeData Dados do nó, incluindo `name` e opcionalmente `description` com labels e conteúdos.
     * @returns FrameNode configurado corretamente.
     */
    export async function createStepNode(nodeData: any): Promise<FrameNode> {
      try {
        // Cria o frame principal com Auto Layout
        const parentFrame = figma.createFrame();
        parentFrame.name = (nodeData.name && nodeData.name.trim()) ? nodeData.name : "Unnamed Step";
        parentFrame.layoutMode = "VERTICAL"; // Auto Layout vertical
        parentFrame.primaryAxisSizingMode = "AUTO"; // Equivalente a HUG
        parentFrame.counterAxisSizingMode = "FIXED";
        parentFrame.layoutAlign = "INHERIT"
        parentFrame.layoutGrow = 0
        parentFrame.fills = []; // Sem preenchimento
        parentFrame.strokes = []; // Sem borda
        parentFrame.itemSpacing = 16; // Espaçamento entre titleBlock e descBlock
        parentFrame.resize(400, parentFrame.height); // Largura fixa
  
        // Adiciona o frame à página imediatamente
        figma.currentPage.appendChild(parentFrame);
  
        // Bloco do título com Auto Layout
        const titleBlock = figma.createFrame();
        titleBlock.name = "STEP Title Block";
        titleBlock.layoutMode = "VERTICAL"; // Auto Layout vertical
        titleBlock.primaryAxisSizingMode = "AUTO"; // Equivalente a HUG
        titleBlock.counterAxisSizingMode = "FIXED"; // Largura fixa
        titleBlock.fills = [{ type: "SOLID", color: { r: 0.95686274766922, g: 0.95686274766922, b: 0.9607843160629272 } }];
        titleBlock.strokes = [{ type: "SOLID", color: { r: 0.6313725709915161, g: 0.6313725709915161, b: 0.6666666865348816 } }];
        titleBlock.strokeWeight = 2;
        titleBlock.cornerRadius = 24;
        titleBlock.paddingTop = 24;
        titleBlock.paddingBottom = 24;
        titleBlock.paddingLeft = 24;
        titleBlock.paddingRight = 24;
        titleBlock.itemSpacing = 8; // Espaçamento entre stepChip e titleText
        titleBlock.resize(400, titleBlock.height); // Remove altura inicial fixa
  
        // Adiciona o chip "STEP" com layoutAlign
        const stepChip = await ChipNode.createChipNode("STEP");
        stepChip.layoutAlign = "STRETCH"; // Garante que o chip influencie a altura
        titleBlock.appendChild(stepChip);
  
        // Adiciona o título com layoutAlign
        const titleText = figma.createText();
        titleText.characters = nodeData.name || "Untitled Step";
        titleText.fontSize = 24;
        titleText.fontName = { family: "Inter", style: "Semi Bold" };
        titleText.fills = [{ type: "SOLID", color: { r: 0.03529411926865578, g: 0.03529411926865578, b: 0.04313725605607033 } }];
        titleText.textAutoResize = "HEIGHT"; // Ajustado conforme o JSON
        titleText.layoutAlign = "STRETCH"; // Garante que o texto influencie a altura
        titleBlock.appendChild(titleText);
  
        // Adiciona o titleBlock ao parentFrame
        parentFrame.appendChild(titleBlock);
  
        // Bloco da descrição com Auto Layout
        const descBlock = figma.createFrame();
        descBlock.name = "STEP Description Block";
        descBlock.layoutMode = "VERTICAL"; // Auto Layout vertical
        descBlock.primaryAxisSizingMode = "AUTO"; // Equivalente a HUG
        descBlock.counterAxisSizingMode = "FIXED"; // Largura fixa
        descBlock.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
        descBlock.strokes = [{ type: "SOLID", color: { r: 0.8941176533699036, g: 0.8941176533699036, b: 0.9058823585510254 } }];
        descBlock.strokeWeight = 2;
        descBlock.cornerRadius = 24;
        descBlock.paddingTop = 24;
        descBlock.paddingBottom = 24;
        descBlock.paddingLeft = 24;
        descBlock.paddingRight = 24;
        descBlock.itemSpacing = 8; // Espaçamento entre seções
        descBlock.resize(400, descBlock.height);
  
        const addSection = async (label: string, content: string | string[]) => {
          const sectionFrame = figma.createFrame();
          sectionFrame.layoutMode = "VERTICAL";
          sectionFrame.primaryAxisSizingMode = "AUTO";
          sectionFrame.counterAxisSizingMode = "FIXED";
          sectionFrame.layoutAlign = "STRETCH";
          sectionFrame.itemSpacing = 8;
          sectionFrame.paddingBottom = 24;
  
          // Adiciona o chip com layoutAlign
          const chip = await ChipNode.createDescriptionChip(label);
          chip.layoutAlign = "STRETCH"; // Garante que o chip influencie a altura
          sectionFrame.appendChild(chip);
          console.log("Adicionando chip com label:", label, "altura:", chip.height);
  
          // Adiciona o conteúdo
          const contentArray = Array.isArray(content) ? content : [content];
          for (const item of contentArray) {
            const itemText = figma.createText();
            itemText.characters = item || "Sem conteúdo";
            itemText.fontSize = 18;
            itemText.fontName = { family: "Inter", style: "Regular" };
            itemText.fills = [{ type: "SOLID", color: { r: 0.11764705926179886, g: 0.11764705926179886, b: 0.11764705926179886 } }];
            itemText.textAutoResize = "HEIGHT"; // Ajustado conforme o JSON
            itemText.layoutAlign = "STRETCH"; // Garante que o texto influencie a altura
            sectionFrame.appendChild(itemText);
            console.log("Adicionando conteúdo:", item, "altura:", itemText.height);
          }
  
          descBlock.appendChild(sectionFrame);
        };
  
        // Processa a descrição baseada no JSON
        console.log("Conteúdo de nodeData.description:", nodeData.description);
        if (Array.isArray(nodeData.description)) {
          for (const descItem of nodeData.description) {
            console.log("Item de descrição:", descItem);
            if (descItem && typeof descItem === "object" && descItem.label && descItem.content) {
              await addSection(descItem.label, descItem.content);
            }
          }
        }
  
        // Adiciona o descBlock ao parentFrame
        parentFrame.appendChild(descBlock);
  
        // Adiciona o frame à página (já feito no início, mas mantido como redundância)
        figma.currentPage.appendChild(parentFrame);
  
        return parentFrame;
      } catch (error) {
        console.error("Erro ao criar o nó STEP:", error);
        throw error;
      }
    }
  
  
    /**
     * Converte uma cor HEX para RGB normalizado usado pelo Figma.
     * @param hex Cor no formato HEX
     * @returns RGBColor
     */
    function hexToRgb(hex: string): RGBColor {
      const cleanHex = hex.replace("#", "");
      const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
      const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
      const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
      return { r, g, b };
    }
  }
  
  // Função main ajustada para usar o nodeData
  async function main() {
    await loadFonts();
  
    // Define o nodeData baseado no JSON
    const nodeData = {
      name: "User Registration Form",
      description: [
        { label: "ACTION", content: "User fills out the registration form." },
        { label: "INPUTS", content: ["Full Name, Email, Phone Number, Password, Address (Auto-suggestion), Referral Code (Optional)."] },
        { label: "OUTPUTS", content: "Account creation request sent." },
        { label: "ERRORS", content: ["Invalid email format, Weak password, Phone number already registered, Address not recognized."] }
      ]
    };
  
    // Cria o nó STEP usando a função adaptada
    const stepNode = await StepNode.createStepNode(nodeData);
  


  // Executa a função main
  main();}
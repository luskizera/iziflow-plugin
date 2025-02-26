namespace StepNode {
    /**
     * Cria um nó STEP no Figma com Auto Layout, separando título e descrição em dois blocos.
     * @param nodeData Dados do nó, incluindo `name` e opcionalmente `description` com ações, entradas, saídas e erros.
     * @returns FrameNode configurado corretamente.
     */
    export async function createStepNode(nodeData: any): Promise<FrameNode> {
        const stepNode = figma.createFrame();
        stepNode.name = nodeData.name || "Unnamed Step";
        stepNode.layoutMode = "VERTICAL";
        stepNode.counterAxisSizingMode = "FIXED";
        stepNode.primaryAxisSizingMode = "AUTO";
        stepNode.resize(400, 1);
        stepNode.primaryAxisAlignItems = "MIN";
        stepNode.fills = [];
        stepNode.strokes = [];
        stepNode.strokeWeight = 2;
        stepNode.itemSpacing = 16;

        // Carrega fontes necessárias
        await Promise.all([
            figma.loadFontAsync({ family: "Inter", style: "Bold" }),
            figma.loadFontAsync({ family: "Inter", style: "Regular" }),
        ]);

        // Bloco do título
        const titleBlock = figma.createFrame();
        titleBlock.layoutMode = "VERTICAL";
        titleBlock.counterAxisSizingMode = "FIXED";
        titleBlock.primaryAxisSizingMode = "AUTO";
        titleBlock.resize(400, 1);
        titleBlock.paddingTop = 24;
        titleBlock.paddingBottom = 24;
        titleBlock.paddingLeft = 24;
        titleBlock.paddingRight = 24;
        titleBlock.cornerRadius = 24;
        titleBlock.fills = [{ type: "SOLID", color: hexToRGB("#F4F4F5") }];
        titleBlock.itemSpacing = 8;
        titleBlock.strokes = [{ type: "SOLID", color: hexToRGB("#A1A1AA") }];
        titleBlock.strokeWeight = 2;

        const chip = await ChipNode.createChipNode("STEP");
        titleBlock.appendChild(chip);

        const title = figma.createText();
        title.characters = nodeData.name || "Unnamed Step";
        title.fontSize = 24;
        title.fontName = { family: "Inter", style: "Bold" };
        title.fills = [{ type: "SOLID", color: hexToRGB("#09090B") }];
        title.textAutoResize = "HEIGHT";
        title.resize(368, title.height);
        titleBlock.appendChild(title);
        stepNode.appendChild(titleBlock);

        // Bloco da descrição
        const descBlock = figma.createFrame();
        descBlock.layoutMode = "VERTICAL";
        descBlock.counterAxisSizingMode = "FIXED";
        descBlock.primaryAxisSizingMode = "AUTO";
        descBlock.resize(400, 1);
        descBlock.paddingTop = 24;
        descBlock.paddingBottom = 24;
        descBlock.paddingLeft = 24;
        descBlock.paddingRight = 24;
        descBlock.cornerRadius = 24;
        descBlock.fills = [{ type: "SOLID", color: hexToRGB("#FFFFFF") }];
        descBlock.itemSpacing = 8;
        descBlock.strokes = [{ type: "SOLID", color: hexToRGB("#E4E4E7") }];
        descBlock.strokeWeight = 2;

        /**
         * Adiciona uma seção ao bloco de descrição, usando `createDescriptionChip` para o rótulo.
         * @param label - O rótulo da seção (ex.: "Action", "Inputs").
         * @param content - O conteúdo da seção (string ou array de strings).
         */
        const addSection = async (label: string, content: string | string[]) => {
            const section = figma.createFrame();
            section.layoutMode = "VERTICAL";
            section.counterAxisSizingMode = "AUTO";
            section.primaryAxisSizingMode = "AUTO";
            section.paddingTop = 8;
            section.paddingBottom = 8;
            section.itemSpacing = 4;

            // Usa `createDescriptionChip` para o rótulo
            const descriptionChip = await ChipNode.createDescriptionChip(label);
            section.appendChild(descriptionChip);

            const contentArray = Array.isArray(content) ? content : [content];
            contentArray.forEach((item) => {
                const itemText = figma.createText();
                itemText.characters = item;
                itemText.fontSize = 14;
                itemText.fontName = { family: "Inter", style: "Regular" };
                itemText.fills = [{ type: "SOLID", color: hexToRGB("#09090B") }];
                section.appendChild(itemText);
            });

            descBlock.appendChild(section);
        };

        if (nodeData.description) {
            if (nodeData.description.action) await addSection("Action", nodeData.description.action);
            if (nodeData.description.inputs) await addSection("Inputs", nodeData.description.inputs);
            if (nodeData.description.outputs) await addSection("Outputs", nodeData.description.outputs);
            if (nodeData.description.errors) await addSection("Errors", nodeData.description.errors);
        }

        stepNode.appendChild(descBlock);
        return stepNode;
    }

    /**
     * Converte uma cor HEX para RGB normalizado usado pelo Figma
     * @param hex Cor no formato HEX
     * @returns RGBColor
     */
    function hexToRGB(hex: string) {
        const sanitizedHex = hex.replace("#", "");
        const bigint = parseInt(sanitizedHex, 16);
        return {
            r: ((bigint >> 16) & 255) / 255,
            g: ((bigint >> 8) & 255) / 255,
            b: (bigint & 255) / 255,
        };
    }
}
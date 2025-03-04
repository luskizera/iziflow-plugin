import { createChipNode, createDescriptionChip } from "./chipNode";
import { hexToRgb } from "../utils/hexToRgb";
export async function createStepNode(nodeData) {
    try {
        // Cria o frame principal com Auto Layout
        const parentFrame = figma.createFrame();
        parentFrame.name = (nodeData.name && nodeData.name.trim()) ? nodeData.name : "Unnamed Step";
        parentFrame.layoutMode = "VERTICAL"; // Auto Layout vertical
        parentFrame.primaryAxisSizingMode = "AUTO"; // Equivalente a HUG
        parentFrame.counterAxisSizingMode = "FIXED";
        parentFrame.layoutAlign = "INHERIT";
        parentFrame.layoutGrow = 0;
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
        titleBlock.fills = [{ type: "SOLID", color: hexToRgb("#F4F4F5") }];
        titleBlock.strokes = [{ type: "SOLID", color: hexToRgb("#A1A1AA") }];
        titleBlock.strokeWeight = 2;
        titleBlock.cornerRadius = 24;
        titleBlock.paddingTop = 24;
        titleBlock.paddingBottom = 24;
        titleBlock.paddingLeft = 24;
        titleBlock.paddingRight = 24;
        titleBlock.itemSpacing = 8; // Espaçamento entre stepChip e titleText
        titleBlock.resize(400, titleBlock.height); // Remove altura inicial fixa
        // Adiciona o chip "STEP" com layoutAlign
        const stepChip = await createChipNode("STEP");
        stepChip.layoutAlign = "STRETCH"; // Garante que o chip influencie a altura
        titleBlock.appendChild(stepChip);
        // Adiciona o título com layoutAlign
        const titleText = figma.createText();
        titleText.characters = nodeData.name || "Untitled Step";
        titleText.fontSize = 24;
        titleText.fontName = { family: "Inter", style: "Semi Bold" };
        titleText.fills = [{ type: "SOLID", color: hexToRgb("#09090B") }];
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
        descBlock.fills = [{ type: "SOLID", color: hexToRgb("#EFFFFFF") }];
        descBlock.strokes = [{ type: "SOLID", color: hexToRgb("#E4E4E7") }];
        descBlock.strokeWeight = 2;
        descBlock.cornerRadius = 24;
        descBlock.paddingTop = 24;
        descBlock.paddingBottom = 24;
        descBlock.paddingLeft = 24;
        descBlock.paddingRight = 24;
        descBlock.itemSpacing = 8; // Espaçamento entre seções
        descBlock.resize(400, descBlock.height);
        const addSection = async (label, content) => {
            const sectionFrame = figma.createFrame();
            sectionFrame.layoutMode = "VERTICAL";
            sectionFrame.primaryAxisSizingMode = "AUTO";
            sectionFrame.counterAxisSizingMode = "FIXED";
            sectionFrame.layoutAlign = "STRETCH";
            sectionFrame.itemSpacing = 8;
            sectionFrame.paddingBottom = 24;
            // Adiciona o chip com layoutAlign
            const chip = await createDescriptionChip(label);
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
                itemText.fills = [{ type: "SOLID", color: hexToRgb("#1E1E1E") }];
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
    }
    catch (error) {
        console.error("Erro ao criar o nó STEP:", error);
        throw error;
    }
}
//# sourceMappingURL=stepNode.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStepNode = createStepNode;
const chipNode_1 = require("./chipNode");
function createStepNode(nodeData) {
    const stepNode = figma.createFrame();
    stepNode.name = nodeData.name;
    stepNode.layoutMode = "VERTICAL";
    stepNode.counterAxisSizingMode = "FIXED";
    stepNode.primaryAxisSizingMode = "AUTO";
    stepNode.resize(400, 0);
    stepNode.paddingTop = 16;
    stepNode.paddingBottom = 16;
    stepNode.paddingLeft = 16;
    stepNode.paddingRight = 16;
    stepNode.primaryAxisAlignItems = "MIN";
    stepNode.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.96, b: 0.96 } }];
    stepNode.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
    stepNode.strokeWeight = 2;
    stepNode.itemSpacing = 16;
    const chip = (0, chipNode_1.createChipNode)("STEP");
    stepNode.appendChild(chip);
    const title = figma.createText();
    title.characters = nodeData.name;
    title.fontSize = 24;
    title.fontName = { family: "Inter", style: "Bold" };
    title.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
    stepNode.appendChild(title);
    const addSection = (label, content) => {
        const section = figma.createFrame();
        section.layoutMode = "VERTICAL";
        section.counterAxisSizingMode = "AUTO";
        section.primaryAxisSizingMode = "AUTO";
        section.paddingTop = 8;
        section.paddingBottom = 8;
        section.itemSpacing = 4;
        const labelText = figma.createText();
        labelText.characters = label.toUpperCase();
        labelText.fontSize = 12;
        labelText.fontName = { family: "Inter", style: "Bold" };
        labelText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
        section.appendChild(labelText);
        const contentArray = Array.isArray(content) ? content : [content];
        contentArray.forEach(item => {
            const itemText = figma.createText();
            itemText.characters = item;
            itemText.fontSize = 14;
            itemText.fontName = { family: "Inter", style: "Regular" };
            itemText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
            section.appendChild(itemText);
        });
        stepNode.appendChild(section);
    };
    if (nodeData.description) {
        console.log("🟢 Descrição encontrada para:", nodeData.name, nodeData.description);
        if (nodeData.description.action)
            addSection("Action", nodeData.description.action);
        if (nodeData.description.inputs)
            addSection("Inputs", nodeData.description.inputs);
        if (nodeData.description.outputs)
            addSection("Outputs", nodeData.description.outputs);
        if (nodeData.description.errors)
            addSection("Errors", nodeData.description.errors);
    }
    else {
        console.warn(`⚠️ Nenhuma descrição encontrada para STEP Node: ${nodeData.name}`);
    }
    return stepNode;
}

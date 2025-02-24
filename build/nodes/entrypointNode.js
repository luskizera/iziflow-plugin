"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEntryPointNode = createEntryPointNode;
const chipNode_1 = require("./chipNode");
function createEntryPointNode(nodeData) {
    const entryNode = figma.createFrame();
    entryNode.name = nodeData.name || "ENTRYPOINT";
    entryNode.layoutMode = "VERTICAL";
    entryNode.primaryAxisAlignItems = "MIN";
    entryNode.counterAxisSizingMode = "FIXED";
    entryNode.primaryAxisSizingMode = "AUTO";
    entryNode.resize(400, 0);
    entryNode.paddingTop = 24;
    entryNode.paddingBottom = 24;
    entryNode.paddingLeft = 24;
    entryNode.paddingRight = 24;
    entryNode.cornerRadius = 24;
    entryNode.strokeWeight = 2;
    entryNode.fills = [{ type: 'SOLID', color: hexToRGB('#F4F4F5') }];
    entryNode.strokes = [{
            type: "SOLID",
            color: hexToRGB("#A1A1AA")
        }];
    entryNode.dashPattern = [4, 4];
    entryNode.itemSpacing = 8;
    const chip = (0, chipNode_1.createChipNode)("ENTRYPOINT");
    entryNode.appendChild(chip);
    const nameText = figma.createText();
    figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }).then(() => {
        nameText.characters = nodeData.name;
        nameText.fontSize = 24;
        nameText.fontName = { family: "Inter", style: "Semi Bold" };
        nameText.textAlignHorizontal = "LEFT";
        nameText.textAlignVertical = "TOP";
        nameText.fills = [{ type: 'SOLID', color: hexToRGB('#09090B') }];
        nameText.resizeWithoutConstraints(352, nameText.height);
        nameText.textAutoResize = "HEIGHT";
        entryNode.appendChild(nameText);
    });
    return entryNode;
}
function hexToRGB(hex) {
    const sanitizedHex = hex.replace('#', '');
    const bigint = parseInt(sanitizedHex, 16);
    return {
        r: ((bigint >> 16) & 255) / 255,
        g: ((bigint >> 8) & 255) / 255,
        b: (bigint & 255) / 255
    };
}

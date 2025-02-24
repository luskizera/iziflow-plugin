"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStartNode = createStartNode;
function createStartNode(nodeData) {
    const startNode = figma.createFrame();
    startNode.name = nodeData.name || "START";
    startNode.resize(140, 140);
    startNode.cornerRadius = 400;
    startNode.layoutMode = "VERTICAL";
    startNode.counterAxisSizingMode = "AUTO";
    startNode.primaryAxisAlignItems = "CENTER";
    startNode.primaryAxisSizingMode = "AUTO";
    startNode.paddingTop = 55.5;
    startNode.paddingBottom = 55.5;
    startNode.paddingLeft = 30;
    startNode.paddingRight = 30;
    startNode.fills = [{
            type: 'SOLID',
            color: hexToRGB('#18181B')
        }];
    const textNode = figma.createText();
    figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
        textNode.characters = "START";
        textNode.fontSize = 24;
        textNode.fontName = { family: "Inter", style: "Bold" };
        textNode.textAlignHorizontal = "CENTER";
        textNode.textAlignVertical = "CENTER";
        textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }];
        startNode.appendChild(textNode);
    });
    return startNode;
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

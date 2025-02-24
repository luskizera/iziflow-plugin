"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEndNode = createEndNode;
function createEndNode(nodeData) {
    const endNode = figma.createFrame();
    endNode.name = nodeData.name || "END";
    endNode.resize(140, 140);
    endNode.cornerRadius = 400;
    endNode.layoutMode = "VERTICAL";
    endNode.counterAxisSizingMode = "AUTO";
    endNode.primaryAxisAlignItems = "CENTER";
    endNode.primaryAxisSizingMode = "AUTO";
    endNode.paddingTop = 55.5;
    endNode.paddingBottom = 55.5;
    endNode.paddingLeft = 30;
    endNode.paddingRight = 30;
    endNode.fills = [{
            type: 'SOLID',
            color: hexToRGB('#18181B')
        }];
    const textNode = figma.createText();
    figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
        textNode.characters = "END";
        textNode.fontSize = 24;
        textNode.fontName = { family: "Inter", style: "Bold" };
        textNode.textAlignHorizontal = "CENTER";
        textNode.textAlignVertical = "CENTER";
        textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }];
        endNode.appendChild(textNode);
    });
    return endNode;
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

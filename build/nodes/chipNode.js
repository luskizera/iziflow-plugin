"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChipNode = createChipNode;
function createChipNode(type) {
    const chip = figma.createFrame();
    chip.layoutMode = 'HORIZONTAL';
    chip.counterAxisSizingMode = 'AUTO';
    chip.primaryAxisSizingMode = 'AUTO';
    chip.paddingLeft = 16;
    chip.paddingRight = 16;
    chip.paddingTop = 2;
    chip.paddingBottom = 2;
    chip.cornerRadius = 8;
    chip.strokeWeight = 0;
    chip.fills = [{
            type: 'SOLID',
            color: hexToRGB('#18181B')
        }];
    const textNode = figma.createText();
    textNode.characters = type.toUpperCase();
    textNode.fontSize = 12;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.fills = [{ type: 'SOLID', color: hexToRGB('#FAFAFA') }];
    chip.appendChild(textNode);
    return chip;
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

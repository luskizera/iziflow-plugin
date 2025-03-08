import { hexToRgb } from "../utils/hexToRgb";
import { nodeCache } from "../utils/nodeCache";

export async function createChipNode(type: string): Promise<FrameNode> {
    return nodeCache.enqueueTask(async () => {
        const chip = figma.createFrame();
        chip.layoutMode = "HORIZONTAL";
        chip.primaryAxisSizingMode = "AUTO";
        chip.counterAxisSizingMode = "AUTO";
        chip.paddingLeft = 16;
        chip.paddingRight = 16;
        chip.paddingTop = 4;
        chip.paddingBottom = 4;
        chip.cornerRadius = 8;
        chip.strokeWeight = 0;
        chip.fills = [{ type: "SOLID", color: hexToRgb("#18181B") }];

        // Usa o cache de fontes
        await nodeCache.loadFont("Inter", "Bold");
        
        const textNode = figma.createText();
        textNode.characters = type.toUpperCase();
        textNode.fontSize = 14;
        textNode.fontName = { family: "Inter", style: "Bold" };
        textNode.fills = [{ type: "SOLID", color: hexToRgb("#FAFAFA") }];
        textNode.textAutoResize = "WIDTH_AND_HEIGHT";

        chip.appendChild(textNode);
        return chip;
    });
}

export async function createDescriptionChip(label: string): Promise<FrameNode> {
    return nodeCache.enqueueTask(async () => {
        const chip = figma.createFrame();
        chip.layoutMode = "HORIZONTAL";
        chip.primaryAxisSizingMode = "AUTO";
        chip.counterAxisSizingMode = "AUTO";
        chip.paddingLeft = 12;
        chip.paddingRight = 12;
        chip.paddingTop = 2;
        chip.paddingBottom = 2;
        chip.cornerRadius = 4;
        chip.strokeWeight = 0;
        chip.fills = [{ type: "SOLID", color: hexToRgb("#27272A") }];

        // Usa o cache de fontes
        await nodeCache.loadFont("Inter", "Semi Bold");
        
        const textNode = figma.createText();
        textNode.characters = label.toUpperCase();
        textNode.fontSize = 12;
        textNode.fontName = { family: "Inter", style: "Semi Bold" };
        textNode.fills = [{ type: "SOLID", color: hexToRgb("#FAFAFA") }];
        textNode.textAutoResize = "WIDTH_AND_HEIGHT";

        chip.appendChild(textNode);
        return chip;
    });
}
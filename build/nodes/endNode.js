import { hexToRgb } from "../utils/hexToRgb";
export async function createEndNode(nodeData) {
    const endNode = figma.createFrame();
    endNode.name = nodeData.name || "End";
    endNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
    endNode.cornerRadius = 400; // Para deixar o nó totalmente circular
    endNode.layoutMode = "NONE"; // Remove Auto Layout, posicionamento manual
    endNode.fills = [{
            type: 'SOLID',
            color: hexToRgb('#18181B')
        }];
    // Carrega a fonte e cria o texto
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = "End";
    textNode.fontSize = 24; // Mantém a fonte original
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.textAlignHorizontal = "CENTER";
    textNode.textAlignVertical = "CENTER";
    textNode.fills = [{ type: 'SOLID', color: hexToRgb('#FAFAFA') }]; // Texto branco
    textNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Ajusta automaticamente ao conteúdo
    // Ajusta o tamanho do texto para garantir centralização
    const textWidth = Math.min(80, textNode.width); // Limita a largura para caber no círculo
    const textHeight = textNode.height;
    textNode.resize(textWidth, textHeight);
    // Centraliza o texto manualmente no frame de 140x140px
    textNode.x = (endNode.width - textWidth) / 2; // Centraliza horizontalmente (30px)
    textNode.y = (endNode.height - textHeight) / 2; // Centraliza verticalmente (~58px)
    // Adiciona o texto ao frame
    endNode.appendChild(textNode);
    // Força a renderização completa e adiciona à página
    figma.currentPage.appendChild(endNode);
    // Força um pequeno atraso para garantir que o Figma processe o layout
    await new Promise((resolve) => setTimeout(resolve, 0));
    return endNode;
}
//# sourceMappingURL=endNode.js.map
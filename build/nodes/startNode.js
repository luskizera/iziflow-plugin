import { hexToRgb } from "../utils/hexToRgb";
export async function createStartNode(nodeData) {
    const startNode = figma.createFrame();
    startNode.name = nodeData.name || "START";
    startNode.resize(140, 140); // Mantém tamanho fixo de 140x140px
    startNode.cornerRadius = 400; // Para deixar o nó totalmente circular
    startNode.layoutMode = "NONE"; // Remove Auto Layout, posicionamento manual
    startNode.fills = [{
            type: 'SOLID',
            color: hexToRgb('#18181B')
        }];
    // Carrega a fonte e cria o texto
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = "START";
    textNode.fontSize = 24; // Mantém a fonte original
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.textAlignHorizontal = "CENTER";
    textNode.textAlignVertical = "CENTER";
    textNode.fills = [{ type: 'SOLID', color: hexToRgb('#FAFAFA') }]; // Texto branco
    textNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Ajusta automaticamente ao conteúdo
    // Ajusta o tamanho do texto para garantir centralização
    const textWidth = Math.min(100, textNode.width); // Limita a largura para caber no círculo (START é mais largo que End)
    const textHeight = textNode.height;
    textNode.resize(textWidth, textHeight);
    // Centraliza o texto manualmente no frame de 140x140px
    textNode.x = (startNode.width - textWidth) / 2; // Centraliza horizontalmente (~20px)
    textNode.y = (startNode.height - textHeight) / 2; // Centraliza verticalmente (~58px)
    // Adiciona o texto ao frame
    startNode.appendChild(textNode);
    // Força a renderização completa e adiciona à página
    figma.currentPage.appendChild(startNode);
    // Força um pequeno atraso para garantir que o Figma processe o layout
    await new Promise((resolve) => setTimeout(resolve, 0));
    return startNode;
}
//# sourceMappingURL=startNode.js.map
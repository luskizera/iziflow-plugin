"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/core/layout.ts
function layoutNodes(nodes, connections, spacing = 300) {
  console.log("\u{1F504} Iniciando layout dos n\xF3s...");
  let x = 0;
  const startNode = Array.from(nodes.entries()).find(([_, node]) => node.name === "Start");
  if (!startNode) {
    console.error("\u{1F6A8} No START node found.");
    return;
  }
  const [startId, startNodeObj] = startNode;
  startNodeObj.x = 0;
  startNodeObj.y = 0;
  let maxHeight = startNodeObj.height;
  console.log(`\u{1F4CD} START node posicionado em (${startNodeObj.x}, ${startNodeObj.y})`);
  const positionedNodes = /* @__PURE__ */ new Set([startId]);
  const queue = [startId];
  while (queue.length > 0) {
    const currentId = queue.shift();
    const currentNode = nodes.get(currentId);
    if (!currentNode) continue;
    console.log(`\u{1F500} Processando conex\xF5es a partir de: ${currentNode.name}`);
    const outgoingConnections = connections.filter((conn) => conn.from === currentId);
    outgoingConnections.forEach((conn) => {
      const targetId = conn.to;
      if (!positionedNodes.has(targetId)) {
        const targetNode = nodes.get(targetId);
        if (targetNode) {
          targetNode.x = x + currentNode.width + spacing;
          targetNode.y = 0;
          console.log(`\u27A1\uFE0F Posicionando ${targetNode.name} em (${targetNode.x}, ${targetNode.y})`);
          maxHeight = Math.max(maxHeight, targetNode.height);
          x = targetNode.x + targetNode.width;
          positionedNodes.add(targetId);
          queue.push(targetId);
        } else {
          console.warn(`\u26A0\uFE0F N\xF3 de destino n\xE3o encontrado: ${targetId}`);
        }
      }
    });
  }
  for (const node of [...nodes.values()]) {
    node.y = (maxHeight - node.height) / 2;
    console.log(`\u{1F3AF} Centralizando ${node.name} em Y: ${node.y}`);
  }
  console.log("\u2705 Layout finalizado.");
}

// src/utils/hexToRgb.ts
function hexToRgb(hex) {
  const sanitizedHex = hex.replace("#", "");
  const r = parseInt(sanitizedHex.slice(0, 2), 16) / 255;
  const g = parseInt(sanitizedHex.slice(2, 4), 16) / 255;
  const b = parseInt(sanitizedHex.slice(4, 6), 16) / 255;
  return { r, g, b };
}

// src/nodes/startNode.ts
function createStartNode(nodeData) {
  return __async(this, null, function* () {
    const startNode = figma.createFrame();
    startNode.name = nodeData.name || "START";
    startNode.resize(140, 140);
    startNode.cornerRadius = 400;
    startNode.layoutMode = "NONE";
    startNode.fills = [{
      type: "SOLID",
      color: hexToRgb("#18181B")
    }];
    yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = "START";
    textNode.fontSize = 24;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.textAlignHorizontal = "CENTER";
    textNode.textAlignVertical = "CENTER";
    textNode.fills = [{ type: "SOLID", color: hexToRgb("#FAFAFA") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";
    const textWidth = Math.min(100, textNode.width);
    const textHeight = textNode.height;
    textNode.resize(textWidth, textHeight);
    textNode.x = (startNode.width - textWidth) / 2;
    textNode.y = (startNode.height - textHeight) / 2;
    startNode.appendChild(textNode);
    figma.currentPage.appendChild(startNode);
    yield new Promise((resolve) => setTimeout(resolve, 0));
    return startNode;
  });
}

// src/nodes/endNode.ts
function createEndNode(nodeData) {
  return __async(this, null, function* () {
    const endNode = figma.createFrame();
    endNode.name = nodeData.name || "End";
    endNode.resize(140, 140);
    endNode.cornerRadius = 400;
    endNode.layoutMode = "NONE";
    endNode.fills = [{
      type: "SOLID",
      color: hexToRgb("#18181B")
    }];
    yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = "End";
    textNode.fontSize = 24;
    textNode.fontName = { family: "Inter", style: "Bold" };
    textNode.textAlignHorizontal = "CENTER";
    textNode.textAlignVertical = "CENTER";
    textNode.fills = [{ type: "SOLID", color: hexToRgb("#FAFAFA") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";
    const textWidth = Math.min(80, textNode.width);
    const textHeight = textNode.height;
    textNode.resize(textWidth, textHeight);
    textNode.x = (endNode.width - textWidth) / 2;
    textNode.y = (endNode.height - textHeight) / 2;
    endNode.appendChild(textNode);
    figma.currentPage.appendChild(endNode);
    yield new Promise((resolve) => setTimeout(resolve, 0));
    return endNode;
  });
}

// src/nodes/chipNode.ts
function createChipNode(type) {
  return __async(this, null, function* () {
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
    yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
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
function createDescriptionChip(label) {
  return __async(this, null, function* () {
    const chip = figma.createFrame();
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";
    chip.paddingLeft = 12;
    chip.paddingRight = 12;
    chip.paddingTop = 2;
    chip.paddingBottom = 2;
    chip.cornerRadius = 8;
    chip.strokeWeight = 0;
    chip.fills = [{ type: "SOLID", color: hexToRgb("#F4F4F5") }];
    yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
    const textNode = figma.createText();
    textNode.characters = label.toUpperCase();
    textNode.fontSize = 12;
    textNode.fontName = { family: "Inter", style: "Semi Bold" };
    textNode.fills = [{ type: "SOLID", color: hexToRgb("#3F3F46") }];
    textNode.textAutoResize = "WIDTH_AND_HEIGHT";
    chip.appendChild(textNode);
    return chip;
  });
}

// src/nodes/entrypointNode.ts
function createEntryPointNode(data) {
  return __async(this, null, function* () {
    const entryNode = figma.createFrame();
    entryNode.name = data.name || "ENTRYPOINT";
    entryNode.layoutMode = "VERTICAL";
    entryNode.primaryAxisSizingMode = "AUTO";
    entryNode.counterAxisSizingMode = "FIXED";
    entryNode.resize(400, 1);
    entryNode.paddingTop = 24;
    entryNode.paddingBottom = 24;
    entryNode.paddingLeft = 24;
    entryNode.paddingRight = 24;
    entryNode.cornerRadius = 24;
    entryNode.strokeWeight = 2;
    entryNode.itemSpacing = 8;
    entryNode.fills = [{ type: "SOLID", color: hexToRgb("#F4F4F5") }];
    entryNode.strokes = [{ type: "SOLID", color: hexToRgb("#A1A1AA") }];
    entryNode.dashPattern = [4, 4];
    yield Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
      // Para o chip
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" })
      // Para o texto
    ]);
    const chip = yield createChipNode("ENTRYPOINT");
    entryNode.appendChild(chip);
    console.log("Altura do chip ap\xF3s adicionar:", chip.height);
    const nameText = figma.createText();
    nameText.characters = data.name || "ENTRYPOINT";
    nameText.fontSize = 24;
    nameText.fontName = { family: "Inter", style: "Semi Bold" };
    nameText.textAlignHorizontal = "LEFT";
    nameText.textAlignVertical = "TOP";
    nameText.fills = [{ type: "SOLID", color: hexToRgb("#09090B") }];
    nameText.textAutoResize = "HEIGHT";
    nameText.resize(352, nameText.height);
    entryNode.appendChild(nameText);
    console.log("Altura do texto ap\xF3s adicionar:", nameText.height);
    console.log("Altura do entryNode antes de ajuste:", entryNode.height);
    const totalHeight = chip.height + nameText.height + entryNode.itemSpacing + entryNode.paddingTop + entryNode.paddingBottom;
    entryNode.resize(400, totalHeight);
    console.log("Altura ajustada manualmente:", totalHeight);
    yield new Promise((resolve) => setTimeout(resolve, 0));
    console.log("Altura final do entryNode ap\xF3s tick:", entryNode.height);
    return entryNode;
  });
}

// src/nodes/stepNode.ts
function createStepNode(nodeData) {
  return __async(this, null, function* () {
    try {
      const parentFrame = figma.createFrame();
      parentFrame.name = nodeData.name && nodeData.name.trim() ? nodeData.name : "Unnamed Step";
      parentFrame.layoutMode = "VERTICAL";
      parentFrame.primaryAxisSizingMode = "AUTO";
      parentFrame.counterAxisSizingMode = "FIXED";
      parentFrame.layoutAlign = "INHERIT";
      parentFrame.layoutGrow = 0;
      parentFrame.fills = [];
      parentFrame.strokes = [];
      parentFrame.itemSpacing = 16;
      parentFrame.resize(400, parentFrame.height);
      figma.currentPage.appendChild(parentFrame);
      const titleBlock = figma.createFrame();
      titleBlock.name = "STEP Title Block";
      titleBlock.layoutMode = "VERTICAL";
      titleBlock.primaryAxisSizingMode = "AUTO";
      titleBlock.counterAxisSizingMode = "FIXED";
      titleBlock.fills = [{ type: "SOLID", color: hexToRgb("#F4F4F5") }];
      titleBlock.strokes = [{ type: "SOLID", color: hexToRgb("#A1A1AA") }];
      titleBlock.strokeWeight = 2;
      titleBlock.cornerRadius = 24;
      titleBlock.paddingTop = 24;
      titleBlock.paddingBottom = 24;
      titleBlock.paddingLeft = 24;
      titleBlock.paddingRight = 24;
      titleBlock.itemSpacing = 8;
      titleBlock.resize(400, titleBlock.height);
      const stepChip = yield createChipNode("STEP");
      stepChip.layoutAlign = "STRETCH";
      titleBlock.appendChild(stepChip);
      const titleText = figma.createText();
      titleText.characters = nodeData.name || "Untitled Step";
      titleText.fontSize = 24;
      titleText.fontName = { family: "Inter", style: "Semi Bold" };
      titleText.fills = [{ type: "SOLID", color: hexToRgb("#09090B") }];
      titleText.textAutoResize = "HEIGHT";
      titleText.layoutAlign = "STRETCH";
      titleBlock.appendChild(titleText);
      parentFrame.appendChild(titleBlock);
      const descBlock = figma.createFrame();
      descBlock.name = "STEP Description Block";
      descBlock.layoutMode = "VERTICAL";
      descBlock.primaryAxisSizingMode = "AUTO";
      descBlock.counterAxisSizingMode = "FIXED";
      descBlock.fills = [{ type: "SOLID", color: hexToRgb("#FFFFFF") }];
      descBlock.strokes = [{ type: "SOLID", color: hexToRgb("#E4E4E7") }];
      descBlock.strokeWeight = 2;
      descBlock.cornerRadius = 24;
      descBlock.paddingTop = 24;
      descBlock.paddingBottom = 24;
      descBlock.paddingLeft = 24;
      descBlock.paddingRight = 24;
      descBlock.itemSpacing = 8;
      descBlock.resize(400, descBlock.height);
      const addSection = (label, content) => __async(this, null, function* () {
        const sectionFrame = figma.createFrame();
        sectionFrame.layoutMode = "VERTICAL";
        sectionFrame.primaryAxisSizingMode = "AUTO";
        sectionFrame.counterAxisSizingMode = "FIXED";
        sectionFrame.layoutAlign = "STRETCH";
        sectionFrame.itemSpacing = 8;
        sectionFrame.paddingBottom = 24;
        const chip = yield createDescriptionChip(label);
        chip.layoutAlign = "STRETCH";
        sectionFrame.appendChild(chip);
        console.log("Adicionando chip com label:", label, "altura:", chip.height);
        const contentArray = Array.isArray(content) ? content : [content];
        for (const item of contentArray) {
          const itemText = figma.createText();
          itemText.characters = item || "Sem conte\xFAdo";
          itemText.fontSize = 18;
          itemText.fontName = { family: "Inter", style: "Regular" };
          itemText.fills = [{ type: "SOLID", color: hexToRgb("#1E1E1E") }];
          itemText.textAutoResize = "HEIGHT";
          itemText.layoutAlign = "STRETCH";
          sectionFrame.appendChild(itemText);
          console.log("Adicionando conte\xFAdo:", item, "altura:", itemText.height);
        }
        descBlock.appendChild(sectionFrame);
      });
      console.log("Conte\xFAdo de nodeData.description:", nodeData.description);
      if (Array.isArray(nodeData.description)) {
        for (const descItem of nodeData.description) {
          console.log("Item de descri\xE7\xE3o:", descItem);
          if (descItem && typeof descItem === "object" && descItem.label && descItem.content) {
            yield addSection(descItem.label, descItem.content);
          }
        }
      }
      parentFrame.appendChild(descBlock);
      figma.currentPage.appendChild(parentFrame);
      return parentFrame;
    } catch (error) {
      console.error("Erro ao criar o n\xF3 STEP:", error);
      throw error;
    }
  });
}

// src/nodes/decisionNode.ts
function createDecisionNode(data) {
  return __async(this, null, function* () {
    try {
      const name = "name" in data ? data.name : data.name || "DECISION";
      const frame = figma.createFrame();
      frame.name = "decisionNode";
      frame.resize(300, 200);
      frame.fills = [];
      frame.strokes = [];
      frame.strokeWeight = 1;
      frame.cornerRadius = 0;
      frame.layoutMode = "NONE";
      frame.primaryAxisAlignItems = "CENTER";
      frame.counterAxisAlignItems = "CENTER";
      frame.paddingLeft = 0;
      frame.paddingRight = 0;
      frame.paddingTop = 0;
      frame.paddingBottom = 0;
      frame.itemSpacing = 0;
      frame.clipsContent = true;
      yield figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }).catch((error) => {
        throw new Error(`Falha ao carregar a fonte Inter Semi Bold: ${error.message}`);
      });
      const polygon = figma.createPolygon();
      polygon.name = "Polygon";
      polygon.pointCount = 4;
      polygon.resize(300, 200);
      polygon.fills = [
        {
          type: "SOLID",
          visible: true,
          opacity: 1,
          blendMode: "NORMAL",
          color: {
            r: 0.6392157077789307,
            // #A3A3A3 em RGB normalizado
            g: 0.6392157077789307,
            b: 0.6392157077789307
          }
        }
      ];
      polygon.strokes = [];
      polygon.strokeWeight = 1;
      polygon.cornerRadius = 0;
      polygon.x = 0;
      polygon.y = 0;
      const text = figma.createText();
      text.name = "name";
      text.characters = "Is Phone Verification\nSuccessful?";
      text.fontSize = 18;
      text.fontName = { family: "Inter", style: "Semi Bold" };
      text.textAlignHorizontal = "CENTER";
      text.textAlignVertical = "CENTER";
      text.fills = [
        {
          type: "SOLID",
          visible: true,
          opacity: 1,
          blendMode: "NORMAL",
          color: {
            r: 0.03529411926865578,
            // #09090B em RGB normalizado (preto escuro)
            g: 0.03529411926865578,
            b: 0.04313725605607033
          }
        }
      ];
      text.strokes = [];
      text.strokeWeight = 1;
      text.textAutoResize = "WIDTH_AND_HEIGHT";
      text.resize(180, 44);
      text.x = 60;
      text.y = 78;
      frame.appendChild(polygon);
      frame.appendChild(text);
      frame.x = 2891;
      frame.y = 6336;
      figma.currentPage.appendChild(frame);
      yield new Promise((resolve) => setTimeout(resolve, 0));
      return frame;
    } catch (error) {
      console.error("Erro ao criar o n\xF3 Decision:", error);
      throw error;
    }
  });
}

// src/core/transformDescription.ts
function transformDescription(description) {
  const transformed = [];
  if (Array.isArray(description)) {
    return description;
  }
  if (description && typeof description === "object") {
    if (description.action) {
      transformed.push({ label: "Action", content: description.action });
    }
    if (description.inputs) {
      transformed.push({ label: "Inputs", content: description.inputs });
    }
    if (description.outputs) {
      transformed.push({ label: "Outputs", content: description.outputs });
    }
    if (description.errors) {
      transformed.push({ label: "Errors", content: description.errors });
    }
  }
  return transformed;
}

// src/core/parser.ts
function parseJSON(json) {
  return __async(this, null, function* () {
    const nodes = /* @__PURE__ */ new Map();
    const connections = json.connections || [];
    console.log("\u{1F4CA} Iniciando parse do JSON");
    console.log("\u{1F310} Nome do fluxo:", json.flowName);
    console.log("\u{1F504} Total de n\xF3s:", json.nodes.length);
    console.log("\u{1F517} Total de conex\xF5es:", connections.length);
    if (!json.nodes || json.nodes.length === 0) {
      console.error("\u{1F6A8} Nenhum n\xF3 encontrado no JSON.");
      return nodes;
    }
    for (const nodeData of json.nodes) {
      let figmaNode;
      try {
        console.log(`\u{1F7E1} Criando n\xF3: ${nodeData.name} (${nodeData.type})`);
        console.log("\u{1F535} Descri\xE7\xE3o original do n\xF3:", nodeData.description);
        let transformedDescription = void 0;
        if (nodeData.type === "STEP" && nodeData.description) {
          transformedDescription = transformDescription(nodeData.description);
          console.log("\u{1F535} Descri\xE7\xE3o transformada para STEP:", transformedDescription);
        }
        switch (nodeData.type) {
          case "START":
            figmaNode = yield createStartNode(nodeData);
            break;
          case "ENTRYPOINT":
            figmaNode = yield createEntryPointNode(nodeData);
            break;
          case "STEP":
            figmaNode = yield createStepNode(__spreadProps(__spreadValues({}, nodeData), { description: transformedDescription }));
            break;
          case "DECISION":
            figmaNode = yield createDecisionNode(nodeData);
            break;
          case "END":
            figmaNode = yield createEndNode(nodeData);
            break;
          default:
            console.error(`\u274C Tipo de n\xF3 desconhecido: ${nodeData.type}`);
        }
        if (figmaNode) {
          nodes.set(nodeData.id, { node: figmaNode, type: nodeData.type });
          console.log(`\u2705 N\xF3 criado: ${nodeData.name}`);
        } else {
          console.warn(`\u26A0\uFE0F N\xF3 n\xE3o criado para: ${nodeData.name}`);
        }
      } catch (error) {
        console.error(`\u{1F525} Erro ao criar n\xF3 ${nodeData.id}:`, error);
      }
    }
    console.log("\u{1F4D0} Realizando layout dos n\xF3s...");
    layoutNodes(
      new Map([...nodes].map(([id, data]) => [id, data.node])),
      connections,
      300
      // Espaçamento
    );
    console.log("\u2705 Todos os n\xF3s criados e posicionados.");
    return nodes;
  });
}

// src/core/connectors.ts
function createConnectors(connections, nodes) {
  for (const conn of connections) {
    const fromNodeData = nodes.get(conn.from);
    const toNodeData = nodes.get(conn.to);
    if (fromNodeData && toNodeData) {
      const fromNode = fromNodeData.node;
      const toNode = toNodeData.node;
      const isDecisionNode = fromNodeData.type === "DECISION";
      const connector = figma.createConnector();
      connector.connectorStart = { endpointNodeId: fromNode.id, magnet: "AUTO" };
      connector.connectorEnd = { endpointNodeId: toNode.id, magnet: "AUTO" };
      if (isDecisionNode) {
        connector.connectorLineType = "ELBOWED";
      } else {
        connector.connectorLineType = "STRAIGHT";
      }
      connector.connectorEndStrokeCap = "ARROW_LINES";
      connector.strokeWeight = 2;
      connector.strokes = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
      if (isDecisionNode) {
        if (conn.conditionType === "negative") {
          connector.dashPattern = [4, 4];
        } else {
          connector.dashPattern = [];
        }
      }
      figma.currentPage.appendChild(connector);
      if (conn.conditionLabel) {
        figma.loadFontAsync({ family: "Inter", style: "Bold" }).then(() => {
          var _a;
          const label = figma.createText();
          label.characters = (_a = conn.conditionLabel) != null ? _a : "";
          label.fontSize = 12;
          label.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
          label.x = (fromNode.x + fromNode.width + toNode.x) / 2 - label.width / 2;
          label.y = Math.min(fromNode.y, toNode.y) - 20;
          figma.currentPage.appendChild(label);
        });
      }
    }
  }
}

// src/code.ts
function loadFonts() {
  return __async(this, null, function* () {
    try {
      yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
      yield figma.loadFontAsync({ family: "Inter", style: "Medium" });
      yield figma.loadFontAsync({ family: "Inter", style: "Bold" });
      yield figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    } catch (error) {
      console.error("Erro ao carregar fontes:", error);
      figma.notify("Erro ao carregar fontes.");
      throw error;
    }
  });
}
figma.showUI(`<!DOCTYPE html>\r
<html lang="pt">\r
<head>\r
  <meta charset="UTF-8" />\r
  <title>IziFlow</title>\r
  <style>\r
    /* CSS embutido */\r
    * {\r
      box-sizing: border-box;\r
    }\r
\r
    body {\r
      display: flex;\r
      flex-direction: column;\r
      align-items: flex-start; /* Alinha o conte\xFAdo \xE0 esquerda */\r
      padding: 24px;\r
      gap: 24px;\r
      width: 600px;\r
      height: 400px;\r
      background: #FFFFFF;\r
      font-family: 'Inter', Arial, sans-serif;\r
    }\r
\r
    h2 {\r
      margin: 0;\r
      font-weight: 600;\r
      font-size: 24px;\r
      line-height: 32px;\r
      color: #09090B;\r
      text-align: left; /* Alinha o texto \xE0 esquerda */\r
    }\r
\r
    textarea {\r
      font-family: 'Inter', Arial, sans-serif;\r
      width: 100%;\r
      height: 200px;\r
      padding: 8px 12px;\r
      border: 1px solid #E4E4E7;\r
      border-radius: 8px;\r
      font-size: 14px;\r
      line-height: 20px;\r
      color: #09090B;\r
      resize: none;\r
      transition: border-color 0.3s ease; /* Suaviza a transi\xE7\xE3o de cor */\r
    }\r
\r
    /* Altera a borda do textarea ao receber foco */\r
    textarea:focus {\r
      border: 2px solid #A1A1AA; /* Aumenta a espessura da borda */\r
      outline: none;\r
    }\r
\r
    button {\r
      padding: 8px 16px;\r
      font-family: 'Inter', Arial, sans-serif;\r
      font-size: 14px;\r
      font-weight: 500;\r
      color: #FAFAFA;\r
      background-color: #18181B;\r
      border: none;\r
      border-radius: 8px;\r
      cursor: pointer;\r
      align-self: flex-end;\r
    }\r
\r
    button:hover {\r
      background-color: #333;\r
    }\r
  </style>\r
</head>\r
<body>\r
  <h2>JSON from User Flow</h2>\r
  <textarea id="jsonInput" placeholder="JSON from User Flow"></textarea>\r
  <button id="generateButton">Generate Flow</button>\r
\r
  <script>\r
    // Foca automaticamente o textarea quando a UI \xE9 carregada\r
    document.addEventListener('DOMContentLoaded', () => {\r
      const textarea = document.getElementById('jsonInput');\r
      if (textarea) {\r
        textarea.focus(); // Foca automaticamente o textarea ao carregar\r
      }\r
    });\r
\r
    // Escuta mensagens do c\xF3digo principal para focar o textarea, se necess\xE1rio\r
    onmessage = (event) => {\r
      if (event.data.pluginMessage && event.data.type === 'focusTextarea') {\r
        const textarea = document.getElementById('jsonInput');\r
        if (textarea) {\r
          textarea.focus(); // Foca o textarea quando receber a mensagem\r
        }\r
      }\r
    };\r
\r
    // Bot\xE3o de gera\xE7\xE3o (manter a funcionalidade existente)\r
    const generateButton = document.getElementById("generateButton");\r
    generateButton.onclick = () => {\r
      const jsonInput = document.getElementById("jsonInput").value;\r
\r
      try {\r
        const parsedJSON = JSON.parse(jsonInput); // Valida\xE7\xE3o b\xE1sica\r
        console.log("Enviando JSON para o plugin:", parsedJSON); // Verificar se est\xE1 enviando o JSON\r
\r
        parent.postMessage(\r
          {\r
            pluginMessage: {\r
              type: "generate-flow",\r
              json: JSON.stringify(parsedJSON),\r
            },\r
          },\r
          "*"\r
        );\r
      } catch (error) {\r
        alert("JSON inv\xE1lido! Corrija o erro e tente novamente.");\r
      }\r
    };\r
\r
    // Evento para a tecla Enter\r
    const jsonInput = document.getElementById('jsonInput');\r
    jsonInput.addEventListener('keypress', (event) => {\r
      if (event.key === 'Enter' && !event.shiftKey) { // Enter sem Shift para evitar novas linhas\r
        event.preventDefault(); // Impede que o Enter adicione uma nova linha\r
        generateButton.click(); // Simula o clique no bot\xE3o\r
      }\r
    });\r
  </script>\r
</body>\r
</html>`, { width: 624, height: 400 });
figma.ui.onmessage = (msg) => __async(void 0, null, function* () {
  if (msg.type === "generate-flow" && msg.json) {
    try {
      yield loadFonts();
      const flowData = JSON.parse(msg.json);
      const nodeMap = yield parseJSON(flowData);
      const sceneNodeMap = new Map(
        [...nodeMap].map(([id, data]) => [id, data.node])
      );
      layoutNodes(sceneNodeMap, flowData.connections, 300);
      createConnectors(flowData.connections, nodeMap);
      figma.viewport.scrollAndZoomIntoView([...sceneNodeMap.values()]);
      figma.notify("Fluxo criado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao gerar o fluxo:", error.message);
        figma.notify(`Erro: ${error.message}`);
      } else {
        console.error("Erro desconhecido", error);
        figma.notify("Ocorreu um erro desconhecido.");
      }
    }
  }
});

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSON = parseJSON;
const decisionNode_1 = require("../nodes/decisionNode");
const endNode_1 = require("../nodes/endNode");
const entrypointNode_1 = require("../nodes/entrypointNode");
const startNode_1 = require("../nodes/startNode");
const stepNode_1 = require("../nodes/stepNode");
const layout_1 = require("./layout");
function parseJSON(json) {
    return __awaiter(this, void 0, void 0, function* () {
        const nodes = new Map();
        const connections = json.connections || [];
        if (!json.nodes || json.nodes.length === 0) {
            console.error("Nenhum nó encontrado no JSON.");
            return nodes;
        }
        for (const nodeData of json.nodes) {
            let figmaNode;
            try {
                console.log(`🟡 Criando nó: ${nodeData.name} (${nodeData.type})`);
                console.log("🔵 Descrição do nó:", nodeData.description);
                switch (nodeData.type) {
                    case 'START':
                        figmaNode = yield (0, startNode_1.createStartNode)(nodeData);
                        break;
                    case 'ENTRYPOINT':
                        figmaNode = yield (0, entrypointNode_1.createEntryPointNode)(nodeData);
                        break;
                    case 'STEP':
                        figmaNode = yield (0, stepNode_1.createStepNode)(nodeData);
                        break;
                    case 'DECISION':
                        figmaNode = yield (0, decisionNode_1.createDecisionNode)(nodeData);
                        break;
                    case 'END':
                        figmaNode = yield (0, endNode_1.createEndNode)(nodeData);
                        break;
                    default:
                        console.error(`❌ Tipo de nó desconhecido: ${nodeData.type}`);
                }
                if (figmaNode) {
                    nodes.set(nodeData.id, { node: figmaNode, type: nodeData.type });
                    console.log(`✅ Nó criado: ${nodeData.name}`);
                }
                else {
                    console.warn(`⚠️ Nó não criado para: ${nodeData.name}`);
                }
            }
            catch (error) {
                console.error(`🔥 Erro ao criar nó ${nodeData.id}:`, error);
            }
        }
        (0, layout_1.layoutNodes)(new Map([...nodes].map(([id, data]) => [id, data.node])), connections, 300);
        return nodes;
    });
}

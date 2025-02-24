"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildGraph = buildGraph;
exports.getSortedLevels = getSortedLevels;
exports.layoutNodes = layoutNodes;
function buildGraph(nodes, connections) {
    const adjacencyList = {};
    const inDegree = {};
    nodes.forEach(node => {
        adjacencyList[node.id] = [];
        inDegree[node.id] = 0;
    });
    connections.forEach(conn => {
        adjacencyList[conn.from].push(conn.to);
        inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
    });
    return { adjacencyList, inDegree };
}
function getSortedLevels(_, connections) {
    return [0];
}
function layoutNodes(nodes, connections, spacing = 300) {
    let x = 0;
    const startNode = Array.from(nodes.entries()).find(([_, node]) => node.name === 'Start');
    if (!startNode) {
        console.error("No START node found.");
        return;
    }
    const [startId, startNodeObj] = startNode;
    startNodeObj.x = 0;
    startNodeObj.y = 0;
    let maxHeight = startNodeObj.height;
    const positionedNodes = new Set([startId]);
    const queue = [startId];
    while (queue.length > 0) {
        const currentId = queue.shift();
        const currentNode = nodes.get(currentId);
        if (!currentNode)
            continue;
        const outgoingConnections = connections.filter(conn => conn.from === currentId);
        outgoingConnections.forEach(conn => {
            const targetId = conn.to;
            if (!positionedNodes.has(targetId)) {
                const targetNode = nodes.get(targetId);
                if (targetNode) {
                    targetNode.x = x + currentNode.width + spacing;
                    targetNode.y = 0;
                    maxHeight = Math.max(maxHeight, targetNode.height);
                    x = targetNode.x + targetNode.width;
                    positionedNodes.add(targetId);
                    queue.push(targetId);
                }
            }
        });
    }
    for (const node of [...nodes.values()]) {
        node.y = (maxHeight - node.height) / 2;
    }
}

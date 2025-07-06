# Module: src-code/lib/layout.ts

## Purpose and Scope

This module provides utility functions related to graph building and level sorting, which are likely foundational steps for a more complex layout algorithm that positions nodes on the Figma canvas. The functions here prepare data structures representing the flow graph's topology.

This module is part of the Figma plugin's backend (`src-code`).

## Namespace: `Layout`

This namespace groups the exported layout-related utility functions.

### `buildGraph(nodes: any[], connections: any[]): { adjacencyList: { [id: string]: string[] }, inDegree: { [id: string]: number } }`

This function constructs a graph representation from a list of nodes and connections.

*   **Parameters**:
    *   `nodes: any[]`: An array of node objects. Each node object is expected to have at least an `id` property.
    *   `connections: any[]`: An array of connection objects. Each connection object is expected to have `from` and `to` properties, representing the source and target node IDs of the connection.
*   **Returns**: `object`
    *   `adjacencyList: { [id: string]: string[] }`: An object where keys are node IDs. The value for each key is an array of node IDs representing the direct successors (nodes connected *from* the key node).
    *   `inDegree: { [id: string]: number }`: An object where keys are node IDs. The value for each key is the number of incoming connections to that node.
*   **Process**:
    1.  Initializes `adjacencyList` and `inDegree` for all nodes, setting initial `inDegree` to 0 and an empty array for successors.
    2.  Iterates through the `connections` array:
        *   For each connection, it adds the `conn.to` node ID to the list of successors for `conn.from` in the `adjacencyList`.
        *   It increments the `inDegree` count for the `conn.to` node.
*   **Usage**: This function is typically a preliminary step in graph algorithms, such as topological sort or layered graph drawing, which are used to determine node positions.

### `getSortedLevels(levelToNodes: { [level: number]: string[] }): number[]`

This function takes an object mapping level numbers to arrays of node IDs and returns a sorted array of the level numbers.

*   **Parameters**:
    *   `levelToNodes: { [level: number]: string[] }`: An object where keys are numbers representing graph levels (or layers), and values are arrays of node IDs belonging to that level.
*   **Returns**: `number[]`
    *   An array of level numbers, sorted in ascending order.
*   **Process**:
    1.  Gets all keys (level numbers as strings) from the `levelToNodes` object.
    2.  Converts these string keys to integers.
    3.  Sorts the integers in ascending order.
*   **Usage**: This function is useful when processing nodes level by level in a layered graph drawing algorithm. After nodes have been assigned to levels, this function can provide the order in which to process these levels.

## Example (Conceptual)

```typescript
// import { Layout } from './layout'; // Assuming used elsewhere in src-code

// const myNodes = [
//   { id: 'A', name: 'Start' },
//   { id: 'B', name: 'Step 1' },
//   { id: 'C', name: 'Decision' },
//   { id: 'D', name: 'Step 2A' },
//   { id: 'E', name: 'Step 2B' },
//   { id: 'F', name: 'End' },
// ];

// const myConnections = [
//   { from: 'A', to: 'B' },
//   { from: 'B', to: 'C' },
//   { from: 'C', to: 'D', conditionLabel: 'Yes' },
//   { from: 'C', to: 'E', conditionLabel: 'No' },
//   { from: 'D', to: 'F' },
//   { from: 'E', to: 'F' },
// ];

// const { adjacencyList, inDegree } = Layout.buildGraph(myNodes, myConnections);
// console.log(adjacencyList);
// // Output:
// // {
// //   A: ['B'],
// //   B: ['C'],
// //   C: ['D', 'E'],
// //   D: ['F'],
// //   E: ['F'],
// //   F: []
// // }

// console.log(inDegree);
// // Output:
// // { A: 0, B: 1, C: 1, D: 1, E: 1, F: 2 }


// // Assuming some algorithm populates levelToNodes:
// const nodeLevels = {
//   0: ['A'],
//   1: ['B'],
//   2: ['C'],
//   3: ['D', 'E'],
//   4: ['F']
// };
// const sortedLevels = Layout.getSortedLevels(nodeLevels);
// console.log(sortedLevels); // Output: [0, 1, 2, 3, 4]
```

## Relationships with Other Modules

*   **Layout Algorithm (e.g., `src-code/utils/layoutManager.ts` or a more comprehensive layout engine)**: The functions in this module are likely prerequisites for a more sophisticated layout algorithm that determines the (x, y) coordinates of each node. The `adjacencyList` and `inDegree` are fundamental for many graph traversal and layout techniques. `getSortedLevels` implies a layered approach to layout.
*   **`@shared/types/flow.types` (Implicit)**: While `any[]` is used in the function signatures, the `nodes` and `connections` parameters would typically conform to structures like `NodeData` (or a simplified version with `id`) and `Connection` from the shared types.

This module provides basic graph utility functions that are essential for processing the flow's structure before a visual layout can be computed and applied to the Figma nodes.

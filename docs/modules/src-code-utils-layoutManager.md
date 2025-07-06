# Module: src-code/utils/layoutManager.ts

## Purpose and Scope

This module provides a `LayoutManager` class, implemented as a singleton, designed to manage and process layout-related tasks for Figma `SceneNode` objects in a queued manner. The primary operation performed on the nodes in the current implementation is setting their relaunch data.

The main goal seems to be to handle potentially numerous or asynchronous layout updates sequentially to prevent race conditions or overwhelming the Figma API, although the current task (`node.setRelaunchData`) is relatively simple.

## Class: `LayoutManager` (Singleton)

### Constructor (`private constructor()`)

*   Initializes `this.layoutQueue` as an empty array to hold layout tasks.
*   Initializes `this.isProcessing` to `false`, indicating that the queue is not currently being processed.
*   The constructor is private to enforce the singleton pattern.

### `public static getInstance(): LayoutManager`

*   Static method to get the single instance of `LayoutManager`.
*   If an instance doesn't exist, it creates one.
*   Returns the singleton instance.

### `public async processLayout(node: SceneNode): Promise<void>`

Adds a layout task for a given `SceneNode` to the queue.

*   **Parameters**:
    *   `node: SceneNode`: The Figma node for which the layout task needs to be processed.
*   **Returns**: `Promise<void>`: A promise that resolves when the task for this specific node is added to the queue and its wrapper promise is set up. It resolves successfully even if the internal task execution encounters an error (errors are caught and logged).
*   **Process**:
    1.  Creates a new task (an asynchronous function) and pushes it to `this.layoutQueue`.
    2.  The task, when executed, will:
        *   Call `node.setRelaunchData({ relaunch: '' })`. This is typically used to add a button to the Figma UI when the node is selected, allowing the user to "relaunch" the plugin with that node as context. Setting it to an empty string might be a way to ensure the relaunch button appears or to clear previous relaunch data.
        *   Resolves the promise returned by `processLayout`.
        *   Catches and logs any error during `setRelaunchData`.
    3.  If the queue is not already being processed (`!this.isProcessing`), it calls `this.processQueue()` to start processing.

### `private async processQueue(): Promise<void>`

Processes the tasks in the `layoutQueue` sequentially.

*   **Process**:
    1.  If `this.isProcessing` is true or the queue is empty, it returns immediately.
    2.  Sets `this.isProcessing = true`.
    3.  Enters a `while` loop that continues as long as there are tasks in `this.layoutQueue`.
        *   Removes the first task from the queue using `this.layoutQueue.shift()`.
        *   If a task exists, it awaits its execution.
    4.  Once the queue is empty, sets `this.isProcessing = false`.

### `public clearQueue(): void`

Clears all tasks from the `layoutQueue` and resets `this.isProcessing` to `false`.

*   This can be used to cancel pending layout updates.

## Singleton Instance

### `export const layoutManager = LayoutManager.getInstance();`

Exports a single, ready-to-use instance of the `LayoutManager`.

## Dependencies

*   **`./nodeCache`**: Imported but not explicitly used in the provided code snippet for `LayoutManager`. It might have been intended for use with more complex layout tasks that require font loading or other cached data.
*   **Figma Plugin API**:
    *   `SceneNode`: Type for the nodes being processed.
    *   `node.setRelaunchData()`: The core Figma API call made by the layout tasks.

## Usage Context

The `layoutManager` is intended to be used whenever a node's relaunch data needs to be set, potentially after the node has been created or modified. By queuing these operations, the plugin can ensure they are handled one by one.

```typescript
// import { layoutManager } from './layoutManager';
// import { Frames } from '../lib/frames'; // Assuming Frames creates nodes

// async function createAndProcessNode(nodeData, finalColors) {
//   const figmaNode = await Frames.createStepNode(nodeData, finalColors);
//   // ... other setup for figmaNode ...

//   // Add to layout manager to set relaunch data
//   await layoutManager.processLayout(figmaNode);

//   figma.currentPage.appendChild(figmaNode);
//   return figmaNode;
// }
```

While the current implementation only sets relaunch data, the `LayoutManager` structure is flexible enough to be extended to handle more complex, asynchronous layout calculations or manipulations for each node if needed in the future. The queue ensures that these operations occur in a controlled sequence.

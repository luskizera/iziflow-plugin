# Module: src-code/utils/nodeCache.ts

## Purpose and Scope

This module provides a `NodeCache` class, implemented as a singleton. While the name suggests caching, the current implementation primarily focuses on:
1.  Providing a direct method to load fonts using `figma.loadFontAsync`.
2.  Offering a generic task queuing mechanism (`enqueueTask`, `processQueue`) to serialize asynchronous operations.

The "cache" aspect might be a planned feature or an older naming convention, as there's no explicit caching logic (like storing and retrieving results of operations) in the provided code. The task queue itself helps manage asynchronous Figma API calls sequentially.

## Class: `NodeCache` (Singleton)

### Constructor (`private constructor()`)

*   Initializes `this.taskQueue` as an empty array to hold tasks.
*   Initializes `this.isProcessing` to `false`, indicating the queue is not currently being processed.
*   The constructor is private to enforce the singleton pattern.

### `public static getInstance(): NodeCache`

*   Static method to get the single instance of `NodeCache`.
*   If an instance doesn't exist, it creates one.
*   Returns the singleton instance.

### `public async loadFont(family: string, style: string): Promise<void>`

A direct wrapper around `figma.loadFontAsync`.

*   **Parameters**:
    *   `family: string`: The font family name.
    *   `style: string`: The font style (e.g., "Regular", "Bold").
*   **Returns**: `Promise<void>`: A promise that resolves when the font has been loaded by Figma, or rejects if loading fails.
*   **Action**: Calls `figma.loadFontAsync({ family, style })`.

### `public async enqueueTask<T>(task: () => Promise<T>): Promise<T>`

Adds an asynchronous task to a queue for sequential processing.

*   **Type Parameters**:
    *   `T`: The expected return type of the task.
*   **Parameters**:
    *   `task: () => Promise<T>`: A function that returns a promise. This is the task to be enqueued.
*   **Returns**: `Promise<T>`: A promise that resolves with the result of the `task` or rejects if the `task` itself throws an error or is rejected.
*   **Process**:
    1.  Creates a new wrapper function and pushes it to `this.taskQueue`.
    2.  This wrapper, when executed by `processQueue`, will:
        *   Await the execution of the original `task`.
        *   Resolve the promise returned by `enqueueTask` with the result of the `task`.
        *   Catch any errors from the `task`, log them, and reject the promise returned by `enqueueTask`.
    3.  If the queue is not already being processed (`!this.isProcessing`), it calls `this.processQueue()` to start or continue processing.

### `private async processQueue(): Promise<void>`

Processes the tasks in the `taskQueue` sequentially.

*   **Process**:
    1.  If `this.isProcessing` is true or the queue is empty, it returns immediately.
    2.  Sets `this.isProcessing = true`.
    3.  Enters a `while` loop that continues as long as there are tasks in `this.taskQueue`.
        *   Removes the first task (a wrapper function) from the queue using `this.taskQueue.shift()`.
        *   If a task exists, it awaits its execution. The actual resolution/rejection of the `enqueueTask` promise happens within this shifted task.
    4.  Catches any errors that might occur if a task wrapper itself has an unhandled promise rejection (though individual tasks are try-catched within their wrappers).
    5.  Finally, sets `this.isProcessing = false` once the queue is empty or an error occurs in the queue processing loop itself.

## Singleton Instance

### `export const nodeCache = NodeCache.getInstance();`

Exports a single, ready-to-use instance of the `NodeCache`.

## Dependencies

*   **Figma Plugin API**:
    *   `figma.loadFontAsync()`: Used by the `loadFont` method.

## Usage Context

*   **Font Loading**: The `loadFont` method is used directly by other modules (e.g., `src-code/lib/frames.ts`, `src-code/lib/connectors.ts`) to ensure fonts are loaded before attempting to create text nodes or apply font styles.
    ```typescript
    // import { nodeCache } from './nodeCache';
    // await nodeCache.loadFont("Inter", "Regular");
    // const textNode = figma.createText();
    // textNode.fontName = { family: "Inter", style: "Regular" };
    ```

*   **Task Queuing**: The `enqueueTask` method can be used to serialize any asynchronous operations, especially those interacting with the Figma API that might benefit from sequential execution to avoid race conditions or performance issues.
    ```typescript
    // import { nodeCache } from './nodeCache';

    // async function someAsyncFigmaOperation(nodeId: string): Promise<string> {
    //   // ... async work with Figma API ...
    //   return `Result for ${nodeId}`;
    // }

    // async function processMultipleNodes() {
    //   const result1 = await nodeCache.enqueueTask(() => someAsyncFigmaOperation("node1"));
    //   const result2 = await nodeCache.enqueueTask(() => someAsyncFigmaOperation("node2"));
    //   // result1 and result2 will be processed sequentially by the queue.
    //   console.log(result1, result2);
    // }
    ```

The `NodeCache` module, particularly its task queuing mechanism, helps in managing the flow of asynchronous operations within the plugin's backend, contributing to stability and predictable execution. While direct caching isn't implemented, the `loadFont` method centralizes font loading calls.

# Module: src-code/utils/code-utils.ts

## Purpose and Scope

This module provides utility functions for the Figma plugin's backend (`src-code`). These utilities facilitate communication between the plugin's backend (running in Figma's sandbox) and its UI (running in an iframe), as well as interaction with Figma's client storage.

## Main Exported Functions

### `dispatch(data: any, origin = "*")`

A generic function to send a message from the plugin's backend to its UI.

*   **Parameters**:
    *   `data: any`: The payload to send to the UI.
    *   `origin: string` (optional, default: `"*"`): Specifies the origin for `postMessage`. Using `"*"` allows communication with any origin, which is common in Figma plugin development but should be considered for security if specific origins are expected.
*   **Action**: Calls `figma.ui.postMessage(data, { origin })`.

### `dispatchTS<Key extends keyof EventTS>(event: Key, data: EventTS[Key], origin = "*")`

A type-safe version of `dispatch` that uses a predefined `EventTS` type (presumably from `../../shared/types/messaging.types`) to structure messages.

*   **Type Parameters**:
    *   `Key extends keyof EventTS`: The type of the event key, ensuring it's a valid event name defined in `EventTS`.
*   **Parameters**:
    *   `event: Key`: The name of the event to dispatch (e.g., `"userAction"`, `"dataLoaded"`).
    *   `data: EventTS[Key]`: The payload for the event, typed according to the `event` name in `EventTS`.
    *   `origin: string` (optional, default: `"*"`).
*   **Action**: Wraps the `event` name and `data` into an object `{ event, data }` and sends it using the generic `dispatch` function. This provides a structured way for the UI to identify and handle different types of messages.

### `listenTS<Key extends keyof EventTS>(eventName: Key, callback: (data: EventTS[Key]) => any, listenOnce = false)`

A type-safe function to listen for messages sent from the UI to the plugin's backend.

*   **Type Parameters**:
    *   `Key extends keyof EventTS`: The type of the event key to listen for.
*   **Parameters**:
    *   `eventName: Key`: The name of the event to listen for.
    *   `callback: (data: EventTS[Key]) => any`: A function to be executed when a message with the specified `eventName` is received. The `data` passed to the callback is typed according to `EventTS[Key]`.
    *   `listenOnce: boolean` (optional, default: `false`): If `true`, the listener will be automatically removed after the callback is executed once.
*   **Action**:
    *   Sets up an event listener using `figma.ui.on("message", func)`.
    *   The internal `func` checks if the `event.event` property of the received message matches `eventName`.
    *   If it matches, the `callback` is called with the `event` data (which should conform to `{ event: Key, data: EventTS[Key] }`).
    *   If `listenOnce` is true, `figma.ui.off("message", func)` is called to remove the listener.

### `getStore(key: string): Promise<any>`

Retrieves a value from Figma's client storage (persistent local storage for the plugin).

*   **Parameters**:
    *   `key: string`: The key of the data to retrieve.
*   **Returns**: `Promise<any>`: A promise that resolves with the value stored for the given `key`, or `undefined` if the key is not found.
*   **Action**: Calls `figma.clientStorage.getAsync(key)`.

### `setStore(key: string, value: string): Promise<void>`

Stores a string value in Figma's client storage.

*   **Parameters**:
    *   `key: string`: The key under which to store the data.
    *   `value: string`: The string value to store. Note that client storage primarily stores strings; complex objects should be serialized (e.g., with `JSON.stringify`) before storing and deserialized after retrieval.
*   **Returns**: `Promise<void>`: A promise that resolves when the data has been successfully stored.
*   **Action**: Calls `figma.clientStorage.setAsync(key, value)`.

## Dependencies

*   **`../../shared/types/messaging.types`**: For the `EventTS` type, which defines the structure and types of messages exchanged between the plugin backend and UI. This shared type is crucial for type-safe communication.
*   **Figma Plugin API**:
    *   `figma.ui.postMessage`: For sending messages to the UI.
    *   `figma.ui.on` and `figma.ui.off`: For listening to messages from the UI.
    *   `figma.clientStorage.getAsync` and `figma.clientStorage.setAsync`: For interacting with persistent plugin storage.

## Usage Context

These utility functions are fundamental for the operation of a Figma plugin that has a UI.

*   `dispatchTS` and `listenTS` form the backbone of communication, allowing the backend logic (e.g., processing a flow diagram, interacting with the Figma document) to send updates or requests to the UI, and for the UI to send user commands or data back to the backend.
*   `getStore` and `setStore` are used for persisting user preferences, plugin state, or any other data that needs to be remembered across plugin sessions or Figma sessions.

This module centralizes common plugin operations, promoting cleaner and more maintainable code in the rest of the `src-code` directory.

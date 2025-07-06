# Module: shared/types/messaging.types.ts

## Purpose and Scope

This module defines the `EventTS` interface, which serves as a contract for messages passed between the IziFlow Figma plugin's UI (frontend) and its core logic (backend running in Figma's sandbox). It specifies the names of possible events and the structure (payload type) of the data associated with each event.

Using a shared type definition like this is crucial for type-safe communication, ensuring that both the sender and receiver of a message agree on the data structure, which helps prevent runtime errors and improves developer experience.

## `EventTS` Interface

This interface maps event names (string keys) to the expected type of their payload.

*   **`'generate-flow': { markdown: string; mode: 'light' | 'dark'; accentColor: string; }`**
    *   **Direction**: Likely UI -> Backend.
    *   **Purpose**: Sent when the user initiates the flow diagram generation process.
    *   **Payload**:
        *   `markdown: string`: The Markdown string input by the user defining the flow.
        *   `mode: 'light' | 'dark'`: The selected theme mode (light or dark) for generating the diagram.
        *   `accentColor: string`: The accent color (likely a HEX string) chosen by the user.

*   **`'generation-success': { message: string; }`**
    *   **Direction**: Likely Backend -> UI.
    *   **Purpose**: Sent by the backend to indicate that the flow diagram has been successfully generated.
    *   **Payload**:
        *   `message: string`: A success message to display to the user.

*   **`'generation-error': { message: string; }`**
    *   **Direction**: Likely Backend -> UI.
    *   **Purpose**: Sent by the backend if a general error occurs during the diagram generation process (but not a parsing error).
    *   **Payload**:
        *   `message: string`: An error message describing what went wrong.

*   **`'parse-error': { message: string; lineNumber?: number; }`**
    *   **Direction**: Likely Backend -> UI.
    *   **Purpose**: Sent by the backend if an error occurs while parsing the user's Markdown input.
    *   **Payload**:
        *   `message: string`: A message detailing the parsing error.
        *   `lineNumber?: number`: An optional line number where the parsing error occurred in the Markdown input, to help the user locate the issue.

*   **`'debug': { message: string; data?: string; }`**
    *   **Direction**: Bidirectional (UI <-> Backend).
    *   **Purpose**: Used for sending debug information between the UI and backend, typically during development.
    *   **Payload**:
        *   `message: string`: The debug message.
        *   `data?: string`: Optional additional data, serialized as a string if complex.

*   **`closePlugin: {}`**
    *   **Direction**: Likely UI -> Backend.
    *   **Purpose**: Sent from the UI to request the plugin to close (e.g., `figma.closePlugin()`).
    *   **Payload**: An empty object, as the event name itself carries the intent.

*   **`'get-history': {}`**
    *   **Direction**: Likely UI -> Backend.
    *   **Purpose**: Sent from the UI to request the Markdown input history from the backend.
    *   **Payload**: An empty object.

*   **`'history-data': { history: string[] }`**
    *   **Direction**: Likely Backend -> UI.
    *   **Purpose**: Sent from the backend to the UI, providing the retrieved Markdown input history.
    *   **Payload**:
        *   `history: string[]`: An array of Markdown strings representing the user's input history.

*   **`'clear-history-request': {}`**
    *   **Direction**: Likely UI -> Backend.
    *   **Purpose**: Sent from the UI to request the backend to clear the Markdown input history.
    *   **Payload**: An empty object.

*   **`'remove-history-entry': { markdown: string }`**
    *   **Direction**: Likely UI -> Backend.
    *   **Purpose**: Sent from the UI to request the backend to remove a specific Markdown entry from the history.
    *   **Payload**:
        *   `markdown: string`: The Markdown string of the history entry to be removed.

*   **`// 'add-history-entry': { markdown: string }; // Note: Plugin adds internally now`**
    *   This commented-out event suggests that previously, the UI might have explicitly requested the backend to add a history entry. The comment indicates this is now handled internally by the plugin backend, likely when a flow is successfully generated or parsed.

## Usage Context

This `EventTS` interface is used in conjunction with messaging utility functions like `dispatchTS` and `listenTS` (defined in `src-code/utils/code-utils.ts` and potentially similar utilities in the UI codebase).

**Example (Backend listening for 'generate-flow'):**
```typescript
// In src-code/code.ts (or similar)
import { listenTS } from './utils/code-utils';
import type { EventTS } from '../shared/types/messaging.types';

listenTS('generate-flow', (payload) => {
  // payload is typed as { markdown: string; mode: 'light' | 'dark'; accentColor: string; }
  console.log("Markdown to generate:", payload.markdown);
  // ... call generation logic ...
});
```

**Example (UI dispatching 'generate-flow'):**
```typescript
// In a UI component (e.g., using React)
// Presuming a dispatchTS function is available in the UI context
// that calls figma.ui.postMessage under the hood.

// dispatchTS('generate-flow', {
//   markdown: "NODE A STEP \"First\"...",
//   mode: "dark",
//   accentColor: "#FF5733"
// });
```

By centralizing event definitions in `EventTS`, the plugin maintains a clear and type-safe communication protocol between its distinct parts, which is essential for robust plugin development.

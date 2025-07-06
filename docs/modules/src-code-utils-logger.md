# Module: src-code/utils/logger.ts

## Purpose and Scope

This module provides a simple `Logger` object with methods for logging messages to the console at different severity levels (info, error, success, debug, warn). Each log message is prefixed with a context string, making it easier to identify the source of the log output during development and debugging of the Figma plugin's backend (`src-code`).

## `Logger` Object

The `Logger` object contains several methods, each corresponding to a different log level or type.

### `Logger.info(context: string, message: any, ...args: any[])`

Logs informational messages.

*   **Parameters**:
    *   `context: string`: A string indicating the module or area of the code where the log originates (e.g., "FramesLib", "Parser").
    *   `message: any`: The main message or data to log.
    *   `...args: any[]`: Additional arguments or data to include in the log output.
*   **Output**: `console.log(`[${context}]`, message, ...args)`
    *   Example: `[Parser] Parsing complete. 5 nodes found.`

### `Logger.error(context: string, message: any, error?: any)`

Logs error messages. Includes a "❌" emoji for quick visual identification.

*   **Parameters**:
    *   `context: string`: The context of the error.
    *   `message: any`: The error message or description.
    *   `error?: any` (optional): An error object or additional error information.
*   **Output**: `console.error(`[${context}] ❌`, message, error || '')`
    *   Example: `[API_CALL] ❌ Failed to fetch user data. { status: 500 }`

### `Logger.success(context: string, message: any)`

Logs success messages. Includes a "✓" emoji.

*   **Parameters**:
    *   `context: string`: The context of the successful operation.
    *   `message: any`: The success message.
*   **Output**: `console.log(`[${context}] ✓`, message)`
    *   Example: `[Theme] ✓ Theme applied successfully.`

### `Logger.debug(context: string, message: any, data?: any)`

Logs debug messages, typically for detailed diagnostic information during development. Includes a "🔍" emoji.

*   **Parameters**:
    *   `context: string`: The context of the debug information.
    *   `message: any`: The debug message.
    *   `data?: any` (optional): Additional data to log (e.g., variable contents).
*   **Output**: `console.debug(`[${context}] 🔍`, message, data || '')`
    *   Example: `[LayoutManager] 🔍 Queue processed. Current queue length: 0`

### `Logger.warn(context: string, message: any, data?: any)`

Logs warning messages. Includes a "⚠️" emoji.

*   **Parameters**:
    *   `context: string`: The context of the warning.
    *   `message: any`: The warning message.
    *   `data?: any` (optional): Additional data related to the warning.
*   **Output**: `console.warn(`[${context}] ⚠️`, message, data || '')`
    *   Example: `[Parser] ⚠️ Optional field 'notes' not found. Proceeding with default.`

## Usage Example

```typescript
// import { Logger } from './logger'; // Assuming usage within a src-code module

// function processUserData(userId: string) {
//   Logger.info("UserProcessing", `Starting to process user: ${userId}`);
//   try {
//     // ... some processing ...
//     if (userId === "unknown") {
//       Logger.warn("UserProcessing", "User ID is 'unknown'. This might lead to issues.", { userId });
//     }
//     // ...
//     Logger.success("UserProcessing", `Successfully processed user: ${userId}`);
//   } catch (e) {
//     Logger.error("UserProcessing", `Error processing user: ${userId}`, e);
//   }
// }

// Logger.debug("MainPlugin", "Plugin initialized with settings:", { theme: "dark", autoSave: true });
```

## Dependencies

*   None, beyond standard JavaScript `console` methods (`console.log`, `console.error`, `console.debug`, `console.warn`).

## Benefits

*   **Consistency**: Provides a uniform way to log messages across the `src-code` part of the plugin.
*   **Clarity**: Prefixes (context string and emojis) make it easier to scan and understand console output.
*   **Filtering**: Some browser developer consoles allow filtering by log level (e.g., hide debug, show only errors), which this logger supports implicitly by using the corresponding `console` methods.
*   **Centralization**: If logging behavior needs to be changed globally (e.g., disable logging in production, send logs to a remote service), modifications can be made in this single module.

This `Logger` utility is a simple but effective tool for improving the development and maintainability of the Figma plugin's backend code.

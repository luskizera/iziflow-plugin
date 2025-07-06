# Module: src-code/utils/historyStorage.ts

## Purpose and Scope

This module provides functions to manage a history of Markdown inputs within the IziFlow Figma plugin. It uses Figma's `clientStorage` to persist this history, allowing users to access previously used Markdown snippets. The history is limited to a maximum number of items, and new entries are added to the top, with duplicates being removed.

The `/// <reference types="@figma/plugin-typings" />` directive indicates usage of Figma plugin API types.

## Constants

*   **`HISTORY_STORAGE_KEY: string`**
    *   Value: `'markdownHistory'`
    *   The key used to store and retrieve the Markdown history from `figma.clientStorage`.
*   **`MAX_HISTORY_ITEMS: number`**
    *   Value: `20`
    *   The maximum number of Markdown strings to keep in the history.

## Main Exported Functions

### `async getHistory(): Promise<string[]>`

Retrieves the Markdown history from client storage.

*   **Returns**: `Promise<string[]>`: A promise that resolves to an array of Markdown strings. If no history is found, the stored data is invalid, or an error occurs, it resolves to an empty array.
*   **Process**:
    1.  Attempts to read data from `figma.clientStorage.getAsync(HISTORY_STORAGE_KEY)`.
    2.  If data is retrieved and is a non-empty string:
        *   Tries to `JSON.parse()` the string.
        *   If parsing is successful and the result is an array where every item is a string, it returns this parsed array.
        *   If parsing fails or the parsed data is not an array of strings, it logs a warning and returns an empty array. (The code includes commented-out lines to optionally clear invalid storage).
    3.  If no data is found or the data is not a string, it returns an empty array.
    4.  Catches any general errors during the process and returns an empty array.
    *   *Note: The provided code contains extensive `console.log` and `console.warn` statements (commented out in the original prompt's view but present in the actual file) for detailed logging of its operations.*

### `async addHistoryEntry(markdownToAdd: string): Promise<void>`

Adds a new Markdown string to the history.

*   **Parameters**:
    *   `markdownToAdd: string`: The Markdown string to add to the history.
*   **Process**:
    1.  Checks if `markdownToAdd` is a non-empty string. If not, it returns early.
    2.  Calls `getHistory()` to retrieve the current history.
    3.  Removes any existing occurrences of `markdownToAdd` from the history to prevent duplicates.
    4.  Adds the new `markdownToAdd` to the beginning of the array (`unshift`).
    5.  If the history length exceeds `MAX_HISTORY_ITEMS`, it truncates the array to the maximum allowed size using `slice(0, MAX_HISTORY_ITEMS)`.
    6.  Serializes the updated history array to a JSON string.
    7.  Saves the JSON string back to `figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, ...)`.
    8.  Catches and logs any errors during the process.

### `async clearHistory(): Promise<void>`

Removes all Markdown history from client storage.

*   **Process**:
    1.  Calls `figma.clientStorage.deleteAsync(HISTORY_STORAGE_KEY)` to remove the history item.
    2.  Catches and logs any errors during the process.

## Dependencies

*   **Figma Plugin API**:
    *   `figma.clientStorage.getAsync()`: To retrieve data.
    *   `figma.clientStorage.setAsync()`: To save data.
    *   `figma.clientStorage.deleteAsync()`: To remove data.

## Usage Context

These functions are likely used by the plugin's UI to:

*   Display a list of recent Markdown inputs to the user.
*   Allow the user to select a past entry to reuse.
*   Automatically save new valid Markdown inputs submitted by the user to the history.
*   Provide an option to clear the history.

This module enhances user experience by providing quick access to previously used flow definitions, saving time and effort. The logging included (though commented out in the visible snippet) would be very helpful during development and debugging.

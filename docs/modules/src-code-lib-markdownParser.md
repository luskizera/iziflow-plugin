# Module: src-code/lib/markdownParser.ts

## Purpose and Scope

This module is responsible for parsing a custom Markdown-like syntax into a structured representation of a flow diagram, consisting of nodes and connections. This structured data can then be used by other parts of the IziFlow plugin to generate the visual diagram in Figma.

The `/// <reference types="@figma/plugin-typings" />` directive indicates potential usage of Figma plugin API types, though it's not directly used in this file's exports.

## Core Function: `parseMarkdownToFlow`

### `async parseMarkdownToFlow(markdown: string): Promise<{ nodes: FlowNode[], connections: Connection[] }>`

This is the main exported function that takes a string of Markdown-like text and converts it into an object containing arrays of `FlowNode` and `Connection` objects.

*   **Parameters**:
    *   `markdown: string`: The input string containing the flow definition in the custom Markdown syntax.
*   **Returns**: `Promise<{ nodes: FlowNode[], connections: Connection[] }>`: An object containing:
    *   `nodes: FlowNode[]`: An array of parsed flow nodes.
    *   `connections: Connection[]`: An array of parsed connections between nodes.
*   **Process**:
    1.  Splits the input `markdown` string into individual lines.
    2.  Initializes a `ParserState` object (`state`) to keep track of parsed nodes, connections, the current node being processed, and the line number.
    3.  Initializes a `nodeMap` to store parsed nodes by their ID for quick lookup and validation.
    4.  Iterates through each line of the Markdown:
        *   Increments `lineNumber`.
        *   Calls `cleanLine()` to remove comments (`#...`) and trim whitespace.
        *   If the cleaned line is empty, it resets `state.currentNodeId` (indicating that subsequent indented lines like `META` or `DESC` are not associated with a node until a new `NODE` line appears) and continues to the next line.
        *   It then attempts to parse the line using a series of helper functions in order:
            *   `parseNodeLine()`: Tries to parse a `NODE` definition.
            *   `parseMetaLine()`: Tries to parse a `META` definition (indented).
            *   `parseDescLine()`: Tries to parse a `DESC` definition (indented).
            *   `parseConnLine()`: Tries to parse a `CONN` definition.
        *   If none of these functions successfully parse the line, it throws a "Sintaxe inválida ou desconhecida" error.
        *   Any error caught during parsing is augmented with the line number and original line content for better debugging.
    5.  **Final Validation**: After processing all lines, it iterates through the parsed `state.connections` to ensure that both `from` and `to` nodes for each connection exist in the `nodeMap`. If not, it throws an error.
    6.  Returns the accumulated `nodes` and `connections`.

## Internal `ParserState` Type

```typescript
type ParserState = {
    nodes: FlowNode[];
    connections: Connection[];
    currentNodeId: string | null; // ID of the most recently defined NODE
    lineNumber: number;
};
```

## Helper Functions

### `cleanLine(rawLine: string): string`

*   Removes any content from the first `#` character onwards (comments).
*   Trims leading/trailing whitespace from the line.

### `parseNodeLine(line: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean`

Parses lines defining nodes.

*   **Regex**: `^NODE\s+(\S+)\s+(START|END|STEP|DECISION|ENTRYPOINT)\s+"([^"]+)"$/i`
    *   Matches lines like: `NODE node1 STEP "This is the first step"`
*   **Logic**:
    *   If matched, extracts `id`, `type` (converted to uppercase), and `name`.
    *   Checks for duplicate node IDs in `nodeMap`.
    *   Creates a new `FlowNode` object (initializing `metadata` and `description.fields`).
    *   Adds the new node to `state.nodes` and `nodeMap`.
    *   Sets `state.currentNodeId` to the ID of this new node.
    *   Returns `true` if successful.

### `parseMetaLine(rawLine: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean`

Parses lines defining metadata for the current node. These lines must be indented.

*   **Regex**: `^META\s+(\S+):\s*(.*)$/i`
    *   Matches lines like: `  META author: "John Doe"` (after indentation check and cleaning)
*   **Logic**:
    *   Checks for indentation. If not indented (indent === 0), returns `false`.
    *   Cleans the line *after* checking indentation.
    *   If matched and `state.currentNodeId` is set:
        *   Extracts `key` and `value`.
        *   Adds the `key: value` pair to the `metadata` object of the current node in `nodeMap`.
    *   Throws an error if `META` is defined without a preceding `NODE`.
    *   Returns `true` if successful.

### `parseDescLine(rawLine: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean`

Parses lines defining description fields for the current node. These lines must be indented.

*   **Regex**: `^DESC\s+([^:]+):\s*(.*)$/i`
    *   Matches lines like: `  DESC Action: "User clicks the button"` (after indentation check and cleaning)
*   **Logic**:
    *   Checks for indentation. If not indented, returns `false`.
    *   Cleans the line *after* checking indentation.
    *   If matched and `state.currentNodeId` is set:
        *   Extracts `label` and `content`.
        *   Pushes a new `{ label: label.trim(), content: content }` object to the `description.fields` array of the current node in `nodeMap`. The `content` is preserved as captured to maintain internal spacing.
    *   Throws an error if `DESC` is defined without a preceding `NODE`.
    *   Returns `true` if successful.

### `parseConnLine(line: string, state: ParserState): boolean`

Parses lines defining connections between nodes.

*   **Regex**: `^CONN\s+(\S+)\s*->\s*(\S+)\s+"([^"]*)"(\s+\[SECONDARY\])?$/i`
    *   Matches lines like: `CONN node1 -> node2 "User proceeds"`
    *   Also matches: `CONN node2 -> node3 "Error path" [SECONDARY]`
*   **Logic**:
    *   The input `line` is already cleaned (comments removed, trimmed).
    *   If matched, extracts `from` ID, `to` ID, `conditionLabel` (trimmed), and an optional `secondaryFlag`.
    *   Pushes a new `Connection` object to `state.connections`.
    *   Sets `state.currentNodeId` to `null` because connections typically end a node definition block.
    *   Returns `true` if successful.

## Markdown Syntax Rules (Inferred)

1.  **Node Definition**:
    `NODE <id> <TYPE> "<name>"`
    *   `TYPE` can be `START`, `END`, `STEP`, `DECISION`, `ENTRYPOINT` (case-insensitive).
    *   `<id>` must be unique.
    *   `<name>` is enclosed in double quotes.
2.  **Metadata (Indented)**:
    `  META <key>: <value>`
    *   Must follow a `NODE` line and be indented (any amount of leading whitespace).
    *   Applies to the most recent `NODE`.
3.  **Description Fields (Indented)**:
    `  DESC <label>: <content>`
    *   Must follow a `NODE` line and be indented.
    *   Applies to the most recent `NODE`.
    *   `<label>` is the part before the first colon.
    *   `<content>` is everything after the first colon.
4.  **Connection Definition**:
    `CONN <from_id> -> <to_id> "<condition_label>" [SECONDARY]`
    *   `"<condition_label>"` can be empty (`""`).
    *   `[SECONDARY]` is an optional flag to mark the connection as secondary.
5.  **Comments**: Lines or parts of lines starting with `#` are ignored.
6.  **Blank Lines**: Used to separate node definition blocks. A blank line resets the `currentNodeId`, so subsequent `META` or `DESC` lines would be invalid until a new `NODE` is defined.

## Dependencies

*   **`@shared/types/flow.types`**: For `FlowNode`, `Connection`, `DescriptionField`, `NodeData` (though `NodeData` isn't directly used as a type for a variable in this file, `FlowNode` aligns with parts of it).

This parser provides the foundational step for IziFlow by converting a human-readable text format into a machine-understandable graph structure. Robust error handling with line numbers helps users debug their Markdown syntax.

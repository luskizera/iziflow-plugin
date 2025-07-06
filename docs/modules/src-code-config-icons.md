# Module: src-code/config/icons.ts

## Purpose and Scope

This module is responsible for managing and providing SVG icon strings for different types of nodes used within the IziFlow Figma plugin. It imports SVG file contents as raw strings and maps them to node types, allowing the plugin to dynamically retrieve the appropriate icon for rendering on the Figma canvas.

This configuration is specifically for the Figma plugin's backend (`src-code`), which handles the generation of visual elements in Figma.

## SVG Imports

The module imports SVG files as raw string data using Vite's `?raw` suffix. This means the actual SVG markup is loaded as a string variable.

*   `entrypointIconSvgString`: Contains the SVG string for "entrypoint" nodes.
    *   Source: `../assets/icons/entrypoint.svg`
*   `stepIconSvgString`: Contains the SVG string for "step" nodes.
    *   Source: `../assets/icons/step.svg`
*   `decisionIconSvgString`: Contains the SVG string for "decision" nodes.
    *   Source: `../assets/icons/decision.svg`

## Main Data Structures

### `nodeTypeToSvgMap: Record<string, string | undefined>`

A private record (JavaScript object) that maps node type strings (in uppercase) to their corresponding SVG string content.

*   **Keys**: Node types (e.g., `"ENTRYPOINT"`, `"STEP"`, `"DECISION"`). These are expected to be in uppercase to match `nodeData.type` (presumably from elsewhere in the plugin logic).
*   **Values**: The raw SVG string for the icon, or `undefined` if no icon is mapped for that type.
*   **Note**: The current mapping explicitly omits icons for "START" and "END" node types.

```typescript
const nodeTypeToSvgMap: Record<string, string | undefined> = {
    ENTRYPOINT: entrypointIconSvgString,
    STEP: stepIconSvgString,
    DECISION: decisionIconSvgString,
    // START and END do not have icons defined in this map
};
```

## Main Exported Functions

### `getIconSvgStringForNodeType(nodeType: string): string | undefined`

This function retrieves the SVG string for a given node type.

*   **Purpose**: To provide a centralized way to access icon SVG data based on a node's type.
*   **Parameters**:
    *   `nodeType: string`: The type of the node (e.g., `"STEP"`, `"decision"`, `"Entrypoint"`). The function internally converts this to uppercase for a case-insensitive lookup in `nodeTypeToSvgMap`.
*   **Returns**: `string | undefined`
    *   The raw SVG string if an icon is mapped for the specified `nodeType`.
    *   `undefined` if no icon is found for that type (e.g., for "START", "END", or an unrecognized type).
*   **Usage**:
    ```typescript
    // Example (within src-code part of the plugin)
    // import { getIconSvgStringForNodeType } from './config/icons';

    // const stepIcon = getIconSvgStringForNodeType("STEP");
    // if (stepIcon) {
    //   // Logic to use the SVG string, e.g., create a Figma node with this SVG
    // }

    // const startIcon = getIconSvgStringForNodeType("START"); // Would return undefined
    ```

## Relationships with Other Modules

*   **`../assets/icons/`**: This module directly depends on the SVG files located in this directory. Changes to these files (content or naming) will affect the icons used by the plugin.
*   **Node Creation Logic (e.g., in `src-code/lib/frames.ts` or similar)**: Other parts of the Figma plugin code that are responsible for creating visual representations of nodes will likely use `getIconSvgStringForNodeType` to fetch the appropriate icon SVG to embed within Figma frames or shapes.
*   **Vite Build Process**: The `?raw` import syntax is a Vite-specific feature that processes these SVG files as string assets during the build.

This configuration module plays a crucial role in the visual representation of different node types in the generated IziFlow diagrams by providing easy access to their associated icon graphics.

# Module: src-code/config/styles.config.ts

## Purpose and Scope

This module defines configuration constants for non-color visual styles used when generating IziFlow diagrams in Figma. It covers aspects like font families, font sizes, stroke weights, corner radii, and dash patterns for various elements such as nodes, connectors, and labels (chips). Color-related styles are managed separately by `theme.config.ts`.

This configuration is crucial for the Figma plugin's backend (`src-code`) to ensure consistent visual styling of the generated flow diagrams. The `/// <reference types="@figma/plugin-typings" />` directive indicates that this file uses types from the Figma plugin API (e.g., `FontName`, `ConnectorStrokeCap`).

## Main Configuration Objects

### `Connectors` Object

Defines non-color styling attributes for connectors.

*   **`PRIMARY`**: Styles for primary path connectors.
    *   `STROKE_WEIGHT: number`: `1` - Thickness of the connector line.
    *   `DASH_PATTERN: number[]`: `[]` - An empty array signifies a solid line.
    *   `END_CAP: ConnectorStrokeCap`: `"ARROW_LINES"` - Specifies the type of arrowhead.
*   **`SECONDARY`**: Styles for secondary path connectors.
    *   `STROKE_WEIGHT: number`: `1` - Thickness of the connector line.
    *   `DASH_PATTERN: number[]`: `[4, 4]` - A dashed line pattern (4 units on, 4 units off).
    *   `END_CAP: ConnectorStrokeCap`: `"ARROW_LINES"` - Specifies the type of arrowhead.

### `Labels` Object

Defines non-color styling for labels, often rendered as "chips" on or near nodes. This seems to correspond to `chipsNode` and `nodeTypeChip` mentioned in comments, likely referring to elements described in a `nodeLayout.md` document.

*   **`DESC_CHIP_PADDING_HORIZONTAL: number`**: `6` - Horizontal padding for description chips.
*   **`DESC_CHIP_PADDING_VERTICAL: number`**: `1` - Vertical padding for description chips.
*   **`DESC_CHIP_CORNER_RADIUS: number`**: `4` - Corner radius for description chips.
*   **`DESC_CHIP_FONT_SIZE: number`**: `12` - Font size for text in description chips.
*   **`DESC_CHIP_ITEM_SPACING: number`**: `4` - Spacing within a description chip (e.g., between an icon and text, though comments note it might not have an icon).
*   **`TYPE_CHIP_PADDING_HORIZONTAL: number`**: `8` - Horizontal padding for node type chips.
*   **`TYPE_CHIP_PADDING_VERTICAL: number`**: `4` - Vertical padding for node type chips.
*   **`TYPE_CHIP_CORNER_RADIUS: number`**: `6` - Corner radius for node type chips.
*   **`TYPE_CHIP_FONT_SIZE: number`**: `14` - Font size for text in node type chips.
*   **`TYPE_CHIP_ITEM_SPACING: number`**: `8` - Spacing within a node type chip (e.g., between an icon and text).
*   **`FONT: FontName`**: `{ family: "Inter", style: "Medium" }` - Common font for all chips.

### `Nodes` Object

Defines non-color styling attributes for different parts of various node types.

*   **`START_END`**: Styles for "Start" and "End" nodes.
    *   `CORNER_RADIUS: number`: `100` - Large radius, likely to make a 150x150px square frame appear as a circle.
    *   `FONT: FontName`: `{ family: "Inter", style: "Medium" }` - Font for text within these nodes.
    *   `FONT_SIZE: number`: `30` - Font size for text.
    *   `SIZE: number`: `150` - Fixed width and height for these nodes.
*   **`DECISION`**: Styles for the main frame of "Decision" nodes.
    *   `CORNER_RADIUS: number`: `8`.
    *   *Padding and Item Spacing are noted to be defined directly in creation functions.*
*   **`STEP_ENTRYPOINT`**: Common styles for main frames of "Step" and "Entrypoint" nodes.
    *   `CORNER_RADIUS: number`: `8`.
    *   `WIDTH: number`: `400` - Fixed width.
    *   *Padding and Item Spacing are noted to be defined directly in creation functions.*
*   **`TITLE_BLOCK`**: Styles for the title area within nodes (e.g., `nodeTitle`).
    *   `FONT: FontName`: `{ family: "Inter", style: "Regular" }` - Font for the node's name/title.
    *   `FONT_SIZE: number`: `24` - Font size for the node's name/title.
    *   *Fill, Stroke, Padding, and Item Spacing are noted as "none" or defined directly in creation functions.*
*   **`DESCRIPTION_BLOCK`**: Styles for the description container within nodes (e.g., `descBlock`).
    *   *Fill, Stroke, Padding, and Item Spacing are noted as "none" or defined directly in creation functions.*
*   **`DESCRIPTION_ITEM`**: Styles for individual description items within the `DESCRIPTION_BLOCK`.
    *   `CONTENT_FONT: FontName`: `{ family: "Inter", style: "Regular" }` - Font for the description content.
    *   `CONTENT_FONT_SIZE: number`: `16` - Font size for the description content.
    *   *Fill, Stroke, Padding, and Item Spacing are noted as "none" or defined directly in creation functions.*
*   **`DIVIDER`**: Styles for visual dividers within nodes.
    *   *Fill, Stroke, Padding, and Item Spacing are noted as "none" or defined directly in creation functions.*

### `FontsToLoad: FontName[]`

An array listing all `FontName` objects that the Figma plugin needs to explicitly load using `figma.loadFontAsync()` before they can be used to render text on the canvas.

*   Includes:
    *   `{ family: "Inter", style: "Regular" }`
    *   `{ family: "Inter", style: "Medium" }`
    *   `{ family: "Inter", style: "Semi Bold" }` (if used)
    *   `{ family: "Inter", style: "Bold" }` (if used, though comments suggest "START/END" now uses "Medium")

## Usage

These style configurations are imported and utilized by the parts of `src-code` that programmatically create and style Figma layers (frames, text nodes, connectors, etc.). For instance, when creating a "STEP" node, the logic would refer to `Nodes.STEP_ENTRYPOINT.CORNER_RADIUS`, `Nodes.STEP_ENTRYPOINT.WIDTH`, and use fonts from `FontsToLoad`.

```typescript
// Hypothetical usage within src-code/lib/frames.ts or similar

// import { Nodes, Labels, FontsToLoad } from '../config/styles.config';
// import { figma } from '@figma/plugin-typings'; // For figma global

// async function createStepNode(title: string, description: string) {
//   await Promise.all(FontsToLoad.map(font => figma.loadFontAsync(font)));

//   const frame = figma.createFrame();
//   frame.name = "Step Node";
//   frame.cornerRadius = Nodes.STEP_ENTRYPOINT.CORNER_RADIUS;
//   frame.resize(Nodes.STEP_ENTRYPOINT.WIDTH, 100); // Height might be dynamic

//   const titleText = figma.createText();
//   titleText.fontName = Nodes.TITLE_BLOCK.FONT;
//   titleText.fontSize = Nodes.TITLE_BLOCK.FONT_SIZE;
//   titleText.characters = title;
//   frame.appendChild(titleText);

//   // ... similar logic for description, chips, etc. ...
//   return frame;
// }
```

## Relationships with Other Modules

*   **`@figma/plugin-typings`**: Provides types like `FontName` and `ConnectorStrokeCap`.
*   **`src-code/config/theme.config.ts`**: Complements this file by managing color-related styles. This `styles.config.ts` explicitly defers color definitions to the theme configuration.
*   **Node and Connector Creation Logic (e.g., `src-code/lib/frames.ts`, `src-code/lib/connectors.ts`)**: These modules are the primary consumers of the style constants defined here. They use these values to set properties on Figma objects.
*   **Figma Plugin API**: The values (e.g., for `fontName`, `cornerRadius`, `strokeWeight`, `strokeCap`) directly map to properties of Figma `Node` objects. The fonts listed in `FontsToLoad` are critical for `figma.loadFontAsync()` calls.

This configuration file is essential for maintaining a consistent visual language (excluding colors) across all elements of the IziFlow diagrams and simplifies updates to these stylistic aspects.

# Module: src-code/lib/frames.ts

## Purpose and Scope

This module is responsible for creating the visual representation of various types of flow nodes (Start, End, Decision, Step, Entrypoint) as Figma frames. It constructs these frames with internal elements like titles, descriptions, and chips, applying styles (padding, spacing, corner radius) from `StyleConfig` and colors from the `finalColors` (resolved theme colors).

The `/// <reference types="@figma/plugin-typings" />` directive indicates usage of Figma plugin API types.

## Namespace: `Frames`

This namespace groups all the exported functions for creating different node frames.

### Main Exported Functions

Each function creates a specific type of node frame:

*   **`createStartNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   Creates a circular "Start" node with fixed text "Start".
    *   Uses styles from `StyleConfig.Nodes.START_END`.
    *   Applies fill and text colors using tokens like `node_startend_start-fill` and `node_startend_border` from `finalColors`.
*   **`createEndNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   Creates a circular "End" node with fixed text "End".
    *   Similar styling and color application to `createStartNode`, using tokens like `node_startend_end-fill`.
*   **`createDecisionNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   Creates a rectangular "Decision" node.
    *   Includes a title section (node type chip + node name).
    *   Optionally includes a description block if `nodeData.description.fields` exist.
    *   A divider is added between title and description if both are present.
    *   Uses styles from `StyleConfig.Nodes.DECISION` and `StyleConfig.Nodes.STEP_ENTRYPOINT` (for width).
    *   Applies colors using tokens like `decision_fill`, `decision_border`.
*   **`createStepNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   Creates a rectangular "Step" node.
    *   Structure (title, optional description, divider) is similar to `createDecisionNode`.
    *   Uses styles from `StyleConfig.Nodes.STEP_ENTRYPOINT`.
    *   Applies colors using tokens like `step_fill`, `step_border`.
*   **`createEntrypointNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   Creates a rectangular "Entrypoint" node.
    *   Structure is similar to `createStepNode`.
    *   Uses styles from `StyleConfig.Nodes.STEP_ENTRYPOINT`.
    *   Applies colors using tokens like `entrypoints_fill`, `entrypoints_border` (note the plural "entrypoints" for token lookup, matching `theme.config.ts`).

## Internal Helper Functions

These functions are used internally by the main exported functions to create common parts of the node frames.

*   **`_createChip(text: string, chipType: 'NodeType' | 'DescLabel', variant: ChipVariant, finalColors: Record<string, RGB>, iconSvgString?: string): Promise<FrameNode>`**
    *   A generic function to create a "chip" (a small, pill-shaped frame with text and an optional icon).
    *   **Parameters**:
        *   `text`: Text to display in the chip.
        *   `chipType`: `'NodeType'` (for Step, Decision, Entrypoint) or `'DescLabel'` (for description item labels like Action, Input).
        *   `variant`: `ChipVariant` (e.g., 'Step', 'Decision', 'Error', 'Success') which determines styling and token lookup.
        *   `finalColors`: Resolved theme colors.
        *   `iconSvgString`: Optional SVG string for an icon (used for `NodeType` chips).
    *   **Process**:
        *   Sets up Auto Layout (Horizontal, HUG/HUG).
        *   Applies padding, corner radius, item spacing, and font size based on `chipType` from `StyleConfig.Labels`.
        *   Determines fill, text, and icon color tokens based on `chipType` and `variant`. For `NodeType` chips, it uses prefixes like `step_`, `decision_`, or `entrypoints_`. For `DescLabel` chips, it uses prefixes like `chips_error_`, `chips_success_`.
        *   Applies fill and text colors from `finalColors`, with fallbacks.
        *   If an `iconSvgString` and icon color token are provided for `NodeType` chips, it creates an icon from the SVG, attempts to color it, and appends it.
        *   Creates and appends a `TextNode` with the given `text`.
*   **`_createNodeTypeChip(type: NodeTypeVariant, finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   A specialized function that calls `_createChip` to create the chip indicating the node's type (e.g., "STEP", "DECISION").
    *   Retrieves the appropriate icon SVG using `getIconSvgStringForNodeType()`.
*   **`_createDescLabelChip(label: string, finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   Creates a chip for a description item's label (e.g., "ACTION", "INPUTS", "ERROR").
    *   Normalizes the input `label` to identify a `DescChipVariant` (e.g., 'Action', 'Input', 'Error', 'Success', 'Info', 'Default').
    *   Defines a standardized display text for the chip based on the variant (e.g., "action" label becomes "ACTION" chip).
    *   Calls `_createChip` with the standardized text and determined variant.
*   **`_createNodeTitleFrame(nodeData: NodeData, finalColors: Record<string, RGB>, type: NodeTypeVariant): Promise<FrameNode>`**
    *   Creates a frame containing the node type chip and the node's name/title.
    *   Uses Auto Layout (Vertical, HUG/FILL).
    *   Appends the result of `_createNodeTypeChip()`.
    *   Creates a `TextNode` for `nodeData.name`, styled using `StyleConfig.Nodes.TITLE_BLOCK`.
    *   Applies text color using appropriate tokens (e.g., `decision_title-text`, `entrypoints_title-text`).
*   **`_createDescItemFrame(field: DescriptionField, finalColors: Record<string, RGB>, parentType: NodeTypeVariant): Promise<FrameNode | null>`**
    *   Creates a frame for a single item in the description block (label chip + content text).
    *   Uses Auto Layout (Horizontal, FILL/HUG).
    *   Appends the result of `_createDescLabelChip()` for the `field.label`. The label chip is set to `layoutGrow = 1` to take available space.
    *   Creates a `TextNode` for `field.content`, handling array or object content by joining/formatting. Replaces `\\n` with actual newlines.
    *   Content text is styled using `StyleConfig.Nodes.DESCRIPTION_ITEM` and given a fixed width.
    *   Applies text color using appropriate tokens (e.g., `entrypoints_desc-text`, with fallback to `step_desc-text`).
    *   Returns `null` if the `field.label` is empty.
*   **`_createDescBlockFrame(descriptionFields: DescriptionField[], finalColors: Record<string, RGB>, parentType: NodeTypeVariant): Promise<FrameNode | null>`**
    *   Creates a container frame for all description items.
    *   Uses Auto Layout (Vertical, HUG/FILL).
    *   Iterates through `descriptionFields`, creating and appending an item frame for each using `_createDescItemFrame()`.
    *   Returns `null` if no valid description items were added.
*   **`_createDivider(finalColors: Record<string, RGB>): Promise<FrameNode>`**
    *   Creates a simple horizontal line used as a visual separator within nodes.
    *   Consists of a container frame and a `LineNode`.
    *   Line color is taken from `finalColors['divider_line']`.

## Internal Types

*   **`DescChipVariant`**: Union type for description chip variants (`'Default' | 'Error' | ...`).
*   **`NodeTypeVariant`**: Union type for node type chip variants (`'Step' | 'Decision' | 'Entrypoint'`).
*   **`ChipVariant`**: Combined type (`DescChipVariant | NodeTypeVariant`).

## Key Dependencies

*   **`@shared/types/flow.types`**: For `NodeData` and `DescriptionField` types.
*   **`../config/theme.config`**: For `RGB` type, consuming `finalColors`, and referencing `semanticTokenDefinitions` for token key structure.
*   **`../config/styles.config` (`StyleConfig`)**: For non-color styling properties (fonts, sizes, radii, padding, item spacing).
*   **`../utils/nodeCache`**: For loading fonts (`figma.loadFontAsync`).
*   **`../config/icons`**: For `getIconSvgStringForNodeType()` to fetch SVG strings for node type chips.
*   **Figma Plugin API**: Extensively used for creating `FrameNode`, `TextNode`, `LineNode`, `figma.createNodeFromSvg()`, and setting their various layout and style properties.

This module is central to the visual generation of flow nodes, translating structured `NodeData` and theme configurations into complex, styled Figma frames with Auto Layout. It handles the assembly of various sub-elements (chips, text blocks, icons, dividers) to construct the final appearance of each node type.

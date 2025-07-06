# Module: src-code/config/layout.config.ts

## Purpose and Scope

This module defines configuration constants related to the layout of nodes and connectors within the IziFlow diagrams generated in Figma. These settings control aspects like spacing between nodes, the type of connector lines, and where connectors attach to nodes (magnets).

This configuration is specifically for the Figma plugin's backend (`src-code`), which handles the automated arrangement of visual elements on the Figma canvas.
The `/// <reference types="@figma/plugin-typings" />` directive indicates that this file uses types from the Figma plugin API.

## Main Configuration Objects

### `Connectors` Object

This object contains settings that dictate how connectors (lines between nodes) are drawn and positioned.

*   **`DEFAULT_PRIMARY_START_MAGNET: ConnectorMagnet` (string)**
    *   Value: `"RIGHT"`
    *   Default magnet point on the starting node for primary path connectors. (e.g., the main "yes" path from a decision).
*   **`DEFAULT_SECONDARY_START_MAGNET: ConnectorMagnet` (string)**
    *   Value: `"BOTTOM"`
    *   Default magnet point on the starting node for secondary path connectors (e.g., the "no" path from a decision, or alternative paths).
*   **`DEFAULT_END_MAGNET: ConnectorMagnet` (string)**
    *   Value: `"LEFT"`
    *   Default magnet point on the ending node where connectors attach.
*   **`DEFAULT_PRIMARY_LINE_TYPE: ConnectorLineType` (string)**
    *   Value: `"ELBOWED"`
    *   Default line type for primary path connectors (e.g., right-angled lines).
*   **`DEFAULT_SECONDARY_LINE_TYPE: ConnectorLineType` (string)**
    *   Value: `"ELBOWED"`
    *   Default line type for secondary path connectors.
*   **`DECISION_PRIMARY_LINE_TYPE: ConnectorLineType` (string)**
    *   Value: `"ELBOWED"`
    *   Specific line type for primary connectors originating from "Decision" nodes.
*   **`DECISION_SECONDARY_LINE_TYPE: ConnectorLineType` (string)**
    *   Value: `"ELBOWED"`
    *   Specific line type for secondary connectors originating from "Decision" nodes.
*   **`DECISION_PRIMARY_MAGNET_SEQUENCE: ConnectorMagnet[]` (string[])**
    *   Value: `["TOP", "RIGHT", "BOTTOM"]`
    *   An ordered sequence of preferred magnet points on a "Decision" node for its primary outgoing connectors. The layout algorithm might try these in order.
*   **`DECISION_SECONDARY_START_MAGNET: ConnectorMagnet` (string)**
    *   Value: `"BOTTOM"`
    *   Specific starting magnet for secondary paths from "Decision" nodes.
*   **`CONVERGENCE_PRIMARY_LINE_TYPE: ConnectorLineType` (string)**
    *   Value: `"ELBOWED"`
    *   Line type for connectors that converge (e.g., multiple paths leading to a single node).
*   **`LABEL_OFFSET_NEAR_START: number`**
    *   Value: `45`
    *   Offset distance (likely in pixels) from the start of a connector for placing its label.
*   **`LABEL_OFFSET_MID_LINE_Y: number`**
    *   Value: `10`
    *   Vertical offset (likely in pixels) for placing labels that are positioned in the middle of a connector line.

**Note on Types**: The comments `// Removido 'as ConnectorMagnet'` and `// Removido 'as ConnectorLineType'` suggest that previous versions might have used type assertions. The current version relies on the Figma API expecting specific string literals (e.g., `"RIGHT"`, `"ELBOWED"`), and the types are inferred as strings. `ConnectorMagnet` and `ConnectorLineType` would typically be string literal types defined in `@figma/plugin-typings`.

### `Nodes` Object

This object contains settings related to the spacing and arrangement of nodes.

*   **`HORIZONTAL_SPACING: number`**
    *   Value: `300`
    *   The horizontal distance (likely in pixels) to maintain between nodes in the layout.
*   **`VERTICAL_SPACING: number`**
    *   Value: `0`
    *   The vertical distance (likely in pixels) to maintain between nodes. A value of `0` suggests that vertical spacing might be handled differently, perhaps by aligning nodes to a common vertical axis or based on connector routing rather than a fixed gap.

## Usage

These configuration constants are intended to be imported and used by the layout algorithms and node/connector creation logic within the `src-code` part of the IziFlow plugin. For example, when the plugin calculates the position for a new node or determines how to draw a connector, it would refer to these values.

```typescript
// Hypothetical usage within src-code/lib/layout.ts or similar

// import { Connectors, Nodes } from '../config/layout.config';

// function calculateNextNodePosition(currentNode: SceneNode, nextNodeType: string) {
//   const x = currentNode.x + currentNode.width + Nodes.HORIZONTAL_SPACING;
//   const y = currentNode.y + Nodes.VERTICAL_SPACING; // Though 0, illustrates usage
//   return { x, y };
// }

// function createFlowConnector(startNode: SceneNode, endNode: SceneNode, isPrimary: boolean) {
//   const connector = figma.createConnector();
//   connector.connectorLineType = isPrimary ? Connectors.DEFAULT_PRIMARY_LINE_TYPE : Connectors.DEFAULT_SECONDARY_LINE_TYPE;
//   connector.connectorStart = {
//       endpointNodeId: startNode.id,
//       magnet: isPrimary ? Connectors.DEFAULT_PRIMARY_START_MAGNET : Connectors.DEFAULT_SECONDARY_START_MAGNET
//   };
//   connector.connectorEnd = {
//       endpointNodeId: endNode.id,
//       magnet: Connectors.DEFAULT_END_MAGNET
//   };
//   // ... other connector setup ...
//   return connector;
// }
```

## Relationships with Other Modules

*   **`@figma/plugin-typings`**: Provides the types for Figma-specific properties like `ConnectorMagnet` and `ConnectorLineType` (even if not explicitly cast, the values must conform to these API expectations).
*   **`src-code/lib/layout.ts` (or similar layout engine)**: This is the primary consumer of `layout.config.ts`. The layout engine uses these constants to determine how to arrange nodes and route connectors.
*   **`src-code/lib/connectors.ts` (or similar connector creation logic)**: Functions responsible for creating Figma connector objects will use the `Connectors` configuration.
*   **Figma Plugin API**: The values defined (especially for magnets and line types) directly correspond to properties and accepted values in the Figma Plugin API for creating and styling connectors.

This configuration file centralizes layout-related "magic numbers" and settings, making it easier to adjust the visual appearance and arrangement of IziFlow diagrams without modifying the core layout logic.

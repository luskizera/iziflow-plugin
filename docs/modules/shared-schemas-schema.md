# Module: shared/schemas/schema.ts

## Purpose and Scope

This module defines data validation schemas using the [Zod](https://zod.dev/) library. These schemas are used to validate the structure and types of data related to flow diagrams, particularly `FlowNode`, `Connection`, and the overall `Flow` or `FlowData` structure. Being in the `shared/` directory suggests these schemas are used by both the plugin's UI (`src/`) and its backend (`src-code/`) to ensure data consistency.

## Main Exported Schemas

### `DescriptionFieldSchema`

Defines the schema for a single field within a node's description.

*   **Structure**: `z.object`
    *   `label: z.string()`: The label for the description field (required string).
    *   `content: z.union([...])`: The content of the field. It can be:
        *   `z.string()`: A simple string.
        *   `z.array(z.string())`: An array of strings.
        *   `z.record(z.string())`: A simple key-value object where values are strings.
    *   `.passthrough()`: Allows other undefined fields to exist on the object without causing a validation error.

### `FlowNodeSchema`

Defines the schema for a single node in the flow diagram.

*   **Structure**: `z.object`
    *   `id: z.string()`: The unique identifier for the node (required string).
    *   `type: z.enum(["START", "END", "STEP", "DECISION", "ENTRYPOINT"])`: The type of the node, restricted to the specified enum values (required).
    *   `name: z.string()`: The display name of the node (required string).
    *   `metadata: z.object(...).passthrough().optional()`: An optional object for metadata.
        *   `category: z.string().optional()`
        *   `createdBy: z.string().optional()`
        *   `.passthrough()`: Allows other fields within `metadata`.
    *   `description: z.object(...).passthrough().optional()`: An optional object for the node's description.
        *   `fields: z.array(DescriptionFieldSchema)`: An array of description fields, validated by `DescriptionFieldSchema`.
        *   `.passthrough()`: Allows other fields within `description`.

### `ConnectionSchema`

Defines the schema for a connection between two nodes.

*   **Structure**: `z.object`
    *   `id: z.string().optional()`: An optional unique identifier for the connection.
    *   `from: z.string()`: The ID of the source node (required string).
    *   `to: z.string()`: The ID of the target node (required string).
    *   `condition: z.string().optional()`: An optional condition string (legacy or alternative to `conditionLabel`).
    *   `conditionLabel: z.string().optional()`: An optional label for the condition, typically displayed on the connector.
    *   `secondary: z.boolean().optional()`: An optional boolean flag indicating if this is a secondary path.

### `FlowSchema`

Defines the schema for a complete flow, containing nodes and connections. This is typically used when `FlowDataSchema` has a `flows` array.

*   **Structure**: `z.object`
    *   `flowName: z.string().optional()`: An optional name for the flow.
    *   `nodes: z.array(FlowNodeSchema)`: An array of nodes, each validated by `FlowNodeSchema` (required).
    *   `connections: z.array(ConnectionSchema)`: An array of connections, each validated by `ConnectionSchema` (required).

### `FlowDataSchema`

Defines the schema for the top-level data structure that can represent either a single flow or multiple flows. This is likely the main schema used for validating input data for the plugin.

*   **Structure**: `z.object`
    *   `flowName: z.string().optional()`: Optional name if the root object represents a single flow.
    *   `nodes: z.array(FlowNodeSchema).optional()`: Optional array of nodes if the root represents a single flow.
    *   `connections: z.array(ConnectionSchema).optional()`: Optional array of connections if the root represents a single flow.
    *   `flows: z.array(FlowSchema).optional()`: Optional array of flow objects, each validated by `FlowSchema`.
*   **Refinement (`.refine(...)`)**:
    *   Adds a custom validation rule: the input data must either have a `flows` array, OR it must have both `nodes` and `connections` arrays at the root level.
    *   If this condition isn't met, it provides a custom error message.

## Dependencies

*   **`zod`**: The Zod library is the core dependency for defining and using these schemas.

## Usage Context

These Zod schemas are essential for:

1.  **Data Validation**: Ensuring that any data purporting to be a flow diagram (e.g., from user input, a file, or an API) conforms to the expected structure and types before processing. This helps prevent runtime errors and ensures data integrity.
    ```typescript
    // import { FlowDataSchema } from './schema'; // In either UI or plugin code
    // const userInputJson = /* ... some JSON string from user ... */;
    // try {
    //   const parsedInput = JSON.parse(userInputJson);
    //   const validatedFlowData = FlowDataSchema.parse(parsedInput);
    //   // Proceed with validatedFlowData
    // } catch (error) {
    //   // Handle validation errors (e.g., from Zod) or JSON parse errors
    //   console.error("Invalid flow data:", error);
    // }
    ```
2.  **Type Inference**: Zod schemas can be used to infer TypeScript types, ensuring that the code working with flow data is type-safe.
    ```typescript
    // import { z } from 'zod';
    // import { FlowNodeSchema } from './schema';

    // type FlowNode = z.infer<typeof FlowNodeSchema>;
    // // Now FlowNode type can be used in TypeScript code
    ```
    (Although the project seems to define types separately in `shared/types/flow.types.ts` and these Zod schemas are likely designed to match those types).
3.  **Parsing and Transformation**: While not heavily used for transformation in this specific file, Zod can also transform data during parsing (e.g., default values, data coercion), though the primary use here is validation.

By defining these schemas in a shared location, both the plugin UI and the Figma backend can rely on the same validation rules, reducing discrepancies and improving the robustness of the data handling pipeline. The use of `.optional()` and `.passthrough()` provides some flexibility while still enforcing the core structure.

# Module: shared/types/flow.types.ts

## Purpose and Scope

This module defines TypeScript interfaces and type aliases that represent the structure of data for flow diagrams within the IziFlow project. These types are crucial for ensuring data consistency and providing type safety across different parts of the application, likely including the plugin's UI (`src/`), the Figma backend (`src-code/`), and any data parsing or validation layers (like `shared/schemas/schema.ts`).

The types defined here model the various components of a flow diagram, such as individual nodes, their descriptions, metadata, and the connections between them.

## Main Exported Interfaces and Types

### `DescriptionField` Interface

Represents a single field within the description section of a `FlowNode`.

*   **Properties**:
    *   `label: string`: The label or title of the description field (e.g., "Action", "Inputs", "Error State").
    *   `content: string | string[] | Record<string, string>`: The actual content of the description field. This allows for flexibility:
        *   `string`: A simple textual content.
        *   `string[]`: A list of textual items.
        *   `Record<string, string>`: A simple key-value object for structured content.
    *   `[key: string]: any`: An index signature allowing for additional, unspecified properties if needed, providing extensibility.

### `FlowNode` Interface

Represents a single node within the flow diagram. This is a core data structure.

*   **Properties**:
    *   `id: string`: A unique identifier for the node.
    *   `type: "START" | "END" | "STEP" | "DECISION" | "ENTRYPOINT"`: The type of the node, restricted to these specific string literals.
    *   `name: string`: The display name of the node.
    *   `metadata?: { ... }`: An optional object for storing metadata associated with the node.
        *   `category?: string`: An optional category for the node.
        *   `createdBy?: string`: An optional field indicating who created the node.
        *   `[key: string]: any`: An index signature allowing for other arbitrary metadata properties.
    *   `description?: { ... }`: An optional object containing descriptive information for the node.
        *   `fields: DescriptionField[]`: An array of `DescriptionField` objects that make up the structured description of the node.
        *   *(Comments suggest potential for other fields like `title` within the description object in the future).*

### `NodeData` Type Alias

A direct type alias for `FlowNode`.

```typescript
export type NodeData = FlowNode;
```
*   This alias is likely used in various modules (e.g., `code.ts`, `frames.ts`) for clarity or historical reasons, but it represents the same structure as `FlowNode`.

### `Connection` Interface

Represents a connection or link between two nodes in the flow diagram.

*   **Properties**:
    *   `id?: string`: An optional unique identifier for the connection itself.
    *   `from: string`: The `id` of the source node from which the connection originates.
    *   `to: string`: The `id` of the target node to which the connection points.
    *   `condition?: string`: An optional string describing a condition for this path (potentially a legacy field or an alternative to `conditionLabel`).
    *   `conditionLabel?: string`: An optional string label that is typically displayed on or near the connector line, often used for decision outcomes (e.g., "Yes", "No", "User clicks button").
    *   `secondary?: boolean`: An optional boolean flag. If `true`, it indicates that this connection represents a secondary or alternative path (e.g., an error path or a less common route).

### `Flow` Interface

Represents a complete, self-contained flow diagram, consisting of a set of nodes and the connections between them.

*   **Properties**:
    *   `flowName?: string`: An optional name for the entire flow.
    *   `nodes: FlowNode[]`: An array of `FlowNode` objects that are part of this flow.
    *   `connections: Connection[]`: An array of `Connection` objects that define the links between the nodes in this flow.

### `FlowData` Interface

Represents the top-level structure for input data that defines one or more flow diagrams. This interface provides flexibility for how flow data might be packaged.

*   **Properties**:
    *   `flowName?: string`: An optional name, relevant if the `FlowData` object represents a single flow directly at its root.
    *   `nodes?: FlowNode[]`: An optional array of `FlowNode` objects, relevant if the `FlowData` represents a single flow at its root.
    *   `connections?: Connection[]`: An optional array of `Connection` objects, relevant if the `FlowData` represents a single flow at its root.
    *   `flows?: Flow[]`: An optional array of `Flow` objects. This allows the `FlowData` to contain multiple, distinct flow diagrams.

## Usage Context

These TypeScript types are fundamental for:

*   **Development**: Providing static typing for developers working with flow data, enabling auto-completion, type checking, and reducing errors.
*   **Data Modeling**: Clearly defining the expected structure of data for nodes, connections, and entire flows.
*   **API Design**: If the plugin interacts with external data sources or has an internal API between its UI and backend, these types would define the contract for that data.
*   **Inter-Module Communication**: Ensuring that different parts of the plugin (e.g., parser, layout engine, rendering components) operate on data with a consistent and understood structure.
*   **Validation Alignment**: These types should ideally be consistent with the Zod schemas defined in `shared/schemas/schema.ts`. While Zod schemas can infer types, having explicit TypeScript types can sometimes be preferred for clarity or when types are more complex than what Zod easily infers.

The structure, particularly of `FlowNode` with its `metadata` and nested `description.fields`, allows for rich and extensible data to be associated with each node in a flow diagram. The `FlowData` interface offers flexibility in how flow information is provided to the plugin.

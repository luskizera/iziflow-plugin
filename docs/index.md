# IziFlow Documentation

Welcome to the IziFlow technical documentation. This collection of documents provides a comprehensive overview of the project, its modules, business flows, and design system.

## Project Overview

*   **[README](../../README.md)**: The main README for the project, covering purpose, technologies, repository structure, and setup instructions.

## Module Documentation (`./modules/`)

This section details the purpose, scope, main exports, and usage of various source code modules.

### UI Components (`src/components/`)

*   **[Alert](./modules/ui-alert.md)**: Documentation for the `Alert` UI component used for displaying important messages.
*   **[AlertDialog](./modules/ui-alert-dialog.md)**: Documentation for the `AlertDialog` UI component used for modal confirmation dialogs.
*   **[Button](./modules/ui-button.md)**: Documentation for the `Button` UI component, including its variants and sizes.
*   **[DropdownMenu](./modules/ui-dropdown-menu.md)**: Documentation for the `DropdownMenu` UI component for displaying lists of actions.
*   **[Input](./modules/ui-input.md)**: Documentation for the `Input` UI component for single-line text input.
*   **[Label](./modules/ui-label.md)**: Documentation for the `Label` UI component for accessible form field labeling.
*   **[ScrollArea](./modules/ui-scroll-area.md)**: Documentation for the `ScrollArea` UI component for scrollable content regions.
*   **[Table](./modules/ui-table.md)**: Documentation for the `Table` UI components for displaying tabular data.
*   **[Tabs](./modules/ui-tabs.md)**: Documentation for the `Tabs` UI component for tabbed content navigation.
*   **[Textarea](./modules/ui-textarea.md)**: Documentation for the `Textarea` UI component for multi-line text input.
*   **[Tooltip](./modules/ui-tooltip.md)**: Documentation for the `Tooltip` UI component for displaying informational hints.

### UI Providers (`src/components/providers/`)

*   **[ThemeProvider](./modules/theme-provider.md)**: Documentation for the `ThemeProvider` and `useTheme` hook for managing light/dark modes.

### UI Libraries (`src/lib/`)

*   **[src/lib/utils.ts](./modules/src-lib-utils.md)**: Documentation for utility functions in the UI, primarily the `cn` class name utility.

### Figma Plugin Core Logic (`src-code/`)

#### Configuration (`src-code/config/`)

*   **[icons.ts](./modules/src-code-config-icons.md)**: Manages SVG icons for different node types in the Figma plugin.
*   **[layout.config.ts](./modules/src-code-config-layout.md)**: Defines layout constants for nodes and connectors (spacing, magnets, line types).
*   **[styles.config.ts](./modules/src-code-config-styles.md)**: Defines non-color visual styles (fonts, sizes, radii) for Figma elements.
*   **[theme.config.ts](./modules/src-code-config-theme.md)**: Manages color definitions, semantic color tokens, and dynamic theme generation for Figma elements.

#### Libraries (`src-code/lib/`)

*   **[connectors.ts](./modules/src-code-lib-connectors.md)**: Handles the creation and styling of connector lines and their labels between nodes.
*   **[frames.ts](./modules/src-code-lib-frames.md)**: Responsible for creating the visual Figma frames for different types of flow nodes.
*   **[layout.ts](./modules/src-code-lib-layout.md)**: Provides utility functions for graph building and level sorting, foundational for node positioning.
*   **[yamlParser.ts](./modules/src-code-lib-yamlParser.md)**: Parses the IziFlow YAML syntax (metadata + nodes + connections) into flow structures and layout hints.

#### Utilities (`src-code/utils/`)

*   **[code-utils.ts](./modules/src-code-utils-code-utils.md)**: Utilities for messaging between plugin backend and UI, and client storage interaction.
*   **[color-generation.ts](./modules/src-code-utils-color-generation.md)**: Functions for color manipulation and dynamic accent palette generation.
*   **[hexToRgb.ts](./modules/src-code-utils-hexToRgb.md)**: Utility to convert HEX color strings to RGB objects.
*   **[historyStorage.ts](./modules/src-code-utils-historyStorage.md)**: Manages a history of YAML inputs (persisting `metadata.name`) using Figma's client storage.
*   **[layoutManager.ts](./modules/src-code-utils-layoutManager.md)**: Singleton class to manage and queue layout-related tasks for Figma nodes.
*   **[logger.ts](./modules/src-code-utils-logger.md)**: Provides a simple logger for consistent console output with different levels.
*   **[nodeCache.ts](./modules/src-code-utils-nodeCache.md)**: Singleton class for loading fonts and queuing asynchronous tasks.

### Shared Code (`shared/`)

#### Schemas (`shared/schemas/`)

*   **[schema.ts](./modules/shared-schemas-schema.md)**: Zod data validation schemas for flow diagrams (`FlowNode`, `Connection`, etc.).

#### Types (`shared/types/`)

*   **[flow.types.ts](./modules/shared-types-flow.md)**: TypeScript interfaces and type aliases for flow diagram data structures.
*   **[messaging.types.ts](./modules/shared-types-messaging.md)**: Defines the `EventTS` interface for type-safe messaging between plugin UI and backend.

## Business Flow Documentation (`./flows/`)

This section describes key business flows defined and used within the IziFlow project, illustrating how nodes and connections represent process logic.

*   **[Understanding IziFlow Flows](./flows/00-understanding-flows.md)**: Explains the core concepts of `FlowNode` and `Connection` and how they are used to define flows.
*   **[Checkout Flow](./flows/01-checkout-flow.md)**: Documentation for a simple e-commerce checkout process.
*   **[File Upload Flow](./flows/02-file-upload-flow.md)**: Documentation for a typical file upload process.
*   **[Password Reset Flow](./flows/03-password-reset-flow.md)**: Documentation for a user password reset process.

## Design System & Theme (`./theme/`)

*   **[Design System & Theme](./theme/design-system.md)**: Explains the theming system (light/dark mode), design tokens (colors, typography, spacing), and styling conventions used in the project.

This index provides a starting point for navigating the technical details of the IziFlow project. Each linked document offers more specific information about its respective area.

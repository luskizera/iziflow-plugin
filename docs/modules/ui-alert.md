# UI Component: Alert

## Purpose and Scope

The `Alert` component is used to display important messages or notifications to the user. It can be styled with different variants, such as "default" and "destructive," to indicate the nature of the message. This component is built using `class-variance-authority` for variant management and styled with Tailwind CSS.

## Main Exported Components

The `Alert` is a compound component, typically consisting of an `Alert` root, an `AlertTitle`, and an `AlertDescription`.

*   **`Alert`**: The main container for the alert message.
    *   Props:
        *   `className?: string`: Additional CSS classes to apply.
        *   `variant?: "default" | "destructive"`: The style variant of the alert. Defaults to `"default"`.
        *   Other standard `div` props.
    *   Styling:
        *   Uses `alertVariants` (created with `cva`) to apply base and variant-specific styles.
        *   Includes styles for layout (relative, full-width, rounded corners, border, padding).
        *   Implements a grid layout to accommodate an optional icon (`svg`). If an icon is present (`has-[>svg]`), the grid adjusts to create space for it.
        *   The icon itself (`&>svg`) is styled for size and alignment.
    *   Variants:
        *   `default`: Standard alert styling (`bg-card text-card-foreground`).
        *   `destructive`: Styling for error or critical messages (`text-destructive bg-card`). The description text color is also adjusted.
*   **`AlertTitle`**: A component to display the title of the alert.
    *   Props:
        *   `className?: string`: Additional CSS classes.
        *   Other standard `div` props.
    *   Styling:
        *   Positioned in the second column of the parent `Alert`'s grid (`col-start-2`).
        *   Styled for font weight, tracking, and line clamping (to prevent overly long titles).
*   **`AlertDescription`**: A component to display the main content or description of the alert.
    *   Props:
        *   `className?: string`: Additional CSS classes.
        *   Other standard `div` props.
    *   Styling:
        *   Positioned in the second column of the parent `Alert`'s grid (`col-start-2`).
        *   Styled with muted foreground text color and specific line height for paragraphs within it.

## Usage Examples

```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"; // Assuming '@' is an alias for 'src'
import { Terminal } from "lucide-react"; // Example icon

// Default Alert
function DefaultAlertExample() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" /> {/* Optional Icon */}
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}

// Destructive Alert
function DestructiveAlertExample() {
  return (
    <Alert variant="destructive">
      <Terminal className="h-4 w-4" /> {/* Optional Icon */}
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  );
}
```

## Styling

*   Uses `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Uses `class-variance-authority` (`cva`) to define and manage variants (`alertVariants`).
*   Relies on Tailwind CSS for all styling.
*   The component is designed to optionally include an SVG icon. If an `svg` element is a direct child of `Alert`, the layout adjusts to display it correctly next to the title and description.
*   Data attributes `data-slot="alert"`, `data-slot="alert-title"`, `data-slot="alert-description"` are used, potentially for testing or more specific global styling.

## Relationships with Other Modules

*   **`class-variance-authority`**: Used for creating variants with different styles.
*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **Tailwind CSS**: Provides the utility classes for styling all parts of the component.
*   **Lucide-React (or other icon libraries)**: Can be used to provide icons within the `Alert` component, though not a direct dependency.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables (e.g., `--spacing`, `bg-card`, `text-card-foreground`, `text-destructive`).

This `Alert` component set offers a flexible way to present dismissible or persistent messages with clear visual distinction based on their importance.

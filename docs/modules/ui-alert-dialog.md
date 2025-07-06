# UI Component: AlertDialog

## Purpose and Scope

The `AlertDialog` component is a modal dialog that interrupts the user with important information or a call to action. It's typically used for confirming actions that have significant consequences, such as deleting data. This component is built on top of `@radix-ui/react-alert-dialog` and styled with Tailwind CSS.

## Main Exported Components

The `AlertDialog` is a compound component, meaning it's composed of several sub-components that work together.

*   **`AlertDialog`**: The root component that wraps the entire alert dialog.
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Root` component.
*   **`AlertDialogTrigger`**: A component that triggers the opening of the alert dialog when clicked.
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Trigger` component.
*   **`AlertDialogPortal`**: A component that portals the dialog content to a different part of the DOM (usually `document.body`).
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Portal` component.
*   **`AlertDialogOverlay`**: A semi-transparent overlay that covers the rest of the page when the dialog is open.
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Overlay` component, plus `className`.
    *   Styling: Includes fixed positioning, z-index, background color with opacity, and fade-in/out animations.
*   **`AlertDialogContent`**: The main content area of the dialog.
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Content` component, plus `className`.
    *   Styling: Includes fixed positioning, centered layout, background, border, shadow, and zoom-in/out animations.
*   **`AlertDialogHeader`**: A container for the dialog's title and description, providing layout.
    *   Props: Accepts standard `div` props, plus `className`.
    *   Styling: Flexbox layout for title and description.
*   **`AlertDialogFooter`**: A container for action and cancel buttons, providing layout.
    *   Props: Accepts standard `div` props, plus `className`.
    *   Styling: Flexbox layout, typically right-aligned buttons.
*   **`AlertDialogTitle`**: The title of the alert dialog.
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Title` component, plus `className`.
    *   Styling: Sets font size and weight.
*   **`AlertDialogDescription`**: The descriptive text within the alert dialog.
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Description` component, plus `className`.
    *   Styling: Sets text color and size for muted foreground.
*   **`AlertDialogAction`**: A button that typically represents the primary action (e.g., "Confirm", "Delete").
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Action` component, plus `className`.
    *   Styling: Uses `buttonVariants()` for default button styling.
*   **`AlertDialogCancel`**: A button that typically closes the dialog without performing the action (e.g., "Cancel").
    *   Props: Accepts all props of `@radix-ui/react-alert-dialog`'s `Cancel` component, plus `className`.
    *   Styling: Uses `buttonVariants({ variant: "outline" })` for outline button styling.

## Usage Examples

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Assuming '@' is an alias for 'src'
import { Button } from "@/components/ui/button";

function MyComponent() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => console.log("Confirmed!")}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default MyComponent;
```

## Styling

*   Uses `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies on Tailwind CSS for all styling.
*   Animations for open/close states are defined using `data-[state=open]:animate-in`, `data-[state=closed]:animate-out`, etc.
*   Action and Cancel buttons use `buttonVariants` from ` "@/components/ui/button"` for consistent button styling.

## Relationships with Other Modules

*   **`@radix-ui/react-alert-dialog`**: This component is a styled wrapper around the Radix UI AlertDialog primitive, inheriting its accessibility features and core functionality.
*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **`@/components/ui/button` (`buttonVariants`)**: Used to style the `AlertDialogAction` and `AlertDialogCancel` buttons.
*   **Tailwind CSS**: Provides the utility classes for styling all parts of the component.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables and base styles.

This component provides a standardized and accessible way to present critical alerts and confirmation dialogs within the IziFlow plugin UI.

# UI Component: Input

## Purpose and Scope

The `Input` component provides a styled HTML input element. It's designed to be a general-purpose text input field, but can also accommodate other input types like `file`. It includes styling for various states such as focus, disabled, and invalid.

## Main Exported Components

### `Input` Component

*   **Props**:
    *   `className?: string`: Additional CSS classes to apply to the input element.
    *   `type?: string`: The type of the input element (e.g., `"text"`, `"password"`, `"email"`, `"file"`). Defaults to `"text"` if not specified by the underlying HTML input element.
    *   Other standard `input` element props (e.g., `value`, `onChange`, `placeholder`, `disabled`, `id`, `name`).
*   **Functionality**:
    *   Renders a standard HTML `<input>` element.
    *   Applies a consistent set of styles defined by Tailwind CSS utility classes.
*   **Styling**:
    *   **Base Styles**:
        *   `flex h-9 w-full min-w-0`: Full width, fixed height, basic flex properties.
        *   `rounded-md border bg-transparent px-3 py-1`: Rounded corners, border, transparent background, padding.
        *   `text-base shadow-xs`: Base text size, small box shadow.
        *   `transition-[color,box-shadow]`: Smooth transitions for color and box-shadow changes.
        *   `outline-none`: Removes the default browser outline.
    *   **Placeholder Text**: `placeholder:text-muted-foreground` styles the placeholder text.
    *   **Text Selection**: `selection:bg-primary selection:text-primary-foreground` styles the appearance of selected text.
    *   **Dark Mode**: `dark:bg-input/30` applies a specific background for dark mode.
    *   **File Input Specific Styles**:
        *   `file:text-foreground`: Styles the text of the file input button.
        *   `file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium`: Styles for the "Choose File" button part of a file input.
    *   **Disabled State**: `disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50` styles for when the input is disabled.
    *   **Focus State**: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]` applies a ring and border color change when the input is focused using keyboard navigation.
    *   **Invalid State**: `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive` applies a ring and border to indicate an invalid input, typically when the `aria-invalid` attribute is set to `true`.
    *   **Responsive Text Size**: `md:text-sm` adjusts text size on medium screens and above.
    *   **Data Attribute**: `data-slot="input"` is added, potentially for testing or more specific global styling.

## Usage Examples

```tsx
import { Input } from "@/components/ui/input"; // Assuming '@' is an alias for 'src'
import { Label } from "@/components/ui/label"; // For accessible forms

// Basic Text Input
function TextInputExample() {
  return (
    <div>
      <Label htmlFor="username">Username</Label>
      <Input type="text" id="username" placeholder="Enter your username" />
    </div>
  );
}

// Email Input
function EmailInputExample() {
  return (
    <div>
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="your@email.com" />
    </div>
  );
}

// Disabled Input
function DisabledInputExample() {
  return (
    <div>
      <Label htmlFor="disabled-input">Disabled</Label>
      <Input type="text" id="disabled-input" placeholder="Cannot edit" disabled />
    </div>
  );
}

// File Input
function FileInputExample() {
  return (
    <div>
      <Label htmlFor="profile-picture">Profile Picture</Label>
      <Input type="file" id="profile-picture" />
    </div>
  );
}

// Input with aria-invalid state
function InvalidInputExample() {
  return (
    <div>
      <Label htmlFor="error-input">Input with Error</Label>
      <Input type="text" id="error-input" aria-invalid={true} defaultValue="Invalid value" />
    </div>
  );
}
```

## Styling

*   Uses the `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies entirely on Tailwind CSS for styling.
*   The component defines styles for various states including default, focus, disabled, and invalid (via `aria-invalid`).
*   It includes specific styling for `type="file"` inputs to ensure a consistent look.

## Relationships with Other Modules

*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **Tailwind CSS**: Provides all utility classes for styling.
*   **`@/components/ui/label`**: Often used in conjunction with `Input` for creating accessible forms.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables (e.g., `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `border-input`, `border-ring`, `ring-ring`, `ring-destructive`).

The `Input` component is a fundamental building block for forms and user data entry within the IziFlow plugin UI, offering a consistent and accessible styling experience.

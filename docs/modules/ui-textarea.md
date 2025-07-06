# UI Component: Textarea

## Purpose and Scope

The `Textarea` component provides a styled multi-line text input field. It's designed for users to enter larger amounts of text than a standard single-line `Input` field would accommodate. It includes styling for various states such as focus, disabled, and invalid.

## Main Exported Components

### `Textarea` Component

*   **Props**:
    *   `className?: string`: Additional CSS classes to apply to the textarea element.
    *   Other standard `textarea` element props (e.g., `value`, `onChange`, `placeholder`, `disabled`, `id`, `name`, `rows`).
*   **Functionality**:
    *   Renders a standard HTML `<textarea>` element.
    *   Applies a consistent set of styles defined by Tailwind CSS utility classes.
*   **Styling**:
    *   **Base Styles**:
        *   `flex min-h-10 w-full`: Full width, minimum height of 10 units (typically 40px if 1 unit = 4px), basic flex properties.
        *   `rounded-md border bg-transparent px-3 py-2`: Rounded corners, border, transparent background, padding.
        *   `text-base shadow-xs`: Base text size, small box shadow.
        *   `transition-[color,box-shadow]`: Smooth transitions for color and box-shadow changes.
        *   `outline-none`: Removes the default browser outline.
    *   **Placeholder Text**: `placeholder:text-muted-foreground` styles the placeholder text.
    *   **Dark Mode**: `dark:bg-input/30` applies a specific background for dark mode.
    *   **Disabled State**: `disabled:cursor-not-allowed disabled:opacity-50` styles for when the textarea is disabled.
    *   **Focus State**: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]` applies a ring and border color change when the textarea is focused using keyboard navigation.
    *   **Invalid State**: `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive` applies a ring and border to indicate an invalid input, typically when the `aria-invalid` attribute is set to `true`.
    *   **Responsive Text Size**: `md:text-sm` adjusts text size on medium screens and above.
    *   **Data Attribute**: `data-slot="textarea"` is added, potentially for testing or more specific global styling.

## Usage Examples

```tsx
import { Textarea } from "@/components/ui/textarea"; // Assuming '@' is an alias for 'src'
import { Label } from "@/components/ui/label"; // For accessible forms

// Basic Textarea
function BasicTextareaExample() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
    </div>
  );
}

// Textarea with a specific number of rows
function TextareaWithRowsExample() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="story">Your Story (3 rows)</Label>
      <Textarea placeholder="Tell us a little bit about yourself..." id="story" rows={3} />
    </div>
  );
}

// Disabled Textarea
function DisabledTextareaExample() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="disabled-message">Disabled Message</Label>
      <Textarea placeholder="Cannot edit" id="disabled-message" disabled />
    </div>
  );
}

// Textarea with aria-invalid state
function InvalidTextareaExample() {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="error-message">Message with Error</Label>
      <Textarea
        placeholder="This field has an error"
        id="error-message"
        aria-invalid={true}
        defaultValue="Incorrect submission."
      />
    </div>
  );
}
```

## Styling

*   Uses the `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies entirely on Tailwind CSS for styling.
*   The component defines styles for various states including default, focus, disabled, and invalid (via `aria-invalid`).
*   The `min-h-10` class ensures a minimum height, but the textarea will grow vertically as content is added, unless a specific `rows` attribute or height via `className` restricts it.

## Relationships with Other Modules

*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **Tailwind CSS**: Provides all utility classes for styling.
*   **`@/components/ui/label`**: Often used in conjunction with `Textarea` for creating accessible forms.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables (e.g., `text-muted-foreground`, `border-input`, `border-ring`, `ring-ring`, `ring-destructive`, `dark:bg-input/30`).

The `Textarea` component is essential for forms requiring multi-line text input, providing a consistent and accessible styling experience within the IziFlow plugin UI.

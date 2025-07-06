# UI Component: Label

## Purpose and Scope

The `Label` component is used to render an accessible label for form elements like inputs, textareas, selects, etc. It is built upon `@radix-ui/react-label` which ensures proper association with form controls and enhances accessibility. The component is styled using Tailwind CSS.

## Main Exported Components

### `Label` Component

*   **Props**:
    *   `className?: string`: Additional CSS classes to apply to the label element.
    *   Other props accepted by `@radix-ui/react-label`'s `Root` component (e.g., `htmlFor`).
*   **Functionality**:
    *   Renders a `<label>` element.
    *   Leverages `@radix-ui/react-label` for accessibility benefits, such as associating the label with a form control when the `htmlFor` prop is used. Clicking the label will focus the associated control.
*   **Styling**:
    *   **Base Styles**:
        *   `flex items-center gap-2`: Uses flexbox for layout, allowing easy alignment with icons or other elements if placed inside the label.
        *   `text-sm leading-none font-medium`: Defines the text size, line height, and font weight.
        *   `select-none`: Prevents the label text from being selectable.
    *   **Disabled State Styling**:
        *   `group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50`: If the label is part of a "group" (e.g., a fieldset or a custom component wrapper) that has `data-disabled="true"`, the label becomes non-interactive and semi-transparent.
        *   `peer-disabled:cursor-not-allowed peer-disabled:opacity-50`: If the label is associated with a form control (the "peer") that is disabled, the label's cursor changes to `not-allowed` and it becomes semi-transparent. This typically requires the associated input to have the `peer` class in Tailwind CSS.
    *   **Data Attribute**: `data-slot="label"` is added, potentially for testing or more specific global styling.

## Usage Examples

```tsx
import { Label } from "@/components/ui/label"; // Assuming '@' is an alias for 'src'
import { Input } from "@/components/ui/input"; // Example form control
import { Checkbox } from "@/components/ui/checkbox"; // Example form control (if available)

// Label for a text input
function LabelForInputExample() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  );
}

// Label for a checkbox (illustrative, assuming Checkbox component exists and works with peer)
function LabelForCheckboxExample() {
  return (
    <div className="flex items-center space-x-2">
      {/* <Checkbox id="terms" className="peer" /> */}
      <input type="checkbox" id="terms" className="peer" /> {/* Using standard input for demo */}
      <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Accept terms and conditions
      </Label>
    </div>
  );
}

// Label for a disabled input (demonstrating peer-disabled styling)
function LabelForDisabledInputExample() {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled-email">Disabled Email</Label>
      <Input type="email" id="disabled-email" placeholder="Email" disabled className="peer"/>
    </div>
  );
}
```

## Styling

*   Uses the `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies on Tailwind CSS for styling.
*   Includes specific styling for states related to disabled form controls using `peer-disabled` (when the associated input has the `peer` class) and `group-data-[disabled=true]` (when a parent element has `data-disabled="true"`).

## Relationships with Other Modules

*   **`@radix-ui/react-label`**: This component is a styled wrapper around the Radix UI Label primitive, inheriting its accessibility features and core functionality.
*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **Tailwind CSS**: Provides all utility classes for styling.
*   **Form Control Components (e.g., `Input`, `Textarea`, `Checkbox`, `RadioGroup`)**: `Label` is intended to be used with these components to provide accessible names. The `htmlFor` prop should match the `id` of the form control.

The `Label` component is crucial for creating accessible and user-friendly forms in the IziFlow plugin UI. It ensures that form fields are clearly described and that users of assistive technologies can understand and interact with them effectively.

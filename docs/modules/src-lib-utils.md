# Module: src/lib/utils.ts

## Purpose and Scope

This module provides utility functions for the IziFlow plugin's user interface (UI), primarily focused on class name manipulation for styling with Tailwind CSS.

## Main Exported Functions

### `cn(...inputs: ClassValue[]): string`

This function is a helper that combines `clsx` and `tailwind-merge` to conditionally join class names and merge Tailwind CSS classes without style conflicts.

*   **Purpose**: To provide a convenient and safe way to apply conditional classes and merge Tailwind utility classes in React components.
*   **Parameters**:
    *   `...inputs: ClassValue[]`: A variable number of arguments that can be strings, arrays, or objects. These are the same inputs that `clsx` accepts.
        *   `string`: Class names.
        *   `object`: A map where keys are class names and values are booleans. If the value is true, the class name is included.
        *   `array`: An array of class names.
*   **Returns**: `string` - A string of combined and merged class names.
*   **Dependencies**:
    *   `clsx`: A utility for constructing `className` strings conditionally.
    *   `tailwind-merge`: A utility to merge Tailwind CSS classes in JavaScript without style conflicts.

## Usage Examples

```tsx
import { cn } from "@/lib/utils"; // Assuming '@' is an alias for 'src'

// Basic usage
const className1 = cn("p-4", "bg-red-500");
// -> "p-4 bg-red-500"

// Conditional classes
const isActive = true;
const className2 = cn("text-lg", {
  "font-bold": isActive,
  "text-gray-500": !isActive,
});
// -> "text-lg font-bold" (if isActive is true)

// Merging Tailwind classes (tailwind-merge handles conflicts)
const className3 = cn("p-2 bg-blue-500", "p-4 bg-red-500");
// -> "p-4 bg-red-500" (p-4 overrides p-2, bg-red-500 overrides bg-blue-500)

// Used in a React component
interface MyComponentProps {
  variant: "primary" | "secondary";
  isActive: boolean;
  className?: string;
}

function MyComponent({ variant, isActive, className }: MyComponentProps) {
  const buttonClasses = cn(
    "rounded-md px-3 py-1",
    {
      "bg-blue-600 text-white": variant === "primary",
      "bg-gray-200 text-gray-800": variant === "secondary",
      "opacity-50 cursor-not-allowed": !isActive,
    },
    className // Allow overriding or extending with external classes
  );

  return <button className={buttonClasses}>Click me</button>;
}
```

## Relationships with Other Modules

*   **React Components (`src/components/`)**: This utility is widely used across almost all React components in the `src/components/` directory for dynamic and conditional styling.
*   **Tailwind CSS**: Directly related to the usage of Tailwind CSS for styling the application. It helps manage the complexity of utility classes.

This module is fundamental for maintaining clean and manageable class names in a Tailwind CSS-based project.

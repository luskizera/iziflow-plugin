# UI Component: Tooltip

## Purpose and Scope

The `Tooltip` component set is used to display informative text or hints when a user hovers over, focuses on, or taps an element. It's built upon `@radix-ui/react-tooltip`, ensuring accessibility and robust tooltip behavior, and is styled using Tailwind CSS. It includes a provider, root, trigger, and content elements.

## Main Exported Components

*   **`TooltipProvider`**:
    *   A component that wraps your application or a part of it to provide context for all tooltips within it. It controls aspects like `delayDuration`.
    *   Props: Accepts props of `@radix-ui/react-tooltip`'s `Provider` component, with `delayDuration` defaulting to `0` (meaning tooltips appear almost immediately on hover/focus).
    *   It's recommended to wrap your application root with `TooltipProvider` once. The exported `Tooltip` component in this file *already includes* a `TooltipProvider` with `delayDuration={0}`. If you need a different delay or global configuration, you might use `TooltipProvider` explicitly.
*   **`Tooltip`**:
    *   The root component for an individual tooltip instance. **Note:** This implementation wraps `TooltipPrimitive.Root` with its own `TooltipProvider` (with `delayDuration = 0`). This means each `Tooltip` instance is self-contained regarding its provider context unless nested within an explicit, outer `TooltipProvider`.
    *   Props: Accepts all props of `@radix-ui/react-tooltip`'s `Root` component (e.g., `defaultOpen`, `open`, `onOpenChange`).
*   **`TooltipTrigger`**:
    *   The element that, when interacted with (hover, focus), will trigger the display of the tooltip content. This should wrap the interactive element.
    *   Props: Accepts all props of `@radix-ui/react-tooltip`'s `Trigger` component. Often used with `asChild` to pass styling and behavior to a custom child component.
*   **`TooltipContent`**:
    *   The actual content of the tooltip that appears when triggered.
    *   Props: Accepts props of `@radix-ui/react-tooltip`'s `Content` component, plus `className` and `sideOffset` (defaulting to `0`).
    *   Styling:
        *   `bg-primary text-primary-foreground`: Background and text colors.
        *   Animations: `animate-in fade-in-0 zoom-in-95` for opening; `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95` for closing.
        *   Slide-in animations based on `data-side` (e.g., `data-[side=bottom]:slide-in-from-top-2`).
        *   `z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance`: Z-index, width fitting content, transform origin, rounded corners, padding, small text size, and balanced text wrapping.
    *   Includes a `TooltipPrimitive.Arrow` for a small pointer arrow, styled with `bg-primary fill-primary`.

## Usage Examples

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider, // Can be used explicitly for global settings
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Assuming '@' is an alias for 'src'
import { Button } from "@/components/ui/button"; // Example trigger element

// Basic Tooltip (uses the implicit TooltipProvider within Tooltip)
function BasicTooltipExample() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a helpful tooltip message!</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Tooltip with a different side and offset
function TooltipSideExample() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Info Icon</Button>
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        <p>More details here, appearing on the right.</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Using the explicit TooltipProvider for a different delay
function TooltipWithDelay() {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost">Delayed Tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This tooltip appears after a 500ms delay.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

## Styling

*   Uses the `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies on Tailwind CSS for styling, including animations and positioning based on `data-side` attributes.
*   The `TooltipContent` includes a styled arrow (`TooltipPrimitive.Arrow`) that points towards the trigger element.
*   `data-slot` attributes are present on all sub-components for potential global styling or testing.
*   The `delayDuration` for tooltips is set to `0` by default within the `Tooltip` component's implicit provider, meaning they appear quickly. This can be overridden by wrapping a section of the app with an explicit `TooltipProvider` with a different `delayDuration`.

## Relationships with Other Modules

*   **`@radix-ui/react-tooltip`**: These components are styled wrappers around the Radix UI Tooltip primitives, inheriting accessibility features (like ARIA attributes) and core tooltip logic.
*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **Tailwind CSS**: Provides all utility classes for styling.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables (e.g., `bg-primary`, `text-primary-foreground`).
*   **Interactive Elements (e.g., `Button`, icons)**: `TooltipTrigger` is typically wrapped around these elements to provide contextual help.

The `Tooltip` component set is valuable for enhancing user experience by providing non-intrusive, contextual information for various UI elements in the IziFlow plugin.

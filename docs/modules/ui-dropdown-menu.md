# UI Component: DropdownMenu

## Purpose and Scope

The `DropdownMenu` component provides a way to display a list of actions or options in a temporary pop-up menu that appears when a user interacts with a trigger element. It is built upon `@radix-ui/react-dropdown-menu`, ensuring accessibility and robust functionality, and is styled using Tailwind CSS. This component is highly composable, offering various sub-components to build complex dropdown structures including submenus, checkboxes, and radio groups.

## Main Exported Components

The `DropdownMenu` is a compound component with many parts:

*   **`DropdownMenu`**: The root component that wraps the entire dropdown menu.
    *   Props: Accepts all props of `@radix-ui/react-dropdown-menu`'s `Root` component.
*   **`DropdownMenuTrigger`**: The element that, when interacted with (e.g., clicked), opens the dropdown menu.
    *   Props: Accepts all props of `@radix-ui/react-dropdown-menu`'s `Trigger` component.
*   **`DropdownMenuPortal`**: Portals the dropdown menu content to a different part of the DOM (typically `document.body`), which helps avoid z-index issues.
    *   Props: Accepts all props of `@radix-ui/react-dropdown-menu`'s `Portal` component.
*   **`DropdownMenuContent`**: The container for the dropdown menu's items.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `Content` component, plus `className` and `sideOffset` (default is `4`).
    *   Styling: Includes background, text color, animations for open/close states, slide-in animations based on side, z-index, max height, min width, rounded corners, border, shadow, and padding.
*   **`DropdownMenuGroup`**: Used to group related `DropdownMenuItem`s.
    *   Props: Accepts all props of `@radix-ui/react-dropdown-menu`'s `Group` component.
*   **`DropdownMenuItem`**: A single item within the dropdown menu.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `Item` component, plus `className`, `inset?: boolean`, and `variant?: "default" | "destructive"`.
    *   Styling: Includes focus styles, destructive variant styles, layout for icon and text, rounded corners, padding (adjusted if `inset` is true), text size, and disabled state styles. SVG icons are styled for size and color.
*   **`DropdownMenuCheckboxItem`**: An item that can be checked or unchecked, like a checkbox.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `CheckboxItem` component, plus `className` and `children`.
    *   Styling: Similar to `DropdownMenuItem`, with additional padding for the check indicator. Includes a `CheckIcon`.
*   **`DropdownMenuRadioGroup`**: A group of `DropdownMenuRadioItem`s, where only one can be selected.
    *   Props: Accepts all props of `@radix-ui/react-dropdown-menu`'s `RadioGroup` component.
*   **`DropdownMenuRadioItem`**: An item within a `DropdownMenuRadioGroup` that can be selected.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `RadioItem` component, plus `className` and `children`.
    *   Styling: Similar to `DropdownMenuCheckboxItem`, but uses a `CircleIcon` as the indicator.
*   **`DropdownMenuLabel`**: A non-interactive label within the dropdown, often used as a title for a group of items.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `Label` component, plus `className` and `inset?: boolean`.
    *   Styling: Includes padding (adjusted if `inset` is true), text size, and font weight.
*   **`DropdownMenuSeparator`**: A visual separator between groups of items.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `Separator` component, plus `className`.
    *   Styling: Background color, margin, and height.
*   **`DropdownMenuShortcut`**: A component to display a keyboard shortcut associated with a menu item, typically aligned to the right.
    *   Props: Accepts standard `span` props, plus `className`.
    *   Styling: Muted text color, margin, text size, and tracking.
*   **`DropdownMenuSub`**: The root component for a submenu.
    *   Props: Accepts all props of `@radix-ui/react-dropdown-menu`'s `Sub` component.
*   **`DropdownMenuSubTrigger`**: The item that opens a submenu.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `SubTrigger` component, plus `className`, `inset?: boolean`, and `children`.
    *   Styling: Similar to `DropdownMenuItem`, with a `ChevronRightIcon` to indicate a submenu.
*   **`DropdownMenuSubContent`**: The container for the submenu's items.
    *   Props: Accepts props of `@radix-ui/react-dropdown-menu`'s `SubContent` component, plus `className`.
    *   Styling: Similar to `DropdownMenuContent`.

## Usage Examples

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"; // Assuming '@' is an alias for 'src'
import { Button } from "@/components/ui/button";
import { User, PlusCircle, Settings, LogOut, Mail, MessageSquare, Plus, UserPlus } from "lucide-react"; // Example icons
import React from "react";

function MyDropdownMenu() {
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [showActivityBar, setShowActivityBar] = React.useState(false);
  const [position, setPosition] = React.useState("bottom");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Invite users</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Mail className="mr-2 h-4 w-4" />
              <span>Invite by Email</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
          disabled
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default MyDropdownMenu;
```

## Styling

*   Uses `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies on Tailwind CSS for all styling, including animations (`animate-in`, `fade-out-0`, etc.) and positioning based on `data-side` attributes.
*   Icons (`CheckIcon`, `ChevronRightIcon`, `CircleIcon` from `lucide-react`) are used for indicators and submenu triggers.
*   `data-slot` attributes are present on most sub-components for potential global styling or testing.
*   `data-inset` attribute on items and labels adjusts padding for items that might have icons or indicators, ensuring proper alignment.
*   `DropdownMenuItem` supports a `variant="destructive"` for styling critical actions.

## Relationships with Other Modules

*   **`@radix-ui/react-dropdown-menu`**: This component set is a styled wrapper around the Radix UI DropdownMenu primitives, inheriting its accessibility features and core functionality.
*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **`lucide-react`**: Provides icons used within the dropdown menu items.
*   **Tailwind CSS**: Provides the utility classes for styling all parts of the component.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables (e.g., `bg-popover`, `text-popover-foreground`, `bg-accent`, `text-accent-foreground`, `text-destructive`, `bg-border`).

This `DropdownMenu` component suite offers a comprehensive solution for creating rich, interactive, and accessible dropdown menus within the IziFlow plugin UI.

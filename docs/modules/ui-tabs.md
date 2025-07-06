# UI Component: Tabs

## Purpose and Scope

The `Tabs` component set allows users to navigate between different sections of content within the same page or view. It's built upon `@radix-ui/react-tabs`, ensuring accessibility and robust tab management functionality, and is styled using Tailwind CSS. It consists of a root container, a list of tab triggers, and content panels associated with each trigger.

## Main Exported Components

*   **`Tabs` (alias for `TabsPrimitive.Root`)**:
    *   The root component that wraps the entire tabs interface.
    *   Props: Accepts all props of `@radix-ui/react-tabs`'s `Root` component (e.g., `defaultValue`, `onValueChange`, `orientation`, `activationMode`).
*   **`TabsList`**:
    *   The container for the tab trigger buttons.
    *   Props: Accepts all props of `@radix-ui/react-tabs`'s `List` component, plus `className`.
    *   Styling: `inline-flex h-9 w-96 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground`. Provides a styled container for the tab buttons. The fixed width `w-96` might be specific to a certain design and could be overridden via `className`.
*   **`TabsTrigger`**:
    *   A button that activates a specific tab and displays its associated content. Each `TabsTrigger` should have a `value` prop that corresponds to the `value` prop of a `TabsContent` component.
    *   Props: Accepts all props of `@radix-ui/react-tabs`'s `Trigger` component (importantly `value`), plus `className`.
    *   Styling: `inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ...`.
        *   `transition-all`: Smooth transitions for style changes.
        *   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`: Custom focus ring styling.
        *   `disabled:pointer-events-none disabled:opacity-50`: Styles for disabled state.
        *   `data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow`: Styles for the active tab trigger (e.g., different background, text color, and shadow).
*   **`TabsContent`**:
    *   The panel that displays the content for an active tab. Each `TabsContent` should have a `value` prop that corresponds to the `value` prop of a `TabsTrigger`.
    *   Props: Accepts all props of `@radix-ui/react-tabs`'s `Content` component (importantly `value`), plus `className`.
    *   Styling: `mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`. Adds top margin and focus visibility styling.

All functional components (`TabsList`, `TabsTrigger`, `TabsContent`) are created using `React.forwardRef` to allow refs to be passed to the underlying Radix primitive components.

## Usage Examples

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // Assuming '@' is an alias for 'src'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Assuming Card components are available
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2"> {/* Overriding default w-96 */}
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        {/* Assuming Card component for structure */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default TabsDemo;
```

## Styling

*   Uses the `cn` utility from ` "@/lib/utils"` for merging and conditional class names.
*   Relies on Tailwind CSS for all styling.
*   `TabsList` has a default width of `w-96`, which might need to be overridden depending on the context (as shown in the example with `grid w-full grid-cols-2`).
*   Active tabs (`TabsTrigger` with `data-[state=active]`) have distinct styling to differentiate them from inactive tabs.
*   Focus visibility is styled for both `TabsTrigger` and `TabsContent`.

## Relationships with Other Modules

*   **`@radix-ui/react-tabs`**: These components are styled wrappers around the Radix UI Tabs primitives, inheriting accessibility features (like keyboard navigation) and core tab management logic.
*   **`@/lib/utils` (`cn` function)**: Used for class name construction.
*   **Tailwind CSS**: Provides all utility classes for styling.
*   **Global Styles (`theme.css`, `globals.css`)**: May be influenced by global CSS variables (e.g., `bg-muted`, `text-muted-foreground`, `bg-background`, `text-foreground`, `ring-ring`, `ring-offset-background`).
*   **Other UI Components (e.g., `Card`, `Button`, `Input`, `Label`)**: Tabs are often used to organize forms or sections built with other UI components.

The `Tabs` component set is a key element for organizing content and improving user navigation in complex interfaces within the IziFlow plugin.

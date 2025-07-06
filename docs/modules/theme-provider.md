# Module: ThemeProvider

## Purpose and Scope

The `ThemeProvider` module is responsible for managing and providing theme (e.g., "dark" or "light" mode) context to the IziFlow plugin's user interface. It allows components within the application to access the current theme and provides a function to change it. The theme changes are applied by adding or removing CSS classes (`"light"`, `"dark"`) on the HTML document's root element (`documentElement`).

## Main Exported Components and Hooks

### `ThemeProvider` Component

*   **Props**:
    *   `children: React.ReactNode`: The child components that will have access to the theme context. Typically, this will wrap a large portion or the entirety of the application.
    *   `defaultTheme?: Theme`: The theme to apply by default when the provider is initialized. It can be `"dark"` or `"light"`. Defaults to `"light"`.
*   **Functionality**:
    *   Initializes a React state for the current `theme` with the `defaultTheme`.
    *   Uses a `useEffect` hook to update the class list on the `document.documentElement`. When the `theme` state changes, it removes any existing `"light"` or `"dark"` classes and adds the class corresponding to the current `theme`. This allows CSS rules scoped to `.light {...}` or `.dark {...}` to take effect.
    *   Provides the current `theme` and the `setTheme` function to its children via `ThemeProviderContext.Provider`.
*   **State**:
    *   `theme: Theme`: Stores the current active theme ("light" or "dark").
    *   `setTheme: (theme: Theme) => void`: A function to update the current theme.

### `useTheme` Hook

*   **Functionality**:
    *   A custom React hook that allows components to access the theme context.
    *   It uses `useContext(ThemeProviderContext)` to get the current `theme` and the `setTheme` function.
    *   Throws an error if used outside of a `ThemeProvider`, ensuring that components only attempt to access the theme context when it's available.
*   **Returns**: `object`
    *   `theme: Theme`: The current active theme ("light" or "dark").
    *   `setTheme: (theme: Theme) => void`: The function to change the current theme.

## Internal Types

### `Theme`
A TypeScript type alias:
```typescript
type Theme = "dark" | "light";
```

## Usage Examples

**1. Wrapping the Application with `ThemeProvider` (e.g., in `main.tsx` or `App.tsx`):**

```tsx
// In your main application file (e.g., src/main.tsx or src/components/app.tsx)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Your main App component
import { ThemeProvider } from "@/components/providers/theme-provider"; // Adjust path as needed
import "./index.css"; // Assuming global styles and theme variables are here

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark"> {/* Or "light", or load from storage */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

**2. Using the `useTheme` Hook in a Component:**

```tsx
// In a hypothetical ThemeToggleButton component
import React from "react";
import { useTheme } from "@/components/providers/theme-provider"; // Adjust path as needed
import { Button } from "@/components/ui/button"; // Assuming a Button component
import { Moon, Sun } from "lucide-react"; // Example icons

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggleButton;
```

## How It Works

1.  The `ThemeProvider` component is placed high in the component tree.
2.  It initializes the theme (e.g., to "light" or "dark").
3.  The `useEffect` hook in `ThemeProvider` listens for changes to the `theme` state.
4.  When the theme changes (either initially or through `setTheme`):
    *   It accesses `window.document.documentElement` (the `<html>` tag).
    *   It removes both `"light"` and `"dark"` classes to ensure a clean state.
    *   It adds the class corresponding to the new theme (e.g., `document.documentElement.classList.add("dark")`).
5.  CSS stylesheets (like `theme.css`, `primitives/colors.css`, or Tailwind's dark mode variant) can then use these classes to apply different styles:
    ```css
    /* Example in a CSS file */
    :root { /* Default light theme variables */
      --background: #ffffff;
      --foreground: #000000;
    }

    .dark { /* Dark theme overrides */
      --background: #000000;
      --foreground: #ffffff;
    }
    ```
    Or with Tailwind's `darkMode: 'class'` strategy:
    ```jsx
    // In a component
    <div className="bg-white dark:bg-black text-black dark:text-white">...</div>
    ```
6.  Components call `useTheme()` to get the current `theme` string (e.g., to render different icons) and the `setTheme` function to allow users to switch themes.

## Relationships with Other Modules

*   **React Context API**: Uses `createContext` and `useContext` for providing and consuming theme state.
*   **Global CSS/Tailwind CSS**: The primary mechanism for theme switching relies on adding a class to the `<html>` element, which is then used by CSS rules (defined in files like `theme.css`, `primitives/colors.css` or via Tailwind's dark mode configuration) to apply different visual styles.
*   **UI Components (`src/components/`)**: Any component that needs to be theme-aware or provide theme-switching capabilities will use the `useTheme` hook.

This `ThemeProvider` provides a simple yet effective way to implement theme switching in the IziFlow plugin, enhancing user customization and accessibility.

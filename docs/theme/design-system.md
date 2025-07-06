# Design System & Theme Documentation

This document outlines the theming system, design tokens, and styling conventions used in the IziFlow project, based on the provided CSS files (`src/theme.css`, `src/primitives/colors.css`) and the Tailwind CSS configuration (`tailwind.config.js`).

## Theme System (Light/Dark Mode)

IziFlow supports both **light** and **dark** themes. This is primarily managed by CSS custom properties (variables) defined within `:root` (for the light theme by default) and a `.dark` class scope (for the dark theme).

The `src/components/providers/theme-provider.tsx` component is responsible for toggling the `.dark` class on the `<html>` element, which then activates the corresponding set of CSS variables.

**Key Files:**

*   `src/theme.css`: Defines semantic CSS variables for both light and dark themes. These variables often reference a base color palette.
*   `src/primitives/colors.css`: Defines the base color palettes (e.g., `--slate-50` to `--slate-950`, `--zinc-50` to `--zinc-950`, various color hues like `--red-500`, `--emerald-600`, etc.). These are the raw color values.
*   `tailwind.config.js`: Configures Tailwind CSS, including how it integrates with the dark mode (`darkMode: ["class"]`) and extends its default theme with custom colors that also reference these CSS variables.

### How Theming Works:

1.  **Base Colors (`src/primitives/colors.css`):**
    A comprehensive set of color scales (e.g., slate, gray, zinc, red, green, blue, primary) are defined as CSS custom properties. Each color has multiple shades, typically from 50 (lightest) to 950 (darkest).
    ```css
    /* src/primitives/colors.css */
    :root {
      --zinc-50: rgba(250, 250, 250, 1);
      /* ... all other zinc shades ... */
      --zinc-950: rgba(9, 9, 11, 1);

      --red-500: rgba(239, 68, 68, 1);
      /* ... etc. ... */

      /* The --primary-XXX colors are defined as aliases to --zinc-XXX */
      --primary-50: var(--zinc-50);
      /* ... */
      --primary-950: var(--zinc-950);
    }
    ```

2.  **Semantic Theme Variables (`src/theme.css`):**
    This file defines semantic color variables for different UI elements and states (e.g., foregrounds, backgrounds, borders for default, primary, destructive states). It defines these for both `:root` (light theme) and `.dark` scopes.
    ```css
    /* src/theme.css */
    :root { /* Light Theme Defaults */
        --foreground-default: var(--zinc-950);
        --background-default: var(--white);
        --background-card: var(--white);
        --background-input: var(--zinc-200);
        /* ... other light theme semantic colors ... */

        --radius-radius-md: 8px; /* Example of non-color token */
        --spacing-spacing-sm: 8px; /* Example of non-color token */
    }

    .dark { /* Dark Theme Overrides */
        --foreground-default: var(--zinc-50);
        --background-default: var(--zinc-950);
        --background-card: var(--zinc-950);
        --background-input: var(--zinc-700);
        /* ... other dark theme semantic colors ... */
    }
    ```
    These semantic variables often reference the primitive colors (e.g., `var(--zinc-950)`).

3.  **Tailwind CSS Integration (`tailwind.config.js`):**
    Tailwind is configured to use the `class` strategy for dark mode. Its `theme.extend.colors` section maps Tailwind color names to these CSS semantic variables. This allows developers to use Tailwind utility classes like `bg-background_default` or `text-foreground_muted`, and Tailwind will correctly apply the color defined by the corresponding CSS variable for the current theme.
    ```javascript
    // tailwind.config.js
    module.exports = {
      darkMode: ["class"], // Enables .dark class strategy
      theme: {
        extend: {
          colors: {
            "foreground_default": "var(--foreground-default)",
            "background_default": "var(--background-default)",
            "background_card": "var(--background-card)",
            "background_input": "var(--background-input)",
            // ... many other color mappings ...
          },
          fontFamily: {
            sans: ["var(--font-sans)", "sans-serif"],
            mono: ["var(--font-mono)", "monospace"]
          },
        }
      }
      // ...
    };
    ```

## Design Tokens

Design tokens are the named entities that store design decisions, such as colors, fonts, spacing, radii, etc. They are primarily defined as CSS custom properties.

### 1. Colors

*   **Primitive Colors**: Defined in `src/primitives/colors.css`. These are the base color scales (e.g., `--slate-100`, `--red-500`, `--primary-700`).
*   **Semantic Colors**: Defined in `src/theme.css` (for both light and dark modes) and then mapped in `tailwind.config.js`. These give contextual meaning to colors (e.g., `--foreground-default`, `--background-destructive-light`, `--border-primary-default`).
    *   **Foregrounds**: `foreground_primary_default`, `foreground_secondary_default`, `foreground_destructive_default`, etc.
    *   **Backgrounds**: `background_primary_default`, `background_card`, `background_popover`, `background_input`, etc.
    *   **Borders**: `border_primary_default`, `border_destructive_default`, `border_default`, etc.
    *   **Icons**: `icon_default`, `icon_muted`, `icon_destructive_default`, etc.
    *   **Charts**: A set of chart-specific colors with opacity variations (e.g., `charts_chart_1_opacity100`).

### 2. Typography

*   **Font Families**:
    *   `--font-sans`: Referenced by Tailwind's `fontFamily.sans`. The actual font family string (e.g., "Inter") would typically be set on the `<html>` or `<body>` element or imported via CSS `@font-face`.
    *   `--font-mono`: Referenced by Tailwind's `fontFamily.mono`.
*   **Font Sizes, Weights, etc.**: While specific font size tokens (like `--font-size-sm`) are not explicitly listed in `theme.css`, Tailwind CSS provides its own comprehensive scale for font sizes, weights, line heights, etc., which are used by utility classes (e.g., `text-sm`, `font-medium`, `leading-tight`). The components often use these Tailwind classes directly.

### 3. Spacing and Sizing

*   **Spacing Tokens (`--spacing-spacing-xxs` to `--spacing-spacing-4xl`)**: Defined in `src/theme.css`.
    *   Example: `--spacing-spacing-sm: 8px;`
    *   These are likely used for margins, paddings, or gaps within custom component styles or could be mapped to Tailwind's spacing scale if further customization beyond Tailwind's defaults is needed.
*   **Padding Tokens (`--padding-padding-xxs` to `--padding-padding-4xl`)**: Defined in `src/theme.css`.
    *   Example: `--padding-padding-md: 20px;`
    *   Similar to spacing tokens, used for padding.
*   **Tailwind's Spacing Scale**: Tailwind CSS itself has an extensive and configurable spacing scale (for `margin`, `padding`, `width`, `height`, etc.) that is used throughout the components via utility classes (e.g., `p-4`, `m-2`, `h-9`).

### 4. Border Radii

*   **Radius Tokens (`--radius-radius-none` to `--radius-radius-full`)**: Defined in `src/theme.css`.
    *   Example: `--radius-radius-md: 8px;`, `--radius-radius-full: 400px;`
*   **Tailwind's Border Radius Scale**: Components primarily use Tailwind's border-radius utilities (e.g., `rounded-md`, `rounded-lg`, `rounded-full`) which map to Tailwind's own configurable scale. The CSS variables for radii might be for custom non-Tailwind styles or for very specific overrides.

## Styling Conventions

*   **Utility-First with Tailwind CSS**: The primary styling approach is utility-first, leveraging Tailwind CSS classes for most styling needs (e.g., `flex`, `items-center`, `bg-blue-500`, `text-white`, `rounded-md`). This is evident in all UI components (`src/components/ui/*.tsx`).
*   **CSS Custom Properties for Theming**: The core theming (light/dark modes, semantic colors) is built on CSS custom properties, which Tailwind then consumes.
*   **`cn` Utility**: The `cn` utility function (from `src/lib/utils.ts`), which combines `clsx` and `tailwind-merge`, is used extensively in components to conditionally apply classes and merge Tailwind classes without style conflicts.
*   **Component-Specific Styles**:
    *   Some components use `@radix-ui/react-*` primitives, which handle accessibility and core functionality. The styling is then applied on top of these primitives using Tailwind classes.
    *   Variant styles (e.g., button variants, alert variants) are often managed using `class-variance-authority` (`cva`) which generates functions to apply classes based on props.
*   **Global Styles**:
    *   `src/index.css` likely contains base styles, Tailwind base/components/utilities imports, and potentially global font imports or body styling.
    *   `src/primitives/index.css` might be an entry point for primitive styles if it exists and is used (though `colors.css` is the one explicitly mentioned for documentation).
*   **Focus States**: Custom focus-visible states are defined for interactive elements like buttons and inputs, often using ring utilities from Tailwind (`focus-visible:ring-2 focus-visible:ring-ring`).
*   **Disabled States**: Standardized styling for disabled elements (`disabled:opacity-50 disabled:pointer-events-none`).
*   **Data Attributes for State Styling**: Radix UI components often use `data-[state=...]` attributes (e.g., `data-[state=open]`, `data-[state=active]`, `data-[state=closed]`) to reflect their internal state. Tailwind CSS is used to style these states (e.g., `data-[state=active]:bg-background`).

This system provides a robust and flexible way to manage the visual appearance of the IziFlow plugin, allowing for theme changes and consistent application of design tokens across all components. Developers should primarily use Tailwind utility classes that reference the semantic color names defined in `tailwind.config.js` to ensure theme compliance.

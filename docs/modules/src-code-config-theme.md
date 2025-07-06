# Module: src-code/config/theme.config.ts

## Purpose and Scope

This module is the core of the theming system for the IziFlow Figma plugin's backend (`src-code`). It is responsible for defining primitive color palettes, semantic token mappings, and dynamically generating theme colors (including accent colors) based on user input (mode and accent color hex). The final output is a flat record of semantic token names to RGB color objects, which are then used to style Figma elements.

## Key Components and Data Structures

### 1. `RGB` Type

```typescript
export type RGB = { r: number; g: number; b: number };
```
Represents a color in RGB format, where `r`, `g`, and `b` values are typically between 0 and 1 (as expected by the Figma plugin API for fills, strokes, etc.).

### 2. `fixedPrimitiveThemeData` Object

Contains predefined color palettes for "light" and "dark" modes. These palettes are "fixed" meaning they don't change based on the user's accent color choice. Each mode (`lightPrimitives`, `darkPrimitives`) contains several color scales (e.g., `neutral`, `grass`, `ruby`, `orange`, `cyan`, `amber`). Each scale is an object mapping step numbers (e.g., "1" through "12") to HEX color strings.

*   **Example (`lightPrimitives.neutral`)**:
    ```javascript
    neutral: {"1":"#FCFCFE", "2":"#F9F9FD", ..., "12":"#1F1F29"}
    ```
*   **Note**: The `accent` palette is NOT defined here; it's generated dynamically.

### 3. `semanticTokenDefinitions` Object

This object maps semantic token names to color values. These values are often aliases that reference specific steps within the primitive color palettes (e.g., `"{neutral.2}"`). The structure can be nested.

*   **Purpose**: To provide a layer of abstraction between design decisions (e.g., "the fill color of a step node") and the raw primitive color values.
*   **Alias Format**: `"{paletteName.stepNumber}"` (e.g., `"{neutral.6}"`, `"{accent.4}"`).
*   **Structure**:
    *   Node-specific tokens: `step`, `decision`, `entrypoints` (defining `fill`, `border`, `chip-fill`, `chip-icon`, `chip-text`, `title-text`, `desc-text`).
    *   General chip tokens: `chips` (with sub-types like `action`, `success`, `default`, `error`, `info`, `input`).
    *   Connector tokens: `connector` (`primary`, `secondary`).
    *   Divider token: `divider_line`.
*   **Example**:
    ```javascript
    step: {
        fill: "{neutral.2}",
        border: "{neutral.6}",
        "chip-fill": "{cyan.3}",
        // ... other properties
    },
    chips: {
        action: { fill: "{amber.4}", text: "{amber.12}" },
        default: { fill: "{accent.4}", text: "{accent.12}" } // Uses the dynamic accent
    }
    ```

### 4. `getThemeColors(mode: 'light' | 'dark', accentColorHex: string = '#3860FF'): Record<string, RGB>` Function

This is the main exported function and the heart of the theme generation logic.

*   **Parameters**:
    *   `mode: 'light' | 'dark'`: Specifies the desired theme mode.
    *   `accentColorHex: string` (optional, default: `'#3860FF'`): The user-selected accent color in HEX format.
*   **Returns**: `Record<string, RGB>` - A flat object where keys are "flattened" semantic token names (e.g., `step_fill`, `chips_action_text`) and values are `RGB` objects.
*   **Process**:
    1.  **Select Fixed Primitives**: Based on the `mode`, it chooses either `fixedPrimitiveThemeData.lightPrimitives` or `fixedPrimitiveThemeData.darkPrimitives`.
    2.  **Generate Dynamic Accent Palette**: Calls `generateCustomAccentPalette(accentColorHex, mode)` (from `../utils/color-generation`) to create the `accent` color palette. This function is expected to return a palette in the format `{"1": {r,g,b}, ..., "12": {r,g,b}}` where RGB values are already clamped between 0 and 1.
    3.  **Combine and Convert Primitives to RGB**:
        *   Iterates through the selected fixed primitives.
        *   Converts each HEX value to an RGB object using `hexToRgb()`.
        *   Clamps the RGB values using `clampRgb()` (both imported from `../utils/`).
        *   Stores these RGB palettes in `currentPrimitivesRgb`.
        *   Adds the dynamically generated `accent` palette (which is already in the correct RGB format) to `currentPrimitivesRgb`.
    4.  **Resolve Semantic Tokens**:
        *   Recursively traverses the `semanticTokenDefinitions` object.
        *   When it encounters a string value that is an alias (e.g., `"{neutral.2}"`):
            *   It parses the palette name (e.g., "neutral") and step (e.g., "2").
            *   It looks up the corresponding RGB color from `currentPrimitivesRgb`.
            *   The token path is flattened to create the key for the `finalColors` object (e.g., `step.fill` becomes `step_fill`).
            *   The resolved `RGB` object is assigned to this flattened key.
        *   Handles errors or missing tokens by assigning a fallback gray color.
    5.  Returns the `finalColors` record.

### 5. `FontsToLoad: FontName[]`

An array listing `FontName` objects for fonts that need to be loaded by Figma using `figma.loadFontAsync()` before text rendering. This is identical to the one in `styles.config.ts` and might be redundant if both are always imported together, or it could be for contexts where only theme/color related aspects are needed along with fonts.

*   Includes "Inter" with styles "Regular", "Medium", "Semi Bold", and "Bold".

## Helper Function Dependencies

*   **`hexToRgb(hex: string): RGB` (from `../utils/hexToRgb`)**: Converts a HEX color string to an `RGB` object (values 0-255 initially, then normalized in this module or by `clampRgb`).
*   **`generateCustomAccentPalette(baseHex: string, mode: 'light' | 'dark'): Record<string, RGB>` (from `../utils/color-generation`)**: Generates a 12-step accent color palette in LCH, then converts to RGB (0-1 range, clamped).
*   **`clampRgb(rgb: RGB): RGB` (from `../utils/color-generation`)**: Ensures RGB channel values are within the valid 0-1 range.

## Usage

The `getThemeColors` function is called by the plugin's main logic (`src-code/code.ts` or similar) when it needs to apply styles to Figma nodes. The user's current theme mode and chosen accent color are passed to it. The resulting `Record<string, RGB>` provides all the necessary colors for styling various parts of the flow diagram elements.

```typescript
// Hypothetical usage in src-code/code.ts
// import { getThemeColors, FontsToLoad } from './config/theme.config';
// import { figma } from '@figma/plugin-typings';

// async function applyStylesToNode(node: FrameNode, nodeType: string, userAccent: string, currentMode: 'light' | 'dark') {
//   await Promise.all(FontsToLoad.map(font => figma.loadFontAsync(font)));
//   const themeColors = getThemeColors(currentMode, userAccent);

//   const fillColor = themeColors[`${nodeType.toLowerCase()}_fill`];
//   if (fillColor) {
//     node.fills = [{ type: 'SOLID', color: fillColor }];
//   }

//   const borderColor = themeColors[`${nodeType.toLowerCase()}_border`];
//   if (borderColor) {
//     node.strokes = [{ type: 'SOLID', color: borderColor }];
//     node.strokeWeight = 1; // from styles.config.ts usually
//   }
//   // ... apply other colors to text, chips etc.
// }
```

## Relationships with Other Modules

*   **`../utils/hexToRgb.ts`**: Provides HEX to RGB conversion.
*   **`../utils/color-generation.ts`**: Provides accent palette generation and RGB clamping.
*   **`src-code/config/styles.config.ts`**: Manages non-color styles. `theme.config.ts` is responsible for all color aspects.
*   **Core Plugin Logic (e.g., `src-code/code.ts`, `src-code/lib/frames.ts`)**: Consumes the `getThemeColors` output to style Figma elements.
*   **Figma Plugin API**: The generated `RGB` values are directly usable with Figma API properties like `fills`, `strokes`, etc. The `FontName` objects are used with `figma.loadFontAsync`.

This module provides a sophisticated and flexible theming system, allowing for consistent styling that adapts to light/dark modes and user-defined accent colors, all while maintaining a clear separation between primitive colors and their semantic application.

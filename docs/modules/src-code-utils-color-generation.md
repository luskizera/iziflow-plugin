# Module: src-code/utils/color-generation.ts

## Purpose and Scope

This module provides functions for color manipulation and dynamic palette generation, specifically for creating a 12-step "accent" color palette based on a user-provided HEX color. It uses the LCH color space for generating harmonious shades and ensures that output RGB values are clamped within the valid [0, 1] range for the Figma API.

## Main Exported Functions

### `clampRgb(color: RGB): RGB`

Ensures that the `r`, `g`, and `b` components of an `RGB` color object are within the range [0, 1].

*   **Parameters**:
    *   `color: RGB`: An object with `r`, `g`, `b` properties (numbers).
*   **Returns**: `RGB`: A new `RGB` object with each component clamped to the [0, 1] interval.
*   **Logic**: Uses `Math.max(0, Math.min(1, value))` for each color channel.

### `generateCustomAccentPalette(accentColorHex: string, mode: 'light' | 'dark'): Record<string, RGB>`

Generates a 12-step accent color palette based on a base `accentColorHex` and the current theme `mode` ('light' or 'dark').

*   **Parameters**:
    *   `accentColorHex: string`: The base accent color in HEX format (e.g., `'#3860FF'`).
    *   `mode: 'light' | 'dark'`: The current theme mode, which influences the lightness curve of the generated palette.
*   **Returns**: `Record<string, RGB>`: An object where keys are strings `'1'` through `'12'`, and values are `RGB` objects (values normalized to 0-1) representing each step of the accent palette.
*   **Process**:
    1.  **Input Validation**: Checks if `accentColorHex` is a valid 6-digit HEX string.
        *   If invalid, it logs a warning and uses the corresponding "neutral" palette from `fixedPrimitiveThemeData` (defined in `theme.config.ts`) as a fallback. The fallback HEX values are converted to RGB and clamped.
    2.  **LCH Conversion**: If the HEX is valid, it parses the `accentColorHex` and converts it to the LCH (D65) color space using `culori.converter('lch65')()`.
        *   Handles cases where the input color is grayscale (LCH `c` (chroma) is 0 or `h` (hue) is undefined) by setting a default hue and chroma.
        *   If LCH conversion fails, it populates the palette with a fallback gray color and returns.
    3.  **Extract Base Hue and Chroma**: Stores the `h` (hue) and `c` (chroma) from the LCH conversion of the base accent color.
    4.  **Define Lightness Curves**: Uses predefined arrays of 12 lightness (L*) values: `lightnessStepsLight` and `lightnessStepsDark`. The appropriate array is chosen based on the `mode`.
    5.  **Generate Palette Steps**: Iterates 12 times (for each step):
        *   Gets the target `lightness` for the current step from the selected curve.
        *   Calculates an adjusted `chroma` for the current step. This involves a `chromaFactor` that typically reduces chroma for very light or very dark steps to maintain perceived harmony and avoid overly garish colors. The chroma is also clamped to a `maxChroma` value.
        *   The `baseHue` is generally kept constant across all steps.
        *   Constructs an `Lch65` color object for the current step using the calculated `lightness`, adjusted `chroma`, and `baseHue`.
        *   Converts this LCH color back to RGB using `culori.converter('rgb')()`.
        *   Clamps the resulting RGB values using `clampRgb()` to ensure they are in the [0, 1] range.
        *   Stores the clamped `RGB` object in the `paletteRgb` record, keyed by the step number (e.g., `"1"`, `"2"`).
        *   Includes error handling for LCH to RGB conversion, using a fallback gray if it fails.
    6.  **Logging (Development)**: The function includes `console.log` statements (commented out in the provided snippet) to output the final generated palette in HEX format for debugging purposes. This involves converting the internal RGB (0-1) palette to HEX using the internal `rgbToHex` function.
    7.  Returns the `paletteRgb` (an object mapping step strings to `RGB` objects).

## Internal Helper Functions

### `rgbToHex(rgb: RGB): string`

Converts an `RGB` object (with values in the [0, 1] range) to a 6-digit uppercase HEX string (e.g., `#RRGGBB`).

*   **Process**:
    1.  Clamps the input `rgb` values using `clampRgb()`.
    2.  Multiplies each component by 255 and rounds to the nearest integer.
    3.  Converts each 0-255 component to its 2-digit hexadecimal string representation (padding with a leading '0' if necessary).
    4.  Concatenates the components with a leading `#` and converts to uppercase.

## Dependencies

*   **`culori` library**: Used for color parsing, conversion between color spaces (HEX to LCH, LCH to RGB), and potentially other color operations.
*   **`../config/theme.config`**:
    *   Imports the `RGB` type definition.
    *   Imports `fixedPrimitiveThemeData` to use as a fallback if accent color generation fails or input is invalid.
*   **`Lch65` type (from `culori`)**: Used for type hinting LCH color objects.

## Usage Context

The `generateCustomAccentPalette` function is a key component of the dynamic theming system in `src-code/config/theme.config.ts`. It allows the IziFlow plugin to create a full 12-step color scale for accent colors based on a single color input from the user, ensuring that UI elements styled with "accent" tokens have a consistent and harmonious appearance across different lightness values, in both light and dark modes. The `clampRgb` function is a utility ensuring that all color values passed to the Figma API are valid.

This module plays a crucial role in providing color customization capabilities to the plugin.

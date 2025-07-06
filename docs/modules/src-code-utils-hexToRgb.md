# Module: src-code/utils/hexToRgb.ts

## Purpose and Scope

This module provides a single utility function, `hexToRgb`, for converting a hexadecimal (HEX) color string into an RGB color object. The RGB components in the output object are normalized to the range [0, 1], which is the format typically expected by the Figma plugin API for color properties.

## Main Exported Functions

### `hexToRgb(hex: string): { r: number; g: number; b: number }`

Converts a HEX color string (e.g., `#RRGGBB` or `RRGGBB`) to an RGB object.

*   **Parameters**:
    *   `hex: string`: The hexadecimal color string. It can optionally start with a `#`.
*   **Returns**: `{ r: number; g: number; b: number }`: An object representing the RGB color, where `r`, `g`, and `b` are numbers between 0 and 1 (inclusive).
*   **Process**:
    1.  **Remove Hash**: Removes the leading `#` from the `hex` string, if present.
    2.  **Parse to Integer**: Converts the (remaining) hexadecimal string into an integer using `parseInt(hex, 16)`. This integer represents the combined RGB value (e.g., `0xFF0000` for red).
    3.  **Extract Components**:
        *   Red (`r`): Shifts the integer 16 bits to the right (`>> 16`), performs a bitwise AND with `255` (or `0xFF`) to isolate the red component, and then divides by 255 to normalize it to the [0, 1] range.
        *   Green (`g`): Shifts the integer 8 bits to the right (`>> 8`), performs a bitwise AND with `255` to isolate the green component, and then divides by 255.
        *   Blue (`b`): Performs a bitwise AND with `255` to isolate the blue component, and then divides by 255.
    4.  Returns the object `{ r, g, b }`.

## Usage Example

```typescript
// import { hexToRgb } from './hexToRgb'; // Assuming usage within src-code

const redHex = "#FF0000";
const redRgb = hexToRgb(redHex);
// redRgb would be { r: 1, g: 0, b: 0 }

const blueHex = "0000FF";
const blueRgb = hexToRgb(blueHex);
// blueRgb would be { r: 0, g: 0, b: 1 }

const customColorHex = "#34A853"; // A shade of green
const customColorRgb = hexToRgb(customColorHex);
// customColorRgb would be approximately { r: 0.2039, g: 0.6588, b: 0.3254 }
```

## Error Handling

*   The function does not explicitly validate the input HEX string for correct length (e.g., 3-digit or 6-digit) or for valid hexadecimal characters beyond what `parseInt` handles. If `parseInt` fails to parse the string (e.g., due to invalid characters), it will return `NaN`. Subsequent bitwise operations on `NaN` will result in `0` for each component, effectively returning `{ r: 0, g: 0, b: 0 }` (black).
*   For very short invalid strings, `parseInt` might still produce a small number, leading to non-black but incorrect RGB values.

## Dependencies

*   None, beyond standard JavaScript features.

## Relationship with Other Modules

*   **`src-code/config/theme.config.ts`**: This utility is primarily used by `theme.config.ts` to convert HEX color strings from the `fixedPrimitiveThemeData` into the RGB format required for palette manipulation and for the Figma API.
*   Any other module within `src-code` that needs to convert HEX colors (perhaps from user input or other configurations) into Figma-compatible RGB objects could use this function.

This is a fundamental utility for color processing within the plugin's backend, bridging the common HEX color format with the Figma API's preferred RGB [0,1] format.

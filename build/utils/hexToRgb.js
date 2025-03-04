// src/utils/hexToRgb.ts
/**
 * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma.
 * @param hex Cor no formato HEX (#RRGGBB)
 * @returns Objeto {r, g, b} com valores normalizados entre 0 e 1.
 */
export function hexToRgb(hex) {
    const sanitizedHex = hex.replace("#", "");
    const r = parseInt(sanitizedHex.slice(0, 2), 16) / 255;
    const g = parseInt(sanitizedHex.slice(2, 4), 16) / 255;
    const b = parseInt(sanitizedHex.slice(4, 6), 16) / 255;
    return { r, g, b };
}
//# sourceMappingURL=hexToRgb.js.map
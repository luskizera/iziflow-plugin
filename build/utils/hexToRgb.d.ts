/**
 * Converte uma cor HEX para o formato RGB normalizado usado pelo Figma.
 * @param hex Cor no formato HEX (#RRGGBB)
 * @returns Objeto {r, g, b} com valores normalizados entre 0 e 1.
 */
export declare function hexToRgb(hex: string): {
    r: number;
    g: number;
    b: number;
};

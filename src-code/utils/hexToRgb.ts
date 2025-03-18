/**
 * Converte cor hexadecimal para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    hex = hex.replace(/^#/, '');
    
    const bigint = parseInt(hex, 16);
    
    return {
        r: ((bigint >> 16) & 255) / 255,
        g: ((bigint >> 8) & 255) / 255,
        b: (bigint & 255) / 255
    };
}
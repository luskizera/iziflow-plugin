import React from 'react';
import { RgbaColorPicker, type RgbaColor } from "react-colorful"; // Ou HexColorPicker

interface ColorSelectorPanelProps {
  color: string; // Recebe cor em HEX ou outro formato suportado
  setColor: (color: string) => void; // Função para atualizar a cor (espera HEX)
}

// Helper para converter HEX para RGBA object (react-colorful usa {r,g,b,a})
const hexToRgba = (hex: string): RgbaColor => {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b, a: 1 }; // Assume alpha 1
};

// Helper para converter RGBA object para HEX string
 const rgbaToHex = ({ r, g, b }: RgbaColor): string => {
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};


export function ColorSelectorPanel({ color, setColor }: ColorSelectorPanelProps) {
  const handleColorChangeRgba = (rgbaColor: RgbaColor) => {
      setColor(rgbaToHex(rgbaColor)); // Converte de volta para HEX ao atualizar
  };

  return (
    <RgbaColorPicker
        color={hexToRgba(color)} // Converte HEX para o formato do picker
        onChange={handleColorChangeRgba}
        className="!w-full !h-auto" // Exemplo de classes para ajustar tamanho
    />
    // Poderia adicionar inputs HEX/RGB aqui também se quisesse
  );
}
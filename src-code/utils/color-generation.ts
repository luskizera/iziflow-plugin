// src-code/utils/color-generation.ts
import * as culori from 'culori';
import type { RGB } from '../config/theme.config'; // Usa import type
import { fixedPrimitiveThemeData } from '../config/theme.config'; // Importa a constante exportada
import type { Lch65 } from 'culori'; // Adicionar importação do tipo

/**
 * Garante que os valores RGB estejam no intervalo [0, 1].
 */
export function clampRgb(color: RGB): RGB {
    return {
        r: Math.max(0, Math.min(1, color.r)),
        g: Math.max(0, Math.min(1, color.g)),
        b: Math.max(0, Math.min(1, color.b)),
    };
}

/**
 * Gera uma paleta de 12 tons para a escala 'accent' com base em uma cor HEX,
 * adaptada para o tema 'light' ou 'dark'. Usa o espaço de cor LCH para harmonia
 * e retorna cores no formato RGB normalizado (0-1) para a API do Figma.
 *
 * @param accentColorHex - Cor base em formato HEX (ex.: '#3860FF').
 * @param mode - Tema da paleta ('light' ou 'dark').
 * @returns Objeto com chaves '1' a '12', cada uma contendo um objeto RGB { r, g, b }.
 */
export function generateCustomAccentPalette(
  accentColorHex: string,
  mode: 'light' | 'dark'
): Record<string, RGB> {
  const palette: Record<string, RGB> = {};
  const fallbackColorRgb: RGB = { r: 0.5, g: 0.5, b: 0.5 }; // Cinza médio como fallback

  // Validação do formato HEX
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(accentColorHex);
  let color = isValidHex ? culori.parse(accentColorHex) : null;

  // Fallback para escala neutral se a cor for inválida
  if (!color) {
    console.warn(`[color-generation] Cor HEX inválida: ${accentColorHex}. Usando escala neutral como fallback.`);
    const neutralPalette = mode === 'dark'
        ? fixedPrimitiveThemeData.darkPrimitives.neutral
        : fixedPrimitiveThemeData.lightPrimitives.neutral;

    Object.keys(neutralPalette).forEach((step) => {
      const hex = neutralPalette[step as keyof typeof neutralPalette];
      const parsedFallback = culori.parse(hex);
      if (parsedFallback) {
        const rgb = culori.rgb(parsedFallback);
        if (rgb && typeof rgb.r === 'number') {
            // Usa clampRgb aqui também por segurança
            palette[step] = clampRgb({ r: rgb.r, g: rgb.g, b: rgb.b });
        } else {
             console.warn(`[color-generation] Falha ao converter fallback neutral ${step} para RGB.`);
             palette[step] = fallbackColorRgb;
        }
      } else {
         console.warn(`[color-generation] Falha ao parsear fallback neutral ${step}: ${hex}`);
         palette[step] = fallbackColorRgb;
      }
    });
    return palette;
  }

  // Converter para LCH (usando D65)
  let lchBase;
  try {
      lchBase = culori.converter('lch65')(color);
      if (!lchBase || typeof lchBase.h === 'undefined') {
          // Se não houver matiz (cinza), define c=0, h=0
          lchBase = { mode: 'lch65', l: lchBase?.l ?? (mode === 'light' ? 95 : 15), c: 0, h: 0 };
      }
  } catch (e) {
       console.error(`[color-generation] Erro ao converter ${accentColorHex} para LCH:`, e);
       for (let i = 1; i <= 12; i++) { palette[String(i)] = fallbackColorRgb; }
       return palette;
  }

  const baseHue = lchBase.h || 0;
  const baseChroma = lchBase.c;

  // Valores de luminosidade (L*)
  const lightnessStepsLight = [98.8, 96.3, 93.2, 89.8, 85.8, 81.3, 76.1, 69.2, 61.0, 51.1, 41.0, 20.0];
  const lightnessStepsDark =  [12.9, 17.2, 21.1, 24.2, 27.7, 31.8, 36.8, 43.0, 50.7, 60.8, 71.0, 93.0];
  const lightnessSteps = mode === 'dark' ? lightnessStepsDark : lightnessStepsLight;

  // Gerar os 12 tons
  lightnessSteps.forEach((lightness, index) => {
    const stepKey = String(index + 1);
    // Ajuste de croma pode precisar ser refinado para diferentes cores base e modos
    const chromaFactor = mode === 'light' ? (1 - index / 24) : (1 - (11 - index) / 24);
    const chroma = Math.max(0, Math.min(baseChroma * chromaFactor * 1.1, mode === 'light' ? 130 : 80)); // Ajustar croma maximo por modo?

    const lchColor: Lch65 = {
      mode: 'lch65',
      l: lightness,
      c: chroma,
      h: baseHue
    };

    try {
        const rgb = culori.converter('rgb')(lchColor);
        if (rgb && typeof rgb.r === 'number') {
            // Usa clampRgb antes de armazenar na paleta
            palette[stepKey] = clampRgb({
                r: rgb.r,
                g: rgb.g,
                b: rgb.b,
            });
        } else {
            console.warn(`[color-generation] Falha ao converter LCH para RGB no passo ${stepKey}. LCH:`, lchColor);
            palette[stepKey] = fallbackColorRgb;
        }
    } catch (e) {
         console.error(`[color-generation] Erro ao converter LCH ${JSON.stringify(lchColor)} para RGB no passo ${stepKey}:`, e);
         palette[stepKey] = fallbackColorRgb;
    }
  });

  return palette;
}
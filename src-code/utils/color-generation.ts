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
 * Converte um objeto RGB (valores 0-1) para uma string HEX (#RRGGBB).
 */
function rgbToHex(rgb: RGB): string {
    // Multiplica por 255 e arredonda para obter o valor inteiro 0-255
    const r = Math.round(clampRgb(rgb).r * 255);
    const g = Math.round(clampRgb(rgb).g * 255);
    const b = Math.round(clampRgb(rgb).b * 255);
    // Converte cada componente para string hexadecimal de 2 dígitos
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    // Concatena com # e retorna em maiúsculas
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}


/**
 * Gera uma paleta de 12 tons para a escala 'accent' com base em uma cor HEX,
 * adaptada para o tema 'light' ou 'dark'. Usa o espaço de cor LCH para harmonia
 * e retorna cores no formato RGB normalizado (0-1) para a API do Figma.
 * LOGA A PALETA GERADA EM FORMATO HEX NO CONSOLE.
 *
 * @param accentColorHex - Cor base em formato HEX (ex.: '#3860FF').
 * @param mode - Tema da paleta ('light' ou 'dark').
 * @returns Objeto com chaves '1' a '12', cada uma contendo um objeto RGB { r, g, b }.
 */
export function generateCustomAccentPalette(
  accentColorHex: string,
  mode: 'light' | 'dark'
): Record<string, RGB> {
  // Paleta final em RGB (formato para Figma API)
  const paletteRgb: Record<string, RGB> = {};
  // Cor de fallback caso algo dê errado
  const fallbackColorRgb: RGB = { r: 0.5, g: 0.5, b: 0.5 };

  // console.log(`[ColorGen] Iniciando geração da paleta Accent para ${mode} com base em ${accentColorHex}`);

  // Validação do formato HEX da cor de entrada
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(accentColorHex);
  let color = isValidHex ? culori.parse(accentColorHex) : null;

  // Se a cor HEX for inválida, usa a paleta 'neutral' como fallback
  if (!color) {
    // console.warn(`[ColorGen] Cor HEX inválida: ${accentColorHex}. Usando escala neutral como fallback.`);
    // Seleciona a paleta neutral correta (light/dark)
    const neutralPalette = mode === 'dark'
        ? fixedPrimitiveThemeData.darkPrimitives.neutral
        : fixedPrimitiveThemeData.lightPrimitives.neutral;

    // Converte a paleta neutral de HEX para RGB e armazena em paletteRgb
    Object.keys(neutralPalette).forEach((step) => {
      const hex = neutralPalette[step as keyof typeof neutralPalette];
      const parsedFallback = culori.parse(hex);
      if (parsedFallback) {
        const rgb = culori.rgb(parsedFallback);
        if (rgb && typeof rgb.r === 'number') {
            paletteRgb[step] = clampRgb({ r: rgb.r, g: rgb.g, b: rgb.b }); // Garante 0-1
        } else {
             console.warn(`[ColorGen] Falha ao converter fallback neutral ${step} para RGB.`);
             paletteRgb[step] = fallbackColorRgb;
        }
      } else {
         console.warn(`[ColorGen] Falha ao parsear fallback neutral ${step}: ${hex}`);
         paletteRgb[step] = fallbackColorRgb;
      }
    });

    // Loga a paleta fallback em formato HEX
    const paletteHexFallback: Record<string, string> = {};
    Object.keys(paletteRgb).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
        paletteHexFallback[key] = rgbToHex(paletteRgb[key]);
    });
    // console.log(`[ColorGen] Paleta Accent FINAL (${mode} - fallback neutral) em HEX:`, paletteHexFallback);

    return paletteRgb; // Retorna a paleta RGB (neutral neste caso)
  }

  // Converte a cor base válida para o espaço de cor LCH (D65)
  let lchBase;
  try {
      lchBase = culori.converter('lch65')(color);
      // Lida com cores cinzas (sem matiz definido)
      if (!lchBase || typeof lchBase.h === 'undefined') {
          lchBase = { mode: 'lch65', l: lchBase?.l ?? (mode === 'light' ? 95 : 15), c: 0, h: 0 }; // Define croma e matiz como 0
          // console.log(`[ColorGen] Cor base é cinza. Usando LCH:`, lchBase);
      } else {
           // console.log(`[ColorGen] Cor base convertida para LCH:`, lchBase);
      }
  } catch (e) {
       console.error(`[ColorGen] Erro ao converter ${accentColorHex} para LCH:`, e);
       // Preenche a paleta com fallback em caso de erro na conversão LCH
       for (let i = 1; i <= 12; i++) { paletteRgb[String(i)] = fallbackColorRgb; }
       // Loga a paleta fallback em formato HEX
       const paletteHexError: Record<string, string> = {};
       Object.keys(paletteRgb).forEach(key => { paletteHexError[key] = rgbToHex(paletteRgb[key]); });
       // console.log(`[ColorGen] Paleta Accent FINAL (${mode} - ERRO LCH) em HEX:`, paletteHexError);
       return paletteRgb; // Retorna fallback
  }

  // Extrai matiz e croma base
  const baseHue = lchBase.h || 0;
  const baseChroma = lchBase.c;

  // Define as curvas de luminosidade (L*) para light e dark mode
  const lightnessStepsLight = [98.8, 96.3, 93.2, 89.8, 85.8, 81.3, 76.1, 69.2, 61.0, 51.1, 41.0, 20.0];
  const lightnessStepsDark =  [12.9, 17.2, 21.1, 24.2, 27.7, 31.8, 36.8, 43.0, 50.7, 60.8, 71.0, 93.0];
  const lightnessSteps = mode === 'dark' ? lightnessStepsDark : lightnessStepsLight;

  // Gera os 12 tons da paleta
  lightnessSteps.forEach((lightness, index) => {
    const stepKey = String(index + 1);
    // Ajusta o croma (saturação) em cada passo
    // A fórmula pode precisar de ajustes finos para diferentes cores base
    const chromaFactor = mode === 'light' ? (1 - index / 24) : (1 - (11 - index) / 24);
    // Limita o croma máximo para evitar cores excessivamente saturadas
    const maxChroma = mode === 'light' ? 100 : 70; // Exemplo de limites (ajustar conforme necessário)
    const chroma = Math.max(0, Math.min(baseChroma * chromaFactor * 1.1, maxChroma)); // Multiplicador 1.1 aumenta um pouco a saturação

    // Cria o objeto de cor LCH para este passo
    const lchColor: Lch65 = {
      mode: 'lch65',
      l: lightness,
      c: chroma,
      h: baseHue
    };

    // Tenta converter a cor LCH de volta para RGB
    try {
        const rgb = culori.converter('rgb')(lchColor);
        // Verifica se a conversão foi bem-sucedida e grampeia os valores
        if (rgb && typeof rgb.r === 'number') {
            paletteRgb[stepKey] = clampRgb({ r: rgb.r, g: rgb.g, b: rgb.b });
        } else {
            // console.warn(`[ColorGen] Falha ao converter LCH para RGB no passo ${stepKey}. LCH:`, lchColor);
            paletteRgb[stepKey] = fallbackColorRgb;
        }
    } catch (e) {
         // Captura erros durante a conversão LCH -> RGB
         // console.error(`[ColorGen] Erro ao converter LCH ${JSON.stringify(lchColor)} para RGB no passo ${stepKey}:`, e);
         paletteRgb[stepKey] = fallbackColorRgb;
    }
  });

  // --- LOG DA PALETA FINAL EM FORMATO HEX ---
  // Cria um objeto temporário para armazenar os valores HEX
  const paletteHexForLog: Record<string, string> = {};
  // Itera sobre a paleta RGB gerada, ordena as chaves e converte para HEX
  Object.keys(paletteRgb)
        .sort((a, b) => parseInt(a) - parseInt(b)) // Ordena chaves '1', '2', ...
        .forEach(key => {
            paletteHexForLog[key] = rgbToHex(paletteRgb[key]); // Converte e armazena
  });
  // Exibe o objeto HEX no console do plugin
  // console.log(`[ColorGen] Paleta Accent FINAL gerada para ${mode} (${accentColorHex}) em HEX:`, paletteHexForLog);

  // Retorna a paleta original em formato RGB, que é o esperado pelo resto do código
  return paletteRgb;
}
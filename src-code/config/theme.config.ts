// src-code/config/theme.config.ts

import { hexToRgb } from "../utils/hexToRgb";
import { generateCustomAccentPalette, clampRgb } from "../utils/color-generation"; // Importa clampRgb também
import type { Lch65 } from 'culori'; // Adicionar importação do tipo

// --- Tipo para Clareza ---
export type RGB = { r: number; g: number; b: number };

// --- 1. Dados Primitivos FIXOS (SEM ACCENT) ---
// Mantém as paletas fixas que você definiu, mas remove 'accent'
export const fixedPrimitiveThemeData = {
  lightPrimitives: {
    neutral: {"1":"#FCFCFE","2":"#F9F9FD","3":"#EFF0F6","4":"#E7E8F0","5":"#DFE0EA","6":"#D7D8E4","7":"#CCCEDC","8":"#B8BACD","9":"#8A8C9E","10":"#808293","11":"#626371","12":"#1F1F29"},
    grass: {"1":"#FBFEFB","2":"#F5FBF5","3":"#E9F6E9","4":"#DAF1DB","5":"#C9E8CA","6":"#B2DDB5","7":"#94CE9A","8":"#65BA74","9":"#46A758","10":"#3E9B4F","11":"#2A7E3B","12":"#203C25"},
    ruby: {"1":"#FFFCFD","2":"#FFF7F8","3":"#FEEAED","4":"#FFDCE1","5":"#FFCED6","6":"#F8BFC8","7":"#EFACB8","8":"#E592A3","9":"#E54666","10":"#DC3B5D","11":"#CA244D","12":"64172B"}, // Corrigido: #64172B missing hash
    orange: {"1":"#FEFCFB","2":"#FFF7ED","3":"#FFEFD6","4":"#FFDFB5","5":"#FFD19A","6":"#FFC182","7":"#F5AE73","8":"#EC9455","9":"#F76B15","10":"#EF5F00","11":"#CC4E00","12":"#582D1D"},
    cyan: {"1":"#FAFDFE","2":"#F2FAFB","3":"#DEF7F9","4":"#CAF1F6","5":"#B5E9F0","6":"#9DDDE7","7":"#7DCEDC","8":"#3DB9CF","9":"#00A2C7","10":"#0797B9","11":"#107D98","12":"#0D3C48"},
    amber: {"1":"#FEFDFB","2":"#FEFBE9","3":"#FFF7C2","4":"#FFEE9C","5":"#FBE577","6":"#F3D673","7":"#E9C162","8":"#E2A336","9":"#FFC53D","10":"#FFBA18","11":"#AB6400","12":"#4F3422"}
  },
  darkPrimitives: {
    neutral: {"1":"#101116","2":"#18191E","3":"#212229","4":"#282933","5":"#2E303B","6":"#373847","7":"#444656","8":"#5D5F70","9":"#6A6C7E","10":"#787A8C","11":"#B0B2C5","12":"#EDEEF3"},
    grass: {"1":"#0e1511","2":"#141a15","3":"#1b2a1e","4":"#1d3a24","5":"#25482d","6":"#2d5736","7":"#366740","8":"#3e7949","9":"#46a758","10":"#53b365","11":"#71d083","12":"#c2f0c2"},
    ruby: {"1":"#191113","2":"#1e1517","3":"#3a141e","4":"#4e1325","5":"#5e1a2e","6":"#6f2539","7":"#883447","8":"#b3445a","9":"#e54666","10":"#ec5a72","11":"#ff949d","12":"#fed2e1"},
    orange: {"1":"#17120e","2":"#1e160f","3":"#331e0b","4":"#462100","5":"#562800","6":"#66350c","7":"#7e451d","8":"#a35829","9":"#f76b15","10":"#ff801f","11":"#ffa057","12":"#ffe0c2"},
    cyan: {"1":"#0b161a","2":"#101b20","3":"#082c36","4":"#003848","5":"#004558","6":"#045468","7":"#12677e","8":"#11809c","9":"#00a2c7","10":"#23afd0","11":"#4ccce6","12":"#b6ecf7"},
    amber: {"1":"#16120C","2":"#1C1812","3":"#302008","4":"#3E2700","5":"#4C3000","6":"#5B3D06","7":"#704F1A","8":"#8F6424","9":"#FFC53D","10":"#FFD60A","11":"#FFCA16","12":"#FFE7B3"}
  }
};

// --- 2. Mapeamento Semântico ---
export const semanticTokenDefinitions = {
  step: {fill:"{neutral.2}",border:"{neutral.6}","chip-fill":"{cyan.3}","chip-icon":"{cyan.9}","chip-text":"{cyan.11}","title-text":"{neutral.12}","desc-text":"{neutral.11}"},
  decision: {fill:"{neutral.2}",border:"{neutral.6}","chip-fill":"{orange.3}","chip-icon":"{orange.9}","chip-text":"{orange.11}","title-text":"{neutral.12}"},
  // CORRIGIDO: "chip_fill" -> "chip-fill"
  entrypoints: {fill:"{neutral.2}",border:"{neutral.6}","chip-fill":"{grass.3}","chip-icon":"{grass.9}","chip-text":"{grass.11}","title-text":"{neutral.12}"},
  chips: {
    action:     {fill:"{amber.4}",   text:"{amber.12}"},
    success:    {fill:"{grass.4}",   text:"{grass.12}"}, 
    default:    {fill:"{accent.4}",   text:"{accent.12}"},
    error:      {fill:"{ruby.4}",     text:"{ruby.12}"},
    info:       {fill:"{cyan.4}",     text:"{cyan.12}"},
    input:      {fill:"{neutral.4}",  text:"{neutral.12}"},
  },
  connector: {primary:"{neutral.12}", secondary:"{neutral.8}"},
  // ADICIONADO: Token para a cor do divisor
  divider_line: "{neutral.6}" // Conforme a especificação de Layout (border do neutral.6)
};

// --- 3. Função Principal Exportada (Modificada para usar generateCustomAccentPalette e clampRgb) ---

/**
 * Calcula as cores finais em formato RGB para um determinado modo e cor de destaque.
 * Gera a paleta 'accent' dinamicamente usando generateCustomAccentPalette.
 * @param mode - O modo de cor ('light' ou 'dark').
 * @param accentColorHex - A cor de destaque fornecida pelo usuário em formato HEX (ex: '#3860FF'). Default '#3860FF'.
 * @returns Um objeto onde as chaves são nomes de tokens semânticos achatados e os valores são objetos RGB.
 */
export function getThemeColors(mode: 'light' | 'dark', accentColorHex: string = '#3860FF'): Record<string, RGB> {

  // --- a. Seleciona Primitivas Fixas ---
  const fixedPrimitives = mode === 'dark'
    ? fixedPrimitiveThemeData.darkPrimitives
    : fixedPrimitiveThemeData.lightPrimitives;

  // --- b. Gera Paleta Accent Dinâmica (em formato RGB 0-1) ---
  // A função generateCustomAccentPalette já retorna o formato { "1": {r,g,b}, ... }
  // generateCustomAccentPalette já usa clampRgb internamente
  const generatedAccentPaletteRgb = generateCustomAccentPalette(accentColorHex, mode);
  // console.log(`[theme.config] Paleta Accent gerada para ${mode} com base em ${accentColorHex}:`, generatedAccentPaletteRgb);


  // --- c. Combina Primitivas Fixas (convertidas para RGB e grampeadas) + Accent Gerada ---
  const currentPrimitivesRgb: Record<string, Record<string, RGB>> = {};

  // Converte primitivas fixas para RGB e grampeia
  for (const scaleName in fixedPrimitives) {
      currentPrimitivesRgb[scaleName] = {};
      const scaleHex = fixedPrimitives[scaleName as keyof typeof fixedPrimitives];
      for (const step in scaleHex) {
          try {
              // @ts-ignore - Acesso dinâmico
              const rgb = hexToRgb(scaleHex[step]);
              currentPrimitivesRgb[scaleName][step] = clampRgb(rgb); // <<< Usa clampRgb aqui
          } catch (e) {
              // console.error(`[theme.config] Erro ao converter HEX fixo ${scaleName}.${step}: ${scaleHex[step as keyof typeof scaleHex]}`, e);
              currentPrimitivesRgb[scaleName][step] = { r: 0.5, g: 0.5, b: 0.5 }; // Fallback cinza
          }
      }
  }

  // Adiciona a paleta accent gerada (que já está em RGB e grampeada)
  currentPrimitivesRgb['accent'] = generatedAccentPaletteRgb;

  // --- d. Resolve Tokens Semânticos usando as primitivas RGB combinadas ---
  const finalColors: Record<string, RGB> = {};
  const aliasRegex = /\{(\w+)\.(\d+)\}/;

  function processTokens(tokenValue: any, currentPath: string[] = []) {
    const flattenedTokenName = currentPath.join('_'); // Este é o formato de achatamento

    if (typeof tokenValue === 'string' && aliasRegex.test(tokenValue)) {
      const aliasMatch = tokenValue.match(aliasRegex);
      if (aliasMatch) {
        const [, scaleName, step] = aliasMatch;

        // Acessa a paleta primitiva correta (já em RGB e grampeada)
        // @ts-ignore
        const primitivePaletteRgb = currentPrimitivesRgb[scaleName];

        if (primitivePaletteRgb) {
          // Acessa o passo específico (já é um objeto RGB)
          // @ts-ignore
          const rgbColor = primitivePaletteRgb[step];
          if (rgbColor) {
            finalColors[flattenedTokenName] = rgbColor; // <<< Atribui diretamente o objeto RGB (já grampeado)
          } else {
            // console.warn(`[theme.config] Passo ${step} não encontrado na primitiva RGB ${scaleName} para ${mode} (Token: ${flattenedTokenName})`);
            finalColors[flattenedTokenName] = { r: 0.5, g: 0.5, b: 0.5 }; // Fallback
          }
        } else {
           console.warn(`[theme.config] Primitiva RGB ${scaleName} não encontrada para ${mode} (Token: ${flattenedTokenName})`);
           finalColors[flattenedTokenName] = { r: 0.5, g: 0.5, b: 0.5 }; // Fallback
        }
      } else if (tokenValue !== "{placeholder}") {
         // console.warn(`[theme.config] Formato de alias inválido para ${flattenedTokenName}: ${tokenValue}`);
         finalColors[flattenedTokenName] = { r: 0.5, g: 0.5, b: 0.5 }; // Fallback
      }

    } else if (typeof tokenValue === 'object' && tokenValue !== null) {
      for (const key in tokenValue) {
        // Usa `key` diretamente no path, sem tentar substituir hifens
        processTokens(tokenValue[key], [...currentPath, key]);
      }
    }
  }
  
  // Processa semanticTokenDefinitions para gerar finalColors
  // Cria uma cópia para não modificar o objeto original durante o processamento
  const definitionsToProcess = JSON.parse(JSON.stringify(semanticTokenDefinitions));
  processTokens(definitionsToProcess);

  // console.log(`[theme.config] Cores finais RGB calculadas para modo ${mode} e accent ${accentColorHex}:`, finalColors);
  return finalColors;
}

// --- 4. Exportar Fontes ---
export const FontsToLoad: FontName[] = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
];
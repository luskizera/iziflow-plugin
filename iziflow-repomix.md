This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
- Pay special attention to the Repository Description. These contain important context and guidelines specific to this project.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: **/*
- Files matching these patterns are excluded: **/*.min.js, **/*.map, **/coverage/**, **/test-results/**, **/*.test.js, **/*.spec.js, **/docs/**, **/*.md, **/package-lock.json, **/yarn.lock, **/.env*, **/build/**, **/public/**, **/*.png, **/*.jpg, **/*.gif, **/*.svg, **/*.ico
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info
### User Provided Header
IziFlow - Codebase for Architecture Review and Code Quality Analysis

# Directory Structure
```
.gitignore
.npmignore
.npmrc
.repomixignore
components.json
figma.config.ts
index.html
package.json
shared/schemas/schema.ts
shared/types/flow.types.ts
shared/types/messaging.types.ts
src-code/code.ts
src-code/config/icons.ts
src-code/config/layout.config.ts
src-code/config/styles.config.ts
src-code/config/theme.config.ts
src-code/lib/connectors.ts
src-code/lib/frames.ts
src-code/lib/layout.ts
src-code/lib/markdownParser.ts
src-code/tsconfig.json
src-code/utils/code-utils.ts
src-code/utils/color-generation.ts
src-code/utils/hexToRgb.ts
src-code/utils/historyStorage.ts
src-code/utils/layoutManager.ts
src-code/utils/logger.ts
src-code/utils/nodeCache.ts
src/components/app copy.tsx
src/components/app.tsx
src/components/providers/theme-provider.tsx
src/components/ui/accordion.tsx
src/components/ui/alert-dialog.tsx
src/components/ui/alert.tsx
src/components/ui/aspect-ratio.tsx
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/breadcrumb.tsx
src/components/ui/button.tsx
src/components/ui/calendar.tsx
src/components/ui/card.tsx
src/components/ui/carousel.tsx
src/components/ui/chart.tsx
src/components/ui/checkbox.tsx
src/components/ui/collapsible.tsx
src/components/ui/color-picker.tsx
src/components/ui/color-selector-panel.tsx
src/components/ui/command.tsx
src/components/ui/context-menu.tsx
src/components/ui/dialog.tsx
src/components/ui/drawer.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/form.tsx
src/components/ui/hover-card.tsx
src/components/ui/input-otp.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/menubar.tsx
src/components/ui/navigation-menu.tsx
src/components/ui/pagination.tsx
src/components/ui/popover.tsx
src/components/ui/progress.tsx
src/components/ui/radio-group.tsx
src/components/ui/resizable.tsx
src/components/ui/scroll-area.tsx
src/components/ui/select.tsx
src/components/ui/separator.tsx
src/components/ui/sheet.tsx
src/components/ui/sidebar.tsx
src/components/ui/skeleton.tsx
src/components/ui/slider.tsx
src/components/ui/sonner.tsx
src/components/ui/switch.tsx
src/components/ui/tabgroup.tsx
src/components/ui/table.tsx
src/components/ui/tabs.tsx
src/components/ui/textarea.tsx
src/components/ui/toggle-group.tsx
src/components/ui/toggle.tsx
src/components/ui/tooltip.tsx
src/globals.d.ts
src/hooks/use-mobile.ts
src/hooks/use-mobile.tsx
src/index-react.tsx
src/index.css
src/lib/utils.ts
src/main.tsx
src/primitives/colors.css
src/primitives/index.css
src/theme.css
src/types/figma.d.ts
src/utils/utils.ts
src/vite-env.d.ts
tsconfig.app.json
tsconfig.json
vite.config.code.ts
vite.config.ts
```

# Files

## File: .repomixignore
```
# Build outputs
build/
dist/
out/
coverage/

# Dependencies  
node_modules/
.pnp/
.pnp.js

# Testing
test-results/
*.test.js
*.spec.js
__tests__/

# Documentation
docs/
*.md
README*

# Assets
*.png
*.jpg
*.jpeg
*.gif
*.svg
*.ico
*.woff
*.woff2

# Configs específicos
*.config.js
webpack.config.*
babel.config.*
jest.config.*

# Logs e temporários
*.log
*.tmp
.cache/
```

## File: src/components/app copy.tsx
```typescript
// src/components/app.tsx
import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "@/components/providers/theme-provider";
import { SunIcon, MoonIcon, InfoIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Nova logo fornecida pelo usuário
const IziFlowLogo = () => (
  <svg width="101" height="25" viewBox="0 0 101 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="iziFlow Logo">
    <path d="M8.90476 0.854185C10.343 0.70847 12.0985 1.1559 11.591 2.96447C10.9105 5.3919 5.44019 6.57818 5.1419 9.01418C4.99104 10.2468 6.04704 10.629 7.0859 10.3856C11.279 9.40333 15.5596 1.59818 20.2962 3.83018C22.1305 4.6959 22.5676 6.64161 22.0482 8.4759C21.0402 12.0433 15.6076 15.9245 16.1408 19.6325C16.3173 20.853 17.6288 21.4325 18.6488 20.7159C19.703 19.9753 19.6773 18.789 20.2842 17.8719C21.0539 16.7079 22.1888 17.6765 22.4768 18.6725C23.2653 21.3982 20.8859 24.7359 18.0505 24.9742C14.447 25.2759 12.7139 22.965 13.4253 19.5433C13.5385 18.9948 13.9396 18.0845 13.9722 17.625C14.0202 16.9702 13.4476 17.097 13.0448 17.2736C9.86133 18.6708 7.30876 24.5216 4.14247 24.7856C1.4819 25.0068 0.475614 22.437 1.7459 20.3165C3.86133 16.7885 10.7836 15.9536 14.3305 13.893C15.7945 13.0428 19.283 10.4696 18.2356 8.46561C17.2413 6.56447 14.4128 8.43304 13.3105 9.28333C10.6893 11.3045 7.4099 14.6936 3.70876 13.1165C-1.94496 10.7079 4.55733 1.29647 8.90476 0.854185Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M73.9113 9.29715C75.2141 9.29715 76.3713 9.58004 77.3827 10.1458C78.3941 10.7115 79.1913 11.5 79.7741 12.5114C80.357 13.5057 80.6484 14.6629 80.6484 15.9829C80.6484 17.2857 80.357 18.4429 79.7741 19.4543C79.1913 20.4486 78.3941 21.2285 77.3827 21.7942C76.3713 22.3599 75.2141 22.6428 73.9113 22.6428C72.6084 22.6428 71.4428 22.3599 70.4142 21.7942C69.4028 21.2285 68.6056 20.4486 68.0228 19.4543C67.4399 18.4429 67.1484 17.2857 67.1484 15.9829C67.1484 14.6629 67.4399 13.5057 68.0228 12.5114C68.6056 11.5 69.4028 10.7115 70.4142 10.1458C71.4428 9.58006 72.6084 9.29716 73.9113 9.29715ZM73.9113 11.9972C73.1741 11.9972 72.5228 12.1686 71.9571 12.5114C71.4085 12.8371 70.9713 13.3 70.6456 13.8999C70.337 14.4828 70.1827 15.1685 70.1827 15.9571C70.1827 16.7457 70.337 17.44 70.6456 18.04C70.9713 18.64 71.4085 19.1114 71.9571 19.4543C72.5228 19.78 73.1742 19.9428 73.9113 19.9428C74.6484 19.9428 75.2913 19.78 75.8398 19.4543C76.4055 19.1114 76.8428 18.64 77.1513 18.04C77.4599 17.44 77.6142 16.7457 77.6142 15.9571C77.6142 15.1685 77.4599 14.4828 77.1513 13.8999C76.8428 13.3 76.4055 12.8372 75.8398 12.5114C75.2913 12.1686 74.6484 11.9972 73.9113 11.9972Z" fill="currentColor"/>
    <path d="M33.2115 22.3343H30.2028V9.65709H33.2115V22.3343Z" fill="currentColor"/>
    <path d="M44.7945 12.1513L38.3145 19.8142H44.7945V22.3343H34.6116V19.8656L41.0145 12.1771H34.6116V9.65709H44.7945V12.1513Z" fill="currentColor"/>
    <path d="M48.8504 22.3343H45.8417V9.65709H48.8504V22.3343Z" fill="currentColor"/>
    <path d="M62.4391 6.4942H54.0304V11.7656H61.1018V14.62H54.0304V22.3343H50.8677V3.56283H62.4391V6.4942Z" fill="currentColor"/>
    <path d="M66.2901 22.3343H63.3073V3.22852H66.2901V22.3343Z" fill="currentColor"/>
    <path d="M85.2257 15.2886C85.38 15.7857 85.517 16.3001 85.637 16.8315C85.7742 17.3629 85.9028 17.9286 86.0228 18.5285C86.0913 18.1171 86.1686 17.74 86.2543 17.3972C86.34 17.0543 86.4342 16.7199 86.537 16.3942C86.6399 16.0514 86.7514 15.6829 86.8714 15.2886L88.6971 9.65709H91.7571L93.5057 15.2886C93.5571 15.4258 93.6171 15.6315 93.6856 15.9057C93.7542 16.18 93.8313 16.48 93.917 16.8057C94.0199 17.1143 94.1056 17.4229 94.1741 17.7315C94.2427 18.04 94.3029 18.2972 94.3543 18.5029C94.4229 18.1772 94.4999 17.8171 94.5856 17.4228C94.6885 17.0285 94.7913 16.6514 94.8942 16.2914C95.0142 15.9143 95.1085 15.58 95.1771 15.2886L96.9513 9.65709H100.114L95.7428 22.3343H92.9142L91.1142 16.6257C90.8571 15.82 90.6514 15.1343 90.4971 14.5686C90.36 13.9857 90.2656 13.5314 90.2142 13.2057C90.1456 13.5143 90.0428 13.9257 89.9057 14.44C89.7685 14.9372 89.5542 15.6829 89.2628 16.6771L87.437 22.3343H84.4799L80.3656 9.65709H83.5027L85.2257 15.2886Z" fill="currentColor"/>
    <path d="M31.6943 3.33147C32.1914 3.33147 32.62 3.5114 32.98 3.87137C33.34 4.23137 33.5201 4.66858 33.5201 5.18287C33.5201 5.69713 33.34 6.13421 32.98 6.4942C32.62 6.8542 32.1914 7.03426 31.6943 7.03426C31.18 7.03426 30.743 6.85419 30.383 6.4942C30.023 6.1342 29.8429 5.69714 29.8429 5.18287C29.8429 4.66858 30.023 4.23137 30.383 3.87137C30.7429 3.51142 31.18 3.33148 31.6943 3.33147Z" fill="currentColor"/>
    <path d="M47.3331 3.33147C47.8303 3.33147 48.2589 3.5114 48.6188 3.87137C48.9788 4.23137 49.1589 4.66858 49.1589 5.18287C49.1589 5.69713 48.9788 6.13421 48.6188 6.4942C48.2588 6.8542 47.8303 7.03426 47.3331 7.03426C46.8189 7.03426 46.3818 6.85419 46.0218 6.4942C45.6618 6.1342 45.4817 5.69714 45.4817 5.18287C45.4817 4.66858 45.6618 4.23137 46.0218 3.87137C46.3818 3.51142 46.8189 3.33148 47.3331 3.33147Z" fill="currentColor"/>
  </svg>
);

// Helper for HEX validation
function isValidHex(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color);
}

type NodeGenerationMode = "light" | "dark";

export function App() {
  const [markdown, setMarkdown] = useState("");
  const [accentColor, setAccentColor] = useState<string>("#3860FF");
  const [inputValue, setInputValue] = useState<string>(accentColor);
  const [nodeMode, setNodeMode] = useState<NodeGenerationMode>("dark");
  const [activeTab, setActiveTab] = useState<string>("generator");
  const { theme: uiTheme, setTheme: setUiTheme } = useTheme();

  // Accent color handlers
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;
    if (newValue.startsWith('#')) {
      newValue = '#' + newValue.substring(1).replace(/[^0-9a-fA-F]/gi, '');
    } else {
      newValue = '#' + newValue.replace(/[^0-9a-fA-F]/gi, '');
    }
    newValue = newValue.substring(0, 7);
    setInputValue(newValue.toUpperCase());
    if (isValidHex(newValue)) setAccentColor(newValue.toUpperCase());
  };
  const handleInputBlur = () => {
    if (!isValidHex(inputValue)) setInputValue(accentColor.toUpperCase());
    else setAccentColor(inputValue.toUpperCase());
  };
  const handleNodeModeChange = (value: string) => {
  if (value === "dark" || value === "light") setNodeMode(value);
};

  // Layout principal
  return (
    <TooltipProvider>
      <div className="h-[500px] flex flex-col items-center justify-center bg-background">
        <div className="bg-background w-[624px] h-full p-6 flex flex-col grow gap-5 pb-3">
          {/* Header */}
          <div className="flex justify-between items-center">
            <IziFlowLogo />
            <Button
              variant="ghost" size="icon"
              onClick={() => setUiTheme(uiTheme === "dark" ? "light" : "dark")}
              title={uiTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              type="button"
            >
              {uiTheme === "dark" ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col gap-2">
            <TabsList className="w-full rounded-lg flex gap-1">
              <TabsTrigger value="generator" className="flex-1">
                Create Flow
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                History
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex-1">
                Manual Create
              </TabsTrigger>
            </TabsList>

            {/* Tab Content: Create Flow */}
            <TabsContent value="generator" className="w-full h-full grow flex flex-col gap-3">
              {/* Textarea */}
              <div className="relative w-full h-full flex-grow">
                <Textarea
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  placeholder="Paste your iziFlow Markdown here."
                  className="w-full h-full resize-none"
                />
              </div>

              {/* Customization Section */}
              <div className="w-full flex flex-col gap-1">
                <h3 className="text-foreground font-semibold leading-7 text-base">Customize nodes</h3>
                <div className="flex gap-3 items-end w-full">
                  {/* Accent Color */}
                  <div className="w-[259px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-foreground font-medium">Accent Color</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="size-3 text-zinc-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          <span className="text-xs">Define accent color (HEX).</span>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="h-9 rounded-md relative w-full border border-border flex items-center pl-3">
                      <div
                        className="size-4 rounded-sm mr-3"
                        style={{ backgroundColor: isValidHex(accentColor) ? accentColor : "#3860FF" }}
                      />
                      <Input
                        className="w-full border-none"
                        type="text"
                        maxLength={7}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        aria-label="Accent color hex value"
                      />
                    </div>
                  </div>
                  {/* Theme Toggle */}
                  <div className="grow">
                    <Tabs value={nodeMode} onValueChange={handleNodeModeChange}>
                      <TabsList className="w-full">
                        <TabsTrigger
                          value="dark"
                          className="flex-1"
                        >
                          <MoonIcon className="size-4" />
                          <span>Dark mode</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="light"
                          className="flex-1"
                        >
                          <SunIcon className="size-4 text-zinc-500" />
                          <span>Light mode</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={() => setMarkdown("")}
                >
                  Clean Text
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  type="button"
                  onClick={() => {/* Substitua por sua lógica de geração */}}
                >
                  Generate Flow
                </Button>
              </div>
            </TabsContent>

            {/* As outras Tabs (History, Manual Create) devem seguir estrutura lógica do app original */}
          </Tabs>
          {/* Footer */}
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-muted-foreground">Made with ♥ by IziTools</span>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://chatgpt.com/g/g-680800ab82a88191afc106220253ff30-iziflow-assistant" target="_blank" rel="noopener noreferrer">IziFlow Copilot</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/luskizera/iziflow-plugin" target="_blank" rel="noopener noreferrer">GitHub</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://www.luski.studio/izitools/" target="_blank" rel="noopener noreferrer">iziTools Website</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
```

## File: .npmignore
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

src/code.js
.tmp
zip
vite.config.ts.timestamp*
package-lock.json
pnpm-lock.yaml
```

## File: .npmrc
```
legacy-peer-deps=true
```

## File: shared/types/flow.types.ts
```typescript
// src/lib/types.ts

/**
 * Representa um campo individual dentro da descrição de um nó.
 * Exportado para ser usado por FlowNode e outros módulos.
 */
export interface DescriptionField {
  label: string;
  /** O conteúdo pode ser uma string simples, uma lista ou um objeto chave-valor. */
  content: string | string[] | Record<string, string>;
  /** Permite propriedades adicionais, se necessário. */
  [key: string]: any;
}

/**
 * Representa a estrutura de um nó individual no fluxo, conforme definido no JSON.
 * Exportado para ser usado por Flow, FlowData e NodeData.
 */
export interface FlowNode {
  id: string;
  type: "START" | "END" | "STEP" | "DECISION" | "ENTRYPOINT";
  name: string;
  metadata?: {
    category?: string;
    createdBy?: string;
    [key: string]: any; // Permite outras propriedades em metadata
  };
  /**
   * CORREÇÃO: 'description' agora é um objeto opcional
   * que CONTÉM a propriedade 'fields' (que é o array).
   */
  description?: { // <--- Agora é um objeto opcional
    fields: DescriptionField[]; // <--- O array está aqui dentro
    // Você pode adicionar outras propriedades aqui no futuro se precisar
    // title?: string;
  };
}

/**
 * Alias para FlowNode, exportado para uso em módulos como code.ts, frames.ts, etc.
 */
export type NodeData = FlowNode;

/**
 * Representa uma conexão entre dois nós.
 */
export interface Connection {
  id?: string; // ID pode ser opcional
  from: string;
  to: string;
  condition?: string;
  /** Usado nos seus exemplos JSON para a etiqueta da conexão. */
  conditionLabel?: string; // Mantido/Adicionado
  secondary?: boolean;
}

/**
 * Representa um fluxo completo com nome, nós e conexões.
 */
export interface Flow {
  flowName?: string; // Nome do fluxo pode ser opcional
  nodes: FlowNode[];
  connections: Connection[];
}

/**
 * Representa a estrutura geral do JSON de entrada.
 * Pode ser um Flow diretamente ou um objeto contendo um array 'flows'.
 */
export interface FlowData {
  flowName?: string;
  nodes?: FlowNode[];
  connections?: Connection[];
  flows?: Flow[];
}
```

## File: src-code/config/icons.ts
```typescript
// src-code/config/icons.ts

// Importa o CONTEÚDO dos arquivos SVG como strings usando ?raw
// Certifique-se que o caminho relativo está correto a partir DESTE arquivo.
import entrypointIconSvgString from '../assets/icons/entrypoint.svg?raw';
import stepIconSvgString from '../assets/icons/step.svg?raw';
import decisionIconSvgString from '../assets/icons/decision.svg?raw';

// Mapeamento do tipo de nó para a string SVG correspondente
const nodeTypeToSvgMap: Record<string, string | undefined> = {
    // Chaves em MAIÚSCULAS para corresponder a nodeData.type
    ENTRYPOINT: entrypointIconSvgString,
    STEP: stepIconSvgString,
    DECISION: decisionIconSvgString,
    // START e END não têm ícones definidos neste mapeamento
};

/**
 * Obtém a string SVG para um determinado tipo de nó.
 * Retorna undefined se nenhum ícone for mapeado para o tipo.
 * @param nodeType - O tipo do nó (ex: 'STEP', 'DECISION', 'ENTRYPOINT').
 * @returns A string SVG ou undefined.
 */
export function getIconSvgStringForNodeType(nodeType: string): string | undefined {
    return nodeTypeToSvgMap[nodeType.toUpperCase()]; // Garante comparação case-insensitive
}
```

## File: src-code/utils/hexToRgb.ts
```typescript
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
```

## File: src-code/utils/logger.ts
```typescript
export const Logger = {
  info: (context: string, message: any, ...args: any[]) => {
    console.log(`[${context}]`, message, ...args);
  },
  
  error: (context: string, message: any, error?: any) => {
    console.error(`[${context}] ❌`, message, error || '');
  },
  
  success: (context: string, message: any) => {
    console.log(`[${context}] ✓`, message);
  },
  
  debug: (context: string, message: any, data?: any) => {
    console.debug(`[${context}] 🔍`, message, data || '');
  },

  warn: (context: string, message: any, data?: any) => {
    console.warn(`[${context}] ⚠️`, message, data || '');
  }
};
```

## File: src/components/providers/theme-provider.tsx
```typescript
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

const ThemeProviderContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: "light",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
```

## File: src/components/ui/color-picker.tsx
```typescript
// src/components/ui/color-picker.tsx (ou seu caminho correto)
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
// Importa explicitamente SliderProps e o componente Root do slider Radix
import { Root as SliderRoot, Thumb, Track, type SliderProps } from "@radix-ui/react-slider"
import Color, { type ColorLike } from "color"; // Importa ColorLike
import { PipetteIcon } from "lucide-react"
import {
  type ChangeEventHandler,
  type ComponentProps,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type FC // Importa FC para componentes funcionais
} from "react"

// --- Contexto ---
interface ColorPickerContextValue {
  hue: number
  saturation: number
  lightness: number
  alpha: number
  mode: string
  setHue: (hue: number) => void
  setSaturation: (saturation: number) => void
  setLightness: (lightness: number) => void
  setAlpha: (alpha: number) => void
  setMode: (mode: string) => void
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(undefined)

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext)
  if (!context) { throw new Error("useColorPicker must be used within a ColorPickerProvider") }
  return context
}

// --- Componente Principal ColorPicker ---
export type ColorPickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> & {
  value?: ColorLike;
  defaultValue?: ColorLike;
  onChange?: (value: ColorLike) => void;
}

export const ColorPicker: FC<ColorPickerProps> = ({
  value,
  defaultValue = "#000000",
  onChange,
  className,
  children, // <<< Adiciona children à desestruturação
  ...props
}) => {

    let initialColor: InstanceType<typeof Color>; // <<< CORRIGIDO: Usa InstanceType
    try {
        initialColor = Color(value ?? defaultValue);
    } catch (e) {
        console.warn("Invalid initial color value provided to ColorPicker, using default.", value ?? defaultValue);
        try { initialColor = Color(defaultValue); }
        catch (e2) { initialColor = Color("#000000"); }
    }

    // <<< CORRIGIDO: Usa InstanceType
    const [internalColor, setInternalColor] = useState<InstanceType<typeof Color>>(initialColor);

    useEffect(() => {
        if (value) {
            try {
                const newControlledColor = Color(value);
                if (newControlledColor.rgb().string() !== internalColor.rgb().string()) {
                    setInternalColor(newControlledColor);
                }
            } catch (e) { console.warn("Invalid controlled color value provided to ColorPicker.", value); }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const updateColor = useCallback((newColorData: Partial<{ hue: number; saturation: number; lightness: number; alpha: number }>) => {
        const nextColor = Color.hsl(
            newColorData.hue ?? internalColor.hue(),
            newColorData.saturation ?? internalColor.saturationl(),
            newColorData.lightness ?? internalColor.lightness()
        ).alpha(newColorData.alpha !== undefined ? newColorData.alpha / 100 : internalColor.alpha());
        setInternalColor(nextColor);
        onChange?.(nextColor.hex());
    }, [internalColor, onChange]);

    const [h, s, l] = internalColor.hsl().array();
    const a = internalColor.alpha();
    const hue = Math.round(h);
    const saturation = Math.round(s);
    const lightness = Math.round(l);
    const alpha = Math.round(a * 100);

    const setHue = useCallback((newHue: number) => updateColor({ hue: newHue }), [updateColor]);
    const setSaturation = useCallback((newSat: number) => updateColor({ saturation: newSat }), [updateColor]);
    const setLightness = useCallback((newLight: number) => updateColor({ lightness: newLight }), [updateColor]);
    const setAlpha = useCallback((newAlpha: number) => updateColor({ alpha: newAlpha }), [updateColor]);
    const [mode, setMode] = useState("hex");

  return (
    <ColorPickerContext.Provider value={{ hue, saturation, lightness, alpha, mode, setHue, setSaturation, setLightness, setAlpha, setMode }}>
      {/* Passa props HTML restantes para o div container */}
      <div className={cn("grid w-full gap-4", className)} {...props}>
          {children} {/* <<< Renderiza os children passados */}
      </div>
    </ColorPickerContext.Provider>
  )
}


// --- ColorPickerSelection ---
export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>
export const ColorPickerSelection: FC<ColorPickerSelectionProps> = ({ className, ...props }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const { hue, saturation, lightness, setSaturation, setLightness } = useColorPicker();

    const initialPositionX = saturation / 100;
    const initialPositionY = 1 - (lightness / 100);
    const [position, setPosition] = useState({ x: initialPositionX, y: initialPositionY });

    useEffect(() => {
      const newX = saturation / 100;
      const newY = 1 - (lightness / 100); // Reconfirmar se este mapeamento L -> Y está correto para seu gradiente
      // Atualiza a posição visual se os valores do CONTEXTO mudarem significativamente
      if (Math.abs(position.x - newX) > 0.01 || Math.abs(position.y - newY) > 0.01) {
           setPosition({ x: newX, y: newY });
      }
    }, [saturation, lightness, position.x, position.y]);

    const handlePointerMove = useCallback((event: PointerEvent) => {
        if (!isDragging || !containerRef.current) { return }
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        setPosition({ x, y });
        setSaturation(x * 100);
        setLightness((1 - y) * 100);
    }, [isDragging, setSaturation, setLightness]);

    useEffect(() => {
        const stopDragging = () => setIsDragging(false);
        if (isDragging) {
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", stopDragging);
        }
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", stopDragging);
        };
    }, [isDragging, handlePointerMove]);

    return (
        <div
            ref={containerRef}
            className={cn("relative aspect-[4/3] w-full cursor-crosshair rounded", className)}
            style={{
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
                backgroundImage: `linear-gradient(to right, hsl(0, 0%, 100%), hsla(0, 0%, 100%, 0)), linear-gradient(to top, hsl(0, 0%, 0%), hsla(0, 0%, 0%, 0))`
            }}
            onPointerDown={(e) => { e.preventDefault(); setIsDragging(true); handlePointerMove(e.nativeEvent); }}
            {...props}
        >
            <div
                className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
                style={{
                    left: `${position.x * 100}%`,
                    top: `${position.y * 100}%`,
                    backgroundColor: Color.hsl(hue, saturation, lightness).hex(),
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
                }}
            />
        </div>
    );
};


// --- ColorPickerHue (Tipo Corrigido) ---
// Define explicitamente as props que queremos + as do Slider que usamos + className/style/id
export interface ColorPickerHueProps extends Pick<SliderProps, 'dir' | 'max' | 'step'> {
  className?: string; // Inclui className explicitamente
  style?: React.CSSProperties; // Inclui style
  id?: string; // Inclui id
  // Adicione outras props HTML que você possa precisar passar
}

export const ColorPickerHue: FC<ColorPickerHueProps> = ({
    className,
    dir,
    max = 360,
    step = 1,
    style, // Inclui style na desestruturação
    id,   // Inclui id na desestruturação
    // Não usamos mais ...restProps para evitar passar props conflitantes
}) => {
    const { hue, setHue } = useColorPicker();

    return (
        <SliderRoot
            value={[hue]}
            onValueChange={([h]) => setHue(h)}
            max={max}
            step={step}
            dir={dir}
            id={id}     // Passa id
            style={style} // Passa style
            className={cn("relative flex h-4 w-full touch-none items-center", className)}
        >
            <Track className="relative h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]" />
            <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderRoot>
    );
};


// --- ColorPickerAlpha (Tipo Corrigido) ---
// Mesma abordagem de tipagem simplificada
export interface ColorPickerAlphaProps extends Pick<SliderProps, 'dir' | 'max' | 'step'> {
   className?: string;
   style?: React.CSSProperties;
   id?: string;
}

export const ColorPickerAlpha: FC<ColorPickerAlphaProps> = ({
    className,
    dir,
    max = 100,
    step = 1,
    style,
    id,
 }) => {
    const { hue, saturation, lightness, alpha, setAlpha } = useColorPicker();
    const baseColor = Color.hsl(hue, saturation, lightness).hex();

    return (
        <SliderRoot
            value={[alpha]}
            onValueChange={([a]) => setAlpha(a)}
            max={max}
            step={step}
            dir={dir}
            id={id}
            style={style}
            className={cn("relative flex h-4 w-full touch-none items-center", className)}
        >
            <Track
                className="relative h-3 w-full grow overflow-hidden rounded-full"
                style={{ background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==") left center' }}
            >
                <div className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(to right, transparent, ${baseColor})`}} />
            </Track>
            <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
        </SliderRoot>
    );
};


// --- ColorPickerEyeDropper ---
export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>
export const ColorPickerEyeDropper: FC<ColorPickerEyeDropperProps> = ({ className, ...props }) => {
    const { setHue, setSaturation, setLightness, setAlpha } = useColorPicker();
    const handleEyeDropper = useCallback(async () => {
      try {
        // @ts-ignore - EyeDropper API is experimental
        const eyeDropper = new EyeDropper()
        const result = await eyeDropper.open()
        const color = Color(result.sRGBHex)
        const [h, s, l] = color.hsl().array()
        setHue(h); setSaturation(s); setLightness(l); setAlpha(100); // Atualiza via contexto
      } catch (error) { console.error("EyeDropper failed:", error) }
    }, [setHue, setSaturation, setLightness, setAlpha]);
    return ( <Button variant="outline" size="icon" onClick={handleEyeDropper} className={cn("shrink-0 text-muted-foreground", className)} {...props}> <PipetteIcon size={16} /> </Button> );
};

// --- ColorPickerOutput ---
export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>
const formats = ["hex", "rgb", "css", "hsl"];
export const ColorPickerOutput: FC<ColorPickerOutputProps> = ({ className, ...props }) => {
    const { mode, setMode } = useColorPicker();
    return ( <Select value={mode} onValueChange={setMode}> <SelectTrigger className="h-8 w-[4.5rem] shrink-0 text-xs" {...props}> <SelectValue placeholder="Mode" /> </SelectTrigger> <SelectContent> {formats.map((format) => ( <SelectItem key={format} value={format} className="text-xs"> {format.toUpperCase()} </SelectItem> ))} </SelectContent> </Select> );
};

// --- PercentageInput (Corrigido com return) ---
type PercentageInputProps = ComponentProps<typeof Input>
const PercentageInput: FC<PercentageInputProps> = ({ className, onChange, ...props }) => {
  return ( // <<< Adicionado return
    <div className="relative">
      <Input
        type="text" // Mantido como texto para flexibilidade, mas poderia ser number
        onChange={onChange}
        {...props}
        className={cn(
            "h-8 w-[3.25rem] rounded-l-none bg-secondary px-2 text-xs shadow-none pr-4", // Adicionado pr-4
             className
        )}
      />
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground text-xs">
        %
      </span>
    </div>
  ); // <<< Fim do return
};

// --- ColorPickerFormat ---
export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>
export const ColorPickerFormat: FC<ColorPickerFormatProps> = ({ className, ...props }) => {
    const { hue, saturation, lightness, alpha, mode, setHue, setSaturation, setLightness, setAlpha } = useColorPicker();
    const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);

    if (mode === "hex") {
        const hex = color.hex();
        const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
          try {
            const newColor = Color("#" + event.target.value.replace(/[^0-9a-fA-F]/g, '')); // Adiciona # e limpa
            setHue(newColor.hue()); setSaturation(newColor.saturationl()); setLightness(newColor.lightness()); setAlpha(newColor.alpha() * 100);
          } catch (error) { console.error("Invalid hex color:", error); }
        };
        return (
          <div className={cn("-space-x-px relative flex items-center shadow-sm", className)} {...props}>
            <span className="flex items-center justify-center h-8 w-7 rounded-l-md border border-r-0 border-input bg-secondary text-xs">#</span>
            <Input type="text" value={hex.substring(1).toUpperCase()} onChange={handleChange} className="h-8 rounded-none rounded-l-none bg-secondary px-2 text-xs shadow-none border-l-0" />
            <PercentageInput value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          </div>
        );
    }
    if (mode === "rgb") {
        const rgb = color.rgb().array().map((value) => Math.round(value));
        const handleChange = (index: number, value: string) => {
            const numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 255) {
                const newRgb = [...rgb];
                newRgb[index] = numValue;
                try {
                    const newColor = Color.rgb(newRgb);
                    setHue(newColor.hue()); setSaturation(newColor.saturationl()); setLightness(newColor.lightness());
                } catch(e) { console.error("Invalid RGB value", e); }
            }
        };
        return (
          <div className={cn("-space-x-px flex items-center shadow-sm", className)} {...props}>
            {rgb.map((value, index) => ( <Input key={index} type="text" value={value} onChange={e => handleChange(index, e.target.value)} className={cn("h-8 w-10 rounded-none bg-secondary px-2 text-xs shadow-none", index === 0 && "rounded-l-md", className )} /> ))}
            <PercentageInput value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          </div>
        );
    }
    if (mode === "css") {
        const rgbaString = `rgba(${color.rgb().array().map(Math.round).join(", ")}, ${alpha}%)`; // Alpha como %
        return ( <div className={cn("w-full shadow-sm", className)} {...props}> <Input type="text" className="h-8 w-full bg-secondary px-2 text-xs shadow-none" value={rgbaString} readOnly /> </div> );
    }
    if (mode === "hsl") {
        const hsl = color.hsl().array().map((value) => Math.round(value));
         const handleChange = (index: number, value: string) => {
            const numValue = Number(value);
             if (!isNaN(numValue)) {
                 const newHsl = [...hsl];
                 newHsl[index] = numValue;
                 // Adicionar validações de range para H(0-360), S(0-100), L(0-100)
                 try {
                     const newColor = Color.hsl(newHsl);
                     setHue(newColor.hue()); setSaturation(newColor.saturationl()); setLightness(newColor.lightness());
                 } catch(e) { console.error("Invalid HSL value", e); }
             }
        };
        return (
          <div className={cn("-space-x-px flex items-center shadow-sm", className)} {...props}>
            {hsl.map((value, index) => ( <Input key={index} type="text" value={value} onChange={e => handleChange(index, e.target.value)} className={cn("h-8 w-10 rounded-none bg-secondary px-2 text-xs shadow-none", index === 0 && "rounded-l-md", className)} /> ))}
            <PercentageInput value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
          </div>
        );
    }
    return null;
};
```

## File: src/components/ui/color-selector-panel.tsx
```typescript
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
```

## File: src/components/ui/tabgroup.tsx
```typescript
import {
  BoxIcon,
  ChartLine,
  HouseIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
  UsersRoundIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function Component() {
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
          <TabsTrigger
            value="tab-1"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <HouseIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Projects
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1"
              variant="secondary"
            >
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <BoxIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Packages
            <Badge className="ms-1.5">New</Badge>
          </TabsTrigger>
          <TabsTrigger
            value="tab-4"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <UsersRoundIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Team
          </TabsTrigger>
          <TabsTrigger
            value="tab-5"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <ChartLine
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Insights
          </TabsTrigger>
          <TabsTrigger
            value="tab-6"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <SettingsIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Settings
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 1
        </p>
      </TabsContent>
      <TabsContent value="tab-2">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 2
        </p>
      </TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
      <TabsContent value="tab-4">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 4
        </p>
      </TabsContent>
      <TabsContent value="tab-5">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 5
        </p>
      </TabsContent>
      <TabsContent value="tab-6">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 6
        </p>
      </TabsContent>
    </Tabs>
  )
}
```

## File: src/globals.d.ts
```typescript
export type Message = {
  event: string;
  data?: any;
  callback?: string;
};

export interface PluginMessageEvent {
  pluginMessage: Message;
  pluginId?: string;
}

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.svg";
```

## File: src/hooks/use-mobile.ts
```typescript
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

## File: src/hooks/use-mobile.tsx
```typescript
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

## File: src/primitives/colors.css
```css
/* ./src/primitives/colors.css */
:root {
  --slate-50: rgba(248, 250, 252, 1);
  --slate-100: rgba(241, 245, 249, 1);
  --slate-200: rgba(226, 232, 240, 1);
  --slate-300: rgba(203, 213, 225, 1);
  --slate-400: rgba(148, 163, 184, 1);
  --slate-500: rgba(100, 116, 139, 1);
  --slate-600: rgba(71, 85, 105, 1);
  --slate-700: rgba(51, 65, 85, 1);
  --slate-800: rgba(30, 41, 59, 1);
  --slate-900: rgba(15, 23, 42, 1);
  --slate-950: rgba(2, 6, 23, 1);
  --gray-50: rgba(249, 250, 251, 1);
  --gray-100: rgba(243, 244, 246, 1);
  --gray-200: rgba(229, 231, 235, 1);
  --gray-300: rgba(209, 213, 219, 1);
  --gray-400: rgba(156, 163, 175, 1);
  --gray-500: rgba(107, 114, 128, 1);
  --gray-600: rgba(75, 85, 99, 1);
  --gray-700: rgba(55, 65, 81, 1);
  --gray-800: rgba(31, 41, 55, 1);
  --gray-900: rgba(17, 24, 39, 1);
  --gray-950: rgba(3, 7, 18, 1);
  --zinc-50: rgba(250, 250, 250, 1);
  --zinc-100: rgba(244, 244, 245, 1);
  --zinc-200: rgba(228, 228, 231, 1);
  --zinc-300: rgba(212, 212, 216, 1);
  --zinc-400: rgba(161, 161, 170, 1);
  --zinc-500: rgba(113, 113, 122, 1);
  --zinc-600: rgba(82, 82, 91, 1);
  --zinc-700: rgba(63, 63, 70, 1);
  --zinc-800: rgba(39, 39, 42, 1);
  --zinc-900: rgba(24, 24, 27, 1);
  --zinc-950: rgba(9, 9, 11, 1);
  --neutral-50: rgba(250, 250, 250, 1);
  --neutral-100: rgba(245, 245, 245, 1);
  --neutral-200: rgba(229, 229, 229, 1);
  --neutral-300: rgba(212, 212, 212, 1);
  --neutral-400: rgba(163, 163, 163, 1);
  --neutral-500: rgba(115, 115, 115, 1);
  --neutral-600: rgba(82, 82, 82, 1);
  --neutral-700: rgba(64, 64, 64, 1);
  --neutral-800: rgba(38, 38, 38, 1);
  --neutral-900: rgba(23, 23, 23, 1);
  --neutral-950: rgba(10, 10, 10, 1);
  --stone-50: rgba(250, 250, 249, 1);
  --stone-100: rgba(245, 245, 244, 1);
  --stone-200: rgba(231, 229, 228, 1);
  --stone-300: rgba(214, 211, 209, 1);
  --stone-400: rgba(168, 162, 158, 1);
  --stone-500: rgba(120, 113, 108, 1);
  --stone-600: rgba(87, 83, 78, 1);
  --stone-700: rgba(68, 64, 60, 1);
  --stone-800: rgba(41, 37, 36, 1);
  --stone-900: rgba(28, 25, 23, 1);
  --stone-950: rgba(12, 10, 9, 1);
  --red-50: rgba(254, 242, 242, 1);
  --red-100: rgba(254, 226, 226, 1);
  --red-200: rgba(254, 202, 202, 1);
  --red-300: rgba(252, 165, 165, 1);
  --red-400: rgba(248, 113, 113, 1);
  --red-500: rgba(239, 68, 68, 1);
  --red-600: rgba(220, 38, 38, 1);
  --red-700: rgba(185, 28, 28, 1);
  --red-800: rgba(153, 27, 27, 1);
  --red-900: rgba(127, 29, 29, 1);
  --red-950: rgba(69, 10, 10, 1);
  --orange-50: rgba(255, 247, 237, 1);
  --orange-100: rgba(255, 237, 213, 1);
  --orange-200: rgba(254, 215, 170, 1);
  --orange-300: rgba(253, 186, 116, 1);
  --orange-400: rgba(251, 146, 60, 1);
  --orange-500: rgba(249, 115, 22, 1);
  --orange-600: rgba(234, 88, 12, 1);
  --orange-700: rgba(194, 65, 12, 1);
  --orange-800: rgba(154, 52, 18, 1);
  --orange-900: rgba(124, 45, 18, 1);
  --orange-950: rgba(67, 20, 7, 1);
  --amber-50: rgba(255, 251, 235, 1);
  --amber-100: rgba(254, 243, 199, 1);
  --amber-200: rgba(253, 230, 138, 1);
  --amber-300: rgba(252, 211, 77, 1);
  --amber-400: rgba(251, 191, 36, 1);
  --amber-500: rgba(245, 158, 11, 1);
  --amber-600: rgba(217, 119, 6, 1);
  --amber-700: rgba(180, 83, 9, 1);
  --amber-800: rgba(146, 64, 14, 1);
  --amber-900: rgba(120, 53, 15, 1);
  --amber-950: rgba(69, 26, 3, 1);
  --green-50: rgba(240, 253, 244, 1);
  --green-100: rgba(220, 252, 231, 1);
  --green-200: rgba(187, 247, 208, 1);
  --green-300: rgba(134, 239, 172, 1);
  --green-400: rgba(74, 222, 128, 1);
  --green-500: rgba(34, 197, 94, 1);
  --green-600: rgba(22, 163, 74, 1);
  --green-700: rgba(21, 128, 61, 1);
  --green-800: rgba(22, 101, 52, 1);
  --green-900: rgba(20, 83, 45, 1);
  --green-950: rgba(5, 46, 22, 1);
  --emerald-50: rgba(236, 253, 245, 1);
  --emerald-100: rgba(209, 250, 229, 1);
  --emerald-200: rgba(167, 243, 208, 1);
  --emerald-300: rgba(110, 231, 183, 1);
  --emerald-400: rgba(52, 211, 153, 1);
  --emerald-500: rgba(16, 185, 129, 1);
  --emerald-600: rgba(5, 150, 105, 1);
  --emerald-700: rgba(4, 120, 87, 1);
  --emerald-800: rgba(6, 95, 70, 1);
  --emerald-900: rgba(6, 78, 59, 1);
  --emerald-950: rgba(2, 44, 34, 1);
  --teal-50: rgba(240, 253, 250, 1);
  --teal-100: rgba(204, 251, 241, 1);
  --teal-200: rgba(153, 246, 228, 1);
  --teal-300: rgba(94, 234, 212, 1);
  --teal-400: rgba(45, 212, 191, 1);
  --teal-500: rgba(20, 184, 166, 1);
  --teal-600: rgba(13, 148, 136, 1);
  --teal-700: rgba(15, 118, 110, 1);
  --teal-800: rgba(17, 94, 89, 1);
  --teal-900: rgba(19, 78, 74, 1);
  --teal-950: rgba(4, 47, 46, 1);
  --cyan-50: rgba(236, 254, 255, 1);
  --cyan-100: rgba(207, 250, 254, 1);
  --cyan-200: rgba(165, 243, 252, 1);
  --cyan-300: rgba(103, 232, 249, 1);
  --cyan-400: rgba(34, 211, 238, 1);
  --cyan-500: rgba(6, 182, 212, 1);
  --cyan-600: rgba(8, 145, 178, 1);
  --cyan-700: rgba(14, 116, 144, 1);
  --cyan-800: rgba(21, 94, 117, 1);
  --cyan-900: rgba(22, 78, 99, 1);
  --cyan-950: rgba(8, 51, 68, 1);
  --sky-50: rgba(240, 249, 255, 1);
  --sky-100: rgba(224, 242, 254, 1);
  --sky-200: rgba(186, 230, 253, 1);
  --sky-300: rgba(125, 211, 252, 1);
  --sky-400: rgba(56, 189, 248, 1);
  --sky-500: rgba(14, 165, 233, 1);
  --sky-600: rgba(2, 132, 199, 1);
  --sky-700: rgba(3, 105, 161, 1);
  --sky-800: rgba(7, 89, 133, 1);
  --sky-900: rgba(12, 74, 110, 1);
  --sky-950: rgba(8, 47, 73, 1);
  --indigo-50: rgba(238, 242, 255, 1);
  --indigo-100: rgba(224, 231, 255, 1);
  --indigo-200: rgba(199, 210, 254, 1);
  --indigo-300: rgba(165, 180, 252, 1);
  --indigo-400: rgba(129, 140, 248, 1);
  --indigo-500: rgba(99, 102, 241, 1);
  --indigo-600: rgba(79, 70, 229, 1);
  --indigo-700: rgba(67, 56, 202, 1);
  --indigo-800: rgba(55, 48, 163, 1);
  --indigo-900: rgba(49, 46, 129, 1);
  --indigo-950: rgba(30, 27, 75, 1);
  --violet-50: rgba(245, 243, 255, 1);
  --violet-100: rgba(237, 233, 254, 1);
  --violet-200: rgba(221, 214, 254, 1);
  --violet-300: rgba(196, 181, 253, 1);
  --violet-400: rgba(167, 139, 250, 1);
  --violet-500: rgba(139, 92, 246, 1);
  --violet-600: rgba(124, 58, 237, 1);
  --violet-700: rgba(109, 40, 217, 1);
  --violet-800: rgba(91, 33, 182, 1);
  --violet-900: rgba(76, 29, 149, 1);
  --violet-950: rgba(46, 16, 101, 1);
  --purple-50: rgba(250, 245, 255, 1);
  --purple-100: rgba(243, 232, 255, 1);
  --purple-200: rgba(233, 213, 255, 1);
  --purple-300: rgba(216, 180, 254, 1);
  --purple-400: rgba(192, 132, 252, 1);
  --purple-500: rgba(168, 85, 247, 1);
  --purple-600: rgba(147, 51, 234, 1);
  --purple-700: rgba(126, 34, 206, 1);
  --purple-800: rgba(107, 33, 168, 1);
  --purple-900: rgba(88, 28, 135, 1);
  --purple-950: rgba(59, 7, 100, 1);
  --fuchsia-50: rgba(253, 244, 255, 1);
  --fuchsia-100: rgba(250, 232, 255, 1);
  --fuchsia-200: rgba(245, 208, 254, 1);
  --fuchsia-300: rgba(240, 171, 252, 1);
  --fuchsia-400: rgba(232, 121, 249, 1);
  --fuchsia-500: rgba(217, 70, 239, 1);
  --fuchsia-600: rgba(192, 38, 211, 1);
  --fuchsia-700: rgba(162, 28, 175, 1);
  --fuchsia-800: rgba(134, 25, 143, 1);
  --fuchsia-900: rgba(112, 26, 117, 1);
  --fuchsia-950: rgba(74, 4, 78, 1);
  --pink-50: rgba(253, 242, 248, 1);
  --pink-100: rgba(252, 231, 243, 1);
  --pink-200: rgba(251, 207, 232, 1);
  --pink-300: rgba(249, 168, 212, 1);
  --pink-400: rgba(244, 114, 182, 1);
  --pink-500: rgba(236, 72, 153, 1);
  --pink-600: rgba(219, 39, 119, 1);
  --pink-700: rgba(190, 24, 93, 1);
  --pink-800: rgba(157, 23, 77, 1);
  --pink-900: rgba(131, 24, 67, 1);
  --pink-950: rgba(80, 7, 36, 1);
  --rose-50: rgba(255, 241, 242, 1);
  --rose-100: rgba(255, 228, 230, 1);
  --rose-200: rgba(254, 205, 211, 1);
  --rose-300: rgba(253, 164, 175, 1);
  --rose-400: rgba(251, 113, 133, 1);
  --rose-500: rgba(244, 63, 94, 1);
  --rose-600: rgba(225, 29, 72, 1);
  --rose-700: rgba(190, 18, 60, 1);
  --rose-800: rgba(159, 18, 57, 1);
  --rose-900: rgba(136, 19, 55, 1);
  --rose-950: rgba(76, 5, 25, 1);
  --lime-50: rgba(247, 254, 231, 1);
  --lime-100: rgba(236, 252, 203, 1);
  --lime-200: rgba(217, 249, 157, 1);
  --lime-300: rgba(190, 242, 100, 1);
  --lime-400: rgba(163, 230, 53, 1);
  --lime-500: rgba(132, 204, 22, 1);
  --lime-600: rgba(101, 163, 13, 1);
  --lime-700: rgba(77, 124, 15, 1);
  --lime-800: rgba(63, 98, 18, 1);
  --lime-900: rgba(54, 83, 20, 1);
  --lime-950: rgba(26, 46, 5, 1);
  --yellow-50: rgba(254, 252, 232, 1);
  --yellow-100: rgba(254, 249, 195, 1);
  --yellow-200: rgba(254, 240, 138, 1);
  --yellow-300: rgba(253, 224, 71, 1);
  --yellow-400: rgba(250, 204, 21, 1);
  --yellow-500: rgba(234, 179, 8, 1);
  --yellow-600: rgba(202, 138, 4, 1);
  --yellow-700: rgba(161, 98, 7, 1);
  --yellow-800: rgba(133, 77, 14, 1);
  --yellow-900: rgba(113, 63, 18, 1);
  --yellow-950: rgba(66, 32, 6, 1);
  --blue-50: rgba(239, 246, 255, 1);
  --blue-100: rgba(219, 234, 254, 1);
  --blue-200: rgba(191, 219, 254, 1);
  --blue-300: rgba(147, 197, 253, 1);
  --blue-400: rgba(96, 165, 250, 1);
  --blue-500: rgba(59, 130, 246, 1);
  --blue-600: rgba(37, 99, 235, 1);
  --blue-700: rgba(29, 78, 216, 1);
  --blue-800: rgba(30, 64, 175, 1);
  --blue-900: rgba(30, 58, 138, 1);
  --blue-950: rgba(23, 37, 84, 1);
  --white: rgba(255, 255, 255, 1);
  --black: rgba(0, 0, 0, 1);
  --primary-50: var(--zinc-50);
  --primary-100: var(--zinc-100);
  --primary-200: var(--zinc-200);
  --primary-300: var(--zinc-300);
  --primary-400: var(--zinc-400);
  --primary-500: var(--zinc-500);
  --primary-600: var(--zinc-600);
  --primary-700: var(--zinc-700);
  --primary-800: var(--zinc-800);
  --primary-900: var(--zinc-900);
  --primary-950: var(--zinc-950);
}
```

## File: src/primitives/index.css
```css
/* ./src/primitives/index.css */
@import "./colors.css";
```

## File: src/theme.css
```css
/* ./src/theme.css */
:root {
    --foreground-primary-default: var(--primary-50);
    --foreground-secondary-default: var(--zinc-700);
    --foreground-destructive-default: var(--red-500);
    --foreground-success-default: var(--emerald-700);
    --foreground-warning-default: var(--yellow-700);
    --foreground-disabled-default: var(--zinc-400);
    --foreground-default: var(--zinc-950);
    --foreground-muted: var(--zinc-500);
    --foreground-accent: var(--zinc-900);
    --background-primary-default: var(--primary-900);
    --background-primary-default-hover: rgba(24, 24, 27, 0.800000011920929);
    --background-primary-light: var(--primary-50);
    --background-primary-light-hover: var(--primary-100);
    --background-secondary-default: var(--zinc-100);
    --background-destructive-default: var(--red-600);
    --background-destructive-default-hover: rgba(220, 38, 38, 0.800000011920929);
    --background-destructive-light: rgba(220, 38, 38, 0.10000000149011612);
    --background-destructive-light-hover: rgba(220, 38, 38, 0.11999999731779099);
    --background-success-default: var(--emerald-600);
    --background-warning-default: var(--yellow-500);
    --background-warning-default-hover: var(--yellow-600);
    --background-warning-light: rgba(234, 179, 8, 0.10000000149011612);
    --background-warning-light-hover: rgba(234, 179, 8, 0.11999999731779099);
    --background-success-default-hover: var(--emerald-700);
    --background-success-light: rgba(5, 150, 105, 0.10000000149011612);
    --background-success-light-hover: rgba(5, 150, 105, 0.11999999731779099);
    --background-disabled-default: var(--neutral-400);
    --background-default: var(--white);
    --background-card: var(--white);
    --background-popover: var(--white);
    --background-input: var(--zinc-200);
    --background-muted: var(--zinc-100);
    --background-accent: var(--zinc-100);
    --border-primary-default: var(--zinc-400);
    --border-destructive-default: var(--red-500);
    --border-success-default: var(--emerald-700);
    --charts-chart-1-opacity100: rgba(42, 157, 144, 1);
    --charts-chart-1-opacity80: rgba(42, 157, 144, 0.800000011920929);
    --charts-chart-1-opacity50: rgba(42, 157, 144, 0.5);
    --charts-chart-1-opacity10: rgba(42, 157, 144, 0.10000000149011612);
    --charts-chart-2-opacity100: rgba(231, 110, 80, 1);
    --charts-chart-2-opacity80: rgba(231, 110, 80, 0.800000011920929);
    --charts-chart-2-opacity50: rgba(231, 110, 80, 0.5);
    --charts-chart-2-opacity10: rgba(231, 110, 80, 0.10000000149011612);
    --charts-chart-3-opacity100: rgba(39, 71, 84, 1);
    --charts-chart-3-opacity80: rgba(39, 71, 84, 0.800000011920929);
    --charts-chart-3-opacity50: rgba(39, 71, 84, 0.5);
    --charts-chart-3-opacity10: rgba(39, 71, 84, 0.10000000149011612);
    --charts-chart-4-opacity100: rgba(232, 196, 104, 1);
    --charts-chart-4-opacity80: rgba(232, 196, 104, 0.800000011920929);
    --charts-chart-4-opacity50: rgba(232, 196, 104, 0.5);
    --charts-chart-4-opacity10: rgba(232, 196, 104, 0.10000000149011612);
    --charts-chart-5-opacity100: rgba(244, 164, 98, 1);
    --charts-chart-5-opacity80: rgba(244, 164, 98, 0.800000011920929);
    --charts-chart-5-opacity50: rgba(244, 164, 98, 0.5);
    --charts-chart-5-opacity10: rgba(244, 164, 98, 0.10000000149011612);
    --border-default: var(--zinc-200);
    --icon-default: var(--zinc-950);
    --icon-muted: var(--zinc-500);
    --icon-accent: var(--zinc-900);
    --icon-primary-default: var(--primary-50);
    --icon-secondary-default: var(--zinc-700);
    --icon-destructive-default: var(--red-500);
    --icon-success-default: var(--emerald-700);
    --icon-warning-default: var(--yellow-700);
    --icon-disabled-default: var(--zinc-400);
    --radius-radius-none: 0px;
    --radius-radius-xs: 2px;
    --radius-radius-sm: 4px;
    --radius-radius-md: 8px;
    --radius-radius-lg: 12px;
    --radius-radius-xl: 16px;
    --radius-radius-xxl: 24px;
    --radius-radius-full: 400px;
    --padding-padding-none: 0px;
    --padding-padding-xxs: 8px;
    --padding-padding-xs: 12px;
    --padding-padding-sm: 16px;
    --padding-padding-md: 20px;
    --padding-padding-lg: 24px;
    --padding-padding-xl: 32px;
    --padding-padding-xxl: 40px;
    --padding-padding-3xl: 48px;
    --padding-padding-4xl: 64px;
    --spacing-spacing-none: 0px;
    --spacing-spacing-xxs: 2px;
    --spacing-spacing-xs: 4px;
    --spacing-spacing-sm: 8px;
    --spacing-spacing-md: 12px;
    --spacing-spacing-lg: 16px;
    --spacing-spacing-xl: 24px;
    --spacing-spacing-xxl: 32px;
    --spacing-spacing-3xl: 40px;
    --spacing-spacing-4xl: 64px;
    --border-warning-default: var(--yellow-600);
    --white: var(--white);
    --black: var(--black);
    --icon-destructive-on-destructive: var(--red-300);
    --icon-destructive-hover---on-destructive: var(--white);
  }

  :dark {
    --foreground-primary-default: var(--primary-900);
    --foreground-secondary-default: var(--zinc-100);
    --foreground-destructive-default: var(--red-900);
    --foreground-success-default: var(--emerald-600);
    --foreground-warning-default: var(--yellow-600);
    --foreground-disabled-default: var(--zinc-600);
    --foreground-default: var(--zinc-50);
    --foreground-muted: var(--zinc-400);
    --foreground-accent: var(--zinc-50);
    --background-primary-default: var(--primary-50);
    --background-primary-default-hover: rgba(250, 250, 250, 0.800000011920929);
    --background-primary-light: var(--primary-900);
    --background-primary-light-hover: var(--primary-950);
    --background-secondary-default: var(--zinc-800);
    --background-destructive-default: var(--red-800);
    --background-destructive-default-hover: rgba(153, 27, 27, 0.800000011920929);
    --background-destructive-light: rgba(220, 38, 38, 0.15000000596046448);
    --background-destructive-light-hover: rgba(220, 38, 38, 0.20000000298023224);
    --background-success-default: var(--emerald-800);
    --background-warning-default: var(--yellow-500);
    --background-warning-default-hover: var(--yellow-600);
    --background-warning-light: rgba(234, 179, 8, 0.15000000596046448);
    --background-warning-light-hover: rgba(234, 179, 8, 0.20000000298023224);
    --background-success-default-hover: var(--emerald-900);
    --background-success-light: rgba(5, 150, 105, 0.15000000596046448);
    --background-success-light-hover: rgba(5, 150, 105, 0.20000000298023224);
    --background-disabled-default: var(--neutral-400);
    --background-default: var(--zinc-950);
    --background-card: var(--zinc-950);
    --background-popover: var(--zinc-950);
    --background-input: var(--zinc-700);
    --background-muted: var(--zinc-800);
    --background-accent: var(--zinc-800);
    --border-primary-default: var(--zinc-300);
    --border-destructive-default: var(--red-900);
    --border-success-default: var(--emerald-600);
    --charts-chart-1-opacity100: rgba(38, 98, 217, 1);
    --charts-chart-1-opacity80: rgba(38, 98, 217, 0.800000011920929);
    --charts-chart-1-opacity50: rgba(38, 98, 217, 0.5);
    --charts-chart-1-opacity10: rgba(38, 98, 217, 0.10000000149011612);
    --charts-chart-2-opacity100: rgba(226, 54, 112, 1);
    --charts-chart-2-opacity80: rgba(226, 54, 112, 1);
    --charts-chart-2-opacity50: rgba(226, 54, 112, 1);
    --charts-chart-2-opacity10: rgba(226, 54, 112, 1);
    --charts-chart-3-opacity100: rgba(232, 140, 48, 1);
    --charts-chart-3-opacity80: rgba(232, 140, 48, 1);
    --charts-chart-3-opacity50: rgba(232, 140, 48, 1);
    --charts-chart-3-opacity10: rgba(232, 140, 48, 1);
    --charts-chart-4-opacity100: rgba(175, 87, 219, 1);
    --charts-chart-4-opacity80: rgba(175, 87, 219, 1);
    --charts-chart-4-opacity50: rgba(175, 87, 219, 1);
    --charts-chart-4-opacity10: rgba(175, 87, 219, 1);
    --charts-chart-5-opacity100: rgba(46, 184, 138, 1);
    --charts-chart-5-opacity80: rgba(46, 184, 138, 1);
    --charts-chart-5-opacity50: rgba(46, 184, 138, 1);
    --charts-chart-5-opacity10: rgba(46, 184, 138, 1);
    --border-default: var(--zinc-700);
    --icon-default: var(--zinc-50);
    --icon-muted: var(--zinc-400);
    --icon-accent: var(--zinc-50);
    --icon-primary-default: var(--primary-900);
    --icon-secondary-default: var(--zinc-100);
    --icon-destructive-default: var(--red-900);
    --icon-success-default: var(--emerald-600);
    --icon-warning-default: var(--yellow-600);
    --icon-disabled-default: var(--zinc-600);
    --radius-radius-none: 0px;
    --radius-radius-xs: 2px;
    --radius-radius-sm: 4px;
    --radius-radius-md: 8px;
    --radius-radius-lg: 12px;
    --radius-radius-xl: 16px;
    --radius-radius-xxl: 24px;
    --radius-radius-full: 400px;
    --padding-padding-none: 0px;
    --padding-padding-xxs: 8px;
    --padding-padding-xs: 12px;
    --padding-padding-sm: 16px;
    --padding-padding-md: 20px;
    --padding-padding-lg: 24px;
    --padding-padding-xl: 32px;
    --padding-padding-xxl: 40px;
    --padding-padding-3xl: 48px;
    --padding-padding-4xl: 64px;
    --spacing-spacing-none: 0px;
    --spacing-spacing-xxs: 2px;
    --spacing-spacing-xs: 4px;
    --spacing-spacing-sm: 8px;
    --spacing-spacing-md: 12px;
    --spacing-spacing-lg: 16px;
    --spacing-spacing-xl: 24px;
    --spacing-spacing-xxl: 32px;
    --spacing-spacing-3xl: 40px;
    --spacing-spacing-4xl: 40px;
    --border-warning-default: var(--yellow-600);
    --white: var(--white);
    --black: var(--black);
    --icon-destructive-on-destructive: var(--red-300);
    --icon-destructive-hover---on-destructive: var(--white);
  }
```

## File: src/types/figma.d.ts
```typescript
/// <reference types="@figma/plugin-typings" />

declare global {
  const figma: PluginAPI;
}

export {};
```

## File: tsconfig.app.json
```json
{
  "compilerOptions": {
    "target": "es6",
    "useDefineForClassFields": true,
    "module": "es6",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowJs": true,
    "jsx": "react-jsx",
    "checkJs": true,
    "isolatedModules": true,
    "typeRoots": [
      "./node_modules/@types",
      "./src/globals.d.ts",
      "shared/universals.d.ts"
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "src/**/*.js",
    "src/**/*.svelte",
    "src-code/**/*.ts",
    "shared/universals.d.ts"
  ]
}
```

## File: figma.config.ts
```typescript
import type { FigmaConfig, PluginManifest } from "vite-figma-plugin/lib/types";
import { version } from "./package.json";

export const manifest: PluginManifest = {
  name: "IziFlow V2", 
  id: "com.luskizera.iziflow-v2", 
  api: "1.0.0",
  main: "code.js",
  ui: "index.html",
  editorType: [
    "figjam"
  ],
  documentAccess: "dynamic-page",
  networkAccess: {
    allowedDomains: ["*"],
    reasoning: "For accessing remote assets",
  },
};

const extraPrefs = {
  copyZipAssets: ["public-zip/*"],
};

export const config: FigmaConfig = {
  manifest,
  version,
  ...extraPrefs,
};
```

## File: index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bolt Figma</title>
  </head>
  <body>
    <div id="app"></div>
    <div id="root"></div>
    <script type="module" src="/src/index-react.tsx"></script>
  </body>
</html>
```

## File: shared/schemas/schema.ts
```typescript
// shared/schemas/schema.ts
import { z } from "zod";

// Define o schema para DescriptionField primeiro
// Note o z.union para 'content' para flexibilidade
const DescriptionFieldSchema = z.object({
  label: z.string(),
  content: z.union([
    z.string(),
    z.array(z.string()),
    z.record(z.string()), // Para objeto chave-valor simples
  ]),
  // Você pode adicionar .passthrough() ou definir outros campos opcionais aqui
  // se DescriptionField puder ter outras propriedades desconhecidas
}).passthrough(); // Permite campos extras se necessário

// Define o schema para FlowNode usando o DescriptionFieldSchema
export const FlowNodeSchema = z.object({
  id: z.string(),
  type: z.enum(["START", "END", "STEP", "DECISION", "ENTRYPOINT"]),
  name: z.string(),
  metadata: z.object({
    category: z.string().optional(),
    createdBy: z.string().optional(),
    // .passthrough() permite outros campos não definidos em metadata
  }).passthrough().optional(),
  /**
   * CORREÇÃO: 'description' agora é um objeto opcional
   * que CONTÉM a propriedade 'fields' (que é o array).
   */
  description: z.object({ // <--- description é um objeto...
    fields: z.array(DescriptionFieldSchema), // <--- ...contendo 'fields' que é um array de DescriptionFieldSchema
    // Adicione validação para outros campos dentro de description aqui, se houver
    // title: z.string().optional(),
  }).passthrough() // Permite outros campos dentro de description se necessário
    .optional() // <--- O objeto 'description' inteiro é opcional
});

// Define o schema para Connection
export const ConnectionSchema = z.object({
  id: z.string().optional(), // ID da conexão também pode ser opcional
  from: z.string(),
  to: z.string(),
  condition: z.string().optional(),
  conditionLabel: z.string().optional(), // Mantido
  secondary: z.boolean().optional()
});

// Define o schema para Flow usando os schemas anteriores
export const FlowSchema = z.object({
  flowName: z.string().optional(), // flowName também pode ser opcional
  nodes: z.array(FlowNodeSchema),
  connections: z.array(ConnectionSchema)
});

// Define o schema principal FlowData
// Aceita tanto um objeto Flow diretamente quanto um objeto com a chave 'flows'
export const FlowDataSchema = z.object({
    flowName: z.string().optional(), // Incluído para cobrir o caso raiz Flow
    nodes: z.array(FlowNodeSchema).optional(), // Incluído para cobrir o caso raiz Flow
    connections: z.array(ConnectionSchema).optional(), // Incluído para cobrir o caso raiz Flow
    flows: z.array(FlowSchema).optional() // Opcional array de flows
})
.refine(data => data.flows || (data.nodes && data.connections), {
    message: "O JSON deve conter a chave 'flows' com um array de fluxos, ou as chaves 'nodes' e 'connections' no nível raiz.",
    // Path pode ser ajustado se necessário, mas valida a estrutura geral
});

// Você pode querer exportar todos para facilitar importações
export { DescriptionFieldSchema };
```

## File: src-code/lib/layout.ts
```typescript
// src-code/lib/layout.ts
export namespace Layout {
  export function buildGraph(nodes: any[], connections: any[]) {
    const adjacencyList: { [id: string]: string[] } = {};
    const inDegree: { [id: string]: number } = {};

    nodes.forEach(node => {
      adjacencyList[node.id] = [];
      inDegree[node.id] = 0;
    });

    connections.forEach(conn => {
      adjacencyList[conn.from].push(conn.to);
      inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
    });

    return { adjacencyList, inDegree };
  }

  export function getSortedLevels(levelToNodes: { [level: number]: string[] }): number[] {
    return Object.keys(levelToNodes)
      .map(n => parseInt(n, 10))
      .sort((a, b) => a - b);
  }
}
```

## File: src-code/lib/markdownParser.ts
```typescript
// src-code/lib/markdownParser.ts
/// <reference types="@figma/plugin-typings" />

import type { FlowNode, Connection, DescriptionField, NodeData } from '@shared/types/flow.types';

type ParserState = {
    nodes: FlowNode[];
    connections: Connection[];
    currentNodeId: string | null;
    lineNumber: number;
};

// Helper para remover comentários e trimar
function cleanLine(rawLine: string): string {
    return rawLine.split('#')[0].trim();
}

export async function parseMarkdownToFlow(markdown: string): Promise<{ nodes: FlowNode[], connections: Connection[] }> {
    const lines = markdown.split('\n');
    const state: ParserState = {
        nodes: [],
        connections: [],
        currentNodeId: null,
        lineNumber: 0,
    };
    const nodeMap: { [id: string]: FlowNode } = {};

    for (const rawLine of lines) {
        state.lineNumber++;
        const line = cleanLine(rawLine); // Usa a linha limpa para a maioria das verificações

        if (line === '') {
            state.currentNodeId = null;
            continue;
        }

        try {
            // Passa a linha limpa OU a linha original para funções que precisam de indentação
            if (parseNodeLine(line, state, nodeMap)) continue;
            if (parseMetaLine(rawLine, state, nodeMap)) continue; // Precisa da original para indentação
            if (parseDescLine(rawLine, state, nodeMap)) continue; // Precisa da original para indentação
            if (parseConnLine(line, state)) continue; // Usa a linha limpa

            throw new Error(`Sintaxe inválida ou desconhecida.`);

        } catch (error: any) {
            // Inclui a linha original no erro para contexto
            throw new Error(`Erro na linha ${state.lineNumber}: ${error.message}\n-> ${rawLine.trim()}`);
        }
    }

    // Validação final das conexões
    state.connections.forEach(conn => {
        if (!nodeMap[conn.from]) throw new Error(`Erro de Conexão: Nó de origem '${conn.from}' não definido.`);
        if (!nodeMap[conn.to]) throw new Error(`Erro de Conexão: Nó de destino '${conn.to}' não definido.`);
    });


    return { nodes: state.nodes, connections: state.connections };
}

// --- Funções Auxiliares de Parsing ---

function parseNodeLine(line: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean {
    const nodeRegex = /^NODE\s+(\S+)\s+(START|END|STEP|DECISION|ENTRYPOINT)\s+"([^"]+)"$/i;
    const match = line.match(nodeRegex); // Já usa linha limpa

    if (match) {
        const [, id, type, name] = match;
        const nodeType = type.toUpperCase() as FlowNode['type'];

        if (nodeMap[id]) {
            throw new Error(`ID de nó duplicado: '${id}'`);
        }

        const newNode: FlowNode = {
            id,
            type: nodeType,
            name,
             metadata: {},
             description: { fields: [] }
        };
        state.nodes.push(newNode);
        nodeMap[id] = newNode;
        state.currentNodeId = id;
        return true;
    }
    return false;
}

function parseMetaLine(rawLine: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean {
     const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
     if (indent === 0) return false;

    const line = cleanLine(rawLine); // Limpa APÓS checar indentação
    const metaRegex = /^META\s+(\S+):\s*(.*)$/i;
    const match = line.match(metaRegex);

    if (match && state.currentNodeId) {
        const [, key, value] = match;
        const currentNode = nodeMap[state.currentNodeId];
        if (!currentNode.metadata) {
            currentNode.metadata = {};
        }
        currentNode.metadata[key] = value; // Value já está trimado por cleanLine
        return true;
    } else if (match && !state.currentNodeId) {
        throw new Error(`'META' definido sem um 'NODE' precedente.`);
    }
    return false;
}

function parseDescLine(rawLine: string, state: ParserState, nodeMap: { [id: string]: FlowNode }): boolean {
     const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
     if (indent === 0) return false;

    const line = cleanLine(rawLine); // Limpa APÓS checar indentação
    const descRegex = /^DESC\s+([^:]+):\s*(.*)$/i; // Content captura tudo após ':'
    const match = line.match(descRegex);

    if (match && state.currentNodeId) {
        const [, label, content] = match;
        const currentNode = nodeMap[state.currentNodeId];
        if (!currentNode.description) {
            currentNode.description = { fields: [] };
        }
        // Salva o label trimado, mas o content como foi capturado (preserva espaços internos)
        currentNode.description.fields.push({
            label: label.trim(),
            content: content
        });
        return true;
    } else if (match && !state.currentNodeId) {
         throw new Error(`'DESC' definido sem um 'NODE' precedente.`);
    }
    return false;
}

// 👇 CORRIGIDO para usar a linha limpa
function parseConnLine(line: string, state: ParserState): boolean {
    // A linha já vem limpa (sem comentário e trimada) da chamada principal
    const connRegex = /^CONN\s+(\S+)\s*->\s*(\S+)\s+"([^"]*)"(\s+\[SECONDARY\])?$/i;
    const match = line.match(connRegex);

    if (match) {
        const [, from, to, conditionLabel, secondaryFlag] = match;
        state.connections.push({
            from,
            to,
            conditionLabel: conditionLabel.trim(), // Label pode ter espaços extras nas aspas
            secondary: !!secondaryFlag
        });
        state.currentNodeId = null;
        return true;
    }
    return false;
}
```

## File: src-code/utils/layoutManager.ts
```typescript
import { nodeCache } from "./nodeCache";

/**
 * Gerenciador de layout otimizado para o plugin IziFlow
 */
class LayoutManager {
    private static instance: LayoutManager;
    private layoutQueue: Array<() => Promise<void>>;
    private isProcessing: boolean;

    private constructor() {
        this.layoutQueue = [];
        this.isProcessing = false;
    }

    public static getInstance(): LayoutManager {
        if (!LayoutManager.instance) {
            LayoutManager.instance = new LayoutManager();
        }
        return LayoutManager.instance;
    }

    public async processLayout(node: SceneNode): Promise<void> {
        return new Promise((resolve) => {
            this.layoutQueue.push(async () => {
                try {
                    node.setRelaunchData({ relaunch: '' });
                    resolve();
                } catch (error) {
                    console.error(`Erro ao processar layout: ${node.name}`, error);
                    resolve();
                }
            });

            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.layoutQueue.length === 0) return;

        this.isProcessing = true;

        while (this.layoutQueue.length > 0) {
            const task = this.layoutQueue.shift();
            if (task) await task();
        }

        this.isProcessing = false;
    }

    public clearQueue(): void {
        this.layoutQueue = [];
        this.isProcessing = false;
    }
}

export const layoutManager = LayoutManager.getInstance();
```

## File: src-code/utils/nodeCache.ts
```typescript
/**
 * Cache otimizado para recursos do IziFlow
 */
class NodeCache {
    private static instance: NodeCache;
    private taskQueue: Array<() => Promise<any>>;
    private isProcessing: boolean;

    private constructor() {
        this.taskQueue = [];
        this.isProcessing = false;
    }

    static getInstance() {
        if (!NodeCache.instance) {
            NodeCache.instance = new NodeCache();
        }
        return NodeCache.instance;
    }

    async loadFont(family: string, style: string) {
        return figma.loadFontAsync({ family, style });
    }

    async enqueueTask<T>(task: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.taskQueue.push(async () => {
                try {
                    const result = await task();
                    resolve(result);
                } catch (error) {
                    console.error("Erro na execução da task:", error);
                    reject(error);
                }
            });

            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    private async processQueue() {
        if (this.isProcessing || this.taskQueue.length === 0) return;

        this.isProcessing = true;

        try {
            while (this.taskQueue.length > 0) {
                const task = this.taskQueue.shift();
                if (task) {
                    await task();
                }
            }
        } catch (error) {
            console.error("Erro no processamento da fila:", error);
        } finally {
            this.isProcessing = false;
        }
    }
}

export const nodeCache = NodeCache.getInstance();
```

## File: src/components/ui/accordion.tsx
```typescript
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

## File: src/components/ui/alert-dialog.tsx
```typescript
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function AlertDialog({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  )
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  )
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

## File: src/components/ui/aspect-ratio.tsx
```typescript
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
```

## File: src/components/ui/avatar.tsx
```typescript
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
```

## File: src/components/ui/badge.tsx
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
```

## File: src/components/ui/breadcrumb.tsx
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
```

## File: src/components/ui/calendar.tsx
```typescript
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
```

## File: src/components/ui/card.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

## File: src/components/ui/carousel.tsx
```typescript
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

## File: src/components/ui/chart.tsx
```typescript
import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  }) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-medium", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-medium", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey || item.name || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = color || item.payload.fill || item.color

          return (
            <div
              key={item.dataKey}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={cn(
                          "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                          {
                            "h-2.5 w-2.5": indicator === "dot",
                            "w-1": indicator === "line",
                            "w-0 border-[1.5px] border-dashed bg-transparent":
                              indicator === "dashed",
                            "my-0.5": nestLabel && indicator === "dashed",
                          }
                        )}
                        style={
                          {
                            "--color-bg": indicatorColor,
                            "--color-border": indicatorColor,
                          } as React.CSSProperties
                        }
                      />
                    )
                  )}
                  <div
                    className={cn(
                      "flex flex-1 justify-between leading-none",
                      nestLabel ? "items-end" : "items-center"
                    )}
                  >
                    <div className="grid gap-1.5">
                      {nestLabel ? tooltipLabel : null}
                      <span className="text-muted-foreground">
                        {itemConfig?.label || item.name}
                      </span>
                    </div>
                    {item.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
  }) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item) => {
        const key = `${nameKey || item.dataKey || "value"}`
        const itemConfig = getPayloadConfigFromPayload(config, item, key)

        return (
          <div
            key={item.value}
            className={cn(
              "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
            )}
          >
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        )
      })}
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
```

## File: src/components/ui/checkbox.tsx
```typescript
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
```

## File: src/components/ui/collapsible.tsx
```typescript
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

## File: src/components/ui/command.tsx
```typescript
"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
```

## File: src/components/ui/context-menu.tsx
```typescript
"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        "text-foreground px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
```

## File: src/components/ui/dialog.tsx
```typescript
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
```

## File: src/components/ui/drawer.tsx
```typescript
import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
```

## File: src/components/ui/dropdown-menu.tsx
```typescript
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
```

## File: src/components/ui/form.tsx
```typescript
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

## File: src/components/ui/hover-card.tsx
```typescript
import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

function HoverCard({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return (
    <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
  )
}

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content>) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardContent }
```

## File: src/components/ui/input-otp.tsx
```typescript
"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:ring-destructive/20 dark:data-[active=true]:aria-invalid:ring-destructive/40 aria-invalid:border-destructive data-[active=true]:aria-invalid:border-destructive dark:bg-input/30 border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md data-[active=true]:z-10 data-[active=true]:ring-[3px]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
```

## File: src/components/ui/input.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

## File: src/components/ui/label.tsx
```typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
```

## File: src/components/ui/menubar.tsx
```typescript
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
```

## File: src/components/ui/navigation-menu.tsx
```typescript
import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
```

## File: src/components/ui/pagination.tsx
```typescript
import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
```

## File: src/components/ui/popover.tsx
```typescript
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
```

## File: src/components/ui/progress.tsx
```typescript
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
```

## File: src/components/ui/radio-group.tsx
```typescript
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <CircleIcon className="fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
```

## File: src/components/ui/resizable.tsx
```typescript
import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
```

## File: src/components/ui/scroll-area.tsx
```typescript
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="bg-border relative flex-1 rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
```

## File: src/components/ui/separator.tsx
```typescript
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
```

## File: src/components/ui/sheet.tsx
```typescript
import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" &&
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" &&
            "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" &&
            "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" &&
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

## File: src/components/ui/sidebar.tsx
```typescript
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeftIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
```

## File: src/components/ui/skeleton.tsx
```typescript
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

## File: src/components/ui/slider.tsx
```typescript
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
```

## File: src/components/ui/sonner.tsx
```typescript
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
```

## File: src/components/ui/switch.tsx
```typescript
"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
```

## File: src/components/ui/table.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

## File: src/components/ui/toggle-group.tsx
```typescript
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-md data-[variant=outline]:shadow-xs",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "min-w-0 flex-1 shrink-0 rounded-none shadow-none first:rounded-l-md last:rounded-r-md focus:z-10 focus-visible:z-10 data-[variant=outline]:border-l-0 data-[variant=outline]:first:border-l",
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
}

export { ToggleGroup, ToggleGroupItem }
```

## File: src/components/ui/toggle.tsx
```typescript
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
```

## File: src/components/ui/tooltip.tsx
```typescript
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

## File: src/main.tsx
```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import IndexReact from "./index-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IndexReact />
  </React.StrictMode>
);
```

## File: components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## File: src-code/config/styles.config.ts
```typescript
// src-code/config/styles.config.ts
/// <reference types="@figma/plugin-typings" />

// Este arquivo agora foca em estilos NÃO temáticos: fontes, tamanhos, raios, pesos, etc.
// As cores são gerenciadas por theme.config.ts

// --- Estilos de Conectores (Apenas não-cor) ---
export const Connectors = {
    PRIMARY: {
        // STROKE: definido pelo tema (token: connector_primary)
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [], // Sólido
        END_CAP: "ARROW_LINES" as ConnectorStrokeCap, // Tipo correto da API
    },
    SECONDARY: {
        // STROKE: definido pelo tema (token: connector_secondary)
        STROKE_WEIGHT: 1,
        DASH_PATTERN: [4, 4], // Tracejado
        END_CAP: "ARROW_LINES" as ConnectorStrokeCap, // Tipo correto da API
    },
};

// --- Estilos de Etiquetas/Chips (Apenas não-cor) ---
// Reflete chipsNode e nodeTypeChip do nodeLayout.md
export const Labels = {
    // Configuração base para chips de descrição (chipsNode)
    DESC_CHIP_PADDING_HORIZONTAL: 6,
    DESC_CHIP_PADDING_VERTICAL: 1,
    DESC_CHIP_CORNER_RADIUS: 4,
    DESC_CHIP_FONT_SIZE: 12,
    DESC_CHIP_ITEM_SPACING: 4, // Espaço entre ícone e texto (embora chipsNode não tenha ícone)

    // Configuração para chips de tipo de nó (nodeTypeChip)
    TYPE_CHIP_PADDING_HORIZONTAL: 8,
    TYPE_CHIP_PADDING_VERTICAL: 4,
    TYPE_CHIP_CORNER_RADIUS: 6,
    TYPE_CHIP_FONT_SIZE: 14,
    TYPE_CHIP_ITEM_SPACING: 8, // Espaço entre ícone e texto

    // Fonte comum para todos os chips
    FONT: { family: "Inter", style: "Medium" } as FontName,
};

// --- Estilos de Nós (Apenas não-cor) ---
export const Nodes = {
    START_END: {
        // FILL, STROKE, TEXT_COLOR: definidos pelo tema
        CORNER_RADIUS: 100, // Raio para formar círculo em 150x150
        FONT: { family: "Inter", style: "Medium" } as FontName, // Conforme discussão
        FONT_SIZE: 30, // Conforme discussão
        SIZE: 150, // Tamanho fixo 150x150
    },
    DECISION: { // Configurações para o frame principal DECISION
        // FILL, STROKE: definidos pelo tema
        CORNER_RADIUS: 8, // Conforme nodeLayout.md
        // Padding e Item Spacing definidos diretamente nas funções de criação
    },
     STEP_ENTRYPOINT: { // Configurações comuns para frames principais STEP/ENTRYPOINT
        // FILL, STROKE: definidos pelo tema
        CORNER_RADIUS: 8, // Conforme nodeLayout.md
        WIDTH: 400, // Largura fixa conforme nodeLayout.md
        // Padding e Item Spacing definidos diretamente nas funções de criação
    },
    TITLE_BLOCK: { // Estilos para o frame container do Título (nodeTitle)
        // FILL: none
        // STROKE: none
        // Padding e Item Spacing definidos diretamente nas funções de criação
        FONT: { family: "Inter", style: "Regular" } as FontName, // Fonte do Nome do Nó
        FONT_SIZE: 24, // Tamanho do Nome do Nó
    },
    DESCRIPTION_BLOCK: { // Estilos para o frame container da Descrição (descBlock)
        // FILL: none
        // STROKE: none
        // Padding e Item Spacing definidos diretamente nas funções de criação
    },
    DESCRIPTION_ITEM: { // Estilos para o frame container de cada Item da Descrição (descItem)
        // FILL: none
        // STROKE: none
         // Padding e Item Spacing definidos diretamente nas funções de criação
        CONTENT_FONT: { family: "Inter", style: "Regular" } as FontName, // Fonte do Conteúdo da Descrição
        CONTENT_FONT_SIZE: 16, // Tamanho do Conteúdo da Descrição
    },
    DIVIDER: { // Estilos para o frame container do Divisor (divider)
        // FILL: none
        // STROKE: none
        // Padding e Item Spacing definidos diretamente nas funções de criação
    }
};

// --- Fontes Usadas ---
// Fontes que precisam ser carregadas via figma.loadFontAsync
export const FontsToLoad: FontName[] = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" }, // Se usado em algum lugar
    { family: "Inter", style: "Bold" },    // Se usado em algum lugar (START/END agora usa Medium)
];
```

## File: src-code/config/theme.config.ts
```typescript
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
```

## File: src-code/utils/code-utils.ts
```typescript
import type { EventTS } from "../../shared/types/messaging.types";

export const dispatch = (data: any, origin = "*") => {
  figma.ui.postMessage(data, {
    origin,
  });
};

export const dispatchTS = <Key extends keyof EventTS>(
  event: Key,
  data: EventTS[Key],
  origin = "*",
) => {
  dispatch({ event, data }, origin);
};

export const listenTS = <Key extends keyof EventTS>(
  eventName: Key,
  callback: (data: EventTS[Key]) => any,
  listenOnce = false,
) => {
  const func = (event: any) => {
    if (event.event === eventName) {
      callback(event);
      if (listenOnce) figma.ui && figma.ui.off("message", func); // Remove Listener so we only listen once
    }
  };

  figma.ui.on("message", func);
};

export const getStore = async (key: string) => {
  const value = await figma.clientStorage.getAsync(key);
  return value;
};

export const setStore = async (key: string, value: string) => {
  await figma.clientStorage.setAsync(key, value);
};
```

## File: src-code/utils/color-generation.ts
```typescript
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
```

## File: src-code/utils/historyStorage.ts
```typescript
// src-code/utils/historyStorage.ts
/// <reference types="@figma/plugin-typings" />

const HISTORY_STORAGE_KEY = 'markdownHistory';
const MAX_HISTORY_ITEMS = 20;

/**
 * Lê o histórico do clientStorage com logs detalhados.
 */
export async function getHistory(): Promise<string[]> {
    // console.log('[HistoryStorage] Iniciando getHistory...'); // Log início da função
    try {
        const historyJson = await figma.clientStorage.getAsync(HISTORY_STORAGE_KEY);
        // console.log('[HistoryStorage] Raw data lido do storage:', historyJson); // Log do dado bruto

        if (typeof historyJson === 'string' && historyJson.length > 0) {
             try {
                 const parsed = JSON.parse(historyJson);
                 // console.log('[HistoryStorage] JSON parseado com sucesso:', parsed); // Log do dado parseado

                 if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
                     // console.log('[HistoryStorage] Dado parseado é um array de strings válido.');
                     return parsed;
                 } else {
                      // console.warn("[HistoryStorage] Dado parseado NÃO é um array de strings. Retornando vazio. Dado:", parsed);
                      // await clearHistory(); // Opcional: Limpar storage inválido
                      return [];
                 }
             } catch (parseError) {
                 // console.error("[HistoryStorage] Erro ao fazer parse do JSON do histórico:", parseError, "JSON Bruto:", historyJson);
                 // await clearHistory(); // Opcional: Limpar storage inválido
                 return [];
             }
        } else {
             // console.log("[HistoryStorage] Nenhum dado encontrado ou dado não é string. Retornando vazio.");
             return [];
        }
    } catch (error) {
        // console.error("[HistoryStorage] Erro GERAL ao ler histórico do clientStorage:", error);
        return [];
    }
}

/**
 * Adiciona uma nova entrada de markdown ao histórico com logs.
 */
export async function addHistoryEntry(markdownToAdd: string): Promise<void> {
    // console.log('[HistoryStorage] Iniciando addHistoryEntry...');
    if (typeof markdownToAdd !== 'string' || !markdownToAdd.trim()) {
        // console.warn("[HistoryStorage] Tentativa de adicionar entrada vazia/inválida.");
        return;
    }
    // console.log('[HistoryStorage] Tentando adicionar:', markdownToAdd.substring(0, 50) + "..."); // Log do que será adicionado

    try {
        let history = await getHistory(); // Chama a versão com logs
        // console.log('[HistoryStorage] Histórico lido antes de adicionar:', history);

        history = history.filter(entry => entry !== markdownToAdd); // Remove duplicatas
        history.unshift(markdownToAdd); // Adiciona no início

        if (history.length > MAX_HISTORY_ITEMS) {
            console.log(`[HistoryStorage] Histórico excedeu ${MAX_HISTORY_ITEMS} itens. Limitando...`);
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        await figma.clientStorage.setAsync(HISTORY_STORAGE_KEY, JSON.stringify(history));
        // console.log("[HistoryStorage] Histórico salvo com sucesso. Novo tamanho:", history.length);

    } catch (error) {
        // console.error("[HistoryStorage] Erro ao adicionar entrada no histórico:", error);
    }
}

/**
 * Remove todo o histórico do clientStorage com logs.
 */
export async function clearHistory(): Promise<void> {
     // console.log('[HistoryStorage] Iniciando clearHistory...');
     try {
        await figma.clientStorage.deleteAsync(HISTORY_STORAGE_KEY);
        // console.log("[HistoryStorage] Histórico limpo com sucesso via deleteAsync.");
     } catch (error) {
          // console.error("[HistoryStorage] Erro ao limpar histórico:", error);
     }
}
```

## File: src/components/ui/alert.tsx
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
```

## File: src/components/ui/tabs.tsx
```typescript
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 w-96 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

## File: src/components/ui/textarea.tsx
```typescript
import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
```

## File: src/index-react.tsx
```typescript
import "@/index.css";
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { App } from '@/components/app';

export default function IndexReact() {
  return (
    <ThemeProvider defaultTheme="light">
      <App />
    </ThemeProvider>
  );
}

// Crie a raiz e renderize o componente
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<IndexReact />);
}
```

## File: src/vite-env.d.ts
```typescript
/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="figma" />

declare module '*.svg?raw' {
    const content: string;
    export default content;
  }
```

## File: vite.config.code.ts
```typescript
import { defineConfig } from "vite";
import { figmaCodePlugin } from "vite-figma-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [figmaCodePlugin()],
  build: {
    emptyOutDir: false,
    outDir: ".tmp",
    target: "chrome58",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: `code.js`,
      },
      input: "./src-code/code.ts",
      treeshake: true,
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: false, // Importante: manter isso como false
        drop_debugger: false
      },
      mangle: true
    }
  },
});
```

## File: src-code/config/layout.config.ts
```typescript
// src-code/config/layout.config.ts
/// <reference types="@figma/plugin-typings" />

// --- Configuração de Layout de Conectores ---
export const Connectors = {
    // Removido 'as ConnectorMagnet' - A API espera a string literal.
    DEFAULT_PRIMARY_START_MAGNET: "RIGHT",
    DEFAULT_SECONDARY_START_MAGNET: "BOTTOM",
    DEFAULT_END_MAGNET: "LEFT",

    // Removido 'as ConnectorLineType' - A API espera a string literal.
    DEFAULT_PRIMARY_LINE_TYPE: "ELBOWED",
    DEFAULT_SECONDARY_LINE_TYPE: "ELBOWED",

    DECISION_PRIMARY_LINE_TYPE: "ELBOWED",
    DECISION_SECONDARY_LINE_TYPE: "ELBOWED",
    // Removido 'as ConnectorMagnet' do array - O tipo será inferido como string[].
    DECISION_PRIMARY_MAGNET_SEQUENCE: ["TOP", "RIGHT", "BOTTOM"],
    DECISION_SECONDARY_START_MAGNET: "BOTTOM",

    CONVERGENCE_PRIMARY_LINE_TYPE: "ELBOWED",

    LABEL_OFFSET_NEAR_START: 45,
    LABEL_OFFSET_MID_LINE_Y: 10,
};

// --- Configuração de Layout de Nós ---
// Mantém apenas espaçamento *entre* nós
export const Nodes = {
    HORIZONTAL_SPACING: 300,
    VERTICAL_SPACING: 0,
};
```

## File: src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## File: src-code/tsconfig.json
```json
// src-code/tsconfig.json (REFINADO NOVAMENTE - Priorizando resolução correta)
{
  "extends": "../tsconfig.json", // Herda baseUrl, paths, strict...
  "compilerOptions": {
    // --- Opções Específicas ou que Sobrescrevem a Raiz ---
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],          // Sobrescreve 'lib' da raiz: sem "DOM"
    "outDir": "../.tmp",       // Diretório de saída
    // --- TypeRoots: Define explicitamente ONDE procurar tipos ---
    // Sobrescreve os typeRoots herdados. Essencial garantir que @figma esteja aqui.
    "typeRoots": [
      "../node_modules/@types",  // Caminho relativo de src-code para node_modules/@types
      "../node_modules/@figma",  // <<< ESSENCIAL: Caminho relativo para os tipos Figma
      "../shared/types"        // Caminho relativo para tipos compartilhados
    ],

    // 'paths' são herdados da raiz e devem resolver '@shared/*' a partir do baseUrl herdado ('.')
    // Se '@shared/*' ainda falhar, descomente e defina paths aqui:
    // "baseUrl": ".", // Pode ser necessário repetir se extends não funcionar como esperado com paths
    // "paths": {
    //   "@shared/*": ["../shared/*"]
    // },

    "composite": false,
    "isolatedModules": true, // Mantido por consistência com Vite
    "skipLibCheck": true // Mantido
  },
  "include": [
    // Inclui apenas os arquivos TS dentro de src-code
    "./**/*.ts"
    // Imports para ../config e @shared devem ser resolvidos via moduleResolution
  ],
  "exclude": [
    "../node_modules" // Exclui node_modules relativo a src-code
  ]
}
```

## File: src/components/ui/select.tsx
```typescript
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
```

## File: src/utils/utils.ts
```typescript
// src/utils/utils.ts

import type { EventTS } from '@shared/types/messaging.types';

export type Message<K extends keyof EventTS = keyof EventTS> = {
  type: K;
} & EventTS[K];

// <<< Função dispatchTS (UI -> Plugin) CORRIGIDA >>>
export const dispatchTS = <Key extends keyof EventTS>(
  event: Key,
  ...payload: EventTS[Key] extends Record<string, never> ? [] : [EventTS[Key]]
) => {
  console.log('UI dispatchTS chamado:', { event, payload });

  const messagePayload = payload.length > 0 ? payload[0] : {};
  const messageData: Message<Key> = {
    type: event,
    ...(messagePayload as EventTS[Key])
  };

  // <<< GARANTIR QUE ESTA LINHA ESTÁ CORRETA >>>
  console.log('UI Enviando mensagem final (COM wrapper):', { pluginMessage: messageData });
  parent.postMessage({ pluginMessage: messageData }, "*"); // <<< ENVOLVER AQUI
};


// Função listenTS (Plugin -> UI) - Nenhuma alteração necessária
export const listenTS = <Key extends keyof EventTS>(
  eventName: Key,
  callback: (payload: EventTS[Key]) => void,
  listenOnce = false
) => {
  const func = (event: MessageEvent<any>) => {
    const messageData = event.data;

    if (
        messageData &&
        typeof messageData === 'object' &&
        typeof messageData.type === 'string' &&
        messageData.type === eventName
    ) {
      const { type, ...payload } = messageData;
      callback(payload as EventTS[Key]);
      if (listenOnce) {
        window.removeEventListener("message", func);
        console.log(`UI: Listener removido para ${eventName} (listenOnce)`);
      }
    }
  };

  window.addEventListener("message", func);
  console.log(`UI: Listener adicionado para ${eventName}`);

  return () => {
    window.removeEventListener("message", func);
    console.log(`UI: Listener removido para ${eventName} (cleanup)`);
  };
};
```

## File: tsconfig.json
```json
// tsconfig.json (Raiz do Projeto - Confirmar esta versão)
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "es2020",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "verbatimModuleSyntax": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "allowJs": true,
    "jsx": "react-jsx",
    "checkJs": false,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"], // Para UI
      "@shared/*": ["./shared/*"]
    },
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@figma", // <--- Importante para contexto global do editor
      "./shared/types"
    ]
  },
  "include": [
    "src",
    "src-code",
    "shared",
    "vite.config.ts",
    "vite.config.code.ts",
    "figma.config.ts"
  ],
  "exclude": [
    "node_modules",
    ".tmp",
    "dist"
  ]
}
```

## File: .gitignore
```
# Node
*.log
*.log.*
.tmp/
tmp
node_modules
.github/

out/
dist/
code.js
.vs/
.vscode/
.alt-tst/
repomix.config.json
iziflow-repomix.xml
```

## File: shared/types/messaging.types.ts
```typescript
// shared/types/messaging.types.ts
export interface EventTS {
  'generate-flow': {
    markdown: string;
    mode: 'light' | 'dark';
    accentColor: string;
  };
  'generation-success': { message: string; };
  'generation-error': { message: string; };
  'parse-error': { message: string; lineNumber?: number; };
  'debug': { message: string; data?: string; };
  closePlugin: {};
  'get-history': {};
  'history-data': { history: string[] };
  // 'add-history-entry': { markdown: string }; // Note: Plugin adds internally now
  'clear-history-request': {};
  'remove-history-entry': { markdown: string }; // <<< ADD THIS LINE
}
```

## File: src-code/lib/connectors.ts
```typescript
// src-code/lib/connectors.ts
/// <reference types="@figma/plugin-typings" />

import type { NodeData, Connection } from '@shared/types/flow.types';
import type { RGB } from '../config/theme.config'; // Importa tipo RGB
import * as LayoutConfig from '../config/layout.config'; // Configurações de layout (sem tipos problemáticos agora)
import * as StyleConfig from '../config/styles.config'; // Configurações de estilo (sem tipos problemáticos agora)
import { nodeCache } from '../utils/nodeCache';

// --- Interfaces Internas (Tipos Removidos/Alterados para string) ---
interface ConnectorStyleBaseConfig {
    STROKE_WEIGHT: number;
    DASH_PATTERN: number[];
    // A API espera um valor específico, mas usamos string aqui para evitar erro TS
    // O valor de StyleConfig.Connectors.PRIMARY/SECONDARY.END_CAP deve ser uma string válida como "ARROW_LINES"
    END_CAP: string;
}

interface DeterminedConnectorConfig {
    styleBase: ConnectorStyleBaseConfig;
    // Usamos 'string' onde ConnectorMagnet falhava
    startConnection: { magnet?: string; position?: { x: number, y: number } };
    endMagnet: string;
    // Usamos 'string' onde ConnectorLineType falhava
    lineType: string;
    placeLabelNearStart: boolean;
    // Usamos 'string' onde ConnectorMagnet falhava
    actualStartMagnetForLabel: string;
    isSecondary: boolean;
}

// --- Função Principal ---
export namespace Connectors {
    export async function createConnectors(
        connections: Array<Connection>,
        // Usamos SceneNode que é um tipo mais genérico e disponível
        nodeMap: { [id: string]: SceneNode },
        nodeDataMap: { [id: string]: NodeData },
        finalColors: Record<string, RGB>
    ): Promise<void> {

         try {
            // Carrega a fonte para os labels dos conectores
            await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        } catch (e: any) {
            console.error("[Connectors] Erro ao carregar fonte para etiquetas:", e);
            figma.notify(`Erro ao carregar fonte para etiquetas: ${e?.message || e}`, { error: true });
        }

        // Lógica de contagem de conexões (inalterada)
        const outgoingPrimaryCounts: { [nodeId: string]: number } = {};
        const nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<Connection> } = {};
        const incomingPrimaryCounts: { [nodeId: string]: number } = {};
        connections.forEach(conn => {
            if (!conn.secondary) {
                outgoingPrimaryCounts[conn.from] = (outgoingPrimaryCounts[conn.from] || 0) + 1;
                if (!nodeOutgoingPrimaryConnections[conn.from]) nodeOutgoingPrimaryConnections[conn.from] = [];
                nodeOutgoingPrimaryConnections[conn.from].push(conn);
                incomingPrimaryCounts[conn.to] = (incomingPrimaryCounts[conn.to] || 0) + 1;
            }
        });

        const labelCreationPromises: Promise<void>[] = [];

        // Itera sobre as conexões definidas
        for (const conn of connections) {
            const fromNode = nodeMap[conn.from];
            const toNode = nodeMap[conn.to];
            const fromNodeData = nodeDataMap[conn.from];

            // Valida se os nós existem no mapa
            if (!fromNode || !toNode || !fromNodeData) {
                console.warn(`[Connectors] Nó/dados ausentes para conexão: ${conn.from} -> ${conn.to}. Pulando.`);
                continue;
            }

            // Determina a configuração do conector (layout, tipo, magnets)
            // Agora usa a função que aceita/retorna strings onde os tipos falhavam
            const config = determineConnectorConfig(conn, fromNode, fromNodeData, incomingPrimaryCounts[conn.to] || 0, nodeOutgoingPrimaryConnections);

            // Cria o nó conector
            const connector = figma.createConnector();
            const fromNodeName = fromNodeData.name || conn.from;
            const toNodeName = nodeDataMap[conn.to]?.name || conn.to;
            connector.name = `Connector: ${fromNodeName} -> ${toNodeName}`;

            // Define o tipo da linha (a API aceita a string, faz cast opcional para clareza)
            connector.connectorLineType = config.lineType as ConnectorLineType;

            // Anexa os pontos de início e fim do conector
            attachConnectorEndpoints(connector, fromNode.id, toNode.id, config.startConnection, config.endMagnet);

            // Aplica os estilos (peso, traço, cor fixa)
            applyConnectorStyle(connector, config.styleBase, config.isSecondary);

            // Cria a etiqueta (label) apenas se for de uma decisão e tiver texto
            const labelText = conn.conditionLabel || conn.condition;
            if (labelText && labelText.trim() !== '' && fromNodeData.type === 'DECISION') {
                labelCreationPromises.push(
                    createConnectorLabel(labelText, fromNode, toNode, config.actualStartMagnetForLabel, config.placeLabelNearStart, finalColors)
                        .catch(err => {
                            console.error(`[Connectors] Falha ao criar etiqueta para ${conn.from}->${conn.to}:`, err);
                            const errorMessage = (err instanceof Error) ? err.message : String(err);
                            figma.notify(`Erro ao criar etiqueta '${labelText}': ${errorMessage}`, { error: true });
                        })
                );
            } else if (labelText && fromNodeData.type !== 'DECISION') {
                 // Log para debug se label for ignorado
                 console.log(`[Connectors] Debug: Ignorando label '${labelText}' para conexão ${conn.from} -> ${conn.to} (não é de Decision).`);
            }
        } // Fim do loop de conexões

        // Espera todas as criações de label terminarem
        try {
            await Promise.all(labelCreationPromises);
            console.log("[Connectors] Criação de conectores e etiquetas concluída.");
        } catch (overallError: any) {
             console.error("[Connectors] Erro inesperado durante criação das etiquetas:", overallError);
             figma.notify(`Ocorreu um erro durante a criação das etiquetas: ${overallError?.message || overallError}`, { error: true });
        }
    }
}

// --- Funções Auxiliares (Tipos Removidos/Alterados) ---

/**
 * Determina a configuração de layout e tipo para um conector específico.
 * Usa strings onde os tipos ConnectorMagnet/ConnectorLineType causavam erro.
 */
function determineConnectorConfig(
    conn: Connection,
    fromNode: SceneNode,
    fromNodeData: NodeData,
    incomingPrimaryCountToTarget: number,
    nodeOutgoingPrimaryConnections: { [nodeId: string]: Array<Connection> }
): DeterminedConnectorConfig { // Retorna a interface com tipos string onde necessário

    const isDecisionOrigin = fromNodeData.type === 'DECISION';
    const isSecondary = conn.secondary === true;
    const isConvergingPrimary = incomingPrimaryCountToTarget > 1 && !isSecondary;

    // Obtém estilo base (não-cor) de StyleConfig
    let styleBase: ConnectorStyleBaseConfig = isSecondary ? StyleConfig.Connectors.SECONDARY : StyleConfig.Connectors.PRIMARY;

    // Inicializa variáveis com tipos string onde necessário
    let startConnection: { magnet?: string; position?: { x: number; y: number } } = {};
    let finalLineType: string = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE : LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
    let placeLabelNearStart = false;
    let finalEndMagnet: string = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
    let finalStartMagnetForLabel: string = isSecondary ? LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET : LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;

    // Lógica de decisão para diferentes tipos de conexão
    if (isSecondary) {
        finalLineType = LayoutConfig.Connectors.DEFAULT_SECONDARY_LINE_TYPE;
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_SECONDARY_START_MAGNET;
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        startConnection = { magnet: finalStartMagnetForLabel };
        placeLabelNearStart = false;
    } else if (isDecisionOrigin) {
        placeLabelNearStart = true;
        finalLineType = LayoutConfig.Connectors.DECISION_PRIMARY_LINE_TYPE;
        const primaryOutputs = nodeOutgoingPrimaryConnections[conn.from] || [];
        const index = primaryOutputs.findIndex(c => (conn.id && c.id === conn.id) || (!conn.id && c.from === conn.from && c.to === conn.to && c.conditionLabel === conn.conditionLabel));
        const seq = LayoutConfig.Connectors.DECISION_PRIMARY_MAGNET_SEQUENCE;
        let targetMagnet: string = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET; // Usa string
        if (index !== -1) {
             // Garante que o índice não saia dos limites da sequência de magnets definida
             targetMagnet = seq[index % seq.length];
        } else {
            console.warn(`[Connectors] Conexão primária de decisão não encontrada: ${conn.from} -> ${conn.to}. Usando fallback: ${targetMagnet}.`);
        }
        finalStartMagnetForLabel = targetMagnet; // Magnet para posicionar o label
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;

        // Calcula a posição exata no nó de origem com base no magnet
        let startX: number, startY: number;
        const nodeWidth = fromNode.width;
        const nodeHeight = fromNode.height;
        switch (targetMagnet) {
            case 'TOP':    startX = nodeWidth / 2; startY = 0; break;
            case 'RIGHT':  startX = nodeWidth;     startY = nodeHeight / 2; break;
            case 'BOTTOM': startX = nodeWidth / 2; startY = nodeHeight; break;
            case 'LEFT':   startX = 0;             startY = nodeHeight / 2; break;
            case 'CENTER': startX = nodeWidth / 2; startY = nodeHeight / 2; break;
            case 'AUTO':   // AUTO geralmente mapeia para BOTTOM em conectores
                           startX = nodeWidth / 2; startY = nodeHeight; finalStartMagnetForLabel = 'BOTTOM'; break;
            default:       startX = nodeWidth;     startY = nodeHeight / 2; finalStartMagnetForLabel = 'RIGHT'; break; // Fallback
        }
        startConnection = { position: { x: startX, y: startY } }; // Decisão usa posição

    } else if (isConvergingPrimary) {
         finalLineType = LayoutConfig.Connectors.CONVERGENCE_PRIMARY_LINE_TYPE;
         finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
         finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
         startConnection = { magnet: finalStartMagnetForLabel };
         placeLabelNearStart = false;
    } else { // Primário Padrão
        finalLineType = LayoutConfig.Connectors.DEFAULT_PRIMARY_LINE_TYPE;
        finalStartMagnetForLabel = LayoutConfig.Connectors.DEFAULT_PRIMARY_START_MAGNET;
        finalEndMagnet = LayoutConfig.Connectors.DEFAULT_END_MAGNET;
        if (finalLineType === "STRAIGHT") {
            // Para linhas retas, CENTER geralmente é melhor
            startConnection = { magnet: "CENTER" };
            finalEndMagnet = "CENTER";
        } else {
             startConnection = { magnet: finalStartMagnetForLabel };
        }
        placeLabelNearStart = false;
    }

    // Retorna o objeto de configuração
    return {
        // Recria o objeto styleBase com o tipo correto para END_CAP, se necessário
        styleBase: {
            ...styleBase,
            END_CAP: styleBase.END_CAP // Mantém a string como definida em StyleConfig
        },
        startConnection,
        endMagnet: finalEndMagnet,
        lineType: finalLineType,
        placeLabelNearStart,
        actualStartMagnetForLabel: finalStartMagnetForLabel,
        isSecondary
    };
}

/**
 * Aplica estilos visuais (peso, traço, ponta, cor fixa) a um conector.
 */
function applyConnectorStyle(
    connector: ConnectorNode,
    styleBase: ConnectorStyleBaseConfig,
    isSecondary: boolean // Usado para dashPattern e endCap do styleBase
): void {
    try {
        // A API do Figma espera os tipos corretos aqui. Usamos 'as' para garantir.
        connector.connectorEndStrokeCap = styleBase.END_CAP as ConnectorStrokeCap;
        connector.dashPattern = styleBase.DASH_PATTERN;
        connector.strokeWeight = styleBase.STROKE_WEIGHT;

        // Define a cor fixa como preto (RGB 0,0,0)
        connector.strokes = [{ type: "SOLID", color: {r:0, g:0, b:0} }];

    } catch(e: any) {
        console.error(`[Connectors] Erro ao aplicar estilo ao conector ${connector.name || connector.id}: ${e?.message || e}`);
    }
}

/**
 * Anexa os pontos de início e fim de um conector aos nós correspondentes.
 * Usa strings para os magnets, com cast para o tipo Figma API onde necessário.
 */
function attachConnectorEndpoints(
    connector: ConnectorNode,
    fromNodeId: string,
    toNodeId: string,
    // Aceita string para magnet
    startConnection: { magnet?: string; position?: { x: number, y: number } },
    endMagnet: string // Aceita string
): void {
    try {
        if (startConnection.position) {
            // A API aceita o objeto position diretamente
            connector.connectorStart = { endpointNodeId: fromNodeId, position: startConnection.position };
        } else {
            // A API aceita a string do magnet, faz cast para o tipo esperado
            connector.connectorStart = { endpointNodeId: fromNodeId, magnet: (startConnection.magnet ?? "AUTO") as ConnectorMagnet };
        }
        // A API aceita a string do magnet, faz cast
        connector.connectorEnd = { endpointNodeId: toNodeId, magnet: (endMagnet ?? "AUTO") as ConnectorMagnet };
    } catch (e: any) {
         console.error(`[Connectors] Erro ao anexar conector ${connector.name}:`, e);
         figma.notify(`Erro ao conectar nós (${fromNodeId} -> ${toNodeId}): ${e?.message || e}`, { error: true });
    }
}

/**
 * Cria o frame da etiqueta para um conector (apenas para decisões).
 * Usa as constantes de padding/estilo de StyleConfig.Labels.
 */
async function createConnectorLabel(
    labelText: string,
    fromNode: SceneNode,
    toNode: SceneNode,
    actualStartMagnetForLabel: string, // Recebe string
    placeNearStart: boolean,
    finalColors: Record<string, RGB> // Recebe cores para o label
): Promise<void> {
    // A validação de labelText e tipo de nó já foi feita antes de chamar esta função

    let labelFrame: FrameNode | null = null;
     try {
        labelFrame = figma.createFrame();
        labelFrame.name = `Condition: ${labelText}`;
        labelFrame.layoutMode = "HORIZONTAL";
        labelFrame.primaryAxisSizingMode = "AUTO";
        labelFrame.counterAxisSizingMode = "AUTO";

        // Usa as constantes corretas para padding de labels/chips de descrição
        labelFrame.paddingLeft = labelFrame.paddingRight = StyleConfig.Labels.DESC_CHIP_PADDING_HORIZONTAL;
        labelFrame.paddingTop = labelFrame.paddingBottom = StyleConfig.Labels.DESC_CHIP_PADDING_VERTICAL;

        labelFrame.cornerRadius = StyleConfig.Labels.DESC_CHIP_CORNER_RADIUS;
        labelFrame.strokes = []; // Sem borda

        // Aplica Cores do Tema (usando cores de chip default para o LABEL)
        const labelFillToken = 'chips_default_fill';
        if (finalColors[labelFillToken]) {
             labelFrame.fills = [{ type: 'SOLID', color: finalColors[labelFillToken] }];
        } else {
             console.warn(`[Connectors] Cor não encontrada para ${labelFillToken}. Usando fallback cinza.`);
             labelFrame.fills = [{ type: 'SOLID', color: {r:0.8,g:0.8,b:0.8}}];
        }

        const labelTextNode = figma.createText();
        labelTextNode.fontName = StyleConfig.Labels.FONT;
        labelTextNode.characters = labelText;
        labelTextNode.fontSize = StyleConfig.Labels.DESC_CHIP_FONT_SIZE;
        labelTextNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Essencial para HUG

         // Aplica Cores do Tema (usando cores de chip default para o TEXTO do LABEL)
        const labelTextToken = 'chips_default_text';
        if (finalColors[labelTextToken]) {
            labelTextNode.fills = [{ type: 'SOLID', color: finalColors[labelTextToken] }];
        } else {
             console.warn(`[Connectors] Cor não encontrada para ${labelTextToken}. Usando fallback preto.`);
             labelTextNode.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0}}];
        }

        labelFrame.appendChild(labelTextNode);
        // Adiciona à página pai do nó de origem (ou à página atual como fallback)
        (fromNode.parent || figma.currentPage).appendChild(labelFrame);

        // Espera um tick para o Auto Layout calcular o tamanho
        await new Promise(resolve => setTimeout(resolve, 0));
        const labelWidth = labelFrame.width;
        const labelHeight = labelFrame.height;
        let targetX: number, targetY: number;
        const offsetNear = LayoutConfig.Connectors.LABEL_OFFSET_NEAR_START;
        const offsetMidY = LayoutConfig.Connectors.LABEL_OFFSET_MID_LINE_Y;
        const fromNodeWidth = fromNode.width;
        const fromNodeHeight = fromNode.height;
        const toNodeHeight = toNode.height;

        // Lógica de posicionamento (usa actualStartMagnetForLabel como string)
        if (placeNearStart) {
             let startPointX: number, startPointY: number;
             const startConn = (fromNode as ConnectorNode).connectorStart; // Tenta ler como ConnectorNode
             if (startConn && 'position' in startConn && startConn.position) {
                 startPointX = fromNode.x + startConn.position.x;
                 startPointY = fromNode.y + startConn.position.y;
             } else {
                 // Fallback para estimativa
                 let estimatedX = fromNode.x + fromNodeWidth / 2; // Default center X
                 let estimatedY = fromNode.y + fromNodeHeight / 2; // Default center Y
                 switch (actualStartMagnetForLabel) {
                    case 'TOP':    estimatedY = fromNode.y; break;
                    case 'RIGHT':  estimatedX = fromNode.x + fromNodeWidth; break;
                    case 'BOTTOM': estimatedY = fromNode.y + fromNodeHeight; break;
                    case 'LEFT':   estimatedX = fromNode.x; break;
                    // CENTER e AUTO usam o default center X/Y
                 }
                 startPointX = estimatedX; startPointY = estimatedY;
                 console.warn(`[Connectors] Usando posição estimada para label near start...`);
             }
             // Calcula targetX, targetY baseado no magnet (string) e ponto de saída
             switch (actualStartMagnetForLabel) {
                case 'TOP':    targetX = startPointX; targetY = startPointY - offsetNear - labelHeight / 2; break;
                case 'RIGHT':  targetX = startPointX + offsetNear + labelWidth / 2; targetY = startPointY; break;
                case 'BOTTOM': targetX = startPointX; targetY = startPointY + offsetNear + labelHeight / 2; break;
                case 'LEFT':   targetX = startPointX - offsetNear - labelWidth / 2; targetY = startPointY; break;
                case 'CENTER': targetX = startPointX; targetY = startPointY - offsetNear - labelHeight / 2; break;
                default:       targetX = startPointX + offsetNear + labelWidth / 2; targetY = startPointY; break; // Fallback
            }
        } else {
            // Lógica mid line (usa actualStartMagnetForLabel como string)
            let startX = fromNode.x; let startY = fromNode.y;
            const startConn = (fromNode as ConnectorNode).connectorStart;
            if (startConn && 'position' in startConn && startConn.position) { /*...*/ }
            else { // Fallback para estimativa
                switch (actualStartMagnetForLabel) { /*...*/ }
            }
            const endX = toNode.x + toNode.width / 2;
            const endY = toNode.y + toNodeHeight / 2;
            targetX = (startX + endX) / 2;
            targetY = (startY + endY) / 2 + offsetMidY;
        }
        // Posiciona o centro do label no ponto alvo
        labelFrame.x = targetX - labelWidth / 2;
        labelFrame.y = targetY - labelHeight / 2;

    } catch (error: any) {
        console.error(`[Connectors] Erro ao criar/posicionar etiqueta '${labelText}':`, error);
        if (labelFrame && !labelFrame.removed) {
             try { labelFrame.remove(); } catch (removeError) { /* Ignora */ }
        }
    }
}
```

## File: src/components/ui/button.tsx
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

## File: vite.config.ts
```typescript
import path from "path";
import { defineConfig } from "vite";
import { figmaPlugin, figmaPluginInit, runAction } from "vite-figma-plugin";
import tailwindcss from "@tailwindcss/vite"
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";

import { config } from "./figma.config";

const action = process.env.ACTION;
const mode = process.env.MODE;

if (action) runAction({}, action);

figmaPluginInit();

export default defineConfig({
  plugins: [
    react(), 
    viteSingleFile(), 
    tailwindcss(),
    figmaPlugin(config, mode),
  ],
  build: {
    assetsInlineLimit: 0,
    emptyOutDir: false,
    outDir: ".tmp",
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        // Removido manualChunks pois não é compatível com inlineDynamicImports
      },
      treeshake: true,
    },
    chunkSizeWarningLimit: 2000, // Aumentado para evitar warnings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantém os console.logs
        drop_debugger: false,
        pure_funcs: [], // Remove a remoção dos console.logs
        passes: 2
      },
      format: {
        comments: false
      }
    },
    target: 'esnext'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

## File: package.json
```json
{
  "name": "iziflow-v2",
  "version": "1.0.0",
  "description": "Your Figma Plugin",
  "main": "code.js",
  "type": "module",
  "scripts": {
    "dev": "vite build --watch",
    "devcode": "vite build --config vite.config.code.ts --watch",
    "build": "vite build",
    "buildcode": "vite build --config vite.config.code.ts",
    "preview": "vite preview",
    "hmr": "vite",
    "zip": "cross-env MODE=zip vite build"
  },
  "author": "",
  "license": "",
  "dependencies": {
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-aspect-ratio": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.3",
    "@radix-ui/react-context-menu": "^2.2.6",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-hover-card": "^1.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-navigation-menu": "^1.2.5",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.2.2",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.3.2",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toggle": "^1.1.2",
    "@radix-ui/react-toggle-group": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tailwindcss/vite": "^4.0.14",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "color": "^5.0.0",
    "colorjs.io": "^0.5.2",
    "culori": "^4.0.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.5.2",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.482.0",
    "next-themes": "^0.4.6",
    "react": "^19.0.0",
    "react-colorful": "^5.6.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.54.2",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.1",
    "sonner": "^2.0.1",
    "tailwind-merge": "^3.0.2",
    "vaul": "^1.1.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@figma/plugin-typings": "^1.94.0",
    "@tailwindcss/postcss": "^4.0.15",
    "@types/culori": "^2.1.1",
    "@types/node": "^16.18.126",
    "@types/react": "19.0.10",
    "@types/react-dom": "19.0.4",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.21",
    "cross-env": "^7.0.3",
    "postcss": "^8.5.3",
    "postcss-import": "^15.1.0",
    "postcss-nesting": "^12.1.5",
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "tailwindcss": "^4.0.0",
    "terser": "^5.39.0",
    "tw-animate-css": "^1.2.4",
    "typescript": "^5.0.2",
    "vite": "^5.2.12",
    "vite-figma-plugin": "^0.0.24",
    "vite-plugin-singlefile": "^0.13.5"
  },
  "eslintConfig": {
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@figma/figma-plugins/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "project": "./tsconfig.json"
    },
    "root": true,
    "rules": {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ]
    }
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild"
    ]
  }
}
```

## File: src/index.css
```css
/* ./src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap');

@import "tailwindcss";
@import "tw-animate-css";
@import "./primitives/index.css";
@import "./theme.css";


@custom-variant dark (&:is(.dark *));

:root {
  --font-sans: 'Geist', sans-serif;
  --font-mono: 'Geist Mono', monospace;
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    font-family: var(--font-sans);
  }
}
```

## File: src-code/lib/frames.ts
```typescript
// src-code/lib/frames.ts
/// <reference types="@figma/plugin-typings" />

import type { NodeData, DescriptionField } from '@shared/types/flow.types';
import type { RGB } from '../config/theme.config';
// Importa apenas as configurações de estilo NÃO TEMÁTICAS
import * as StyleConfig from '../config/styles.config';
import { nodeCache } from '../utils/nodeCache';
import { getIconSvgStringForNodeType } from '../config/icons';
// Importa a definição dos tokens semânticos para referência das chaves
import { semanticTokenDefinitions } from '../config/theme.config'; // Importa as definições

// --- Tipos Internos ---

// Define as variantes possíveis para os chips de descrição (devem corresponder às chaves em theme.config -> chips)
type DescChipVariant = 'Default' | 'Error' | 'Success' | 'Info' | 'Action' | 'Input';

// Define as variantes possíveis para os chips de tipo de nó
type NodeTypeVariant = 'Step' | 'Decision' | 'Entrypoint';

// Tipo combinado para a função _createChip
type ChipVariant = DescChipVariant | NodeTypeVariant;

// --- Funções Auxiliares Internas ---

/**
 * Cria um chip genérico com base na variante, tipo e texto fornecidos.
 * CORRIGIDO para usar 'entrypoints' como prefixo de token para nós ENTRYPOINT.
 */
async function _createChip(
    text: string, // O texto a ser exibido no chip
    chipType: 'NodeType' | 'DescLabel', // Indica se é um chip de tipo de nó ou de descrição
    variant: ChipVariant, // A variante que determina o estilo (cor) e potencialmente o ícone
    finalColors: Record<string, RGB>, // Cores resolvidas do tema
    iconSvgString?: string // SVG opcional (usado apenas para NodeType)
): Promise<FrameNode> {
    // Carrega a fonte padrão para chips
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

    const chip = figma.createFrame();
    chip.name = `${variant} ${chipType} Chip: ${text}`; // Nome descritivo

    // Configurações de Auto Layout (Horizontal, HUG/HUG)
    chip.layoutMode = "HORIZONTAL";
    chip.primaryAxisAlignItems = "CENTER"
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";

    // Determina Padding, Radius, Spacing, Font Size com base no chipType
    const isNodeType = chipType === 'NodeType';
    const paddingH = isNodeType ? StyleConfig.Labels.TYPE_CHIP_PADDING_HORIZONTAL : StyleConfig.Labels.DESC_CHIP_PADDING_HORIZONTAL;
    const paddingV = isNodeType ? StyleConfig.Labels.TYPE_CHIP_PADDING_VERTICAL : StyleConfig.Labels.DESC_CHIP_PADDING_VERTICAL;
    chip.paddingLeft = chip.paddingRight = paddingH;
    chip.paddingTop = chip.paddingBottom = paddingV;
    chip.cornerRadius = isNodeType ? StyleConfig.Labels.TYPE_CHIP_CORNER_RADIUS : StyleConfig.Labels.DESC_CHIP_CORNER_RADIUS;
    chip.itemSpacing = isNodeType ? StyleConfig.Labels.TYPE_CHIP_ITEM_SPACING : StyleConfig.Labels.DESC_CHIP_ITEM_SPACING;
    const fontSize = isNodeType ? StyleConfig.Labels.TYPE_CHIP_FONT_SIZE : StyleConfig.Labels.DESC_CHIP_FONT_SIZE;

    // Determina os tokens de cor corretos com base na variante e tipo
    let fillToken: string | null = null;
    let textToken: string | null = null;
    let iconToken: string | null = null;
    // Garante que variant seja string antes de chamar toLowerCase
    const variantLower = typeof variant === 'string' ? variant.toLowerCase() : 'default';

    if (isNodeType) { // Para chips de tipo de nó (Step, Decision, Entrypoint)
        // <<< CORREÇÃO AQUI >>>
        // Define o prefixo correto para buscar os tokens semânticos
        let tokenPrefix = variantLower; // Default: 'step', 'decision'
        if (variantLower === 'entrypoint') {
            tokenPrefix = 'entrypoints'; // Usa o plural definido no theme.config.ts
        }
        // <<< FIM DA CORREÇÃO >>>

        // Constrói os nomes dos tokens usando o prefixo correto
        fillToken = `${tokenPrefix}_chip-fill`; // Ex: step_chip-fill, decision_chip-fill, entrypoints_chip-fill
        textToken = `${tokenPrefix}_chip-text`; // Ex: step_chip-text, decision_chip-text, entrypoints_chip-text
        iconToken = `${tokenPrefix}_chip-icon`; // Ex: step_chip-icon, decision_chip-icon, entrypoints_chip-icon
    } else { // Para chips de descrição (Action, Input, Error, Success, Info, Default)
        // Usa a variante como chave para buscar dentro do objeto 'chips'
        let chipKey: keyof typeof semanticTokenDefinitions.chips = 'default'; // Fallback
        if (variantLower in semanticTokenDefinitions.chips) {
             // Converte para o tipo correto para acessar o objeto
            chipKey = variantLower as keyof typeof semanticTokenDefinitions.chips;
        }
        // Constrói o nome do token achatado esperado por getThemeColors
        fillToken = `chips_${chipKey}_fill`; // Ex: chips_error_fill
        textToken = `chips_${chipKey}_text`; // Ex: chips_error_text
        // Chips de descrição não usam ícone por padrão
    }

    // Aplica Fill com fallback
    if (fillToken && finalColors[fillToken]) {
        chip.fills = [{ type: 'SOLID', color: finalColors[fillToken] }];
    } else {
        // console.warn(`[frames] Cor de Fill não encontrada para token: ${fillToken}. Usando fallback.`);
        chip.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }]; // Cinza claro fallback
    }
    chip.strokes = []; // Sem borda

    // Adiciona Ícone (apenas para NodeType se disponível e cor encontrada)
    if (isNodeType && iconSvgString && iconToken && finalColors[iconToken]) {
        try {
            const iconNode = figma.createNodeFromSvg(iconSvgString);
            iconNode.name = `${variant} Icon`;
            iconNode.resize(16, 16); // Tamanho padrão do ícone
            const iconColor = finalColors[iconToken];

            // Tenta aplicar a cor recursivamente (para SVGs complexos) ou diretamente
            if ('findAll' in iconNode) {
                 const vectorNodes = (iconNode as FrameNode).findAll(n => 'fills' in n) as GeometryMixin[];
                 vectorNodes.forEach(vector => {
                    // Verifica se fills é um array antes de atribuir
                    if (Array.isArray(vector.fills)) {
                        vector.fills = [{ type: 'SOLID', color: iconColor }];
                        vector.strokes = []; // Remove borda do ícone
                    }
                 });
            } else if ('fills' in iconNode && Array.isArray(iconNode.fills)) { // Fallback para SVG simples
                 (iconNode as GeometryMixin).fills = [{ type: 'SOLID', color: iconColor }];
                 (iconNode as GeometryMixin).strokes = [];
            }
            chip.appendChild(iconNode);
        } catch (error) { console.error(`[frames] Erro ao criar ícone SVG para ${variant}:`, error); }
    } else if (isNodeType && iconSvgString && iconToken && !finalColors[iconToken]) {
        // Log específico se a cor do ícone não foi encontrada
        // console.warn(`[frames] Token/cor do ícone não encontrado: ${iconToken}. Ícone não será colorido.`);
        // Adiciona o ícone mesmo sem cor (ele usará a cor padrão do SVG)
         try {
            const iconNode = figma.createNodeFromSvg(iconSvgString);
            iconNode.name = `${variant} Icon (Uncolored)`;
            iconNode.resize(16, 16);
            chip.appendChild(iconNode);
        } catch (error) { console.error(`[frames] Erro ao criar ícone SVG (não colorido) para ${variant}:`, error); }
    }

    // Adiciona Texto
    const chipTextNode = figma.createText();
    chipTextNode.fontName = StyleConfig.Labels.FONT;
    chipTextNode.fontSize = fontSize;
    chipTextNode.characters = text; // Usa o texto padronizado passado
    chipTextNode.textAutoResize = "WIDTH_AND_HEIGHT"; // Necessário para HUG funcionar

    // Aplica Cor do Texto com fallback
    if (textToken && finalColors[textToken]) {
         // Verifica se fills é um array antes de atribuir
         if (Array.isArray(chipTextNode.fills)) {
            chipTextNode.fills = [{ type: 'SOLID', color: finalColors[textToken] }];
         }
    } else {
        // console.warn(`[frames] Cor de Texto não encontrada para token: ${textToken}. Usando fallback.`);
         if (Array.isArray(chipTextNode.fills)) {
            chipTextNode.fills = [{ type: 'SOLID', color: {r:0, g:0, b:0} }]; // Preto fallback
         }
    }
    chip.appendChild(chipTextNode);

    return chip;
}


/**
 * Cria o chip específico para o tipo do nó (STEP, DECISION, ENTRYPOINT).
 */
async function _createNodeTypeChip(type: NodeTypeVariant, finalColors: Record<string, RGB>): Promise<FrameNode> {
    const chipText = type.toUpperCase(); // Texto é o tipo em maiúsculas
    const svgString = getIconSvgStringForNodeType(type);
    // A variante passada para _createChip é o próprio tipo de nó
    return _createChip(chipText, 'NodeType', type, finalColors, svgString);
}

/**
 * Cria o chip para o rótulo de um item de descrição, identificando a variante
 * e usando um texto padronizado para exibição no chip.
 */
async function _createDescLabelChip(label: string, finalColors: Record<string, RGB>): Promise<FrameNode> {
    const normalizedLabel = label.trim().toLowerCase();
    let variant: DescChipVariant = 'Default';
    let standardDisplayText = label.trim(); // Texto padrão inicial

    // 1. Identificar Variante (prioriza exato, depois 'includes')
    switch (normalizedLabel) {
        case 'action': variant = 'Action'; break;
        case 'inputs': case 'input': variant = 'Input'; break;
        case 'error state': case 'error states': case 'error': case 'error message': case 'error messages': variant = 'Error'; break; // Adicionado error message(s)
        case 'success feedback': case 'success message': case 'success': variant = 'Success'; break;
        case 'info': case 'message': case 'note': case 'context': case 'instructions': case 'summary': case 'title': case 'highlights': case 'security note': case 'prompt': case 'options': case 'motivation': case 'tone': variant = 'Info'; break; // Adicionado prompt, options, etc.
        case 'validation': variant = 'Default'; standardDisplayText="VALIDATION"; break; // Tratamento especial para Validation como Default
    }
    // Fallback 'includes' (mantido, mas menos provável de ser necessário com mais casos exatos)
    if (variant === 'Default' && standardDisplayText === label.trim()) { // Só faz fallback se ainda não achou e não é Validation
        if (normalizedLabel.includes("error")) { variant = 'Error'; }
        else if (normalizedLabel.includes("success")) { variant = 'Success'; }
        else if (normalizedLabel.includes("action")) { variant = 'Action'; }
        else if (normalizedLabel.includes("input")) { variant = 'Input'; }
        else if (normalizedLabel.includes("info") || normalizedLabel.includes("message") || normalizedLabel.includes("note")) { variant = 'Info'; }
    }

    // 2. Definir Texto Padrão baseado na Variante Final (se não for validation)
    if (standardDisplayText === label.trim()) { // Só ajusta se não for validation
        switch(variant) {
            case 'Action': standardDisplayText = "ACTION"; break;
            case 'Input': standardDisplayText = "INPUTS"; break;
            case 'Error': standardDisplayText = "ERROR"; break;
            case 'Success': standardDisplayText = "SUCCESS"; break;
            case 'Info': standardDisplayText = "INFO"; break;
            default: // Para 'Default' (exceto Validation)
                standardDisplayText = label.trim().toUpperCase(); // Mantém original (ou Uppercase)
                if (variant === 'Default') {
                     // console.warn(`[frames] Rótulo DESC não padronizado: "${label}". Usando estilo Default e texto ${standardDisplayText}.`);
                }
                break;
        }
    }

    // console.log(`[frames] Label Input: "${label}", Variante: ${variant}, Texto Exibido: "${standardDisplayText}"`);

    // Chama _createChip com texto padronizado e variante correta
    return _createChip(standardDisplayText, 'DescLabel', variant, finalColors);
}


/**
 * Cria o frame container para o título (Chip de Tipo + Nome do Nó).
 */
async function _createNodeTitleFrame(nodeData: NodeData, finalColors: Record<string, RGB>, type: NodeTypeVariant): Promise<FrameNode> {
    await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

    const titleFrame = figma.createFrame();
    titleFrame.name = `${type} Title Container`;
    titleFrame.layoutMode = "VERTICAL";
    titleFrame.primaryAxisSizingMode = "AUTO"; // HUG V
    titleFrame.counterAxisSizingMode = "FIXED"; // FILL H
    titleFrame.layoutAlign = "STRETCH";
    titleFrame.paddingLeft = titleFrame.paddingRight = 0;
    titleFrame.paddingTop = titleFrame.paddingBottom = 0;
    titleFrame.cornerRadius = 0;
    titleFrame.itemSpacing = 8; // Espaço entre chip e texto
    titleFrame.primaryAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    titleFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    titleFrame.fills = [];

    // Chip de Tipo (no topo)
    const typeChip = await _createNodeTypeChip(type, finalColors);
    titleFrame.appendChild(typeChip);

    // Texto do Nome do Nó
    const titleText = figma.createText();
    titleText.name = "Node Name Text";
    titleText.characters = nodeData.name || `Untitled ${type}`;
    titleText.fontName = StyleConfig.Nodes.TITLE_BLOCK.FONT;
    titleText.fontSize = StyleConfig.Nodes.TITLE_BLOCK.FONT_SIZE;
    titleText.textAutoResize = "HEIGHT";
    titleText.layoutAlign = "STRETCH"; // Ocupa largura

    // Cor do Texto do Título (já estava correto para entrypoints)
    let titleTextToken: string;
    switch(type) {
        case 'Decision': titleTextToken = 'decision_title-text'; break;
        case 'Entrypoint': titleTextToken = 'entrypoints_title-text'; break;
        default: titleTextToken = 'step_title-text'; break; // Default to step
    }

    if (finalColors[titleTextToken]) {
         if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: finalColors[titleTextToken] }];
    } else {
         // console.warn(`[frames] Cor não encontrada para token de título: ${titleTextToken}. Usando fallback preto.`);
         if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0} }];
    }
    titleFrame.appendChild(titleText);

    return titleFrame;
}

/**
 * Cria o frame para um item de descrição (Chip + Conteúdo) com layout horizontal.
 */
async function _createDescItemFrame(field: DescriptionField, finalColors: Record<string, RGB>, parentType: NodeTypeVariant): Promise<FrameNode | null> {
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
    await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

    if (!field || !field.label || typeof field.label !== 'string' || field.label.trim() === '') return null;

    const itemFrame = figma.createFrame();
    itemFrame.name = `Desc Item: ${field.label}`;
    itemFrame.layoutMode = "HORIZONTAL"; // Lado a lado
    itemFrame.primaryAxisSizingMode = "FIXED"; // Ocupa largura do pai
    itemFrame.counterAxisSizingMode = "AUTO"; // Altura HUG
    itemFrame.layoutAlign = "STRETCH";
    itemFrame.itemSpacing = 8; // Espaço entre chip e texto
    itemFrame.primaryAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    itemFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    itemFrame.paddingLeft = itemFrame.paddingRight = 0;
    itemFrame.paddingTop = itemFrame.paddingBottom = 0;
    itemFrame.cornerRadius = 0;
    itemFrame.fills = [];

    // Chip do Label (Ocupa espaço restante)
    const descChip = await _createDescLabelChip(field.label, finalColors);
    descChip.layoutGrow = 1; // Faz o chip esticar
    itemFrame.appendChild(descChip);

    // Texto do Conteúdo (Largura fixa)
    let contentText = '';
    if (Array.isArray(field.content)) { contentText = field.content.join('\n'); }
    else if (typeof field.content === 'object' && field.content !== null) { contentText = Object.entries(field.content).map(([k, v]) => `${k}: ${v}`).join('\n'); }
    else { contentText = String(field.content ?? ''); }

    // Processa \n no conteúdo para criar quebras de linha reais
    contentText = contentText.replace(/\\n/g, '\n');

    if (contentText.trim()) {
        const content = figma.createText();
        content.name = "Description Content";
        content.characters = contentText;
        content.fontName = StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT;
        content.fontSize = StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT_SIZE;
        content.layoutSizingHorizontal = "FIXED"; // Largura Fixa
        content.resize(258, content.height); // Define largura 258px - Ajuste se necessário
        content.textAutoResize = "HEIGHT"; // Altura automática
        content.layoutAlign = "MIN"; // <<< CORRIGIDO de MIN

        // Cor do texto (Ajustado para buscar token de Entrypoint corretamente)
        let descTextToken: string;
         switch(parentType) {
             case 'Decision': descTextToken = 'decision_desc-text'; break; // Assumindo que Decision usa step como fallback ou tem seu token
             case 'Entrypoint': descTextToken = 'entrypoints_desc-text'; break;
             default: descTextToken = 'step_desc-text'; break; // Default to step
         }
         // Adiciona fallback se token de description não existir (ex: para Decision)
         if (!finalColors[descTextToken]) {
             descTextToken = 'step_desc-text'; // Tenta usar step como fallback geral para descrição
             // console.warn(`[frames] Token ${parentType}_desc-text não encontrado, usando fallback ${descTextToken}`);
         }


        if (finalColors[descTextToken]) {
            if(Array.isArray(content.fills)) content.fills = [{ type: 'SOLID', color: finalColors[descTextToken] }];
        } else {
            // console.warn(`[frames] Cor de descrição não encontrada para token: ${descTextToken}. Usando fallback preto.`);
            if(Array.isArray(content.fills)) content.fills = [{ type: 'SOLID', color: {r:0,g:0,b:0}}];
        }
        itemFrame.appendChild(content);
    } else {
        // Se não há conteúdo, remove o espaçamento entre itens (o chip ocupa tudo)
        itemFrame.itemSpacing = 0;
        // Mantém layoutGrow = 1 no chip para ocupar o espaço
    }

    return itemFrame;
}

/** Cria o frame container para o bloco de descrição (descBlock). */
async function _createDescBlockFrame(descriptionFields: DescriptionField[], finalColors: Record<string, RGB>, parentType: NodeTypeVariant): Promise<FrameNode | null> {
    await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
    await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

    const descBlock = figma.createFrame();
    descBlock.name = "Description Block Container";
    descBlock.layoutMode = "VERTICAL";
    descBlock.primaryAxisSizingMode = "AUTO"; // HUG V
    descBlock.counterAxisSizingMode = "FIXED"; // FILL H
    descBlock.layoutAlign = "STRETCH";
    descBlock.itemSpacing = 12; // Reduzido espaço entre descItems
    descBlock.primaryAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    descBlock.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
    descBlock.paddingLeft = descBlock.paddingRight = 0;
    descBlock.paddingTop = descBlock.paddingBottom = 0;
    descBlock.cornerRadius = 0;
    descBlock.fills = [];

    let addedItems = 0;
    for (const field of descriptionFields) {
        const itemFrame = await _createDescItemFrame(field, finalColors, parentType);
         if (itemFrame) {
            descBlock.appendChild(itemFrame);
            addedItems++;
         }
    }

    // Retorna o bloco apenas se itens foram adicionados
    if (addedItems > 0) return descBlock;
    else {
        // console.warn(`[frames] Nenhum item de descrição válido para ${parentType}. Bloco não será adicionado.`);
        if (!descBlock.removed) { try { descBlock.remove(); } catch(e){} }
        return null;
    }
}

/** Cria o frame container para o divisor (divider). */
async function _createDivider(finalColors: Record<string, RGB>): Promise<FrameNode> {
    const dividerFrame = figma.createFrame();
    dividerFrame.name = "Divider Container";
    dividerFrame.layoutMode = "VERTICAL"; // Mantém vertical para conter a linha
    dividerFrame.primaryAxisSizingMode = "AUTO"; // Altura mínima definida pela linha
    dividerFrame.counterAxisSizingMode = "FIXED"; // Ocupa largura total
    dividerFrame.layoutAlign = "STRETCH"; // Ocupa largura no pai
    // Ajusta padding para alinhamento visual da linha
    dividerFrame.paddingLeft = 20;
    dividerFrame.paddingRight = 20;
    dividerFrame.paddingTop = 0; // Sem padding vertical no container
    dividerFrame.paddingBottom = 0;
    dividerFrame.cornerRadius = 0;
    dividerFrame.itemSpacing = 0;
    dividerFrame.primaryAxisAlignItems = "CENTER"; // Centraliza linha verticalmente se houver espaço
    dividerFrame.counterAxisAlignItems = "CENTER"; // Centraliza linha horizontalmente (não fará diferença com STRETCH)
    dividerFrame.fills = []; // Sem fundo

    const lineNode = figma.createLine();
    lineNode.name = "Divider Line";
    lineNode.layoutAlign = "STRETCH"; // Linha ocupa a largura do container (menos padding)
    lineNode.strokeWeight = 1;

    const lineColorToken = 'divider_line';
    if (finalColors[lineColorToken]) {
        lineNode.strokes = [{ type: 'SOLID', color: finalColors[lineColorToken] }];
    } else {
        // console.warn(`[frames] Cor não encontrada para token: ${lineColorToken}. Usando fallback cinza.`);
        lineNode.strokes = [{ type: 'SOLID', color: {r:0.8, g:0.8, b:0.8}}];
    }

    dividerFrame.appendChild(lineNode);
    // Garante altura mínima para o frame não colapsar
    dividerFrame.minHeight = lineNode.strokeWeight; // Altura mínima é a espessura da linha

    return dividerFrame;
}


// --- Funções Principais Exportadas ---

export namespace Frames {

    /** Cria o nó START. */
    export async function createStartNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);
        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;
        frame.name = nodeData.name || "Start";
        frame.resize(style.SIZE, style.SIZE);
        frame.cornerRadius = style.CORNER_RADIUS;
        frame.layoutMode = "VERTICAL";
        frame.primaryAxisSizingMode = "FIXED";
        frame.counterAxisSizingMode = "FIXED";
        frame.primaryAxisAlignItems = "CENTER";
        frame.counterAxisAlignItems = "CENTER";
        frame.itemSpacing = 0;
        // Busca cor de fill específica para Start, depois fallback geral, depois transparente
        const fillToken = 'node_startend_start-fill'; // Nome específico sugerido
        const fillFallbackToken = 'node_startend_fill';
        const fillColor = finalColors[fillToken] ?? finalColors[fillFallbackToken] ?? null;
        if (fillColor) frame.fills = [{ type: 'SOLID', color: fillColor }]; else frame.fills = [];

        const borderToken = 'node_startend_border';
        if (finalColors[borderToken]) {
            frame.strokes = [{ type: 'SOLID', color: finalColors[borderToken] }];
            frame.strokeWeight = 1; frame.strokeAlign = "INSIDE";
        } else { frame.strokes = []; }

        const titleText = figma.createText();
        titleText.name = "Node Name Text";
        titleText.characters = "Start"; // Texto Fixo
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.textAutoResize = "HEIGHT";
        titleText.layoutAlign = "INHERIT";
        const textColorToken = 'node_startend_start-text';
        const textFallbackToken = 'node_startend_text';
        const textColor = finalColors[textColorToken] ?? finalColors[textFallbackToken] ?? {r:0,g:0,b:0}; // Fallback preto
        if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: textColor }];

        frame.appendChild(titleText);
        return frame;
    }

    /** Cria o nó END. */
    export async function createEndNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.START_END.FONT.family, StyleConfig.Nodes.START_END.FONT.style);
        const frame = figma.createFrame();
        const style = StyleConfig.Nodes.START_END;
        frame.name = nodeData.name || "End";
        frame.resize(style.SIZE, style.SIZE);
        frame.cornerRadius = style.CORNER_RADIUS;
        frame.layoutMode = "VERTICAL";
        frame.primaryAxisSizingMode = "FIXED";
        frame.counterAxisSizingMode = "FIXED";
        frame.primaryAxisAlignItems = "CENTER";
        frame.counterAxisAlignItems = "CENTER";
        frame.itemSpacing = 0;
        // Busca cor de fill específica para End, depois fallback geral, depois transparente
        const fillToken = 'node_startend_end-fill'; // Nome específico sugerido
        const fillFallbackToken = 'node_startend_fill';
        const fillColor = finalColors[fillToken] ?? finalColors[fillFallbackToken] ?? null;
        if (fillColor) frame.fills = [{ type: 'SOLID', color: fillColor }]; else frame.fills = [];

        const borderToken = 'node_startend_border';
        if (finalColors[borderToken]) {
            frame.strokes = [{ type: 'SOLID', color: finalColors[borderToken] }];
            frame.strokeWeight = 1; frame.strokeAlign = "INSIDE";
        } else { frame.strokes = []; }

        const titleText = figma.createText();
        titleText.name = "Node Name Text";
        titleText.characters = "End"; // Texto Fixo
        titleText.fontName = style.FONT;
        titleText.fontSize = style.FONT_SIZE;
        titleText.textAutoResize = "HEIGHT";
        titleText.layoutAlign = "INHERIT";
        const textColorToken = 'node_startend_end-text';
        const textFallbackToken = 'node_startend_text';
        const textColor = finalColors[textColorToken] ?? finalColors[textFallbackToken] ?? {r:0,g:0,b:0}; // Fallback preto
        if(Array.isArray(titleText.fills)) titleText.fills = [{ type: 'SOLID', color: textColor }];

        frame.appendChild(titleText);
        return frame;
    }

    /** Cria o nó DECISION. */
    export async function createDecisionNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Decision";
        mainFrame.layoutMode = "VERTICAL";
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG V
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura Fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1); // Usa mesma largura de STEP
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.DECISION.CORNER_RADIUS; // 8px
        mainFrame.itemSpacing = 16; // Espaço entre Título e Descrição (se houver)
        mainFrame.primaryAxisAlignItems = "CENTER"; // Alinhamento V
        mainFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
        mainFrame.clipsContent = true;

        // Aplica cores do tema
        if (finalColors.decision_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.decision_fill }]; else mainFrame.fills = [];
        if (finalColors.decision_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.decision_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // Adiciona Título
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Decision');
        mainFrame.appendChild(titleFrame);

         // Adiciona Descrição (se houver)
         const descriptionFields = nodeData.description?.fields;
         if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {
             const descBlock = await _createDescBlockFrame(descriptionFields, finalColors, 'Decision');
              // Adiciona divisor apenas se o bloco de descrição foi criado com sucesso e se há título
             if (descBlock && titleFrame) {
                  try {
                      const divider = await _createDivider(finalColors);
                      if (divider) mainFrame.appendChild(divider); // Adiciona APÓS o título
                  } catch(e) { console.error(`[frames] Erro ao criar divisor para decision ${nodeData.id}:`, e); }
                  mainFrame.appendChild(descBlock); // Adiciona descrição após divisor
                  mainFrame.itemSpacing = 24; // Aumenta espaçamento se tiver descrição
             } else if (descBlock) {
                  mainFrame.appendChild(descBlock); // Adiciona descrição mesmo sem título (caso raro)
                  mainFrame.itemSpacing = 0;
             }
         }

        return mainFrame;
    }

    /** Cria o nó STEP. */
    export async function createStepNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
        await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style);

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Step";
        mainFrame.layoutMode = "VERTICAL";
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG V
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura Fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1);
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.STEP_ENTRYPOINT.CORNER_RADIUS; // 8px
        mainFrame.itemSpacing = 24; // Espaço padrão entre Título, Divisor, Descrição
        mainFrame.primaryAxisAlignItems = "CENTER"; // Alinhamento V
        mainFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
        mainFrame.clipsContent = true;

        // Aplica cores do tema
        if (finalColors.step_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.step_fill }]; else mainFrame.fills = [];
        if (finalColors.step_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.step_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // Adiciona Título
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Step');
        mainFrame.appendChild(titleFrame);

        // Adiciona Divisor e Descrição (se houver)
        const descriptionFields = nodeData.description?.fields;
        if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {
            const descBlock = await _createDescBlockFrame(descriptionFields, finalColors, 'Step');
            // Adiciona divisor apenas se o bloco de descrição foi criado com sucesso
            if (descBlock) {
                 try {
                     const divider = await _createDivider(finalColors);
                     if (divider) mainFrame.appendChild(divider); // Adiciona APÓS o título
                 } catch(e) { console.error(`[frames] Erro ao criar divisor para step ${nodeData.id}:`, e); }
                 mainFrame.appendChild(descBlock); // Adiciona descrição após divisor
            }
        }

        return mainFrame;
    }

    /** Cria o nó ENTRYPOINT. */
    export async function createEntrypointNode(nodeData: NodeData, finalColors: Record<string, RGB>): Promise<FrameNode> {
        await nodeCache.loadFont(StyleConfig.Nodes.TITLE_BLOCK.FONT.family, StyleConfig.Nodes.TITLE_BLOCK.FONT.style);
        await nodeCache.loadFont(StyleConfig.Labels.FONT.family, StyleConfig.Labels.FONT.style);
         await nodeCache.loadFont(StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.family, StyleConfig.Nodes.DESCRIPTION_ITEM.CONTENT_FONT.style); // Carrega fonte da descrição tbm

        const mainFrame = figma.createFrame();
        mainFrame.name = nodeData.name || "Entrypoint";
        mainFrame.layoutMode = "VERTICAL";
        mainFrame.primaryAxisSizingMode = "AUTO"; // HUG V
        mainFrame.counterAxisSizingMode = "FIXED"; // Largura Fixa
        mainFrame.resizeWithoutConstraints(StyleConfig.Nodes.STEP_ENTRYPOINT.WIDTH, 1);
        mainFrame.paddingTop = mainFrame.paddingBottom = 16;
        mainFrame.paddingLeft = mainFrame.paddingRight = 16;
        mainFrame.cornerRadius = StyleConfig.Nodes.STEP_ENTRYPOINT.CORNER_RADIUS; // 8px
        mainFrame.itemSpacing = 24; // Espaço padrão, ajustado se houver descrição
        mainFrame.primaryAxisAlignItems = "CENTER"; // Alinhamento V
        mainFrame.counterAxisAlignItems = "MIN"; // <<< CORRIGIDO de MIN
        mainFrame.clipsContent = true;

        // Aplica cores do tema (usando 'entrypoints' como chave)
        if (finalColors.entrypoints_fill) mainFrame.fills = [{ type: 'SOLID', color: finalColors.entrypoints_fill }]; else mainFrame.fills = [];
        if (finalColors.entrypoints_border) { mainFrame.strokes = [{ type: 'SOLID', color: finalColors.entrypoints_border }]; mainFrame.strokeWeight = 1; } else mainFrame.strokes = [];

        // Adiciona Título
        const titleFrame = await _createNodeTitleFrame(nodeData, finalColors, 'Entrypoint');
        mainFrame.appendChild(titleFrame);

         // Adiciona Divisor e Descrição (se houver) - Lógica igual ao STEP
        const descriptionFields = nodeData.description?.fields;
        if (descriptionFields && Array.isArray(descriptionFields) && descriptionFields.length > 0) {
            const descBlock = await _createDescBlockFrame(descriptionFields, finalColors, 'Entrypoint');
            if (descBlock) {
                 try {
                     const divider = await _createDivider(finalColors);
                     if (divider) mainFrame.appendChild(divider);
                 } catch(e) { console.error(`[frames] Erro ao criar divisor para entrypoint ${nodeData.id}:`, e); }
                 mainFrame.appendChild(descBlock);
            }
        } else {
             // Se não houver descrição, remove o espaçamento padrão após o título
             mainFrame.itemSpacing = 0;
        }


        return mainFrame;
    }

} // Fim do namespace Frames
```

## File: src-code/code.ts
```typescript
// src-code/code.ts
/// <reference types="@figma/plugin-typings" />

// Imports de Utilitários e Tipos
import { nodeCache } from './utils/nodeCache';
import { parseMarkdownToFlow } from './lib/markdownParser';
import type { NodeData, Connection, FlowNode } from '@shared/types/flow.types';
import type { EventTS } from '@shared/types/messaging.types';
import type { RGB } from './config/theme.config';
import { getThemeColors, FontsToLoad } from './config/theme.config';
import * as StyleConfig from './config/styles.config';
import * as LayoutConfig from "./config/layout.config";
// import { Layout } from './lib/layout'; // Não usamos mais buildGraph ou calculateLayoutLevels
import { Frames } from './lib/frames';
import { Connectors } from './lib/connectors';
import { getHistory, addHistoryEntry, clearHistory } from './utils/historyStorage';

// Chave para o clientStorage (deve ser a mesma na UI)
const GENERATION_STATUS_KEY = 'iziflow_generation_status';

// --- Debug Log (com envio para UI) ---
function debugLog(context: string, message: string, data?: any) {
  const formattedMessage = `[${context}] ${message}`;
  // Comentado para reduzir ruído, descomente se precisar depurar logs específicos
  // console.log(formattedMessage, data || '');
  try {
    figma.ui.postMessage({
        type: 'debug',
        message: formattedMessage,
        data: data ? JSON.stringify(data) : undefined
    });
  } catch(e) { /* Ignora erro */ }
}

// --- Preload Fonts ---
async function preloadFonts() {
    // Logs comentados para limpeza
    // debugLog('FontLoader', 'Iniciando pré-carregamento de fontes...');
    try {
        await Promise.all(
            FontsToLoad.map(font => {
                // debugLog('FontLoader', `Carregando fonte: ${font.family} - ${font.style}`);
                return nodeCache.enqueueTask(() => figma.loadFontAsync(font));
            })
        );
        // debugLog('FontLoader', `Fontes pré-carregadas: ${FontsToLoad.length}`);
    } catch (e: any) {
        console.error('[FontLoader] Erro ao pré-carregar fontes:', e); // Mantém erros
        figma.notify(`Erro ao carregar fontes essenciais: ${e?.message || e}`, { error: true });
    }
     // debugLog('FontLoader', `Pré-carregamento de fontes concluído.`);
}

// --- Função calculateLayoutLevels REMOVIDA ---

// --- UI e Listener principal ---
figma.showUI(__html__, { width: 624, height: 500, themeColors: true, title: 'IziFlow Plugin' });

// Listener principal
figma.ui.onmessage = async (msg: any) => { // Recebe a mensagem DESEMBRULHADA pelo Figma

    // Valida a mensagem DESEMBRULHADA
    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') {
        console.warn('[Plugin] Mensagem recebida da UI inválida ou sem propriedade type.', msg); // Usa warn para diferenciar
        return;
    }

    const messageType = msg.type as keyof EventTS;
    const payload = msg; // msg é o payload desembrulhado { type: ..., data... }

    console.log(`[Plugin] Mensagem da UI recebida: ${messageType}`); // Log principal mantido

    // --- Handler para 'generate-flow' ---
    if (messageType === 'generate-flow') {
        const { markdown: markdownInput, mode, accentColor } = payload;
        const generationId = Date.now(); // Usado para associar status
        console.log(`[Flow ID: ${generationId}] Iniciando geração... (Modo: ${mode}, Accent: ${accentColor})`);

        try {
            // <<< Limpa o status antigo ANTES de definir como loading >>>
            await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
            console.log(`[Flow ID: ${generationId}] Chave de status antiga limpa (se existia).`);

            // <<< Define status inicial como 'loading' no clientStorage >>>
            await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'loading', id: generationId, timestamp: Date.now() }));
            console.log(`[Flow ID: ${generationId}] Status 'loading' salvo no clientStorage.`);
        } catch(storageError) {
            console.error(`[Flow ID: ${generationId}] Erro ao inicializar status no clientStorage:`, storageError);
            // Notifica a UI sobre o erro de storage inicial (pode não chegar, mas tentamos)
            figma.ui.postMessage({ type: 'generation-error', message: `Erro interno ao preparar geração (storage).` });
            figma.notify("Erro interno ao preparar geração.", { error: true });
            return; // Para a execução se não puder definir o status inicial
        }

        let flowDataResult: { nodes: FlowNode[], connections: Connection[] } | null = null;
        let nodeMap: { [id: string]: SceneNode } = {};
        let createdFrames: SceneNode[] = [];

        try {
            // 1. Calcular Cores
            const finalColors = getThemeColors(mode, accentColor);

            // 2. Validar Input
            if (typeof markdownInput !== 'string' || markdownInput.trim() === '') {
                throw new Error("Entrada Markdown inválida ou vazia.");
            }

            // 3. Parsear Markdown
            try {
                 flowDataResult = await parseMarkdownToFlow(markdownInput);
            } catch (parseError: any) {
                 const errorMessage = `Erro de Parsing: ${parseError.message}`;
                 console.error(`[Flow ID: ${generationId}] ${errorMessage}`, parseError);
                 const lineNumberMatch = parseError.message?.match(/linha (\d+)/);
                 const lineNumber = lineNumberMatch ? parseInt(lineNumberMatch[1], 10) : undefined;
                 // <<< Define status ERRO (parse) no clientStorage >>>
                 await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'error', id: generationId, message: errorMessage, timestamp: Date.now() }));
                 console.log(`[Flow ID: ${generationId}] Status 'error' (parse) salvo no clientStorage.`);
                 // Tenta enviar a mensagem de erro de parse para UI
                 figma.ui.postMessage({ type: 'parse-error', message: `${parseError.message}`, lineNumber });
                 return; // Para a execução
            }

            // 4. Validar Resultado do Parse
             if (!flowDataResult || !flowDataResult.nodes || flowDataResult.nodes.length === 0) {
                 throw new Error("Nenhum nó válido encontrado após o parsing.");
             }
             const { nodes: flowNodes, connections: flowConnections } = flowDataResult;
             console.log(`[Flow ID: ${generationId}] Parsing OK. Nodes: ${flowNodes.length}, Conns: ${flowConnections.length}`);

             // 5. Carregar Fontes
             await preloadFonts();

             // 6. Construir Mapa de Dados
             const nodeDataMap: { [id: string]: NodeData } = {};
             flowNodes.forEach(node => { nodeDataMap[node.id] = node; });

             // 7. Layout Sequencial Horizontal e Criação/Posicionamento de Nós
             console.log(`[Flow ID: ${generationId}] Criando e posicionando nós sequencialmente...`);
             nodeMap = {}; createdFrames = [];
             let currentX = 100;
             const startY = figma.viewport.center.y;
             const horizontalSpacing = LayoutConfig.Nodes.HORIZONTAL_SPACING;

             for (const nodeData of flowNodes) {
                 const nodeId = nodeData.id;
                 let frame: SceneNode | null = null;
                 try {
                     switch (nodeData.type) {
                         case "START": frame = await Frames.createStartNode(nodeData, finalColors); break;
                         case "END": frame = await Frames.createEndNode(nodeData, finalColors); break;
                         case "STEP": frame = await Frames.createStepNode(nodeData, finalColors); break;
                         case "ENTRYPOINT": frame = await Frames.createEntrypointNode(nodeData, finalColors); break;
                         case "DECISION": frame = await Frames.createDecisionNode(nodeData, finalColors); break;
                         default: frame = await Frames.createStepNode(nodeData, finalColors); break;
                     }
                     if (!frame || frame.removed) throw new Error(`Frame nulo/removido para ${nodeId}.`);
                     await new Promise(resolve => setTimeout(resolve, 50));
                     frame.x = currentX;
                     frame.y = startY - frame.height / 2;
                     currentX += frame.width + horizontalSpacing;
                     nodeMap[nodeId] = frame;
                     createdFrames.push(frame);
                 } catch (nodeCreationError: any) {
                      // Lança o erro para ser pego pelo catch principal e definir o status de erro
                      throw new Error(`Falha ao criar nó '${nodeData.name || nodeId}': ${nodeCreationError.message}`);
                 }
             }

             // 8. Adicionar Nós à Página
             if (createdFrames.length === 0) {
                 throw new Error("Falha: Nenhum nó foi criado com sucesso."); // Será pego pelo catch principal
             }
             createdFrames.forEach(f => figma.currentPage.appendChild(f));
             await new Promise(resolve => setTimeout(resolve, 100));
             console.log(`[Flow ID: ${generationId}] Nós adicionados à página: ${createdFrames.length}`);

             // 9. Criar Conexões
             if (Object.keys(nodeMap).length > 0 && flowConnections?.length > 0) {
                 await Connectors.createConnectors(flowConnections, nodeMap, nodeDataMap, finalColors);
             } else {
                 console.log(`[Flow ID: ${generationId}] Pulando criação de conexões.`);
             }

             // 10. Finalização (Agrupar, Centralizar, Zoom)
             const allCreatedNodes = Object.values(nodeMap);
             if (allCreatedNodes.length > 0) {
                const nodesToGroup = [...allCreatedNodes];
                // Tenta incluir conectores recém-criados no grupo
                figma.currentPage.findAll(n => {
                    if (n.type === 'CONNECTOR') {
                        const connector = n as ConnectorNode;
                        // Verifica se os endpoints do conector estão entre os nós criados
                        return allCreatedNodes.some(f => f.id === connector.connectorStart?.endpointNodeId) &&
                               allCreatedNodes.some(f => f.id === connector.connectorEnd?.endpointNodeId);
                    }
                    return false;
                }).forEach(conn => nodesToGroup.push(conn));


                 if (nodesToGroup.length > 0) {
                    const group = figma.group(nodesToGroup, figma.currentPage);
                    group.name = "Fluxo Gerado IziFlow";
                    try {
                        await new Promise(resolve => setTimeout(resolve, 100));
                        const groupCenterX = group.x + group.width / 2;
                        const groupCenterY = group.y + group.height / 2;
                        group.x += figma.viewport.center.x - groupCenterX;
                        group.y += figma.viewport.center.y - groupCenterY;
                        figma.viewport.scrollAndZoomIntoView([group]);
                    } catch (centerError: any) {
                        console.error(`[Flow ID: ${generationId}] Erro ao centralizar/zoom:`, centerError);
                        figma.viewport.scrollAndZoomIntoView(nodesToGroup);
                    }
                 }
             }

             // --- SUCESSO ---
             await addHistoryEntry(payload.markdown);

             // <<< Define status SUCESSO no clientStorage >>>
             await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'success', id: generationId, timestamp: Date.now() }));
             console.log(`[Flow ID: ${generationId}] Status 'success' salvo no clientStorage.`);

             // Tenta enviar a mensagem (best effort, a UI vai usar o clientStorage para isLoading)
             figma.ui.postMessage({ type: 'generation-success', message: 'Fluxo gerado com sucesso!' });
             console.log(">>> PLUGIN: Mensagem 'generation-success' ENVIADA para UI (UI usará clientStorage para estado de loading).");

             figma.notify("Fluxo gerado com sucesso!", { timeout: 3000 });
             console.log(`[Flow ID: ${generationId}] Geração COMPLETA.`);

        } catch (error: any) {
             // --- ERRO GERAL ---
             console.error(`[Flow ID: ${generationId}] Erro GERAL na geração:`, error);
             const errorMessage = (error instanceof Error) ? error.message : String(error);
             // <<< Define status ERRO no clientStorage >>>
             try {
                 await figma.clientStorage.setAsync(GENERATION_STATUS_KEY, JSON.stringify({ status: 'error', id: generationId, message: errorMessage, timestamp: Date.now() }));
                 console.log(`[Flow ID: ${generationId}] Status 'error' salvo no clientStorage.`);
             } catch (storageError) {
                  console.error(`[Flow ID: ${generationId}] Erro ao salvar status de ERRO no clientStorage:`, storageError);
             }
             // Tenta enviar a mensagem de erro (best effort)
             figma.ui.postMessage({ type: 'generation-error', message: `Erro durante geração: ${errorMessage}` });
             console.log(">>> PLUGIN: Mensagem 'generation-error' ENVIADA para UI (UI usará clientStorage para estado de loading).");
             figma.notify(`Erro na geração: ${errorMessage}`, { error: true, timeout: 5000 });
        }
    }
    // --- Handlers para outras mensagens ---
    else if (messageType === 'get-history') {
        console.log("[Plugin] Recebido pedido 'get-history'.");
        const history = await getHistory();
        console.log("[Plugin] Enviando 'history-data' com", history.length, "itens.");
        figma.ui.postMessage({ type: 'history-data', history: history });
   }
   else if (messageType === 'clear-history-request') {
        console.log("[Plugin] Recebido pedido 'clear-history-request'.");
        await clearHistory();
        const updatedHistory = await getHistory();
        console.log("[Plugin] Enviando histórico vazio após limpeza.");
        figma.ui.postMessage({ type: 'history-data', history: updatedHistory });
        figma.notify("Histórico limpo.", { timeout: 2000 });
   }
   else if (messageType === 'remove-history-entry') {
        const { markdown: markdownToRemove } = payload;
        if (typeof markdownToRemove === 'string') {
            console.log(`[Plugin] Recebido pedido 'remove-history-entry'.`);
            try {
                const currentHistory = await getHistory();
                const filteredHistory = currentHistory.filter(item => item !== markdownToRemove);
                if (filteredHistory.length < currentHistory.length) {
                    await figma.clientStorage.setAsync('markdownHistory', JSON.stringify(filteredHistory));
                    console.log("[Plugin] Item removido e histórico salvo.");
                    // Envia o histórico atualizado para a UI após a remoção
                    figma.ui.postMessage({ type: 'history-data', history: filteredHistory });
                } else {
                     console.log("[Plugin] Item a ser removido não encontrado no histórico.");
                }
            } catch (error) {
                 console.error("[Plugin] Erro ao remover item do histórico:", error);
                 figma.notify("Erro ao remover item do histórico.", { error: true });
            }
        } else {
             console.warn("[Plugin] Payload inválido para 'remove-history-entry'.", payload);
        }
   }
   else if (messageType === 'closePlugin') {
       figma.closePlugin();
   }
    else {
        console.warn(`[Plugin] Tipo de mensagem não tratado: ${messageType}`);
    }
};
```

## File: src/components/app.tsx
```typescript
// src/components/app.tsx
import React, { useState, useRef, useEffect, type ChangeEvent } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/components/providers/theme-provider";
import { dispatchTS, listenTS } from "@/utils/utils";
import type { EventTS } from "@shared/types/messaging.types";
import { SunIcon, MoonIcon, SettingsIcon, InfoIcon, Trash2Icon, MoreHorizontalIcon, PlayIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type NodeGenerationMode = "light" | "dark";

// Chave para o clientStorage (deve ser a mesma no plugin)
const GENERATION_STATUS_KEY = 'iziflow_generation_status';

// Helper to check for valid HEX color
function isValidHex(color: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(color);
}

// Helper to extract flow name from Markdown
function extractFlowName(markdown: string): string {
    if (!markdown) return "Untitled Flow";
    const lines = markdown.split('\n');
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('# Flow Name:')) {
            return trimmedLine.substring('# Flow Name:'.length).trim() || "Untitled Flow";
        }
    }
    return "Untitled Flow";
}

// Declaração explícita da API do Figma para clientStorage na UI
declare const figma: {
    clientStorage: {
        getAsync(key: string): Promise<string | undefined>;
        setAsync(key: string, value: string): Promise<void>;
        deleteAsync(key: string): Promise<void>;
    };
};

export function App() {
  // --- States ---
  const [markdown, setMarkdown] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme: uiTheme, setTheme: setUiTheme } = useTheme();
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [accentColor, setAccentColor] = useState<string>("#3860FF");
  const [inputValue, setInputValue] = useState<string>(accentColor);
  const [nodeMode, setNodeMode] = useState<NodeGenerationMode>("light");
  const [history, setHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("generator");
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  console.log('[App Render] isLoading:', isLoading);

  // --- Effects ---
  useEffect(() => {
    if (isValidHex(accentColor)) {
      setInputValue(accentColor.toUpperCase());
    }
  }, [accentColor]);

  // Effect for listeners and initial history fetch
  useEffect(() => {
    markdownTextareaRef.current?.focus();
    console.log("[App Effect] Montado. Pedindo histórico inicial...");
    dispatchTS('get-history');

    // Handlers for specific messages (debug, history, parse-error) using listenTS
    // (postMessage para estes geralmente é confiável)
    const handleDebug = (payload: EventTS['debug']) => {
       const parsedData = payload.data ? JSON.parse(payload.data) : '';
       console.debug(`[Plugin Debug via UI]: ${payload.message}`, parsedData);
    };
    const handleHistoryData = (payload: EventTS['history-data']) => {
       console.log("[App Handler] Recebido 'history-data'.");
       if (Array.isArray(payload.history)) {
           setHistory(payload.history);
           // console.log("[App Handler] Estado 'history' atualizado com", payload.history.length, "itens.");
       } else {
           console.error("UI: Formato de histórico inválido recebido:", payload);
           setHistory([]);
       }
    };
    const handleParseError = (payload: EventTS['parse-error']) => {
        console.error("[App Handler] Recebido 'parse-error'. Payload:", payload);
        setError(`Erro de sintaxe ${payload.lineNumber ? `(linha ${payload.lineNumber})` : ''}: ${payload.message}`);
        // O polling effect cuidará de setIsLoading(false) se a chave de erro for definida
        // Mas podemos definir aqui também para uma resposta mais rápida a erros de parse
        setIsLoading(false);
    };


    // Setup listeners for reliable messages
    console.log("[App Effect] Adicionando listeners (Debug, History, ParseError)...");
    const cleanupDebug = listenTS('debug', handleDebug);
    const cleanupHistory = listenTS('history-data', handleHistoryData);
    const cleanupParseError = listenTS('parse-error', handleParseError);

    // Cleanup function
    return () => {
      cleanupDebug();
      cleanupHistory();
      cleanupParseError();
      console.log("[App Effect] Listeners (Debug, History, ParseError) limpos.");
    };
  }, []); // Runs only once

  // Effect for polling generation status via clientStorage when isLoading is true
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let attempts = 0;
    const maxAttempts = 30; // Aumentado para 30 segundos

    if (isLoading) {
        console.log("[App Polling Effect] Iniciando verificação de status...");
        intervalId = setInterval(async () => {
            attempts++;
            // console.log(`[App Polling Effect] Verificando clientStorage (tentativa ${attempts})...`);
            try {
                // Verifica se a API figma e clientStorage estão disponíveis
                if (typeof figma === 'undefined' || typeof figma.clientStorage === 'undefined') {
                    console.warn("[App Polling Effect] API Figma ou clientStorage não disponível na UI. Parando polling.");
                    setError("Não foi possível verificar o status da geração (API Figma indisponível).");
                    setIsLoading(false);
                    if (intervalId) clearInterval(intervalId);
                    return;
                }

                const statusRaw = await figma.clientStorage.getAsync(GENERATION_STATUS_KEY);
                if (statusRaw) {
                    let statusData;
                    try {
                        statusData = JSON.parse(statusRaw);
                        // console.log("[App Polling Effect] Status parseado:", statusData);

                        const isRecent = statusData.timestamp && (Date.now() - statusData.timestamp < 45000); // Janela de 45s

                        if ((statusData.status === 'success' || statusData.status === 'error') && isRecent) {
                             console.log(`[App Polling Effect] Status final (${statusData.status}) detectado. Parando polling.`);
                             if (statusData.status === 'error') {
                                 setError(statusData.message || "Erro na geração (detalhes no console do plugin).");
                             } else {
                                 setError(null);
                                 dispatchTS('get-history'); // Atualiza histórico no sucesso
                             }
                             setIsLoading(false);
                             if(intervalId) clearInterval(intervalId);
                             await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
                             console.log("[App Polling Effect] Chave de status limpa após processamento final.");
                        } else if (!isRecent && (statusData.status === 'success' || statusData.status === 'error')) {
                             console.warn("[App Polling Effect] Status final encontrado, mas é antigo. Limpando e parando polling.");
                             if (intervalId) clearInterval(intervalId);
                             setIsLoading(false); // Para o loading
                             // Não define erro aqui, apenas limpa o status antigo
                             await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY);
                        }
                        // else: status é 'loading' ou inválido, continua polling

                    } catch (parseError) {
                        console.error("[App Polling Effect] Erro ao fazer parse do statusRaw:", parseError, "Valor Raw:", statusRaw);
                        setError("Erro interno ao ler status da geração (parse).");
                        setIsLoading(false);
                        if (intervalId) clearInterval(intervalId);
                        try { await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY); } catch {}
                    }
                }

                if (attempts >= maxAttempts && isLoading) {
                     console.warn("[App Polling Effect] Máximo de tentativas atingido. Parando polling.");
                     setError("A geração demorou muito ou o status não foi atualizado. Verifique o console do Figma.");
                     setIsLoading(false);
                     if (intervalId) clearInterval(intervalId);
                     try { await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY); } catch {}
                }

            } catch (storageError) {
                console.error("[App Polling Effect] Erro ao LER clientStorage:", storageError);
                setError("Erro ao verificar status da geração (storage).");
                setIsLoading(false);
                if(intervalId) clearInterval(intervalId);
            }
        }, 1000); // Check every second
    }

    // Cleanup function for this effect
    return () => {
        if (intervalId) {
            console.log("[App Polling Effect] Limpando intervalo de verificação (isLoading mudou ou unmount).");
            clearInterval(intervalId);
        }
    };
 }, [isLoading]);


  // --- Handlers ---
  const handleSubmit = async () => {
    console.log("[handleSubmit] Iniciado.");
    setError(null);
    setIsLoading(true); // Ativa o polling effect

    if (!markdown.trim()) {
        setError("O campo Markdown não pode estar vazio.");
        setIsLoading(false); return;
    }
    if (!isValidHex(inputValue)) {
        setError("Cor Accent inválida. Use formato HEX (ex: #3860FF).");
        setIsLoading(false); return;
    }
    const finalAccentColor = accentColor;

    try {
       // Limpa o status antigo ANTES de enviar o pedido (será feito pelo plugin agora)
       // await figma.clientStorage.deleteAsync(GENERATION_STATUS_KEY); // REMOVIDO DAQUI
       // console.log("[handleSubmit] Chave de status antiga limpa (se existia)."); // Log removido

       console.log("[handleSubmit] Enviando para plugin:", { markdown, mode: nodeMode, accentColor: finalAccentColor });
       dispatchTS("generate-flow", { markdown, mode: nodeMode, accentColor: finalAccentColor });
       console.log("[handleSubmit] Mensagem 'generate-flow' enviada.");
    } catch (error: any) { // Captura erros do dispatchTS (muito raro)
       console.error("[handleSubmit] Erro ao despachar mensagem 'generate-flow':", error);
       setError(`Erro interno ao enviar pedido: ${error.message}`);
       setIsLoading(false);
    }
  };

  const handleCleanText = () => { setMarkdown(""); setError(null); markdownTextareaRef.current?.focus(); };
  const handleNodeModeChange = (value: string) => { if (value === 'light' || value === 'dark') { setNodeMode(value as NodeGenerationMode); } };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      let newValue = event.target.value;
      if (newValue.startsWith('#')) {
        newValue = '#' + newValue.substring(1).replace(/[^0-9a-fA-F]/gi, '');
      } else {
        newValue = '#' + newValue.replace(/[^0-9a-fA-F]/gi, '');
      }
      newValue = newValue.substring(0, 7);
      const upperNewValue = newValue.toUpperCase();
      setInputValue(upperNewValue);
      if (isValidHex(upperNewValue)) {
        setAccentColor(upperNewValue);
        if (error === "Cor Accent inválida." || error === "Cor Accent inválida. Use formato HEX (ex: #3860FF).") {
            setError(null);
        }
      } else if (upperNewValue.length === 7) {
        setError("Cor Accent inválida.");
      } else {
         if (error === "Cor Accent inválida.") {
             setError(null);
         }
      }
  };

   const handleInputBlur = () => {
       if (!isValidHex(inputValue)) {
           setInputValue(accentColor.toUpperCase());
           if (error === "Cor Accent inválida." || error === "Cor Accent inválida. Use formato HEX (ex: #3860FF).") {
               setError(null);
           }
       } else {
           setAccentColor(inputValue.toUpperCase());
            setError(null);
       }
   };

   // --- History Handlers ---
   const handleLoadFromHistory = (markdownItem: string) => {
        setMarkdown(markdownItem);
        setError(null);
        setActiveTab("generator");
         setTimeout(() => markdownTextareaRef.current?.focus(), 0);
    };

    const handleRemoveItemClick = (markdownItem: string) => {
        setItemToRemove(markdownItem);
        setIsRemoveConfirmOpen(true);
    };

    const handleConfirmRemoveItem = () => {
        if (itemToRemove) {
            console.log("[History] Confirmado remover item.");
            setHistory(prev => prev.filter(item => item !== itemToRemove));
            dispatchTS('remove-history-entry', { markdown: itemToRemove });
        }
        setIsRemoveConfirmOpen(false);
        setItemToRemove(null);
    }

    const handleClearHistoryClick = () => {
        if (history.length > 0) {
             setIsClearConfirmOpen(true);
        }
    };

    const handleConfirmClearHistory = () => {
        console.log("[History] Confirmado limpar todo o histórico.");
        setHistory([]);
        dispatchTS('clear-history-request');
        setIsClearConfirmOpen(false);
    };

  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn("flex flex-col h-screen bg-background text-foreground", uiTheme)}>
        {/* Header */}
        <header className="flex items-center justify-between w-full flex-shrink-0 p-3 border-b border-border">
           <div className="h-6 w-auto text-foreground">
               {/* IziFlow Logo SVG */}
                <svg width="107" height="22" viewBox="0 0 107 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full" aria-label="IziFlow Logo" role="img"><g clipPath="url(#clip0_19933_1555)"><path d="M6.74156 0.453003C8.00045 0.325078 9.53693 0.717882 9.09279 2.30565C8.49711 4.43672 3.70911 5.47818 3.44803 7.61677C3.31599 8.69886 4.24027 9.03448 5.14956 8.82077C8.81971 7.95841 12.5664 1.10617 16.7122 3.06567C18.3177 3.82569 18.7003 5.53386 18.2457 7.14421C17.3634 10.2761 12.6084 13.6834 13.075 16.9387C13.2296 18.0103 14.3774 18.519 15.2702 17.8899C16.193 17.2397 16.1705 16.1982 16.7017 15.3931C17.3754 14.3712 18.3687 15.2215 18.6208 16.0959C19.311 18.4888 17.2283 21.4191 14.7466 21.6283C11.5926 21.8931 10.0756 19.8644 10.6983 16.8604C10.7973 16.3788 11.1484 15.5797 11.1769 15.1764C11.219 14.6015 10.7178 14.7128 10.3652 14.8678C7.57882 16.0944 5.34462 21.2309 2.57325 21.4627C0.244524 21.6569 -0.636252 19.4009 0.475596 17.5392C2.32718 14.4419 8.38607 13.709 11.4905 11.9C12.7719 11.1535 15.8254 8.89451 14.9086 7.13518C14.0383 5.46614 11.5626 7.10658 10.5978 7.85306C8.30355 9.62745 5.43315 12.6028 2.19363 11.2182C-2.75492 9.10371 2.93637 0.841291 6.74156 0.453003Z" fill="currentColor"/><path d="M25.2664 21.6508V7.28417H28.665V21.6493H25.2664V21.6508ZM26.9514 4.31331C26.3707 4.31331 25.8771 4.10863 25.469 3.70078C25.0623 3.29293 24.8583 2.79778 24.8583 2.21535C24.8583 1.63292 25.0608 1.13778 25.469 0.729922C25.8756 0.322069 26.3692 0.11739 26.9514 0.11739C27.5336 0.11739 27.9973 0.322069 28.4039 0.729922C28.8105 1.13778 29.0146 1.63292 29.0146 2.21535C29.0146 2.79778 28.8105 3.29293 28.4039 3.70078C27.9973 4.10863 27.5126 4.31331 26.9514 4.31331Z" fill="currentColor"/><path d="M41.9547 21.6508H30.4506V18.8531L37.6843 10.1406H30.4506V7.28568H41.9547V10.1121L34.6339 18.7959H41.9547V21.6508Z" fill="currentColor"/><path d="M43.7972 21.6508V7.28417H47.1958V21.6493H43.7972V21.6508ZM45.4822 4.31331C44.9015 4.31331 44.4079 4.10863 44.0013 3.70078C43.5946 3.29293 43.3906 2.79778 43.3906 2.21535C43.3906 1.63292 43.5946 1.13778 44.0013 0.729922C44.4079 0.322069 44.9015 0.11739 45.4822 0.11739C46.0629 0.11739 46.528 0.322069 46.9347 0.729922C47.3413 1.13778 47.5454 1.63292 47.5454 2.21535C47.5454 2.79778 47.3413 3.29293 46.9347 3.70078C46.528 4.10863 46.0434 4.31331 45.4822 4.31331Z" fill="currentColor"/><path d="M62.9432 3.70078V0.379259H53.4437H50.1607H49.8696V21.6508H53.4437V12.9083H61.4323V9.6741H53.4437V3.70078H62.9432Z" fill="currentColor"/><path d="M67.9773 21.6508H64.6072V0H67.9773V21.6508Z" fill="currentColor"/><path d="M69.1431 14.454C69.1431 12.958 69.4732 11.6471 70.1304 10.5199C70.7891 9.3731 71.6894 8.48064 72.8328 7.83951C73.9941 7.19839 75.3116 6.87782 76.7835 6.87782C78.2555 6.87782 79.5624 7.19839 80.7057 7.83951C81.8491 8.48064 82.7494 9.37461 83.4081 10.5199C84.0668 11.6471 84.3954 12.958 84.3954 14.454C84.3954 15.9499 84.0653 17.2412 83.4081 18.388C82.7494 19.5153 81.8491 20.3987 80.7057 21.0398C79.5624 21.6809 78.2555 22.0015 76.7835 22.0015C75.3116 22.0015 73.9941 21.6809 72.8328 21.0398C71.6894 20.3987 70.7891 19.5153 70.1304 18.388C69.4717 17.2412 69.1431 15.9304 69.1431 14.454ZM72.5702 14.4239C72.5702 15.3178 72.7443 16.1049 73.0939 16.7837C73.4615 17.4639 73.9551 17.9982 74.5748 18.3865C75.214 18.7552 75.9508 18.9403 76.7835 18.9403C77.6163 18.9403 78.3425 18.7552 78.9622 18.3865C79.6014 17.9982 80.0951 17.4639 80.4432 16.7837C80.7913 16.1034 80.9668 15.3163 80.9668 14.4239C80.9668 13.5314 80.7928 12.7533 80.4432 12.0926C80.0951 11.4124 79.6014 10.8886 78.9622 10.5184C78.3425 10.1301 77.6163 9.93597 76.7835 9.93597C75.9508 9.93597 75.214 10.1301 74.5748 10.5184C73.9551 10.8871 73.4615 11.4124 73.0939 12.0926C72.7458 12.7533 72.5702 13.5299 72.5702 14.4239Z" fill="currentColor"/><path d="M89.335 21.6508L84.6865 7.28568H88.2306L90.1767 13.6668C90.3508 14.2297 90.5068 14.8137 90.6419 15.4157C90.7964 16.0176 90.942 16.6588 91.077 17.339C91.155 16.8725 91.2421 16.4451 91.3381 16.0568C91.4356 15.6685 91.5422 15.2892 91.6577 14.9205C91.7732 14.5322 91.8993 14.1138 92.0358 13.6668L94.099 7.28568H97.556L99.5322 13.6668C99.5907 13.8219 99.6582 14.0551 99.7347 14.3667C99.8128 14.6782 99.8998 15.0168 99.9958 15.3871C100.111 15.7362 100.209 16.0869 100.287 16.436C100.365 16.7852 100.432 17.0772 100.489 17.3104C100.567 16.9417 100.655 16.5339 100.751 16.0869C100.866 15.6399 100.983 15.2125 101.099 14.8046C101.234 14.3772 101.34 13.9979 101.418 13.6684L103.423 7.28718H106.997L102.059 21.6523H98.863L96.8298 15.1839C96.5387 14.2704 96.3077 13.4938 96.1321 12.8526C95.9776 12.192 95.871 11.6772 95.8125 11.3085C95.7345 11.6577 95.6189 12.1242 95.4644 12.7067C95.3098 13.2695 95.0668 14.1153 94.7382 15.2426L92.675 21.6539H89.3335L89.335 21.6508Z" fill="currentColor"/></g><defs><clipPath id="clip0_19933_1555"><rect width="107" height="22" fill="none"/></clipPath></defs></svg>
           </div>
           {/* Header Buttons */}
           <div className="flex items-center gap-1.5">
               <Button variant="ghost" size="icon" className="p-0 w-8 h-8" onClick={() => setUiTheme(uiTheme === "dark" ? "light" : "dark")} title={uiTheme === "dark" ? "Mudar para Light Mode (UI)" : "Mudar para Dark Mode (UI)"}>
                   {uiTheme === "dark" ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
               </Button>
               <Button variant="ghost" size="icon" className="p-0 w-8 h-8" title="Configurações" onClick={() => setActiveTab('settings')}>
                   <SettingsIcon className="w-4 h-4" />
               </Button>
           </div>
        </header>

        {/* --- Main Tabs --- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow min-h-0">
          <TabsList className="flex-shrink-0 mx-3 mt-3 mb-2 h-9 w-auto p-1 justify-start rounded-lg bg-muted text-muted-foreground">
            <TabsTrigger value="generator" className="flex-1 px-3 py-1 h-7 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Create Flow</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 px-3 py-1 h-7 text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">History</TabsTrigger>
          </TabsList>

          {/* --- Generator Tab Content --- */}
          <TabsContent value="generator" className="flex flex-col flex-grow p-3 gap-3 overflow-y-auto data-[state=inactive]:hidden">
            {/* Textarea */}
            <Textarea
              ref={markdownTextareaRef} value={markdown} onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your IziFlow Markdown here or start typing..."
              className="flex-grow w-full resize-none font-mono text-xs min-h-[15vh] bg-muted/30 dark:bg-muted/10 border-border"
            />
            {/* Customization Section */}
            <div className="flex flex-col gap-2 w-full flex-shrink-0">
              <h3 className="text-xl font-medium">Customize nodes</h3>
              <div className="flex flex-row items-end gap-2">
                {/* Accent Color Input */}
                <div className="flex flex-1 flex-col items-start gap-1">
                   <Label htmlFor="accent-color-input" className="text-sm font-semibold flex items-center gap-1">
                      Accent Color
                      <Tooltip><TooltipTrigger asChild><InfoIcon className="w-3 h-3 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent side="top" align="center"><p className="text-xs">Define accent color (HEX).</p></TooltipContent></Tooltip>
                  </Label>
                  <div className="relative flex items-center w-full h-8">
                      <Input id="accent-color-input" type="text" value={inputValue} onChange={handleInputChange} onBlur={handleInputBlur} className={cn("h-8 w-full pl-7 pr-1 text-xs font-mono", !isValidHex(inputValue) && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30")} maxLength={7} aria-label="Accent color hex value" />
                      <div aria-hidden="true" className="absolute left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm border border-input pointer-events-none" style={{ backgroundColor: isValidHex(accentColor) ? accentColor : '#CCCCCC' }} />
                  </div>
                </div>
                {/* Node Mode Tabs */}
                <div className="flex flex-1 flex-col items-start gap-1">
                    <Label htmlFor="node-theme-tabs" className="text-sm font-semibold flex items-center gap-1">
                      Node Theme
                      <Tooltip><TooltipTrigger asChild><InfoIcon className="w-3 h-3 text-muted-foreground cursor-help" /></TooltipTrigger><TooltipContent side="top" align="center"><p className="text-sm font-semibold">Visual theme for generated nodes.</p></TooltipContent></Tooltip>
                    </Label>
                    <Tabs id="node-theme-tabs" value={nodeMode} onValueChange={handleNodeModeChange} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 p-0.5 bg-secondary border border-border rounded-md h-8">
                        <TabsTrigger value="dark" className="flex items-center gap-1 px-1 py-0.5 text-[11px] h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:opacity-70" aria-label="Generate in Dark mode"><MoonIcon className="w-3 h-3"/> Dark Nodes</TabsTrigger>
                        <TabsTrigger value="light" className="flex items-center gap-1 px-1 py-0.5 text-[11px] h-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=inactive]:opacity-70" aria-label="Generate in Light mode"><SunIcon className="w-3 h-3"/> Light Nodes</TabsTrigger>
                      </TabsList>
                    </Tabs>
                </div>
              </div>
            </div>
            {/* Error Area & Action Buttons */}
            <div className="w-full mt-auto flex-shrink-0 space-y-1.5 pt-1.5">
              {error && ( <Alert variant="destructive" className="text-xs px-3 py-1.5"><AlertDescription>{error}</AlertDescription></Alert> )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleCleanText} title="Clear text area">Clear</Button>
                <Button size="sm" onClick={handleSubmit} disabled={isLoading || !markdown.trim() || !isValidHex(inputValue)}>
                  {isLoading ? "Generating..." : "Create Flow"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* --- History Tab Content (Table View) --- */}
          <TabsContent value="settings" className="flex flex-col flex-grow p-3 gap-6 overflow-hidden data-[state=inactive]:hidden">
            <div className="flex flex-col flex-grow w-full items-start gap-2 mb-2">
            <h2 className="text-xl font-medium   flex-shrink-0">Flows History</h2>
            <div className="flex-grow w-full min-h-0 border rounded-md overflow-hidden">
                <ScrollArea className="h-full">
                    {/* <<< LOG DE DEPURAÇÃO >>> */}
                    {console.log("[App Render JSX - History Tab] history.length:", history.length, "history:", history)}
                    <Table className="text-xs">
                        <TableHeader className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                            <TableRow>
                                <TableHead className="w-[60%] h-8 px-3 font-medium">Flow name</TableHead>
                                <TableHead className="w-[25%] h-8 px-3 font-medium">Date</TableHead>
                                <TableHead className="w-[15%] text-right h-8 px-3 font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.length > 0 ? (
                                history.map((markdownItem, index) => {
                                    const flowName = extractFlowName(markdownItem);
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="py-1.5 px-3 font-medium truncate" title={flowName}>
                                                {flowName}
                                            </TableCell>
                                            <TableCell className="py-1.5 px-3 text-muted-foreground">--</TableCell> {/* Placeholder for Date */}
                                            <TableCell className="py-1 px-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                                            <MoreHorizontalIcon className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Actions</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onSelect={() => handleLoadFromHistory(markdownItem)} className="text-xs gap-1.5">
                                                            <PlayIcon className="w-3 h-3"/> Load Flow
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onSelect={() => handleRemoveItemClick(markdownItem)} className="text-xs text-destructive focus:text-destructive focus:bg-destructive/10 gap-1.5">
                                                            <Trash2Icon className="w-3 h-3"/> Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        No history saved yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
            </div>
            {/* Clean History Button */}
            <div className="flex justify-end mt-auto flex-shrink-0">
                 <Button
                    variant="destructive" size="sm"
                    onClick={handleClearHistoryClick}
                    disabled={history.length === 0}
                 >
                   <Trash2Icon className="w-3.5 h-3.5 mr-1.5" />
                   Clean History
                 </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* --- Confirmation Dialogs (Outside Tabs) --- */}
        {/* Clear History Confirmation */}
        <AlertDialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Entire History?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to permanently delete all saved flows from the history?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmClearHistory} className={buttonVariants({ variant: "destructive" })}>
                Clear History
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Remove Single Item Confirmation */}
        <AlertDialog open={isRemoveConfirmOpen} onOpenChange={setIsRemoveConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Flow from History?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove "{itemToRemove ? extractFlowName(itemToRemove) : 'this flow'}" from the history? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
             <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setItemToRemove(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmRemoveItem} className={buttonVariants({ variant: "destructive" })}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </TooltipProvider>
  );
}
```

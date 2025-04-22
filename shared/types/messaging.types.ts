export interface EventTS {
  'generate-flow': {
    markdown: string; // <-- CORRETO
    mode: 'light' | 'dark'; // <<< ADICIONAR/CONFIRMAR
    accentColor: string;      // <<< ADICIONAR/CONFIRMAR
  };
  'generation-success': { message: string; };
  'generation-error': { message: string; };
  'parse-error': { message: string; lineNumber?: number; };
  'debug': { message: string; data?: string; };
  closePlugin: {};
}
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
  'get-history': {}; // UI pede o histórico
  'history-data': { history: string[] }; // Plugin envia o histórico para a UI
  'add-history-entry': { markdown: string }; // UI (ou Plugin) informa para adicionar entrada
}
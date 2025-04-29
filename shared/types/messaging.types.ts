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
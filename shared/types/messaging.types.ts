export interface EventTS {
  'generate-flow': {
    markdown: string; // <-- CORRETO
  };
  'generation-success': { message: string; };
  'generation-error': { message: string; };
  'parse-error': { message: string; lineNumber?: number; };
  'debug': { message: string; data?: string; };
  closePlugin: {};
}
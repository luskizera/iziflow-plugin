type LogMode = 'production' | 'development' | 'test';

function resolveMode(): LogMode {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE) {
      return (import.meta as any).env.MODE as LogMode;
    }
  } catch {}

  if (typeof process !== 'undefined' && process.env?.NODE_ENV) {
    return process.env.NODE_ENV as LogMode;
  }

  return 'production';
}

const mode = resolveMode();
const allowInfo = mode !== 'production';

export const Logger = {
  info: (context: string, message: any, ...args: any[]) => {
    if (!allowInfo) return;
    console.log(`[${context}]`, message, ...args);
  },
  debug: (context: string, message: any, data?: any) => {
    if (!allowInfo) return;
    console.debug(`[${context}]`, message, data || '');
  },
  warn: (context: string, message: any, data?: any) => {
    console.warn(`[${context}]`, message, data || '');
  },
  error: (context: string, message: any, error?: any) => {
    console.error(`[${context}]`, message, error || '');
  }
};

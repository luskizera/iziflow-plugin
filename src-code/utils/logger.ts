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

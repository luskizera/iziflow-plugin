// src/utils/dispatch.ts
import { notify } from '@/lib/utils';

export const dispatchTS = (event: string, data?: any) => {
  notify(`Dispatch: ${event}`);
  
  try {
    const message = {
      pluginMessage: {
        type: event,
        ...data
      }
    };
    
    // Debug do objeto antes de enviar
    notify(`Debug: ${JSON.stringify(message, null, 2)}`);
    
    parent.postMessage(message, '*');
    notify(`Mensagem enviada: ${event}`);
  } catch (error) {
    notify(`Erro: ${error}`);
  }
};
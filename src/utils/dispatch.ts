import { notify } from '@/lib/utils';

export const dispatchTS = (event: string, data?: any) => {
  notify("1. Dispatch iniciado");
  
  const message = {
    pluginMessage: {
      type: event,
      ...data
    }
  };
  
  notify(`2. Mensagem: ${JSON.stringify(message)}`);
  
  try {
    parent.postMessage(message, '*');
    notify("3. Mensagem enviada com sucesso");
  } catch (error) {
    notify(`Erro ao enviar mensagem: ${error}`);
  }
};
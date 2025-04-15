// src/utils/utils.ts

// 👇 IMPORTAR A DEFINIÇÃO CORRETA E ÚNICA DE EventTS
import type { EventTS } from '@shared/types/messaging.types';

// Tipos auxiliares para a estrutura da mensagem (podem ser mantidos ou simplificados)
export type Message<K extends keyof EventTS = keyof EventTS> = {
  type: K; // Usar 'type' em vez de 'event' é mais comum
} & EventTS[K]; // Combina o tipo com o payload esperado para ele

export type PluginMessage = {
  pluginMessage: Message; // A mensagem real está aqui dentro
  pluginId?: string; // Opcional para direcionar a mensagem
};

// Função dispatch genérica (pode ser removida se não usada diretamente)
// export const dispatch = (msg: Message, global = false, origin = "*") => {
//   let data: PluginMessage = { pluginMessage: msg };
//   if (!global && manifest.id) data.pluginId = manifest.id;
//   parent.postMessage(data, origin);
// };


// Função dispatchTS PRINCIPAL (Agora usa a EventTS importada)
export const dispatchTS = <Key extends keyof EventTS>(
  event: Key,
  // O tipo 'data' é inferido de EventTS[Key]. Se EventTS[Key] for {}, data será opcional.
  // Se EventTS[Key] tiver propriedades, data será obrigatório com essas propriedades.
  // Adaptar para tornar 'data' opcional mesmo se o tipo não for vazio, se necessário:
  ...payload: EventTS[Key] extends Record<string, never> ? [] : [EventTS[Key]] // Payload é opcional se EventTS[Key] for vazio ({}), senão é uma tupla com o payload
) => {
  console.log('dispatchTS chamado:', { event, payload });

  // Construir a mensagem combinando type e payload
  const messagePayload = payload.length > 0 ? payload[0] : {}; // Pega o primeiro item da tupla ou um objeto vazio
  const message: Message<Key> = {
    type: event,
    ...(messagePayload as EventTS[Key]) // Cast para garantir a estrutura correta
  };

  // Estrutura final enviada via postMessage
  const postData: PluginMessage = {
      pluginMessage: message
      // pluginId: manifest.id // Descomente se quiser direcionar a mensagem (geralmente não necessário da UI para o Plugin)
  };

  console.log('Enviando mensagem final:', postData);
  parent.postMessage(postData, "*"); // Usar "*" é comum da UI para o Plugin
};

// Função listenTS (Agora usa a EventTS importada)
export const listenTS = <Key extends keyof EventTS>(
  eventName: Key,
  // Callback recebe o payload específico para aquele evento
  callback: (payload: EventTS[Key]) => void,
  listenOnce = false
) => {
  const func = (event: MessageEvent<any>) => {
    // Verificar a estrutura da mensagem recebida
    const pluginMessage = event.data?.pluginMessage as Message<Key> | undefined;

    if (pluginMessage && pluginMessage.type === eventName) {
      // Remove 'type' do objeto antes de passar para o callback
      const { type, ...payload } = pluginMessage;
      callback(payload as unknown as EventTS[Key]); // Passa apenas o payload

      if (listenOnce) {
        window.removeEventListener("message", func);
      }
    }
  };
  window.addEventListener("message", func);

  // Retornar uma função de cleanup para remover o listener
  return () => {
    window.removeEventListener("message", func);
  };
};
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
import { manifest } from "../../figma.config";

// Definir o tipo EventTS aqui mesmo
export type EventTS = {
  "generate-flow": {
    json: string;
  };
  "closePlugin": void;
};

export type Message = {
  event: keyof EventTS;
  [key: string]: any;
};

export type PluginMessageEvent = {
  pluginMessage: Message;
  pluginId?: string;
};

export const dispatch = (msg: Message, global = false, origin = "*") => {
  let data: PluginMessageEvent = { pluginMessage: msg };
  if (!global) data.pluginId = manifest.id;
  parent.postMessage(data, origin);
};

export const dispatchTS = <Key extends keyof EventTS>(
  event: Key,
  data?: EventTS[Key] extends void ? never : EventTS[Key],
  global = false,
  origin = "*"
) => {
  dispatch({ event, ...(data || {}) }, global, origin);
};

export const listenTS = <Key extends keyof EventTS>(
  eventName: Key,
  callback: (data: EventTS[Key]) => any,
  listenOnce = false
) => {
  const func = (event: MessageEvent<any>) => {
    if (event.data.pluginMessage.event === eventName) {
      callback(event.data.pluginMessage.data);
      if (listenOnce) window.removeEventListener("message", func); // Remove Listener so we only listen once
    }
  };
  window.addEventListener("message", func);
};

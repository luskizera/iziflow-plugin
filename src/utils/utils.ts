import { manifest } from "../../figma.config";
import type { EventTS } from "../../shared/universals";
import type { Message, PluginMessageEvent } from "../globals";

export const dispatch = (msg: Message, global = false, origin = "*") => {
  let data: PluginMessageEvent = { pluginMessage: msg };
  if (!global) data.pluginId = manifest.id;
  parent.postMessage(data, origin);
};

export const dispatchTS = <Key extends keyof EventTS>(
  event: Key,
  data: EventTS[Key],
  global = false,
  origin = "*"
) => {
  dispatch({ event, ...data }, global, origin);
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

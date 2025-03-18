import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

declare const figma: any;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const notify = (message: string) => {
  parent.postMessage({
    pluginMessage: {
      type: 'console',
      message: `[UI] ${message}`
    }
  }, '*');
};

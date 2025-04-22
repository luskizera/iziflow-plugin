/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="figma" />

declare module '*.svg?raw' {
    const content: string;
    export default content;
  }
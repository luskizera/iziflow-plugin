import type { FigmaConfig, PluginManifest } from "vite-figma-plugin/lib/types";
import { version } from "./package.json";

export const manifest: PluginManifest = {
  name: "IziFlow", 
id: "1577430455268046783",
  api: "1.0.0",
  main: "code.js",
  ui: "index.html",
  editorType: [
    "figjam"
  ],
  documentAccess: "dynamic-page",
  networkAccess: {
    allowedDomains: ["*"],
    reasoning: "For accessing remote assets",
  },
};

const extraPrefs = {
  copyZipAssets: ["public-zip/*"],
};

export const config: FigmaConfig = {
  manifest,
  version,
  ...extraPrefs,
};

import path from "path";
import { defineConfig } from "vite";
import { figmaPlugin, figmaPluginInit, runAction } from "vite-figma-plugin";
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";

import { config } from "./figma.config";

const action = process.env.ACTION;
const mode = process.env.MODE;

if (action) runAction({}, action);

figmaPluginInit();

export default defineConfig({
  plugins: [
    react(), 
    viteSingleFile(), 
    figmaPlugin(config, mode),
  ],
  build: {
    assetsInlineLimit: 0,
    emptyOutDir: false,
    outDir: ".tmp",
    sourcemap: mode === "development",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        // Removido manualChunks pois não é compatível com inlineDynamicImports
      },
      treeshake: true,
    },
    chunkSizeWarningLimit: 2000, // Aumentado para evitar warnings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Mantém os console.logs
        drop_debugger: false,
        pure_funcs: [], // Remove a remoção dos console.logs
        passes: 2
      },
      format: {
        comments: false
      }
    },
    target: 'esnext'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

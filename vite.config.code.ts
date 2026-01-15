import { defineConfig } from "vite";
import { figmaCodePlugin } from "vite-figma-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [figmaCodePlugin()],
  build: {
    emptyOutDir: false,
    outDir: ".tmp",
    target: "es2020", // Vite 7 compatible, Figma uses modern V8 engine
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: `code.js`,
      },
      input: "./src-code/code.ts",
      treeshake: true,
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: false,
        drop_debugger: false
      },
      mangle: true
    }
  },
});

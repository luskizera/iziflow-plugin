import { defineConfig } from "vite";
import { figmaCodePlugin } from "vite-figma-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [figmaCodePlugin()],
  build: {
    emptyOutDir: false,
    outDir: ".tmp",
    target: "es2017", // Reverted to ES2017 for better compatibility
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

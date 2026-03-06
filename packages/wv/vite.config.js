import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/js/index.js"),
      name: "wvCore",
      fileName: () => "core.js",
      formats: ["es"]
    },
    outDir: "dist/js",
    emptyOutDir: true,
    rollupOptions: {
      external: []
    }
  }
});
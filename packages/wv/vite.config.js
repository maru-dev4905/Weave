import { defineConfig } from "vite";
import path from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { transformSync } from "esbuild";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

const REPO_URL = "https://github.com/maru-dev4905/Weave";
const banner = `// ${REPO_URL}  V.${pkg.version}`;

/** Vite ES lib 빌드는 공백 minify를 끄므로, 산출물을 한 줄로 만든 뒤 배너를 붙인다. */
function finalizeCoreJs() {
  return {
    name: "weave-finalize-core-js",
    apply: "build",
    closeBundle() {
      const outPath = path.resolve(__dirname, "dist/js/core.js");
      let code = readFileSync(outPath, "utf8");
      code = code.replace(/^\/\/ https:\/\/github\.com\/[^\n]*\n/m, "");
      const { code: minified } = transformSync(code, {
        minify: true,
        legalComments: "none",
        loader: "js"
      });
      writeFileSync(outPath, `${banner}\n${minified}`);
    }
  };
}

export default defineConfig({
  plugins: [finalizeCoreJs()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/js/index.js"),
      name: "wvCore",
      fileName: () => "core.js",
      formats: ["es"]
    },
    outDir: "dist/js",
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      external: []
    }
  },
  esbuild: {
    legalComments: "none"
  }
});
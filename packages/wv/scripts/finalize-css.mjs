import path from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { transformSync } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distCss = path.join(root, "dist", "css");

const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const REPO_URL = "https://github.com/maru-dev4905/Weave";
const BANNER = `/* ${REPO_URL}  V.${pkg.version} */`;

const CSS_FILES = ["wv.css", "common.css", "admin.css", "gov.css"];

const stripBanner = (css) =>
  css.replace(/^\s*\/\* https:\/\/github\.com\/[^*]+\*\/\s*/m, "");

function insertBannerAfterCharset(minified) {
  const charsetRe = /^@charset\s+(?:"[^"]*"|'[^']*')\s*;/i;
  const m = minified.match(charsetRe);
  if (m) {
    return minified.slice(0, m[0].length) + BANNER + minified.slice(m[0].length);
  }
  return BANNER + minified;
}

for (const name of CSS_FILES) {
  const filePath = path.join(distCss, name);
  let raw = readFileSync(filePath, "utf8");
  raw = stripBanner(raw);
  const { code: minified } = transformSync(raw, {
    loader: "css",
    minify: true,
    legalComments: "none"
  });
  const out = insertBannerAfterCharset(minified).replace(/\r?\n+$/g, "");
  writeFileSync(filePath, out, "utf8");
}

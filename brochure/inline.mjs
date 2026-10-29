// Build a self-contained copy of trifold.html (local images inlined as data: URIs)
// for hosting somewhere that cannot read ../images. Usage: node brochure/inline.mjs <out.html>
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const mime = { ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
const inline = (ref) => {
  const file = resolve(here, ref);
  return `data:${mime[extname(file)]};base64,${readFileSync(file).toString("base64")}`;
};

let html = readFileSync(resolve(here, "trifold.html"), "utf8");
html = html.replace(/src="((?:\.\.\/|qr-)[^"]+)"/g, (_, ref) => `src="${inline(ref)}"`);
html = html.replace(/url\("(\.\.\/[^"]+)"\)/g, (_, ref) => `url("${inline(ref)}")`);
writeFileSync(process.argv[2], html);
console.log("wrote", process.argv[2], (html.length / 1e6).toFixed(2) + " MB");

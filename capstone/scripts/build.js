// Production build: bundles + minifies JS and CSS (content-hashed filenames), copies optimized images.
import { build } from "esbuild";
import { readFile, writeFile, rm, mkdir, cp, readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "assets"), { recursive: true });

const common = { bundle: true, minify: true, write: true, outdir: join(dist, "assets"), entryNames: "[name].[hash]", logLevel: "warning" };

await build({ ...common, entryPoints: { app: join(root, "src/main.js") }, format: "esm", target: "es2020" });
await build({ ...common, entryPoints: { styles: join(root, "css/styles.css") } });

const files = await readdir(join(dist, "assets"));
const js = files.find(f => f.startsWith("app.") && f.endsWith(".js"));
const css = files.find(f => f.startsWith("styles.") && f.endsWith(".css"));

let html = await readFile(join(root, "index.html"), "utf8");
html = html
  .replace('href="css/styles.css"', `href="assets/${css}"`)
  .replace('src="src/main.js"', `src="assets/${js}"`)
  .replace(/>\s+</g, "><")           // collapse whitespace between tags
  .replace(/\n\s*/g, "");

await writeFile(join(dist, "index.html"), html);
await cp(join(root, "assets/images"), join(dist, "assets/images"), { recursive: true });

async function size(path) { return (await stat(path)).size; }
console.log("Build complete -> dist/");
console.log(`  ${js}   ${(await size(join(dist, "assets", js)) / 1024).toFixed(1)} KB`);
console.log(`  ${css}   ${(await size(join(dist, "assets", css)) / 1024).toFixed(1)} KB`);
console.log(`  index.html   ${(await size(join(dist, "index.html")) / 1024).toFixed(1)} KB`);

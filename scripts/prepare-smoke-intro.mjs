// Repack the supplied GIF without generating, retiming, or removing any frames.
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const source = new URL("../assets/source/yashguma-smoke.gif", import.meta.url);
const output = new URL("../public/intro/", import.meta.url);
await mkdir(output, { recursive: true });
const input = await readFile(source);
const metadata = await sharp(input, { animated: true }).metadata();
if (!metadata.pages || metadata.pages < 2 || !metadata.delay) throw new Error("Expected an animated GIF");
const width = 384, height = 576, columns = 4, perSheet = 24;
const sheets = [];
for (let start = 0; start < metadata.pages; start += perSheet) {
  const count = Math.min(perSheet, metadata.pages - start);
  const layers = [];
  for (let offset = 0; offset < count; offset++) {
    const frame = await sharp(input, { page: start + offset, pages: 1 }).resize(width, height).png().toBuffer();
    layers.push({ input: frame, left: offset % columns * width, top: Math.floor(offset / columns) * height });
  }
  const name = `yashguma-smoke-${sheets.length}.webp`;
  await sharp({ create: { width: columns * width, height: Math.ceil(count / columns) * height, channels: 4, background: "#00000000" } })
    .composite(layers).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(new URL(name, output).pathname);
  sheets.push(`/intro/${name}`);
}
const manifest = {
  sourceSha256: createHash("sha256").update(input).digest("hex"),
  width, height, columns, perSheet, sheets,
  delays: metadata.delay,
  duration: metadata.delay.reduce((sum, delay) => sum + delay, 0),
};
await writeFile(new URL("../lib/smoke-intro-data.json", import.meta.url), JSON.stringify(manifest, null, 2) + "\n");
console.log(`${metadata.pages} transparent frames, ${manifest.duration} ms per pass, ${sheets.length} atlases`);

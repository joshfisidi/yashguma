import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const [source] = process.argv.slice(2);
if (!source) throw new Error("Usage: node scripts/prepare-drawer-mist.mjs <mist.webp>");

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const { delay } = await sharp(source, { animated: true }).metadata();
if (!delay || delay.length < 2) throw new Error("Expected an animated WebP");

const width = 162;
const height = 242;
const columns = 8;
const frames = 60;
const raw = { width, height, channels: 4 };
const bytesPerFrame = width * height * raw.channels;
const atlasPath = "/drawer/yashguma-mist.webp";

// Keep the transparent endpoint and shorten the source's final hold.
const duration = (delay.slice(0, -1).reduce((sum, value) => sum + value, 0) + delay[1]) / 1000;
const pixels = execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-ignore_loop", "1", "-i", source, "-filter_threads", "2",
  "-vf", `scale=${width}:${height}:flags=lanczos,setpts=(PTS-STARTPTS)*2/${duration},fps=30,tpad=stop_mode=clone:stop=${frames},format=rgba`,
  "-frames:v", String(frames), "-an", "-threads", "1", "-f", "rawvideo", "pipe:1",
], { maxBuffer: frames * bytesPerFrame + 1024 });
if (pixels.length !== frames * bytesPerFrame) throw new Error("Unexpected decoded mist frame count");

const layers = Array.from({ length: frames }, (_, index) => ({
  input: pixels.subarray(index * bytesPerFrame, (index + 1) * bytesPerFrame),
  raw,
  left: index % columns * width,
  top: Math.floor(index / columns) * height,
}));

await mkdir(new URL("../public/drawer/", import.meta.url), { recursive: true });
await sharp({
  create: { width: width * columns, height: height * Math.ceil(frames / columns), channels: 4, background: "#00000000" },
})
  .composite(layers)
  .webp({ quality: 74, alphaQuality: 60, effort: 6 })
  .toFile(fileURLToPath(new URL(`../public${atlasPath}`, import.meta.url)));

await writeFile(new URL("../lib/drawer-mist-data.json", import.meta.url),
  JSON.stringify({ atlasPath, width, height, columns, frames }, null, 2) + "\n");

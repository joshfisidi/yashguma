import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const source = process.argv[2];
if (!source) throw new Error("Usage: node scripts/prepare-smoke-intro.mjs <source.gif>");

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const video = fileURLToPath(new URL("../public/intro/toronto-black-mist.mp4", import.meta.url));
const poster = new URL("../public/intro/toronto-black-mist.webp", import.meta.url);
const duration = Number(execFileSync("ffprobe", [
  "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", source,
], { encoding: "utf8" }).trim());
if (!Number.isFinite(duration) || duration <= 0) throw new Error("Could not read GIF duration");

const filters = [
  "[0:v]scale=540:-2:flags=lanczos,setsar=1,format=yuv420p",
  `setpts=(PTS-STARTPTS)*2/${duration},fps=30,tpad=stop_mode=clone:stop=60,trim=end_frame=60,split[forward][reverse_input]`,
].join(",") +
  ";[reverse_input]reverse,framestep=2,setpts=N/(30*TB)[reverse]" +
  ";[forward][reverse]concat=n=2:v=1:a=0,fps=30,tpad=stop_mode=clone:stop=30[intro]";

execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y", "-ignore_loop", "1", "-i", source,
  "-filter_complex", filters, "-map", "[intro]", "-an",
  "-c:v", "libx264", "-threads", "2", "-preset", "slow", "-crf", "23", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", video,
], { stdio: "inherit" });

const firstFrame = execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-i", video, "-frames:v", "1",
  "-f", "image2pipe", "-c:v", "png", "-threads", "1", "pipe:1",
]);
await sharp(firstFrame).resize(432).webp({ quality: 82 }).toFile(fileURLToPath(poster));

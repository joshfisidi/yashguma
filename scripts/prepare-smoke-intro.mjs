import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const [wallpaper, source] = process.argv.slice(2);
if (!wallpaper || !source) throw new Error("Usage: node scripts/prepare-smoke-intro.mjs <wallpaper.png> <mist.gif>");

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const video = fileURLToPath(new URL("../public/intro/toronto-rooftop-v2.mp4", import.meta.url));
const poster = new URL("../public/intro/toronto-rooftop-v2.webp", import.meta.url);
const { delay } = await sharp(source, { animated: true }).metadata();
// Trim the supplied GIF's redundant blank lead-in. Frame 5 is still transparent
// and the following frames introduce mist, so the authored hold can be 300 ms.
const firstMotionFrame = 5;
if (!delay || delay.length <= firstMotionFrame) throw new Error("Missing the expected Toronto GIF frames");
const duration = delay.slice(firstMotionFrame).reduce((sum, value) => sum + value, 0) / 1000;

const filters = [
  "[1:v]scale=540:808:flags=lanczos,setsar=1,format=yuva420p",
  `trim=start_frame=${firstMotionFrame},setpts=(PTS-STARTPTS)*2/${duration},fps=30,tpad=stop_mode=clone:stop=60,trim=end_frame=60,split[forward][reverse_input]`,
].join(",") +
  ";[reverse_input]reverse,framestep=2,setpts=N/(30*TB)[reverse]" +
  ";[forward][reverse]concat=n=2:v=1:a=0,fps=30,tpad=start_mode=clone:start=9:stop_mode=clone:stop=30[mist]" +
  ";[0:v]scale=540:808:flags=lanczos,setsar=1,format=yuv420p[roof]" +
  ";[roof][mist]overlay=shortest=1:format=yuv420[intro]";

execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y", "-loop", "1", "-framerate", "30", "-i", wallpaper,
  "-ignore_loop", "1", "-i", source, "-filter_complex_threads", "2",
  "-filter_complex", filters, "-map", "[intro]", "-an",
  "-c:v", "libx264", "-threads", "2", "-preset", "slow", "-crf", "26",
  "-maxrate", "1200k", "-bufsize", "700k", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", video,
], { stdio: "inherit" });

const firstFrame = execFileSync("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-i", video, "-frames:v", "1",
  "-f", "image2pipe", "-c:v", "png", "-threads", "1", "pipe:1",
]);
await sharp(firstFrame).webp({ quality: 82 }).toFile(fileURLToPath(poster));

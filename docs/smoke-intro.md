# Toronto smoke intro

The homepage preloads a 432 px wide WebP of the first frame from
`Toronto-Black-Mist-Reversed (1).gif`. A muted, inline H.264 video starts as soon
as the browser can play it. The 540 × 808 video keeps its aspect ratio and fits
inside the current viewport. The existing WebGL background shows around the
edges and behind the fade.

| Playback time | What happens |
| --- | --- |
| 0–2 s | The supplied animation plays in file order, starting with the skyline. |
| 2–3 s | The same motion plays backward. |
| 3–3.5 s | The skyline fades out as the homepage fades in. |
| 3.5–4 s | The homepage is fully visible while the skyline finishes fading. |

Playback and fades share the video clock. Escape, reduced motion, and a media
failure reveal the homepage immediately. A four second playback stall also
releases the page. With JavaScript disabled, the homepage is visible.

To regenerate from the original GIF, use FFmpeg with libx264 and run:

```sh
node scripts/prepare-smoke-intro.mjs "/path/to/Toronto-Black-Mist-Reversed (1).gif"
node --experimental-strip-types --test tests/smoke-intro.test.mjs
```

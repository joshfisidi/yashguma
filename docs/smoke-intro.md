# Toronto smoke intro

The rooftop intro runs in portrait viewports narrower than 640 CSS pixels.
Wider screens, landscape screens, and reduced motion show the homepage
immediately and skip the intro media requests.

On eligible screens, the supplied rooftop still is preloaded as WebP. The
video composites the animated, transparent WebP onto the same rooftop. Both layers use
the same full-viewport crop. A subtle haze and the media share one fade.

| Playback time | What happens |
| --- | --- |
| 0–0.3 s | The still rooftop holds. |
| 0.3–1.3 s | The animation plays in reverse and the figure appears from the mist. |
| 1.3–3.3 s | The animation plays forward and the figure dissolves into mist. |
| 3.3–3.8 s | The homepage fades in as the whole intro fades out. |
| 3.8–4.3 s | The homepage is fully visible while the intro finishes fading. |

The fades use the video clock. Escape, a change to an ineligible viewport, a
media error, or a four-second playback stall releases the homepage. The
homepage also works with JavaScript disabled.

Regenerate from the supplied still and WebP using FFmpeg with animated WebP decoding and libx264.

```sh
node scripts/prepare-smoke-intro.mjs "/path/to/Empty Toronto rooftop under storm clouds.png" "/path/to/Black-Mist-Transparent.webp"
node --experimental-strip-types --test tests/smoke-intro.test.mjs
```

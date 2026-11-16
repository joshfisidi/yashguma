# Toronto smoke intro

The rooftop intro runs in portrait viewports narrower than 640 CSS pixels.
Wider screens, landscape screens, and reduced motion show the homepage
immediately and skip the intro media requests.

On eligible screens, the supplied rooftop still is preloaded as WebP. The
video composites the transparent GIF onto the same rooftop. Both layers use
the same full-viewport crop. A subtle haze and the media share one fade.

| Playback time | What happens |
| --- | --- |
| 0–0.3 s | The still rooftop holds. |
| 0.3–2.3 s | The mist plays forward. |
| 2.3–3.3 s | The mist plays in reverse. |
| 3.3–3.8 s | The homepage fades in as the whole intro fades out. |
| 3.8–4.3 s | The homepage is fully visible while the intro finishes fading. |

The fades use the video clock. Escape, a change to an ineligible viewport, a
media error, or a four-second playback stall releases the homepage. The
homepage also works with JavaScript disabled.

To regenerate from the supplied still and GIF, use FFmpeg with libx264 and run:

```sh
node scripts/prepare-smoke-intro.mjs "/path/to/Empty Toronto rooftop under storm clouds.png" "/path/to/Toronto-Black-Mist-Reversed (2).gif"
node --experimental-strip-types --test tests/smoke-intro.test.mjs
```

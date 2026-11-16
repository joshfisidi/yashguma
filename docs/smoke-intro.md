# Toronto smoke intro

The rooftop intro runs in portrait viewports narrower than 640 CSS pixels.
Wider screens, landscape screens, and reduced motion show the homepage
immediately and skip the intro media requests.

On eligible screens, the supplied rooftop still is preloaded as WebP. A canvas
draws the animated mist from a transparent WebP sheet. The rooftop and mist share
the same full-viewport crop and fade softly at the top and bottom. The rooftop
fades independently over both passes to reveal the site background.

| Playback time | What happens |
| --- | --- |
| 0–0.3 s | The still rooftop holds. |
| 0.3–1.3 s | The figure appears from the mist in reverse. The rooftop starts fading. |
| 1.3–3.3 s | Forward playback begins. Motion fades the title, portrait, and controls in from top to bottom over 420 ms while the rooftop continues fading. |
| 3.3 s | The mist finishes and the intro layer is removed. |

The fades use the same clock as the mist animation. Escape, a change to an
ineligible viewport, a media error, or a four-second load timeout releases the homepage. The
homepage also works with JavaScript disabled.

Regenerate from the supplied still and WebP using FFmpeg with animated WebP decoding.

```sh
node scripts/prepare-smoke-intro.mjs "/path/to/Empty Toronto rooftop under storm clouds.png" "/path/to/Black-Mist-Transparent.webp"
node --experimental-strip-types --test tests/smoke-intro.test.mjs
```

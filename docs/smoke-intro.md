# Smoke entrance

The supplied transparent GIF is the animation source, unchanged in
`assets/source/yashguma-smoke.gif`. It contains 83 frames: 82 × 60 ms followed by
a 600 ms transparent end frame. Both complete passes last 5.52 seconds.

The homepage initially mounts under `visibility: hidden`, allowing its final
layout and images to load without flashing the cards or controls. Once the
atlases, portrait, fonts, and active card are ready, a canvas plays frames 82 → 0.
At the 5.52-second boundary it plays 0 → 82 while the entire page fades in on the
same clock. The background renderer starts only at this boundary. The overlay
then unmounts visually and releases its decoded image data. There is no loop.

Face positioning uses the current active card's rectangle and its object-cover
crop. The GIF face center (260, 128) aligns with the portrait face center
(374, 486). Scale is constrained to keep the full figure within the viewport.
Resize recalculates the placement without restarting playback.

Hidden tabs pause the clock. Reduced motion and Escape bypass the intro. Failed
image decoding or a 15-second preparation timeout reveal the usable page. A
noscript fallback makes the page visible when JavaScript is unavailable.

Preparation retains every source frame, its transparency, and its delay in four
384 × 576-per-frame WebP atlases. The full 8.1 MB source GIF is not downloaded by
site visitors. Decoded atlases are released after the intro. No runtime library
was added; the preparation script uses Sharp already installed through Next.js.

```sh
node scripts/prepare-smoke-intro.mjs
node --experimental-strip-types --test tests/smoke-intro.test.mjs
pnpm exec tsc --noEmit --incremental false
pnpm build
```

The previous walking companion, sprite sheet, motion controller, styles, tests,
and documentation have been removed.

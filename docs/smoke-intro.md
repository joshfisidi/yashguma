# Smoke entrance

The source GIF is `assets/source/yashguma-smoke.gif`. It contains 83 frames
with 82 frames at 60 ms followed by a 600 ms transparent end frame. Each pass
lasts 5.52 seconds.

The existing WebGL background runs from the start. A transparent canvas in the
homepage overlays it while the cards and controls are hidden. At the end of the
reverse pass, the canvas plays frames 0 → 82 and the content fades in on the same
clock. The overlay hides and releases its decoded image when playback finishes.

Face positioning uses the active card's crop and the visible eye and mouth in
both images. Those points determine scale, rotation, and placement. The figure
can extend beyond the screen edges to keep its face at the portrait's scale.
Resize recalculates the placement without restarting playback.

Hidden tabs pause the clock. Reduced motion and Escape bypass the intro. Failed
image decoding or a 15-second preparation timeout reveal the usable page. A
noscript fallback makes the page visible when JavaScript is unavailable.

The browser reads one 1.15 MB WebP sheet from the site. Each frame is 256 × 384
with alpha. The manifest preserves the original frame order and timing, and
the sheet filename includes a content hash so updated media can be cached by
URL. The original GIF is kept outside the public directory for regeneration.

```sh
node scripts/prepare-smoke-intro.mjs
node --experimental-strip-types --test tests/smoke-intro.test.mjs
pnpm exec tsc --noEmit --incremental false
pnpm build
```

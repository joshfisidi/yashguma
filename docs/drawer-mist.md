# Other drawer mist animation

Opening the Other drawer starts the transparent animation above its top edge.
The homepage loads immediately, and the sheet is requested only when needed.
Reduced motion skips playback. Closing the drawer stops playback; reopening starts it over.

The source starts with Yash Guma fully visible. The canvas reads the frame sheet
backward for two seconds to bring him in, then forward for one second to dissolve
him, fading to transparent over the final 320 ms.

Regenerate the optimized sheet from the original file using FFmpeg with animated
WebP decoding:

```sh
node scripts/prepare-drawer-mist.mjs "/path/to/Black-Mist-Transparent.webp"
node --experimental-strip-types --test tests/drawer-mist.test.mjs
```

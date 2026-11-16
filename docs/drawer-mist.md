# Other drawer mist animation

Opening the Other drawer starts the transparent animation above its top edge.
The portrait and homepage controls fade as the drawer opens. The title stays
in place, and the figure rises with the drawer.
The frame sheet loads on demand. Reduced motion shows a static figure.

The source starts with Yash Guma fully visible. The canvas reads the frame sheet
backward for two seconds and holds the formed figure while the drawer is open.
Closing the drawer plays forward for one second in the space above it, then
the portrait and homepage controls fade back in.

Regenerate the optimized sheet from the original file using FFmpeg with animated
WebP decoding:

```sh
node scripts/prepare-drawer-mist.mjs "/path/to/Black-Mist-Transparent.webp"
node --experimental-strip-types --test tests/drawer-mist.test.mjs
```

# Other drawer mist animation

Opening the Other drawer starts the transparent animation above its top edge.
The homepage content fades as the drawer opens, and the figure rises with the drawer.
The frame sheet loads on demand. Reduced motion shows a static figure.

The source starts with Yash Guma fully visible. The canvas reads the frame sheet
backward for two seconds to bring him in and holds the last frame while the drawer
is open. Paper's Liquid Metal shader uses that frame as its mask for a teal sheen.

Regenerate the optimized sheet from the original file using FFmpeg with animated
WebP decoding:

```sh
node scripts/prepare-drawer-mist.mjs "/path/to/Black-Mist-Transparent.webp"
node --experimental-strip-types --test tests/drawer-mist.test.mjs
```

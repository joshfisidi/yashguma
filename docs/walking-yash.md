# Walking Yash Guma

The homepage companion uses a transparent 4 × 2 walk atlas, a distance-driven gait,
short frame blends, acceleration/braking, and a 420 ms profile turn. Every third
journey continues offscreen, waits, and comes back. Controls in the bottom walking
lane get silhouette clearance; scrolling a control over the character fades it
out before it re-enters from an edge. A nearby mouse pauses it, and an open dialog
hides and pauses it. It cannot intercept clicks. Reduced motion hides the
companion; hidden tabs cancel its animation frame. No new runtime dependencies.

Asset: `public/characters/yashguma-walk.png` (1774 × 887 RGBA).
Created with the built-in image generation tool using the user's supplied side-profile photo.
The original generated alpha and image bytes are preserved.

Generation prompt:

> Create a production sprite atlas for a tiny walking website companion from the attached reference. Preserve this specific man's identity, messy black curly hair, black distressed hoodie with hands in pockets, baggy black cargo trousers and heavy black boots, photographic realism. Exactly 8 full-body side-profile walking poses, ALL FACING RIGHT. Layout MUST be exactly 4 equal columns by 2 equal rows, row-major sequence, no grid lines, no text. Transparent alpha background, no white background, no shadows. Every cell identical size with precisely the same body scale, same central hip anchor and same ground baseline; generous padding so full hair and boots stay within each cell. A complete natural relaxed walk cycle: frame1 left-leg forward contact, frame2 left weight down, frame3 right leg passing, frame4 right leg raised, frame5 right-leg forward contact, frame6 right weight down, frame7 left leg passing, frame8 left leg raised. Closed cycle frame8 flows back into frame1, distinct anatomically coherent leg positions. Torso and head remain near-identical with subtle vertical gait movement only. Character height fills 85 percent of each cell. Clean alpha edges around curls, legs and boots. The image is a 4-by-2 evenly spaced sprite sheet, not an illustration.

Checks (Node 22.6+):

```sh
node --experimental-strip-types --test tests/walker-motion.test.mjs
pnpm exec tsc --noEmit --incremental false
pnpm build
```

Browser checks: desktop and mobile walk visibility, direction changes, offscreen
return, short-viewport control avoidance, drawer pause/resume, reduced motion,
and absence of horizontal page overflow.

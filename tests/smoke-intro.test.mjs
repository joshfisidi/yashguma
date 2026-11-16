import test from "node:test";
import assert from "node:assert/strict";
import { INTRO_DURATION, introSample } from "../lib/smoke-intro-timeline.ts";

test("the wallpaper holds for 300 ms before one second in reverse and two seconds forward", () => {
  assert.equal(introSample(0).phase, "wallpaper");
  assert.equal(introSample(0.299).phase, "wallpaper");
  assert.equal(introSample(0.3).phase, "reverse");
  assert.equal(introSample(1.299).phase, "reverse");
  assert.equal(introSample(1.3).phase, "forward");
  assert.equal(introSample(3.299).phase, "forward");
  assert.equal(INTRO_DURATION, 3.3);
  assert.equal(introSample(INTRO_DURATION).mistProgress, 1);
});

test("the rooftop fades from mist onset through both passes", () => {
  assert.equal(introSample(0.299).wallpaperOpacity, 1);
  const reverse = introSample(0.8);
  const forward = introSample(2.3);
  assert.ok(reverse.wallpaperOpacity < 1 && reverse.wallpaperOpacity > forward.wallpaperOpacity);
  assert.ok(introSample(0.31).mistProgress > reverse.mistProgress);
  assert.ok(introSample(1.3).mistProgress < forward.mistProgress);
  assert.equal(introSample(3.3).wallpaperOpacity, 0);
});

test("the mist stays opaque through the reverse pass and dissipates at the end", () => {
  assert.equal(introSample(0.8).mistOpacity, 1);
  assert.equal(introSample(2.9).mistOpacity, 1);
  const midpoint = introSample(3.14);
  assert.ok(midpoint.mistOpacity > 0 && midpoint.mistOpacity < 0.5);
  assert.ok(introSample(3.24).mistOpacity < midpoint.mistOpacity);
  assert.equal(introSample(INTRO_DURATION).mistOpacity, 0);
});

import test from "node:test";
import assert from "node:assert/strict";
import { introSample } from "../lib/smoke-intro-timeline.ts";

test("the wallpaper holds for 300 ms before one second in reverse and two seconds forward", () => {
  assert.equal(introSample(0).phase, "wallpaper");
  assert.equal(introSample(0.299).phase, "wallpaper");
  assert.equal(introSample(0.3).phase, "reverse");
  assert.equal(introSample(1.299).phase, "reverse");
  assert.equal(introSample(1.3).phase, "forward");
  assert.equal(introSample(3.299).phase, "forward");
  assert.equal(introSample(3.3).phase, "fade");
});

test("the rooftop fades from mist onset through both passes independently of the haze", () => {
  assert.equal(introSample(0.299).wallpaperOpacity, 1);
  const reverse = introSample(0.8);
  const forward = introSample(2.3);
  assert.ok(reverse.wallpaperOpacity < 1 && reverse.wallpaperOpacity > forward.wallpaperOpacity);
  assert.equal(reverse.introOpacity, 1);
  assert.equal(forward.introOpacity, 1);
  assert.ok(introSample(0.31).mistProgress > reverse.mistProgress);
  assert.ok(introSample(1.3).mistProgress < forward.mistProgress);
  assert.equal(introSample(3.3).wallpaperOpacity, 0);
});

test("the haze takes one second to fade after the mist finishes", () => {
  assert.equal(introSample(3.3).introOpacity, 1);
  assert.equal(introSample(3.8).introOpacity, 0.5);
  assert.equal(introSample(4.3).introOpacity, 0);
});

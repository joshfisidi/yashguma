import test from "node:test";
import assert from "node:assert/strict";
import { introSample } from "../lib/smoke-intro-timeline.ts";

test("the wallpaper holds for 300 ms before two seconds forward and one second reverse", () => {
  assert.equal(introSample(0).phase, "wallpaper");
  assert.equal(introSample(0.299).phase, "wallpaper");
  assert.equal(introSample(0.3).phase, "forward");
  assert.equal(introSample(2.299).phase, "forward");
  assert.equal(introSample(2.3).phase, "reverse");
  assert.equal(introSample(3.299).phase, "reverse");
  assert.deepEqual(introSample(3.3), { phase: "fade", sceneOpacity: 0, introOpacity: 1 });
});

test("homepage fades in during the first half of the one-second intro fade", () => {
  const halfwayThroughReveal = introSample(3.55);
  assert.ok(Math.abs(halfwayThroughReveal.sceneOpacity - 0.5) < 0.00001);
  assert.ok(Math.abs(halfwayThroughReveal.introOpacity - 0.75) < 0.00001);
  assert.deepEqual(introSample(3.8), { phase: "fade", sceneOpacity: 1, introOpacity: 0.5 });
  assert.deepEqual(introSample(4.3), { phase: "fade", sceneOpacity: 1, introOpacity: 0 });
});

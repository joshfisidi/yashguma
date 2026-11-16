import test from "node:test";
import assert from "node:assert/strict";
import { introSample } from "../lib/smoke-intro-timeline.ts";

test("plays forward for two seconds and in reverse for one before the reveal", () => {
  assert.deepEqual(introSample(0), { phase: "forward", sceneOpacity: 0, videoOpacity: 1 });
  assert.equal(introSample(1.999).phase, "forward");
  assert.deepEqual(introSample(2), { phase: "reverse", sceneOpacity: 0, videoOpacity: 1 });
  assert.equal(introSample(2.999).phase, "reverse");
  assert.deepEqual(introSample(3), { phase: "fade", sceneOpacity: 0, videoOpacity: 1 });
});

test("the homepage fades in during the first half of the fourth second", () => {
  assert.deepEqual(introSample(3.25), { phase: "fade", sceneOpacity: 0.5, videoOpacity: 0.75 });
  assert.deepEqual(introSample(3.5), { phase: "fade", sceneOpacity: 1, videoOpacity: 0.5 });
  assert.deepEqual(introSample(4), { phase: "fade", sceneOpacity: 1, videoOpacity: 0 });
});

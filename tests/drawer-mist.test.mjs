import test from "node:test";
import assert from "node:assert/strict";
import { DRAWER_MIST_SECONDS, sampleDrawerMist } from "../lib/drawer-mist-timeline.ts";

test("reverse playback forms Yash over two seconds, then forward playback dissolves him in one", () => {
  assert.equal(sampleDrawerMist(0).progress, 1);
  assert.equal(sampleDrawerMist(1).progress, 0.5);
  assert.equal(sampleDrawerMist(2).progress, 0);
  assert.equal(sampleDrawerMist(2.5).progress, 0.5);
  assert.equal(DRAWER_MIST_SECONDS, 3);
  assert.equal(sampleDrawerMist(3).progress, 1);
});

test("opacity drops quickly at the end of the forward pass", () => {
  assert.equal(sampleDrawerMist(2).opacity, 1);
  assert.equal(sampleDrawerMist(2.67).opacity, 1);
  const midpoint = sampleDrawerMist(2.84).opacity;
  assert.ok(midpoint > 0 && midpoint < 0.5);
  assert.ok(sampleDrawerMist(2.94).opacity < midpoint);
  assert.equal(sampleDrawerMist(3).opacity, 0);
});

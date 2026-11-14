import assert from "node:assert/strict";
import test from "node:test";
import { advanceWalker, createWalker, travelCorridor } from "../lib/walker-motion.ts";

const mobile = { width: 390, size: 96, obstacles: [] };
function simulate(state, world, seconds, visit = () => {}, fps = 60) {
  for (let frame = 0; frame < seconds * fps; frame++) {
    advanceWalker(state, world, 1 / fps);
    visit(state);
  }
}

test("walks both directions, leaves each edge, and returns without a position jump", () => {
  const state = createWalker(mobile.size);
  let previous = state.x;
  const exits = new Set();
  const directions = new Set();
  let returned = false;
  simulate(state, mobile, 180, (current) => {
    assert.ok(Math.abs(current.x - previous) < 1);
    assert.ok(current.phase >= 0 && current.phase < 1);
    if (current.mode === "away") exits.add(current.x < 0 ? "left" : "right");
    if (current.x > 0 && current.x < mobile.width) {
      directions.add(current.direction);
      if (exits.size) returned = true;
    }
    previous = current.x;
  });
  assert.deepEqual([...exits].sort(), ["left", "right"]);
  assert.equal(directions.size, 2);
  assert.ok(returned);
});

test("brakes and turns before a control with the full silhouette clearance", () => {
  const world = { ...mobile, obstacles: [{ left: 190, right: 270 }] };
  const state = createWalker(world.size);
  let turned = false;
  simulate(state, world, 40, (current) => {
    assert.ok(current.x <= 190 - world.size * 0.32 - 12);
    assert.equal(travelCorridor(current.x, world).covered, false);
    if (current.direction < 0) turned = true;
  });
  assert.ok(turned);
});

test("a control scrolled over the character freezes its movement", () => {
  const state = createWalker(mobile.size);
  state.x = 180;
  const world = { ...mobile, obstacles: [{ left: 160, right: 220 }] };
  const snapshot = { ...state };
  simulate(state, world, 5);
  assert.deepEqual(state, snapshot);
});

test("turn tween crosses smoothly through profile while feet stay planted", () => {
  const state = { ...createWalker(mobile.size), x: 300, mode: "turn", timer: 0.42 };
  advanceWalker(state, mobile, 0.05);
  assert.ok(state.facing < 1 && state.facing > 0);
  while (state.mode === "turn") {
    advanceWalker(state, mobile, 1 / 60);
    assert.equal(state.x, 300);
  }
  assert.equal(state.direction, -1);
  assert.equal(state.facing, -1);
  assert.equal(state.x, 300);
});

test("gait follows distance and a long suspended frame cannot teleport the character", () => {
  const state = createWalker(mobile.size);
  const start = state.x;
  advanceWalker(state, mobile, 30);
  assert.ok(state.x - start < 2);
  assert.ok(Math.abs(state.phase - (state.x - start) / (mobile.size * 0.52)) < 0.00001);
});

test("travel is consistent on 30Hz and 120Hz displays", () => {
  const slow = createWalker(mobile.size);
  const fast = createWalker(mobile.size);
  simulate(slow, mobile, 5, undefined, 30);
  simulate(fast, mobile, 5, undefined, 120);
  assert.ok(Math.abs(slow.x - fast.x) < 1);
});

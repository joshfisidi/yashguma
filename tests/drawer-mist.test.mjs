import test from "node:test";
import assert from "node:assert/strict";
import { DRAWER_MIST_SECONDS, drawerMistProgress } from "../lib/drawer-mist-timeline.ts";

test("reverse playback forms Yash over two seconds and holds on the finished frame", () => {
  assert.equal(drawerMistProgress(0), 1);
  assert.equal(drawerMistProgress(1), 0.5);
  assert.equal(DRAWER_MIST_SECONDS, 2);
  assert.equal(drawerMistProgress(2), 0);
  assert.equal(drawerMistProgress(3), 0);
});

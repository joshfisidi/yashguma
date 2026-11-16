import test from "node:test";
import assert from "node:assert/strict";
import { drawerMistProgress } from "../lib/drawer-mist-timeline.ts";

test("reverse playback forms Yash over two seconds and holds on the finished frame", () => {
  assert.equal(drawerMistProgress(0, 1, true), 1);
  assert.equal(drawerMistProgress(1, 1, true), 0.5);
  assert.equal(drawerMistProgress(2, 1, true), 0);
  assert.equal(drawerMistProgress(3, 1, true), 0);
});

test("closing plays forward from the currently displayed frame", () => {
  assert.equal(drawerMistProgress(0, 0, false), 0);
  assert.equal(drawerMistProgress(0.5, 0, false), 0.5);
  assert.equal(drawerMistProgress(1, 0, false), 1);
  assert.equal(drawerMistProgress(0, 0.5, false), 0.5);
  assert.equal(drawerMistProgress(0.5, 0.5, false), 1);
});

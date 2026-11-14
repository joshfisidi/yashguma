import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { introSample, alignIntroFace } from "../lib/smoke-intro-timeline.ts";
const data = JSON.parse(readFileSync(new URL("../lib/smoke-intro-data.json", import.meta.url)));

test("manifest matches the source GIF and the versioned playback file", () => {
  const source = readFileSync(new URL("../assets/source/yashguma-smoke.gif", import.meta.url));
  assert.equal(createHash("sha256").update(source).digest("hex"), data.sourceSha256);
  assert.equal(data.delays.length, 83);
  assert.equal(data.delays.reduce((a, b) => a + b, 0), 5520);
  assert.equal(data.delays.at(-1), 600);
  assert.equal(data.sheets.length, 1);
  const sheet = readFileSync(new URL(`../public${data.sheets[0]}`, import.meta.url));
  const hash = createHash("sha256").update(sheet).digest("hex").slice(0, 12);
  assert.equal(data.sheets[0], `/intro/yashguma-smoke-${hash}.webp`);
});

test("every reverse frame is visited in exact order before the page content fades in", () => {
  let elapsed = 0;
  for (let frame = 82; frame >= 0; frame--) {
    const sample = introSample(elapsed + data.delays[frame] / 2, data.delays);
    assert.equal(sample.frame, frame);
    assert.equal(sample.phase, "reverse");
    assert.equal(sample.reveal, 0);
    elapsed += data.delays[frame];
  }
});

test("forward pass starts at the same face frame and reveals the page concurrently", () => {
  assert.equal(introSample(5519, data.delays).frame, 0);
  assert.deepEqual(introSample(5520, data.delays), { phase: "forward", frame: 0, reveal: 0 });
  let elapsed = 5520;
  let previous = 0;
  for (let frame = 0; frame < 83; frame++) {
    const sample = introSample(elapsed + data.delays[frame] / 2, data.delays);
    assert.equal(sample.frame, frame);
    assert.equal(sample.phase, "forward");
    assert.ok(sample.reveal >= previous);
    previous = sample.reveal;
    elapsed += data.delays[frame];
  }
  assert.equal(introSample(11040, data.delays).phase, "complete");
  assert.equal(introSample(999999, data.delays).reveal, 1);
});

test("reverse playback preserves variable frame delays instead of assuming a frame rate", () => {
  const delays = [40, 90, 200];
  assert.equal(introSample(199, delays).frame, 2);
  assert.equal(introSample(200, delays).frame, 1);
  assert.equal(introSample(289, delays).frame, 1);
  assert.equal(introSample(290, delays).frame, 0);
  assert.equal(introSample(330, delays).phase, "forward");
});

test("the enlarged overlay aligns both the eye and mouth across portrait crops", () => {
  for (const card of [
    { left: 75, top: 100, width: 240, height: 300 },
    { left: 568, top: 223, width: 304, height: 380 },
    { left: 40, top: 96, width: 240, height: 300 },
  ]) {
    const result = alignIntroFace(card);
    const portraitScale = card.width / 724;
    const cropTop = card.top + (card.height - 1086 * portraitScale) / 2;
    const scale = result.width / 512;
    const eyeX = result.left + 275 * scale;
    const eyeY = result.top + 104 * scale;
    assert.ok(Math.abs(eyeX - (card.left + 431 * portraitScale)) < 0.01);
    assert.ok(Math.abs(eyeY - (cropTop + 410 * portraitScale)) < 0.01);
    const mouthX = eyeX + (-12 * Math.cos(result.rotation) - 28 * Math.sin(result.rotation)) * scale;
    const mouthY = eyeY + (-12 * Math.sin(result.rotation) + 28 * Math.cos(result.rotation)) * scale;
    assert.ok(Math.abs(mouthX - (card.left + 380 * portraitScale)) < 0.01);
    assert.ok(Math.abs(mouthY - (cropTop + 543 * portraitScale)) < 0.01);
    assert.ok(result.width > card.width * 3);
  }
});

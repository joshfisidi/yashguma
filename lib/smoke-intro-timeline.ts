export function introSample(elapsed: number, delays: readonly number[]) {
  const duration = delays.reduce((total, delay) => total + delay, 0);
  if (elapsed >= duration * 2) return { phase: "complete" as const, frame: delays.length - 1, reveal: 1 };
  const reverse = elapsed < duration;
  let remaining = Math.max(0, reverse ? elapsed : elapsed - duration);
  let frame = reverse ? delays.length - 1 : 0;
  while (remaining >= delays[frame]) {
    remaining -= delays[frame];
    frame += reverse ? -1 : 1;
  }
  const progress = reverse ? 0 : Math.min(1, (elapsed - duration) / duration);
  return {
    phase: reverse ? "reverse" as const : "forward" as const,
    frame,
    reveal: progress * progress * (3 - 2 * progress),
  };
}

export type PortraitBounds = { left: number; top: number; width: number; height: number };

// Face centers measured in the supplied GIF and the existing uncropped portrait.
// Account for the card's object-cover crop rather than aligning bounding-box centers.
export function alignIntroFace(card: PortraitBounds, viewportHeight: number, viewportWidth: number) {
  const portraitScale = Math.max(card.width / 724, card.height / 1086);
  const faceX = card.left + (card.width - 724 * portraitScale) / 2 + 374 * portraitScale;
  const faceY = card.top + (card.height - 1086 * portraitScale) / 2 + 486 * portraitScale;
  const idealScale = 225 * portraitScale / 72;
  const scale = Math.max(0.1, Math.min(idealScale,
    (viewportHeight - 12 - faceY) / (768 - 128), (faceY - 12) / 128,
    (faceX - 12) / 260, (viewportWidth - 12 - faceX) / (512 - 260)));
  return { left: faceX - 260 * scale, top: faceY - 128 * scale, width: 512 * scale, height: 768 * scale, faceX, faceY };
}

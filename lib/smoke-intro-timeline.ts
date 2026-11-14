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

// Visible eye and mouth landmarks on the intact GIF frame and uncropped portrait.
const introEye = { x: 278, y: 104 };
const introMouth = { x: 263, y: 134 };
const portraitEye = { x: 431, y: 410 };
const portraitMouth = { x: 380, y: 543 };

export function alignIntroFace(card: PortraitBounds) {
  const portraitScale = Math.max(card.width / 724, card.height / 1086);
  const cropLeft = card.left + (card.width - 724 * portraitScale) / 2;
  const cropTop = card.top + (card.height - 1086 * portraitScale) / 2;
  const targetX = cropLeft + portraitEye.x * portraitScale;
  const targetY = cropTop + portraitEye.y * portraitScale;

  const introDx = introMouth.x - introEye.x;
  const introDy = introMouth.y - introEye.y;
  const portraitDx = portraitMouth.x - portraitEye.x;
  const portraitDy = portraitMouth.y - portraitEye.y;
  const scale = Math.hypot(portraitDx, portraitDy) / Math.hypot(introDx, introDy) * portraitScale;
  const rotation = Math.atan2(portraitDy, portraitDx) - Math.atan2(introDy, introDx);

  return {
    left: targetX - introEye.x * scale,
    top: targetY - introEye.y * scale,
    width: 512 * scale,
    height: 768 * scale,
    transformOrigin: `${introEye.x * scale}px ${introEye.y * scale}px`,
    rotation,
  };
}

const APPEAR_SECONDS = 2;
const FADE_SECONDS = 0.32;
export const DRAWER_MIST_SECONDS = APPEAR_SECONDS + 1;

export function sampleDrawerMist(seconds: number) {
  const elapsed = Math.min(DRAWER_MIST_SECONDS, Math.max(0, seconds));
  // The source starts with Yash fully formed and ends with the mist gone.
  const progress = elapsed < APPEAR_SECONDS ? 1 - elapsed / APPEAR_SECONDS : elapsed - APPEAR_SECONDS;
  const opacity = Math.min(1, (DRAWER_MIST_SECONDS - elapsed) / FADE_SECONDS) ** 2;
  return { progress, opacity };
}

export const DRAWER_MIST_SECONDS = 2;

export function drawerMistProgress(seconds: number) {
  // The source starts with Yash fully formed and ends with the mist gone.
  return 1 - Math.min(1, Math.max(0, seconds / DRAWER_MIST_SECONDS));
}

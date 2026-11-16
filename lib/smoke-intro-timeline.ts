const WALLPAPER_HOLD = 0.3;
const FORWARD_START = 1.3;
const MIST_FADE_DURATION = 0.32;
export const INTRO_DURATION = 3.3;

export function introSample(seconds: number) {
  if (seconds < WALLPAPER_HOLD) {
    return { phase: "wallpaper", mistProgress: 1, mistOpacity: 1, wallpaperOpacity: 1 } as const;
  }

  const elapsed = Math.min(seconds, INTRO_DURATION);
  const reversing = elapsed < FORWARD_START;
  const fadeRemaining = Math.min(1, (INTRO_DURATION - elapsed) / MIST_FADE_DURATION);
  return {
    phase: reversing ? "reverse" as const : "forward" as const,
    mistProgress: reversing ? FORWARD_START - elapsed : (elapsed - FORWARD_START) / (INTRO_DURATION - FORWARD_START),
    mistOpacity: fadeRemaining ** 2,
    wallpaperOpacity: 1 - (elapsed - WALLPAPER_HOLD) / (INTRO_DURATION - WALLPAPER_HOLD),
  };
}

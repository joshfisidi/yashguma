const WALLPAPER_HOLD = 0.3;
const FORWARD_START = 1.3;
const FADE_START = 3.3;
export const INTRO_DURATION = 4.3;

export function introSample(seconds: number) {
  if (seconds < WALLPAPER_HOLD) {
    return { phase: "wallpaper", mistProgress: 1, wallpaperOpacity: 1, sceneOpacity: 0, introOpacity: 1 } as const;
  }
  if (seconds < FADE_START) {
    const wallpaperOpacity = 1 - (seconds - WALLPAPER_HOLD) / (FADE_START - WALLPAPER_HOLD);
    const reversing = seconds < FORWARD_START;
    const mistProgress = reversing ? FORWARD_START - seconds : (seconds - FORWARD_START) / 2;
    return { phase: reversing ? "reverse" as const : "forward" as const, mistProgress, wallpaperOpacity, sceneOpacity: 0, introOpacity: 1 };
  }

  const fade = seconds >= INTRO_DURATION ? 1 : seconds - FADE_START;
  const reveal = seconds >= 3.8 ? 1 : fade * 2;
  return {
    phase: "fade" as const,
    mistProgress: 1,
    wallpaperOpacity: 0,
    sceneOpacity: reveal * reveal * (3 - 2 * reveal),
    introOpacity: 1 - fade,
  };
}

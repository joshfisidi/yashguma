// The video encodes the wallpaper hold, forward and reverse motion, then a still.
// Use the media clock so the fades stay synchronized if playback buffers.
export function introSample(seconds: number) {
  if (seconds < 0.3) return { phase: "wallpaper", sceneOpacity: 0, introOpacity: 1 } as const;
  if (seconds < 2.3) return { phase: "forward", sceneOpacity: 0, introOpacity: 1 } as const;
  if (seconds < 3.3) return { phase: "reverse", sceneOpacity: 0, introOpacity: 1 } as const;

  const fade = seconds >= 4.3 ? 1 : seconds - 3.3;
  const reveal = seconds >= 3.8 ? 1 : fade * 2;
  return {
    phase: "fade" as const,
    sceneOpacity: reveal * reveal * (3 - 2 * reveal),
    introOpacity: 1 - fade,
  };
}

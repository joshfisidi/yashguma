// The video encodes two seconds forward, one second in reverse, then a still.
// Use the media clock so the fades stay synchronized if playback buffers.
export function introSample(seconds: number) {
  if (seconds < 2) return { phase: "forward", sceneOpacity: 0, videoOpacity: 1 } as const;
  if (seconds < 3) return { phase: "reverse", sceneOpacity: 0, videoOpacity: 1 } as const;

  const fade = Math.min(1, seconds - 3);
  const reveal = Math.min(1, fade * 2);
  return {
    phase: "fade" as const,
    sceneOpacity: reveal * reveal * (3 - 2 * reveal),
    videoOpacity: 1 - fade,
  };
}

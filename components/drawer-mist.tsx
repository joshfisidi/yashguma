"use client";

import { useEffect, useRef } from "react";
import data from "@/lib/drawer-mist-data.json";
import { DRAWER_MIST_SECONDS, sampleDrawerMist } from "@/lib/drawer-mist-timeline";

export function DrawerMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { width, height, columns, frames, atlasPath } = data;
    const atlas = new Image();
    let cancelled = false;
    let requestId = 0;
    let startedAt: number | undefined;
    let lastFrame = -1;

    canvas.hidden = false;
    canvas.style.removeProperty("opacity");

    const tick = (now: number) => {
      startedAt ??= now;
      const seconds = (now - startedAt) / 1000;
      if (seconds >= DRAWER_MIST_SECONDS) {
        canvas.hidden = true;
        context.clearRect(0, 0, width, height);
        atlas.removeAttribute("src");
        return;
      }

      const { progress, opacity } = sampleDrawerMist(seconds);
      const index = Math.round(progress * (frames - 1));
      if (index !== lastFrame) {
        context.clearRect(0, 0, width, height);
        context.drawImage(atlas, (index % columns) * width, Math.floor(index / columns) * height, width, height, 0, 0, width, height);
        lastFrame = index;
      }
      if (opacity < 1) canvas.style.opacity = String(opacity);
      requestId = requestAnimationFrame(tick);
    };

    atlas.src = atlasPath;
    void atlas.decode().then(() => {
      if (!cancelled) requestId = requestAnimationFrame(tick);
    }).catch(() => {
      if (!cancelled) canvas.hidden = true;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(requestId);
      atlas.removeAttribute("src");
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      data-slot="drawer-mist"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-full left-1/2 mb-2 h-[min(9rem,20svh)] w-auto -translate-x-1/2"
      width={data.width}
      height={data.height}
    />
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import data from "@/lib/drawer-mist-data.json";
import { DRAWER_MIST_SECONDS, drawerMistProgress } from "@/lib/drawer-mist-timeline";

const DrawerMistMetal = dynamic(() => import("./drawer-mist-metal"), { ssr: false });

export function DrawerMist({ open, reduceMotion }: { open: boolean; reduceMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [metalMask, setMetalMask] = useState("");

  useEffect(() => {
    if (!open) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const { width, height, columns, frames, atlasPath } = data;
    setLoaded(false);
    setMetalMask("");
    context.clearRect(0, 0, width, height);

    const atlas = new Image();
    let cancelled = false;
    let requestId = 0;
    let startedAt: number | undefined;
    let lastFrame = -1;

    const drawFrame = (index: number) => {
      if (index === lastFrame) return;
      context.clearRect(0, 0, width, height);
      const x = (index % columns) * width;
      const y = Math.floor(index / columns) * height;
      context.drawImage(atlas, x, y, width, height, 0, 0, width, height);
      lastFrame = index;
    };

    const tick = (now: number) => {
      startedAt ??= now;
      const seconds = (now - startedAt) / 1000;
      const progress = drawerMistProgress(seconds);
      const index = Math.round(progress * (frames - 1));
      drawFrame(index);
      if (seconds < DRAWER_MIST_SECONDS) {
        requestId = requestAnimationFrame(tick);
      } else {
        // The held frame supplies the shader's silhouette and stays visible underneath.
        setMetalMask(canvas.toDataURL());
        atlas.removeAttribute("src");
      }
    };

    atlas.src = atlasPath;
    void atlas.decode().then(() => {
      if (cancelled) return;
      setLoaded(true);
      if (reduceMotion) {
        drawFrame(0);
        atlas.removeAttribute("src");
      } else {
        requestId = requestAnimationFrame(tick);
      }
    }).catch(() => {
      if (!cancelled) setLoaded(false);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(requestId);
      atlas.removeAttribute("src");
    };
  }, [open, reduceMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-full left-1/2 mb-2 aspect-[162/242] h-[var(--drawer-figure-height)] -translate-x-1/2"
    >
      <motion.div
        data-slot="drawer-figure"
        className="relative h-full w-full origin-bottom"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.86, y: 5 }}
        animate={{ opacity: open && loaded ? 1 : 0, scale: open ? 1 : 0.86, y: open ? -4 : 5 }}
        transition={{
          type: "tween",
          duration: reduceMotion ? 0 : open ? 0.9 : 0.24,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: reduceMotion ? 0 : 0.24 },
        }}
      >
        <div className="absolute -inset-x-10 -inset-y-4 bg-[radial-gradient(ellipse_at_50%_46%,#153c54ba_0%,#0e243a7a_36%,transparent_70%)]" />
        <canvas
          ref={canvasRef}
          data-slot="drawer-mist"
          className="relative block h-full w-full drop-shadow-[0_0_8px_#285c7499]"
          width={data.width}
          height={data.height}
        />
        {metalMask && !reduceMotion && <DrawerMistMetal image={metalMask} active={open} />}
      </motion.div>
    </div>
  );
}

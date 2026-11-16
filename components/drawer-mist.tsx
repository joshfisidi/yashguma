"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue } from "motion/react";
import data from "@/lib/drawer-mist-data.json";
import { drawerMistProgress } from "@/lib/drawer-mist-timeline";

const { width, height, columns, frames, atlasPath } = data;

export function DrawerMist({ drawerRef, open, reduceMotion, visible, onVisibilityChange }: {
  drawerRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  reduceMotion: boolean;
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef(1);
  const [atlas, setAtlas] = useState<HTMLImageElement | null>(null);
  const drawerTop = useMotionValue(0);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (!open) return;

    let frame = 0;
    const followDrawer = () => {
      const drawer = drawerRef.current;
      if (drawer) drawerTop.set(drawer.getBoundingClientRect().top);
      frame = requestAnimationFrame(followDrawer);
    };
    followDrawer();

    // Keep the last position when the drawer closes so the dissolve stays on screen.
    return () => cancelAnimationFrame(frame);
  }, [open, drawerRef, drawerTop]);

  useEffect(() => {
    if (!open || atlas) return;

    const image = new Image();
    let cancelled = false;
    image.src = atlasPath;
    void image.decode().then(() => {
      if (!cancelled) setAtlas(image);
    }).catch(() => {
      // The drawer stays usable if the decorative animation cannot load.
    });

    return () => { cancelled = true; };
  }, [open, atlas]);

  useEffect(() => {
    if (!open && reduceMotion) {
      progress.current = 1;
      opacity.set(0);
      onVisibilityChange(false);
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!atlas || !context) return;

    const from = progress.current;
    const target = open ? 0 : 1;
    let requestId = 0;
    let startedAt: number | undefined;
    let lastFrame = -1;

    const paint = (value: number) => {
      progress.current = value;
      opacity.set(Math.min(1, (1 - value) / 0.18));
      const index = Math.round(value * (frames - 1));
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
      const value = drawerMistProgress(seconds, from, open);
      paint(value);
      if (value !== target) {
        requestId = requestAnimationFrame(tick);
      } else if (!open) {
        onVisibilityChange(false);
      }
    };

    if (reduceMotion || from === target) {
      paint(target);
      onVisibilityChange(open && !reduceMotion);
      return;
    }

    // Keep the portal mounted after close so the current frame can dissolve naturally.
    if (open) onVisibilityChange(true);
    paint(from);
    requestId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestId);
  }, [open, reduceMotion, atlas, opacity, onVisibilityChange]);

  if (!open && !visible) return null;

  return createPortal(
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[51]"
      style={{ y: drawerTop }}
    >
      <div className="absolute bottom-full left-1/2 mb-2 aspect-[162/242] h-[min(10.5rem,22svh)] -translate-x-1/2">
        <motion.div
          data-slot="drawer-figure"
          className="relative h-full w-full origin-bottom"
          initial={reduceMotion ? false : { scale: 0.86, y: 5 }}
          animate={{ scale: 1, y: -4 }}
          style={{ opacity }}
          transition={{ type: "tween", duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute -inset-x-10 -inset-y-4 bg-[radial-gradient(ellipse_closest-side_at_50%_48%,#153c546b_0%,#0e243a45_52%,transparent_100%)]" />
          <div className="relative h-full w-full [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <canvas
              ref={canvasRef}
              data-slot="drawer-mist"
              className="block h-full w-full [mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
              width={width}
              height={height}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  );
}

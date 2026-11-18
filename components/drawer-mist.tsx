"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue } from "motion/react";
import data from "@/lib/drawer-mist-data.json";
import { drawerMistProgress } from "@/lib/drawer-mist-timeline";

const { variants } = data;
type Variant = (typeof variants)[number];
type Atlas = { image: HTMLImageElement; variant: Variant; formed: HTMLImageElement | null };

async function loadImage(path: string) {
  const image = new Image();
  image.src = path;
  await image.decode();
  return image;
}

export function DrawerMist({ drawerRef, open, reduceMotion, visible, onVisibilityChange }: {
  drawerRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  reduceMotion: boolean;
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const progress = useRef(1);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const drawerTop = useMotionValue(0);
  const opacity = useMotionValue(0);

  useEffect(() => {
    if (!open) return;

    const title = document.getElementById("artist-name");
    let lastRoom = -1;
    let frame = 0;
    const followDrawer = () => {
      const drawer = drawerRef.current;
      if (drawer && figureRef.current) {
        drawerTop.set(drawer.getBoundingClientRect().top);
        // Use the drawer's resting position so dragging moves the figure without resizing it.
        const titleBottom = Math.max(0, title?.getBoundingClientRect().bottom ?? 0);
        const room = Math.max(0, Math.floor(window.innerHeight - drawer.offsetHeight - titleBottom - 24));
        if (room !== lastRoom) {
          figureRef.current.style.setProperty("--drawer-room", `${room}px`);
          lastRoom = room;
        }
      }
      frame = requestAnimationFrame(followDrawer);
    };
    followDrawer();

    // Keep the last position when the drawer closes so the dissolve stays on screen.
    return () => cancelAnimationFrame(frame);
  }, [open, drawerRef, drawerTop]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!open || !figure) return;

    let requested: Variant | undefined;
    const selectAtlas = () => {
      const target = figure.clientHeight * window.devicePixelRatio;
      if (target <= 0) return;
      const variant = variants.find((candidate) => candidate.height >= target) ?? variants[variants.length - 1];
      if (variant === requested) return;
      // Keep the current sheet near a boundary during small viewport changes.
      if (requested && variant.height < requested.height && target > variant.height * 0.9) return;
      requested = variant;

      const formed = variant === variants[variants.length - 1]
        ? loadImage(data.formedPath).catch(() => null)
        : null;
      void Promise.all([loadImage(variant.atlasPath), formed]).then(([image, formed]) => {
        if (requested === variant) {
          setAtlas((previous) => previous?.variant === variant ? previous : { image, variant, formed });
        }
      }).catch(() => {
        // Keep the current frame sheet if the replacement cannot load.
      });
    };

    const observer = new ResizeObserver(selectAtlas);
    observer.observe(figure);
    window.addEventListener("resize", selectAtlas);
    return () => {
      requested = undefined;
      observer.disconnect();
      window.removeEventListener("resize", selectAtlas);
    };
  }, [open]);

  useEffect(() => {
    if (!open && reduceMotion) {
      progress.current = 1;
      opacity.set(0);
      onVisibilityChange(false);
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!atlas || !context || !canvas) return;

    const { width, height, columns, frames } = atlas.variant;
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

      context.clearRect(0, 0, canvas.width, canvas.height);
      const x = (index % columns) * width;
      const y = Math.floor(index / columns) * height;
      if (index === 0 && atlas.formed) {
        context.drawImage(atlas.formed, 0, 0, canvas.width, canvas.height);
      } else {
        context.drawImage(atlas.image, x, y, width, height, 0, 0, canvas.width, canvas.height);
      }
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
      <div ref={figureRef} className="absolute bottom-full left-1/2 mb-2 aspect-[2/3] h-[min(var(--drawer-figure-height),var(--drawer-room,100svh))] -translate-x-1/2">
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
              width={atlas?.formed?.naturalWidth ?? atlas?.variant.width ?? variants[0].width}
              height={atlas?.formed?.naturalHeight ?? atlas?.variant.height ?? variants[0].height}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { stagger, useAnimate } from "motion/react";
import data from "@/lib/smoke-intro-data.json";
import { INTRO_DURATION, introSample } from "@/lib/smoke-intro-timeline";
import styles from "./smoke-reveal.module.css";

const INTRO_MEDIA = "(max-width: 639px) and (orientation: portrait) and (prefers-reduced-motion: no-preference)";

export function SmokeReveal({ children, onReveal }: { children: ReactNode; onReveal: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sceneRef, animateItems] = useAnimate<HTMLDivElement>();
  const wallpaperRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const wallpaper = wallpaperRef.current;
    const canvas = canvasRef.current;
    if (!root || !scene || !wallpaper || !canvas) return;

    const introMedia = window.matchMedia(INTRO_MEDIA);
    const context = introMedia.matches ? canvas.getContext("2d") : null;
    if (!context) {
      root.dataset.introPhase = "complete";
      revealRef.current();
      return;
    }

    const atlas = new Image();
    let finished = false;
    let revealed = false;
    let animationFrame = 0;
    let lastFrame = -1;
    let startedAt = 0;
    let entrance: ReturnType<typeof animateItems> | undefined;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      revealRef.current();
    };

    const stop = () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(animationFrame);
      introMedia.removeEventListener("change", viewportChange);
      document.removeEventListener("keydown", escape);
      atlas.removeAttribute("src");
      context.clearRect(0, 0, data.width, data.height);
      scene.inert = false;
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      root.dataset.introPhase = "complete";
      entrance?.complete();
      stop();
      reveal();
    };

    const tick = (now: number) => {
      const seconds = Math.max(0, (now - startedAt) / 1000);
      if (seconds >= INTRO_DURATION) {
        finish();
        return;
      }

      const sample = introSample(seconds);
      if (root.dataset.introPhase !== sample.phase) {
        root.dataset.introPhase = sample.phase;
        if (sample.phase === "forward") {
          entrance = animateItems("[data-intro-item]", { opacity: [0, 1], y: [6, 0] }, {
            duration: 0.28,
            delay: stagger(0.07),
            ease: [0.22, 1, 0.36, 1],
          });
          scene.inert = false;
          reveal();
        }
      }
      wallpaper.style.opacity = String(sample.wallpaperOpacity);

      if (sample.phase !== "wallpaper") {
        if (sample.mistOpacity < 1) canvas.style.opacity = String(sample.mistOpacity);
        const frameIndex = Math.round(sample.mistProgress * (data.frames - 1));
        if (frameIndex !== lastFrame) {
          const x = (frameIndex % data.columns) * data.width;
          const y = Math.floor(frameIndex / data.columns) * data.height;
          context.clearRect(0, 0, data.width, data.height);
          context.drawImage(atlas, x, y, data.width, data.height, 0, 0, data.width, data.height);
          lastFrame = frameIndex;
        }
      }

      animationFrame = requestAnimationFrame(tick);
    };

    const viewportChange = () => { if (!introMedia.matches) finish(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };

    scene.inert = true;
    root.dataset.introPhase = "loading";
    wallpaper.style.removeProperty("opacity");
    canvas.style.removeProperty("opacity");
    introMedia.addEventListener("change", viewportChange);
    document.addEventListener("keydown", escape);
    const timeout = window.setTimeout(finish, 4000);

    atlas.src = data.atlasPath;
    const wallpaperReady = wallpaper.decode().then(() => performance.now());
    void Promise.all([wallpaperReady, atlas.decode()]).then(([wallpaperReadyAt]) => {
      if (finished) return;
      window.clearTimeout(timeout);
      // Time already spent looking at the rooftop counts toward the opening hold.
      startedAt = Math.max(wallpaperReadyAt, performance.now() - 300);
      animationFrame = requestAnimationFrame(tick);
    }).catch(finish);

    return () => {
      finished = true;
      stop();
    };
  }, [animateItems, sceneRef]);

  return (
    <div ref={rootRef} data-intro-phase="loading">
      <link rel="preload" as="image" href={data.posterPath} fetchPriority="high" media={INTRO_MEDIA} />
      <div ref={sceneRef} className={styles.scene} data-smoke-scene>{children}</div>
      <div className={styles.stage} data-smoke-overlay aria-hidden="true">
        <picture>
          <source srcSet={data.posterPath} media={INTRO_MEDIA} />
          {/* The responsive source is the only wallpaper request. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={wallpaperRef} className={styles.wallpaper} alt="" fetchPriority="high" />
        </picture>
        <canvas ref={canvasRef} className={styles.media} width={data.width} height={data.height} />
      </div>
      <noscript><style>{`[data-smoke-scene]{opacity:1!important;visibility:visible!important}[data-smoke-overlay]{display:none!important}`}</style></noscript>
    </div>
  );
}

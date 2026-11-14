"use client";

import { useEffect, useRef, type ReactNode } from "react";
import data from "@/lib/smoke-intro-data.json";
import { alignIntroFace, introSample } from "@/lib/smoke-intro-timeline";
import styles from "./smoke-reveal.module.css";

export function SmokeReveal({ children, onReveal }: { children: ReactNode; onReveal: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!root || !scene || !canvas) return;
    const ctx = canvas.getContext("2d");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let finished = false;
    let revealed = false;
    let raf = 0;
    let elapsed = 0;
    let lastTime = 0;
    let lastFrame = -1;
    let dirtyLayout = true;
    let playing = false;
    let phase = "loading";
    const images: HTMLImageElement[] = [];
    const watchdog = window.setTimeout(finish, 15000);

    function reveal() {
      if (!revealed) {
        revealed = true;
        revealRef.current();
      }
    }
    function finish() {
      if (disposed || finished) return;
      finished = true;
      playing = false;
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
      root!.dataset.introPhase = "complete";
      scene!.inert = false;
      // Release decoded atlas memory as soon as the one-shot intro ends.
      images.forEach((image) => { image.src = ""; });
      images.length = 0;
      canvas!.width = canvas!.height = 0;
      reveal();
    }
    if (!ctx || motion.matches) {
      finish();
      return () => { disposed = true; clearTimeout(watchdog); };
    }
    const context = ctx;
    scene.inert = true;

    function align() {
      const card = scene!.querySelector<HTMLElement>(".swiper-slide-active [data-portrait-anchor]");
      if (!card) return false;
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return false;
      const origin = root!.getBoundingClientRect();
      const geometry = alignIntroFace({
        left: bounds.left - origin.left,
        top: bounds.top - origin.top,
        width: bounds.width,
        height: bounds.height,
      }, window.innerHeight, root!.clientWidth);
      canvas!.style.left = `${geometry.left}px`;
      canvas!.style.top = `${geometry.top}px`;
      canvas!.style.width = `${geometry.width}px`;
      canvas!.style.height = `${geometry.height}px`;
      // The source resolution is the useful upper limit, even on a retina screen.
      canvas!.width = data.width;
      canvas!.height = data.height;
      dirtyLayout = false;
      lastFrame = -1;
      return true;
    }

    function tick(now: number) {
      if (disposed || finished || document.hidden) return;
      if (dirtyLayout) align();
      // Preserve the timeline across tab suspension without skipping either pass.
      if (lastTime) elapsed += Math.min(now - lastTime, 100);
      lastTime = now;
      const sample = introSample(elapsed, data.delays);
      if (sample.phase === "complete") { finish(); return; }
      if (phase !== sample.phase) {
        phase = sample.phase;
        root!.dataset.introPhase = phase;
        if (phase === "forward") reveal();
      }
      if (sample.phase === "forward") scene!.style.setProperty("--intro-reveal", String(sample.reveal));
      if (sample.frame !== lastFrame) {
        const sheet = Math.floor(sample.frame / data.perSheet);
        const cell = sample.frame % data.perSheet;
        context.clearRect(0, 0, data.width, data.height);
        context.drawImage(images[sheet], (cell % data.columns) * data.width, Math.floor(cell / data.columns) * data.height,
          data.width, data.height, 0, 0, data.width, data.height);
        canvas!.dataset.frame = String(sample.frame);
        lastFrame = sample.frame;
      }
      raf = requestAnimationFrame(tick);
    }

    function load(src: string) {
      const image = new Image();
      images.push(image);
      image.src = src;
      return image.decode();
    }
    function waitForLayout() {
      if (disposed || finished) return;
      if (!align()) { raf = requestAnimationFrame(waitForLayout); return; }
      clearTimeout(watchdog);
      playing = true;
      if (!document.hidden) raf = requestAnimationFrame(tick);
    }
    // Decode all atlases before starting, so the turnaround cannot stall on a download.
    const portrait = new Image();
    portrait.src = "/yashguma2027jan.png";
    Promise.all([...data.sheets.map(load), portrait.decode(), document.fonts.ready])
      .then(waitForLayout).catch(finish);

    function invalidate() { dirtyLayout = true; }
    function visibility() {
      cancelAnimationFrame(raf);
      lastTime = 0;
      if (!document.hidden && playing && !finished) raf = requestAnimationFrame(tick);
    }
    function preference() { if (motion.matches) finish(); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") finish(); }
    const observer = new ResizeObserver(invalidate);
    observer.observe(scene);
    window.addEventListener("resize", invalidate);
    window.visualViewport?.addEventListener("resize", invalidate);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("keydown", escape);
    motion.addEventListener("change", preference);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(watchdog);
      observer.disconnect();
      window.removeEventListener("resize", invalidate);
      window.visualViewport?.removeEventListener("resize", invalidate);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("keydown", escape);
      motion.removeEventListener("change", preference);
      scene.inert = false;
      images.forEach((image) => { image.src = ""; });
      images.length = 0;
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} data-intro-phase="loading">
      <div ref={sceneRef} className={styles.scene} data-smoke-scene>{children}</div>
      <canvas ref={canvasRef} className={styles.canvas} data-smoke-overlay aria-hidden="true" width={data.width} height={data.height} />
      <noscript><style>{`[data-smoke-scene]{opacity:1!important;visibility:visible!important}[data-smoke-overlay]{display:none!important}`}</style></noscript>
    </div>
  );
}

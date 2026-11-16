"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { introSample } from "@/lib/smoke-intro-timeline";
import styles from "./smoke-reveal.module.css";

const VIDEO = "/intro/toronto-black-mist.mp4";
const POSTER = "/intro/toronto-black-mist.webp";

export function SmokeReveal({ children, onReveal }: { children: ReactNode; onReveal: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const video = videoRef.current;
    if (!root || !scene || !video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let finished = false;
    let revealed = false;
    let frame = 0;
    let timeout = 0;
    let phase = "loading";

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      revealRef.current();
    };

    const stopMedia = () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
      video.pause();
      if (video.hasAttribute("src")) {
        video.removeAttribute("src");
        video.load();
      }
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      root.dataset.introPhase = "complete";
      scene.inert = false;
      stopMedia();
      reveal();
    };

    if (motion.matches) {
      finish();
      return;
    }

    const tick = () => {
      if (finished) return;
      const sample = introSample(video.currentTime);
      if (sample.phase !== phase) {
        phase = sample.phase;
        root.dataset.introPhase = phase;
        if (phase === "fade") reveal();
      }
      if (phase === "fade") {
        scene.style.setProperty("--intro-reveal", String(sample.sceneOpacity));
        video.style.opacity = String(sample.videoOpacity);
        if (sample.sceneOpacity === 1) scene.inert = false;
      }
      frame = requestAnimationFrame(tick);
    };

    const playing = () => {
      if (finished) return;
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const waiting = () => {
      if (finished) return;
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
      timeout = window.setTimeout(finish, 4000);
    };

    const preference = () => { if (motion.matches) finish(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };

    scene.inert = true;
    root.dataset.introPhase = "loading";
    scene.style.removeProperty("--intro-reveal");
    video.style.removeProperty("opacity");
    video.addEventListener("playing", playing);
    video.addEventListener("waiting", waiting);
    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);
    motion.addEventListener("change", preference);
    document.addEventListener("keydown", escape);

    // The server-rendered source can download before hydration. Restore it if
    // React reruns this effect after cleanup in development.
    if (!video.hasAttribute("src")) video.src = VIDEO;
    waiting();
    void video.play().catch(finish);

    return () => {
      finished = true;
      video.removeEventListener("playing", playing);
      video.removeEventListener("waiting", waiting);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      motion.removeEventListener("change", preference);
      document.removeEventListener("keydown", escape);
      scene.inert = false;
      stopMedia();
    };
  }, []);

  return (
    <div ref={rootRef} data-intro-phase="loading">
      <link rel="preload" as="image" href={POSTER} fetchPriority="high" media="(prefers-reduced-motion: no-preference)" />
      <div ref={sceneRef} className={styles.scene} data-smoke-scene>{children}</div>
      <video ref={videoRef} className={styles.media} data-smoke-overlay src={VIDEO} muted playsInline preload="auto" poster={POSTER} aria-hidden="true" />
      <noscript><style>{`[data-smoke-scene]{opacity:1!important;visibility:visible!important}[data-smoke-overlay]{display:none!important}`}</style></noscript>
    </div>
  );
}

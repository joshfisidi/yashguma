"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { introSample } from "@/lib/smoke-intro-timeline";
import styles from "./smoke-reveal.module.css";

const VIDEO = "/intro/toronto-rooftop-v2.mp4";
const WALLPAPER = "/intro/toronto-rooftop-v2.webp";
const INTRO_MEDIA = "(max-width: 639px) and (orientation: portrait) and (prefers-reduced-motion: no-preference)";

export function SmokeReveal({ children, onReveal }: { children: ReactNode; onReveal: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    if (!root || !scene || !stage || !video) return;

    const introMedia = window.matchMedia(INTRO_MEDIA);
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

    if (!introMedia.matches) {
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
        stage.style.opacity = String(sample.introOpacity);
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

    const viewportChange = () => { if (!introMedia.matches) finish(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };

    scene.inert = true;
    root.dataset.introPhase = "loading";
    scene.style.removeProperty("--intro-reveal");
    stage.style.removeProperty("opacity");
    video.addEventListener("playing", playing);
    video.addEventListener("waiting", waiting);
    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);
    introMedia.addEventListener("change", viewportChange);
    document.addEventListener("keydown", escape);

    video.src = VIDEO;
    waiting();
    void video.play().catch(finish);

    return () => {
      finished = true;
      video.removeEventListener("playing", playing);
      video.removeEventListener("waiting", waiting);
      video.removeEventListener("ended", finish);
      video.removeEventListener("error", finish);
      introMedia.removeEventListener("change", viewportChange);
      document.removeEventListener("keydown", escape);
      scene.inert = false;
      stopMedia();
    };
  }, []);

  return (
    <div ref={rootRef} data-intro-phase="loading">
      <link rel="preload" as="image" href={WALLPAPER} fetchPriority="high" media={INTRO_MEDIA} />
      <div ref={sceneRef} className={styles.scene} data-smoke-scene>{children}</div>
      <div ref={stageRef} className={styles.stage} data-smoke-overlay aria-hidden="true">
        <picture>
          <source srcSet={WALLPAPER} media={INTRO_MEDIA} />
          {/* The responsive source is the only wallpaper request. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.wallpaper} alt="" fetchPriority="high" />
        </picture>
        <video ref={videoRef} className={styles.media} muted playsInline preload="auto" />
      </div>
      <noscript><style>{`[data-smoke-scene]{opacity:1!important;visibility:visible!important}[data-smoke-overlay]{display:none!important}`}</style></noscript>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { advanceWalker, createWalker, travelCorridor, type WalkerWorld } from "@/lib/walker-motion";
import styles from "./walking-yash.module.css";

const CONTROLS = "a[href], button, input, select, textarea, [role='button'], [data-walker-obstacle]";

export function WalkingYash() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!root || !canvas || !context) return;
    const element = root;
    const surface = canvas;
    const ctx = context;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atlas = new Image();
    let ready = false;
    let disposed = false;
    let frame = 0;
    let previous = 0;
    let needsMeasure = true;
    let lastMeasure = 0;
    let modalOpen = false;
    let coveredFor = 0;
    let pointer = { x: -1000, y: -1000 };
    let world: WalkerWorld = { width: window.innerWidth, size: element.offsetWidth, obstacles: [] };
    let floor = window.innerHeight;
    const state = createWalker(world.size);

    function measure() {
      const size = element.offsetWidth || world.size;
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      floor = (viewport?.height ?? window.innerHeight) + (viewport?.offsetTop ?? 0);
      const bottom = Number.parseFloat(getComputedStyle(element).bottom) || 5;
      modalOpen = !!document.querySelector('[role="dialog"][data-state="open"], [aria-modal="true"], [data-slot="drawer-overlay"][data-state="open"]');
      const obstacles: WalkerWorld["obstacles"] = [];
      document.querySelectorAll<HTMLElement>(CONTROLS).forEach((control) => {
        const bounds = control.getBoundingClientRect();
        if (!bounds.width || !bounds.height || bounds.bottom < floor - bottom - size || bounds.top > floor || bounds.right < 0 || bounds.left > width) return;
        const style = getComputedStyle(control);
        if (style.visibility === "hidden" || style.display === "none" || style.opacity === "0") return;
        obstacles.push({ left: bounds.left, right: bounds.right });
      });
      // Preserve the character's relative position when rotating/resizing the viewport.
      if (world.width !== width) state.x = (state.x / world.width) * width;
      world = { width, size, obstacles };
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      if (surface.width !== Math.round(size * ratio)) {
        surface.width = surface.height = Math.round(size * ratio);
      }
      needsMeasure = false;
    }

    function paint() {
      const pixels = surface.width;
      ctx.clearRect(0, 0, pixels, pixels);
      const position = state.phase * 8;
      const index = Math.floor(position) % 8;
      // Briefly blend the last quarter of each pose into the next, including 7 → 0.
      const mix = Math.max(0, ((position % 1) - 0.75) / 0.25);
      const cellWidth = atlas.naturalWidth / 4;
      const cellHeight = atlas.naturalHeight / 2;
      const drawPose = (pose: number, alpha: number) => {
        ctx.globalAlpha = alpha;
        ctx.drawImage(atlas, (pose % 4) * cellWidth, Math.floor(pose / 4) * cellHeight,
          cellWidth, cellHeight, 0, 0, pixels, pixels);
      };
      drawPose(index, 1 - mix);
      if (mix > 0) drawPose((index + 1) % 8, mix);
      ctx.globalAlpha = 1;
      const lean = state.mode === "walk" ? state.direction * state.speed / 48 * 1.2 : 0;
      surface.style.transform = `scaleX(${state.facing}) rotate(${lean}deg)`;
      element.style.transform = `translate3d(${state.x - world.size / 2}px, 0, 0)`;
      element.dataset.behavior = state.mode;
      element.dataset.direction = state.direction > 0 ? "right" : "left";
    }

    function tick(now: number) {
      const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (needsMeasure || now - lastMeasure > 300) {
        measure();
        lastMeasure = now;
      }
      const covered = travelCorridor(state.x, world).covered;
      coveredFor = covered && !modalOpen ? coveredFor + delta : 0;
      if (coveredFor > 0.45) {
        // A scroll can place a button directly over us. Fade out first, then enter
        // again from the nearest edge instead of getting stranded under a control.
        const fromRight = state.x > world.width / 2;
        state.x = fromRight ? world.width + world.size : -world.size;
        state.direction = state.facing = fromRight ? -1 : 1;
        state.speed = 0;
        state.mode = "walk";
        coveredFor = 0;
      }
      const nearby = Math.abs(pointer.x - state.x) < world.size * 0.55 && pointer.y > floor - world.size - 20;
      element.style.opacity = modalOpen || covered ? "0" : "1";
      // Read the room: stop for a nearby pointer, an open drawer, or newly scrolled controls.
      if (!modalOpen && !covered && !nearby) advanceWalker(state, world, delta);
      paint();
      frame = requestAnimationFrame(tick);
    }

    function updatePlayback() {
      cancelAnimationFrame(frame);
      previous = 0;
      if (disposed || !ready || document.hidden || motion.matches) {
        element.style.opacity = "0";
        return;
      }
      needsMeasure = true;
      frame = requestAnimationFrame(tick);
    }
    function invalidate() { needsMeasure = true; }
    function point(event: PointerEvent) {
      if (event.pointerType === "mouse") pointer = { x: event.clientX, y: event.clientY };
    }
    function release() { pointer = { x: -1000, y: -1000 }; }

    const observer = new ResizeObserver(invalidate);
    observer.observe(document.body);
    const mutations = new MutationObserver(invalidate);
    // Ignore per-frame style changes from this and the existing background animation.
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-state", "aria-modal"] });
    window.addEventListener("resize", invalidate);
    window.addEventListener("scroll", invalidate, { passive: true, capture: true });
    window.visualViewport?.addEventListener("resize", invalidate);
    window.visualViewport?.addEventListener("scroll", invalidate);
    window.addEventListener("pointermove", point, { passive: true });
    window.addEventListener("blur", release);
    document.documentElement.addEventListener("pointerleave", release);
    document.addEventListener("visibilitychange", updatePlayback);
    motion.addEventListener("change", updatePlayback);
    atlas.onload = () => { ready = true; updatePlayback(); };
    atlas.src = "/characters/yashguma-walk.png";

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      atlas.onload = null;
      observer.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", invalidate);
      window.removeEventListener("scroll", invalidate, true);
      window.visualViewport?.removeEventListener("resize", invalidate);
      window.visualViewport?.removeEventListener("scroll", invalidate);
      window.removeEventListener("pointermove", point);
      window.removeEventListener("blur", release);
      document.documentElement.removeEventListener("pointerleave", release);
      document.removeEventListener("visibilitychange", updatePlayback);
      motion.removeEventListener("change", updatePlayback);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className={styles.walker} data-walking-yash>
      <span className={styles.shadow} />
      <canvas ref={canvasRef} className={styles.figure} width={224} height={224} />
    </div>
  );
}

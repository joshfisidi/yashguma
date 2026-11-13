"use client";

import { useEffect, useRef } from "react";
import { createAbyssRenderer } from "@/lib/abyss-renderer";

export function AbyssBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;
    const canvas = element;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer = createAbyssRenderer(canvas);
    let frame = 0;
    let previousTime = 0;
    let time = 0;
    let activePointer: number | undefined;
    let activeTouch: number | undefined;

    function draw(now: number) {
      if (!renderer) return;
      const delta = previousTime ? Math.min((now - previousTime) / 1000, 0.1) : 0;
      previousTime = now;
      time += delta;
      renderer.render(time, delta);
      frame = requestAnimationFrame(draw);
    }

    function updateAnimation() {
      cancelAnimationFrame(frame);
      previousTime = 0;
      release();
      if (!renderer || document.hidden) return;
      renderer.render(time, 0);
      if (!motion.matches) frame = requestAnimationFrame(draw);
    }

    function resize() {
      renderer?.resize();
      if (motion.matches) renderer?.render(time, 0);
    }

    function overControl(target: EventTarget | null) {
      return target instanceof Element && target.closest("a, button, [role='dialog'], [data-slot='drawer-overlay']");
    }

    function point(event: PointerEvent) {
      const bounds = canvas.getBoundingClientRect();
      renderer?.pointer(
        (event.clientX - bounds.left) / bounds.width,
        1 - (event.clientY - bounds.top) / bounds.height,
        event.timeStamp / 1000,
        activePointer === event.pointerId,
      );
    }

    function down(event: PointerEvent) {
      if (event.pointerType === "touch" || motion.matches || activePointer !== undefined || event.button !== 0 || overControl(event.target)) return;
      activePointer = event.pointerId;
      point(event);
    }

    function move(event: PointerEvent) {
      if (event.pointerType === "touch" || motion.matches) return;
      if (activePointer === event.pointerId || (activePointer === undefined && event.pointerType === "mouse")) {
        if (overControl(event.target) && activePointer === undefined) renderer?.release();
        else point(event);
      }
    }

    function release() {
      activePointer = undefined;
      activeTouch = undefined;
      renderer?.release();
    }

    function end(event: PointerEvent) {
      if (activePointer === event.pointerId) {
        activePointer = undefined;
        renderer?.release();
      }
    }

    function smokeAt(touch: Touch, initial: boolean) {
      const bounds = canvas.getBoundingClientRect();
      renderer?.stirSmoke(
        (touch.clientX - bounds.left) / bounds.width,
        1 - (touch.clientY - bounds.top) / bounds.height,
        time,
        initial,
      );
    }

    function touchStart(event: TouchEvent) {
      if (motion.matches || activeTouch !== undefined || event.touches.length !== 1 || overControl(event.target)) return;
      const touch = event.changedTouches[0];
      activeTouch = touch.identifier;
      smokeAt(touch, true);
    }

    function touchMove(event: TouchEvent) {
      if (activeTouch === undefined || motion.matches || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (touch.identifier === activeTouch) smokeAt(touch, false);
    }

    function touchEnd(event: TouchEvent) {
      for (const touch of event.changedTouches) {
        if (touch.identifier === activeTouch) activeTouch = undefined;
      }
    }

    function contextLost(event: Event) {
      event.preventDefault();
      cancelAnimationFrame(frame);
      release();
      renderer = undefined;
    }

    function contextRestored() {
      renderer = createAbyssRenderer(canvas);
      resize();
      updateAnimation();
    }

    const pointerOptions = { capture: true, passive: true };
    window.addEventListener("pointerdown", down, pointerOptions);
    window.addEventListener("pointermove", move, pointerOptions);
    window.addEventListener("pointerup", end, pointerOptions);
    window.addEventListener("pointercancel", end, pointerOptions);
    // Passive touch events can follow a finger while the browser handles the scroll.
    window.addEventListener("touchstart", touchStart, pointerOptions);
    window.addEventListener("touchmove", touchMove, pointerOptions);
    window.addEventListener("touchend", touchEnd, pointerOptions);
    window.addEventListener("touchcancel", touchEnd, pointerOptions);
    window.addEventListener("blur", release);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", updateAnimation);
    motion.addEventListener("change", updateAnimation);
    canvas.addEventListener("webglcontextlost", contextLost);
    canvas.addEventListener("webglcontextrestored", contextRestored);
    resize();
    updateAnimation();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", end, true);
      window.removeEventListener("pointercancel", end, true);
      window.removeEventListener("touchstart", touchStart, true);
      window.removeEventListener("touchmove", touchMove, true);
      window.removeEventListener("touchend", touchEnd, true);
      window.removeEventListener("touchcancel", touchEnd, true);
      window.removeEventListener("blur", release);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", updateAnimation);
      motion.removeEventListener("change", updateAnimation);
      canvas.removeEventListener("webglcontextlost", contextLost);
      canvas.removeEventListener("webglcontextrestored", contextRestored);
      renderer?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 h-full w-full bg-black" />;
}

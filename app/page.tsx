"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { GenerativeBackground } from "@/components/generative-background";
import { SkewedCard } from "@/components/skewed-card";
import { Button } from "@/components/ui/button";
import { Code2, Github } from "lucide-react";

const HERO_IMAGE =
  "https://cufummffmtitwhfisrlw.supabase.co/storage/v1/object/public/IMAGES/yashguma-fisidi-joshfisidi-phase1.PNG";

function sampleGaussian(scale: number) {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * scale;
}

export default function HomePage() {
  const mistARef = useRef<HTMLSpanElement>(null);
  const mistBRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layers = [mistARef.current, mistBRef.current].filter(Boolean) as HTMLSpanElement[];

    if (!layers.length) return;

    let isCancelled = false;
    const activeAnimations = new Set<ReturnType<typeof animate>>();

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const launchBrownianWalk = (layer: HTMLSpanElement, config: {
      xScale: number;
      yScale: number;
      blurMin: number;
      blurMax: number;
      minDuration: number;
      maxDuration: number;
      minOpacity: number;
      maxOpacity: number;
      driftLimit: number;
    }) => {
      let x = 0;
      let y = 0;

      const step = () => {
        if (isCancelled) return;

        const nextX = clamp(x + sampleGaussian(config.xScale), -config.driftLimit, config.driftLimit);
        const nextY = clamp(y + sampleGaussian(config.yScale), -config.driftLimit, config.driftLimit);
        const blur = clamp(2 + sampleGaussian(1.2), config.blurMin, config.blurMax);
        const opacity = clamp(config.minOpacity + Math.abs(nextX + nextY) / 240, config.minOpacity, config.maxOpacity);

        const anim = animate(layer, {
          x: [x, nextX],
          y: [y, nextY],
          opacity: [0.2, opacity],
          filter: [`blur(1px)`, `blur(${blur.toFixed(2)}px)`],
          duration: Math.round(config.minDuration + Math.random() * (config.maxDuration - config.minDuration)),
          easing: "inOutSine",
          autoplay: true,
          loop: false,
          onComplete: () => {
            activeAnimations.delete(anim);
            x = nextX;
            y = nextY;
            step();
          },
        });

        activeAnimations.add(anim);
      };

      step();
    };

    launchBrownianWalk(mistARef.current as HTMLSpanElement, {
      xScale: 5,
      yScale: 4,
      blurMin: 1.8,
      blurMax: 2.8,
      minDuration: 1400,
      maxDuration: 2500,
      minOpacity: 0.18,
      maxOpacity: 0.55,
      driftLimit: 24,
    });

    launchBrownianWalk(mistBRef.current as HTMLSpanElement, {
      xScale: 7,
      yScale: 5,
      blurMin: 2.6,
      blurMax: 4.2,
      minDuration: 1700,
      maxDuration: 3300,
      minOpacity: 0.12,
      maxOpacity: 0.42,
      driftLimit: 28,
    });

    return () => {
      isCancelled = true;
      activeAnimations.forEach((animation) => animation.pause());
      activeAnimations.clear();
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <GenerativeBackground />

      <div className="relative z-10 flex min-h-screen items-start justify-start px-4 pb-32 pt-8 text-center sm:pt-10">
        <section className="w-full max-w-2xl space-y-5 pt-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="mist-title relative inline-block">
              <span className="relative z-10 text-[#0f2f77]">Yash Guma</span>
              <span ref={mistARef} className="mist-title-layer mist-title-layer-a pointer-events-none" aria-hidden>
                Yash Guma
              </span>
              <span ref={mistBRef} className="mist-title-layer mist-title-layer-b pointer-events-none" aria-hidden>
                Yash Guma
              </span>
            </span>
          </h1>

          <div className="mx-auto w-full max-w-sm sm:max-w-xl">
            <SkewedCard imageSrc={HERO_IMAGE} className="w-full" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <a href="#projects" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Projects
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="rounded-xl">
              <a href="https://github.com/yashguma" target="_blank" rel="noreferrer" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .mist-title {
          text-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .mist-title-layer {
          position: absolute;
          inset: 0;
          display: inline-block;
          color: transparent;
          white-space: nowrap;
          mix-blend-mode: multiply;
          -webkit-text-stroke: 0;
        }

        .mist-title-layer-a {
          background-image: radial-gradient(
            circle at 40% 55%,
            rgba(0, 0, 0, 0.48) 0%,
            rgba(0, 0, 0, 0.12) 32%,
            transparent 58%
          );
          background-size: 250% 250%;
          -webkit-background-clip: text;
          background-clip: text;
        }

        .mist-title-layer-b {
          background-image: radial-gradient(
            circle at 65% 45%,
            rgba(0, 0, 0, 0.32) 0%,
            rgba(0, 0, 0, 0.05) 38%,
            transparent 60%
          );
          background-size: 240% 240%;
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </main>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { motion, useReducedMotion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { MusicButton } from "@/components/music-button";
import { AppleMusicIcon, SoundCloudIcon, SpotifyIcon } from "@/lib/icons";
import { AbyssBackground } from "@/components/abyss-background";

const PortraitCarousel = dynamic(() => import("@/components/portrait-carousel").then((m) => m.PortraitCarousel), {
  loading: () => <Skeleton aria-hidden className="portrait-skeleton aspect-[4/5] w-full rounded-[28px]" />,
});
const StreamingServicesDrawer = dynamic(() => import("@/components/streaming-services-drawer").then((m) => m.StreamingServicesDrawer), {
  ssr: false,
  loading: () => <Skeleton aria-hidden className="portrait-skeleton h-[46px] rounded-xl" />,
});

const HERO_IMAGE = "/yashguma2027jan.png";

function sampleGaussian(scale: number) {
  const u = 1 - Math.random();
  const v = 1 - Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * scale;
}

export default function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mistVisible, setMistVisible] = useState(false);
  const reduceMotion = useReducedMotion();
  const mistARef = useRef<HTMLSpanElement>(null);
  const mistBRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const layers = [mistARef.current, mistBRef.current].filter(Boolean) as HTMLSpanElement[];

    if (!layers.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
    <main className="relative min-h-screen overflow-hidden bg-[#050d12] pb-[14svh]">
      <AbyssBackground />
      <div className="relative z-10 flex min-h-screen items-start justify-center px-4 pb-24 pt-8 text-center sm:items-center sm:pb-16 sm:pt-10">
        <section className="w-full max-w-[22rem] space-y-5 pt-2 sm:max-w-[26rem] lg:max-w-[30rem] xl:max-w-[32rem]">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="mist-title relative inline-block">
              <span className="relative z-10 mist-title-main">Yash Guma</span>
              <span ref={mistARef} className="mist-title-layer mist-title-layer-a pointer-events-none" aria-hidden>
                Yash Guma
              </span>
              <span ref={mistBRef} className="mist-title-layer mist-title-layer-b pointer-events-none" aria-hidden>
                Yash Guma
              </span>
            </span>
          </h1>

          <motion.div
            data-slot="home-content"
            initial={false}
            animate={{ opacity: drawerOpen || mistVisible ? 0 : 1 }}
            transition={{ type: "tween", duration: reduceMotion ? 0 : 0.26, ease: "easeOut" }}
            className="mx-auto w-full max-w-[15rem] sm:max-w-[19rem] flex flex-col gap-5"
          >
            <PortraitCarousel imageSrc={HERO_IMAGE} />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:[&>*]:w-[calc((100%-0.75rem)/2)]">
              <MusicButton
                href="https://spotify.com"
                icon={<SpotifyIcon className="h-5 w-5" />}
                label="Spotify"
              />

              <MusicButton
                href="https://music.apple.com"
                icon={<AppleMusicIcon className="h-5 w-5" />}
                label="Apple Music"
              />

              <MusicButton
                href="https://soundcloud.com"
                icon={<SoundCloudIcon className="h-5 w-5" />}
                label="SoundCloud"
              />

              <StreamingServicesDrawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                mistVisible={mistVisible}
                onMistVisibilityChange={setMistVisible}
              />
            </div>
          </motion.div>
        </section>
      </div>

      <style jsx>{`
        .mist-title {
          text-shadow:
            0 0 10px rgba(53, 102, 121, 0.36),
            0 0 22px rgba(25, 72, 85, 0.35),
            0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .mist-title-main {
          color: #9dbcc7;
          text-shadow:
            0 0 6px rgba(106, 150, 165, 0.45),
            0 0 18px rgba(54, 105, 123, 0.42),
            0 0 30px rgba(28, 78, 91, 0.35);
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

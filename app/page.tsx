"use client";

import { GenerativeBackground } from "@/components/generative-background";
import { SkewedCard } from "@/components/skewed-card";
import { NavButtons } from "@/components/nav-buttons";
import { Badge } from "@/components/ui/badge";

const HERO_IMAGE =
  "https://cufummffmtitwhfisrlw.supabase.co/storage/v1/object/public/IMAGES/36C72C97-FBFC-47E5-A348-E1AD057AC7B1.PNG";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <GenerativeBackground />

      <div className="relative z-10 flex min-h-screen flex-col px-4 py-8 sm:px-6 sm:py-10 lg:justify-center lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 lg:gap-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-8xl">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Yash Guma
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
              Creative developer, generative artist, and systems builder shaping digital experiences with depth and precision.
            </p>
          </div>

          <div className="grid w-full items-start gap-6 lg:grid-cols-[minmax(160px,220px)_minmax(0,1fr)_minmax(160px,220px)] lg:gap-8">
            <div className="order-2 hidden lg:block">
              <NavButtons position="left" />
            </div>

            <div className="order-1 flex justify-center lg:order-2">
              <SkewedCard imageSrc={HERO_IMAGE} className="w-full max-w-sm sm:max-w-xl lg:max-w-2xl">
                <div className="space-y-6">
                  <div className="space-y-3 text-left">
                    <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">About Me</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      I build visually striking, emotionally resonant web experiences that blend design systems, code, and experimental interaction. My work lives where aesthetic signal meets technical sharpness.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground sm:text-sm">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["Next.js", "TypeScript", "React", "Three.js", "Generative UI", "Motion"].map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-secondary/80 px-3 py-1 text-xs transition-colors hover:bg-primary/20 sm:text-sm"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground sm:text-sm">
                      Focus Areas
                    </h3>
                    <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 sm:text-base">
                      {[
                        "Generative systems",
                        "Interactive 3D experiences",
                        "Creative developer tooling",
                        "Brand-driven digital identity",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SkewedCard>
            </div>

            <div className="order-3 hidden lg:block">
              <NavButtons position="right" />
            </div>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-2 lg:hidden">
            <NavButtons position="left" />
            <NavButtons position="right" />
          </div>
        </div>

        <footer className="relative mt-8 text-center lg:mt-10">
          <p className="text-xs text-muted-foreground sm:text-sm">Built with simplex noise, motion systems, and mobile-first polish.</p>
        </footer>
      </div>
    </main>
  );
}

"use client";

import { GenerativeBackground } from '@/components/generative-background'
import { SkewedCard } from '@/components/skewed-card'
import { Button } from '@/components/ui/button'
import { Github, Code2 } from 'lucide-react'

const HERO_IMAGE =
  'https://cufummffmtitwhfisrlw.supabase.co/storage/v1/object/public/IMAGES/yashguma-fisidi-joshfisidi-phase1.PNG'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <GenerativeBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 text-center">
        <section className="w-full max-w-2xl space-y-5">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="mist-title inline-block" data-text="Yash Guma">
              Yash Guma
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
          position: relative;
          color: #0f2f77;
          letter-spacing: 0.02em;
          text-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        }

        .mist-title::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: transparent;
          background-image: radial-gradient(
              circle at calc(40% + var(--mist-x, 0%)) calc(60% + var(--mist-y, 0%)),
              rgba(0, 0, 0, 0.4) 0%,
              rgba(0, 0, 0, 0.05) 35%,
              transparent 48%
            ),
            radial-gradient(
              circle at calc(70% + var(--mist-x-2, 0%)) calc(30% + var(--mist-y-2, 0%)),
              rgba(255, 255, 255, 0.22) 0%,
              rgba(255, 255, 255, 0.02) 30%,
              transparent 55%
            );
          background-size: 260% 260%;
          background-position: 50% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          filter: blur(1px) saturate(130%);
          animation: brownian-mist 10s ease-in-out infinite;
          mix-blend-mode: multiply;
          pointer-events: none;
          opacity: 0.85;
        }

        .mist-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: transparent;
          background-image: radial-gradient(
              circle at var(--drift-x, 35%) var(--drift-y, 40%),
              rgba(0, 0, 0, 0.2) 0%,
              rgba(0, 0, 0, 0) 40%
            ),
            radial-gradient(
              circle at var(--drift-x2, 65%) var(--drift-y2, 80%),
              rgba(0, 0, 0, 0.28) 0%,
              rgba(0, 0, 0, 0) 38%
            );
          background-size: 220% 220%;
          -webkit-background-clip: text;
          background-clip: text;
          filter: blur(4px);
          animation: gaussian-walk 12s ease-in-out infinite;
          opacity: 0.35;
          pointer-events: none;
        }

        @keyframes brownian-mist {
          0% {
            --mist-x: -10%;
            --mist-y: 14%;
            --mist-x-2: 16%;
            --mist-y-2: -12%;
          }
          20% {
            --mist-x: 8%;
            --mist-y: -8%;
            --mist-x-2: 4%;
            --mist-y-2: 12%;
          }
          40% {
            --mist-x: -2%;
            --mist-y: -14%;
            --mist-x-2: -12%;
            --mist-y-2: 4%;
          }
          60% {
            --mist-x: 12%;
            --mist-y: 2%;
            --mist-x-2: 18%;
            --mist-y-2: -22%;
          }
          80% {
            --mist-x: 0%;
            --mist-y: 18%;
            --mist-x-2: 32%;
            --mist-y-2: 6%;
          }
          100% {
            --mist-x: -10%;
            --mist-y: 14%;
            --mist-x-2: 16%;
            --mist-y-2: -12%;
          }
        }

        @keyframes gaussian-walk {
          0% {
            --drift-x: 45%;
            --drift-y: 45%;
            --drift-x2: 60%;
            --drift-y2: 45%;
          }
          25% {
            --drift-x: 50%;
            --drift-y: 58%;
            --drift-x2: 30%;
            --drift-y2: 70%;
          }
          50% {
            --drift-x: 36%;
            --drift-y: 65%;
            --drift-x2: 44%;
            --drift-y2: 34%;
          }
          75% {
            --drift-x: 58%;
            --drift-y: 36%;
            --drift-x2: 70%;
            --drift-y2: 58%;
          }
          100% {
            --drift-x: 45%;
            --drift-y: 45%;
            --drift-x2: 60%;
            --drift-y2: 45%;
          }
        }
      `}</style>
    </main>
  )
}

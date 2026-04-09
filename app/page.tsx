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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10 text-center">
        <section className="w-full max-w-2xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="relative inline-block">
              <span className="pointer-events-none absolute -inset-4 -z-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.05)_40%,rgba(0,0,0,0)_65%)] animate-[mistShift_8s_ease-in-out_infinite]" />
              <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-[radial-gradient(circle_at_30%_40%,rgba(8,26,57,0.45)_0%,rgba(8,26,57,0.05)_45%,rgba(8,26,57,0)_70%)] blur-md animate-[mistDrift_6s_ease-in-out_infinite]" />
              <span className="relative block text-[#0a2a6a] drop-shadow-[0_4px_20px_rgba(0,0,0,0.55)]">
                Yash Guma
              </span>
            </span>
          </h1>

          <SkewedCard imageSrc={HERO_IMAGE} className="mx-auto w-full max-w-sm sm:max-w-xl" />

          <div className="mt-5 flex w-full items-center justify-between">
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
          </div>        </section>
      </div>

      <style jsx>{`
        @keyframes mistShift {
          0%,
          100% {
            transform: translate3d(-8%, 0, 0) scale(0.95);
            opacity: 0.55;
          }
          50% {
            transform: translate3d(8%, 6%, 0) scale(1.04);
            opacity: 0.3;
          }
        }

        @keyframes mistDrift {
          0%,
          100% {
            transform: translate3d(8%, 0, 0) scale(0.96);
            opacity: 0.35;
          }
          50% {
            transform: translate3d(-8%, 4%, 0) scale(1.05);
            opacity: 0.7;
          }
        }
      `}</style>
    </main>
  )
}

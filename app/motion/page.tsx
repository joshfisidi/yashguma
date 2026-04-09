import { MotionPermissionCard } from '@/components/debug/MotionPermissionCard'

export default function MotionDemoPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-semibold">Motion Sensor Demo</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          iOS Safari requires explicit permission via user action and HTTPS (secure context) for
          DeviceMotionEvent / DeviceOrientationEvent.
        </p>
      </section>

      <MotionPermissionCard />
    </main>
  )
}

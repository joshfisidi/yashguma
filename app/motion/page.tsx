import { MotionPermissionCard } from '@/components/debug/MotionPermissionCard'

export default function MotionDemoPage() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-3 py-6 sm:px-5 sm:py-10">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Motion Sensor Demo</h1>
        <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
          iOS Safari needs explicit user permission and HTTPS (secure context) for
          <span className="font-medium text-foreground"> DeviceMotionEvent </span>
          and
          <span className="font-medium text-foreground"> DeviceOrientationEvent</span>.
        </p>
      </section>

      <MotionPermissionCard />
    </main>
  )
}

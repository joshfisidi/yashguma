"use client";

import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { useMotionSensors } from '@/hooks/useMotionSensors'
import { useTiltStyle } from '@/hooks/useTiltStyle'

const STAT_LABEL_CLASS = 'text-xs sm:text-sm text-muted-foreground'

const statusBadgeClass = (active: boolean) =>
  `inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
    active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
  }`

export function MotionPermissionCard() {
  const { permissionState, snapshot, isSupported, isSecureContext, requestAccess, start } = useMotionSensors()
  const [error, setError] = React.useState('')
  const isMobile = useIsMobile()

  const tiltStyle = useTiltStyle(snapshot.orientation, {
    enableSmoothing: isMobile,
    betaDeadzone: isMobile ? 1 : 0.4,
    gammaDeadzone: isMobile ? 1 : 0.4,
    maxBetaDeg: isMobile ? 18 : 24,
    maxGammaDeg: isMobile ? 18 : 24,
    perspective: isMobile ? 560 : 920,
    smoothingWindow: isMobile ? 7 : 5,
    optimizeForMobile: isMobile,
    mobileIntensityScale: isMobile ? 0.8 : 1,
  })

  const onEnableMotion = async () => {
    setError('')

    const state = await requestAccess()
    if (state === 'granted') {
      start()
      return
    }

    setError(`Motion access ${state}.`)
  }

  const canRequest = isSupported && isSecureContext && permissionState !== 'requesting'
  const permissionGranted = permissionState === 'granted'
  const disabled = !canRequest || permissionGranted

  return (
    <Card
      className="mx-auto w-full max-w-[88vw] border border-border/50 bg-background/95 shadow-sm sm:max-w-3xl"
      style={{
        transform: tiltStyle.transform,
        transformOrigin: 'center',
        transition: 'transform 120ms linear',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      <CardHeader className="space-y-2 px-4 pt-4 pb-3 sm:px-6">
        <CardTitle className="text-base font-semibold sm:text-xl">Motion + Orientation Diagnostics</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          iOS Safari demo for accelerometer and gyroscope capture.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-4 pb-4 sm:px-6">
        <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
          <span className={statusBadgeClass(isSupported)}>Support: {isSupported ? 'supported' : 'unsupported'}</span>
          <span className={statusBadgeClass(isSecureContext)}>
            Secure: {isSecureContext ? 'ok' : 'HTTPS required'}
          </span>
          <span className={statusBadgeClass(permissionGranted)}>Permission: {permissionState}</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatusBlock
            title="Orientation"
            lines={[
              ['alpha', snapshot.orientation.alpha],
              ['beta', snapshot.orientation.beta],
              ['gamma', snapshot.orientation.gamma],
            ]}
          />
          <StatusBlock
            title="Acceleration"
            lines={[
              ['x', snapshot.acceleration.x],
              ['y', snapshot.acceleration.y],
              ['z', snapshot.acceleration.z],
            ]}
          />
          <StatusBlock
            title="Acceleration (incl. gravity)"
            lines={[
              ['x', snapshot.accelerationIncludingGravity.x],
              ['y', snapshot.accelerationIncludingGravity.y],
              ['z', snapshot.accelerationIncludingGravity.z],
            ]}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <StatusBlock
            title="Rotation rate"
            lines={[
              ['alpha', snapshot.rotationRate.alpha],
              ['beta', snapshot.rotationRate.beta],
              ['gamma', snapshot.rotationRate.gamma],
            ]}
          />
          <div className="rounded-lg border border-border/60 bg-card/40 p-3 sm:p-4">
            <h3 className="mb-2 font-medium">Interval</h3>
            <div className="space-y-1">
              <p className={STAT_LABEL_CLASS}>event interval: {snapshot.interval.toFixed(2)} ms</p>
              <p className={STAT_LABEL_CLASS}>last update: {new Date(snapshot.timestamp).toLocaleTimeString()}</p>
              <p className={STAT_LABEL_CLASS}>tilt deg: β {tiltStyle.beta.toFixed(2)}°, γ {tiltStyle.gamma.toFixed(2)}°</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {error ? <p className="text-xs font-medium text-destructive sm:text-sm">{error}</p> : null}
          <Button
            type="button"
            className="h-11 w-full touch-manipulation sm:w-auto"
            onClick={onEnableMotion}
            disabled={disabled}
          >
            Enable Motion
          </Button>
          <p className={STAT_LABEL_CLASS}>Best results on iPhone Safari: HTTPS + allow motion/gyro permission prompt.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBlock({ title, lines }: { title: string; lines: Array<[string, number]> }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-3 sm:p-4">
      <h3 className="mb-2 text-sm font-medium sm:text-base">{title}</h3>
      <dl className="space-y-1.5 text-xs sm:text-sm">
        {lines.map(([name, value]) => (
          <div key={name} className="flex items-center justify-between gap-4">
            <dt className={STAT_LABEL_CLASS}>{name}</dt>
            <dd className="tabular-nums text-foreground">{value.toFixed(3)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

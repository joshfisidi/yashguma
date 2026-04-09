"use client";

import * as React from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMotionSensors } from '@/hooks/useMotionSensors'
import { useTiltStyle } from '@/hooks/useTiltStyle'

const STAT_LABEL_CLASS = 'text-sm text-muted-foreground'

const statusBadgeClass = (active: boolean) =>
  `inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
    active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
  }`

export function MotionPermissionCard() {
  const { permissionState, snapshot, isSupported, isSecureContext, requestAccess, start } = useMotionSensors()
  const [error, setError] = React.useState('')

  const tiltStyle = useTiltStyle(snapshot.orientation, {
    enableSmoothing: true,
    betaDeadzone: 0.6,
    gammaDeadzone: 0.6,
    maxBetaDeg: 18,
    maxGammaDeg: 18,
    perspective: 900,
    smoothingWindow: 6,
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
      className="w-full max-w-3xl rounded-2xl border p-0"
      style={{
        transform: tiltStyle.transform,
        transition: 'transform 150ms ease-out',
      }}
    >
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl">Motion + Orientation Diagnostics</CardTitle>
        <CardDescription>
          Demo for iPhone accelerometer and gyroscope access in iOS Safari.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className={statusBadgeClass(isSupported)}>
            Support: {isSupported ? 'supported' : 'unsupported'}
          </span>
          <span className={statusBadgeClass(isSecureContext)}>
            Secure context: {isSecureContext ? 'yes' : 'no (HTTPS required)'}
          </span>
          <span className={statusBadgeClass(permissionState === 'granted')}>Permission: {permissionState}</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
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
            title="Acceleration incl. gravity"
            lines={[
              ['x', snapshot.accelerationIncludingGravity.x],
              ['y', snapshot.accelerationIncludingGravity.y],
              ['z', snapshot.accelerationIncludingGravity.z],
            ]}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatusBlock
            title="Rotation rate"
            lines={[
              ['alpha', snapshot.rotationRate.alpha],
              ['beta', snapshot.rotationRate.beta],
              ['gamma', snapshot.rotationRate.gamma],
            ]}
          />
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="mb-3 font-medium">Interval</h3>
            <p className={STAT_LABEL_CLASS}>device event interval: {snapshot.interval.toFixed(2)} ms</p>
            <p className={STAT_LABEL_CLASS}>last update: {snapshot.timestamp}</p>
            <p className={STAT_LABEL_CLASS}>sampled at: {new Date(snapshot.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="space-y-2">
          {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={onEnableMotion}
            disabled={disabled}
          >
            Enable Motion
          </Button>
          {permissionGranted ? <p className={STAT_LABEL_CLASS}>State: listeners active or ready to receive updates.</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}

function StatusBlock({ title, lines }: { title: string; lines: Array<[string, number]> }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <h3 className="mb-3 font-medium">{title}</h3>
      <dl className="space-y-2 text-sm">
        {lines.map(([name, value]) => (
          <div key={name} className="flex items-center justify-between">
            <dt className={STAT_LABEL_CLASS}>{name}</dt>
            <dd className="tabular-nums text-foreground">{value.toFixed(3)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

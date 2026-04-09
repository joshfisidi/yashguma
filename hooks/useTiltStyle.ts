"use client";

import * as React from 'react'

import { createMovingAverage, OrientationVector } from '@/lib/sensors/motion'

export interface TiltStyleOptions {
  betaDeadzone?: number
  gammaDeadzone?: number
  maxBetaDeg?: number
  maxGammaDeg?: number
  perspective?: number
  enableSmoothing?: boolean
  smoothingWindow?: number
  optimizeForMobile?: boolean
  mobileIntensityScale?: number
}

export function useTiltStyle(orientation: OrientationVector, options: TiltStyleOptions = {}) {
  const {
    betaDeadzone = 0,
    gammaDeadzone = 0,
    maxBetaDeg = 24,
    maxGammaDeg = 24,
    perspective = 700,
    enableSmoothing = false,
    smoothingWindow = 6,
    optimizeForMobile = false,
    mobileIntensityScale = 0.65,
  } = options

  const effectiveMaxBeta = optimizeForMobile ? Math.min(maxBetaDeg, 18) : maxBetaDeg
  const effectiveMaxGamma = optimizeForMobile ? Math.min(maxGammaDeg, 18) : maxGammaDeg
  const effectiveSmoothing = optimizeForMobile
    ? Math.max(1, Math.round(smoothingWindow + 2))
    : Math.max(1, Math.round(smoothingWindow))
  const effectiveDeadzoneBeta = optimizeForMobile ? Math.max(0, betaDeadzone) : betaDeadzone
  const effectiveDeadzoneGamma = optimizeForMobile ? Math.max(0, gammaDeadzone) : gammaDeadzone
  const effectiveIntensity = optimizeForMobile ? clamp(mobileIntensityScale, 0.4, 1) : 1

  const betaSmoother = React.useRef<ReturnType<typeof createMovingAverage> | null>(null)
  const gammaSmoother = React.useRef<ReturnType<typeof createMovingAverage> | null>(null)

  React.useEffect(() => {
    if (enableSmoothing) {
      betaSmoother.current = createMovingAverage(effectiveSmoothing)
      gammaSmoother.current = createMovingAverage(effectiveSmoothing)
      return
    }

    if (betaSmoother.current) {
      betaSmoother.current.reset()
    }
    if (gammaSmoother.current) {
      gammaSmoother.current.reset()
    }

    betaSmoother.current = null
    gammaSmoother.current = null
  }, [enableSmoothing, effectiveSmoothing])

  const { beta, gamma } = React.useMemo(() => {
    const normalizedBeta = clamp(
      applyDeadzone(orientation.beta, effectiveDeadzoneBeta),
      -Math.abs(effectiveMaxBeta),
      Math.abs(effectiveMaxBeta),
    )

    const normalizedGamma = clamp(
      applyDeadzone(orientation.gamma, effectiveDeadzoneGamma),
      -Math.abs(effectiveMaxGamma),
      Math.abs(effectiveMaxGamma),
    )

    const smoothedBeta = betaSmoother.current
      ? betaSmoother.current.add(normalizedBeta)
      : normalizedBeta
    const smoothedGamma = gammaSmoother.current
      ? gammaSmoother.current.add(normalizedGamma)
      : normalizedGamma

    return {
      beta: smoothedBeta * effectiveIntensity,
      gamma: smoothedGamma * effectiveIntensity,
    }
  }, [
    effectiveDeadzoneBeta,
    effectiveDeadzoneGamma,
    effectiveIntensity,
    effectiveMaxBeta,
    effectiveMaxGamma,
    orientation.beta,
    orientation.gamma,
    enableSmoothing,
  ])

  return {
    transform: `perspective(${Math.max(1, perspective)}px) rotateX(${beta.toFixed(2)}deg) rotateY(${(
      -gamma
    ).toFixed(2)}deg)`,
    beta,
    gamma,
    maxBetaDeg: effectiveMaxBeta,
    maxGammaDeg: effectiveMaxGamma,
  }
}

function applyDeadzone(value: number, deadzone: number): number {
  const zone = Math.max(0, deadzone)
  if (Math.abs(value) <= zone) {
    return 0
  }

  return value
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min
  }
  if (value > max) {
    return max
  }
  return value
}

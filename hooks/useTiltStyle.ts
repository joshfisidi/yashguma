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
  } = options

  const betaSmoother = React.useRef(
    enableSmoothing ? createMovingAverage(Math.max(1, Math.round(smoothingWindow))) : null,
  )
  const gammaSmoother = React.useRef(
    enableSmoothing ? createMovingAverage(Math.max(1, Math.round(smoothingWindow))) : null,
  )

  if (!enableSmoothing) {
    betaSmoother.current = null
    gammaSmoother.current = null
  }

  const { beta, gamma } = React.useMemo(() => {
    const normalizedBeta = clamp(
      applyDeadzone(orientation.beta, betaDeadzone),
      -Math.abs(maxBetaDeg),
      Math.abs(maxBetaDeg),
    )

    const normalizedGamma = clamp(
      applyDeadzone(orientation.gamma, gammaDeadzone),
      -Math.abs(maxGammaDeg),
      Math.abs(maxGammaDeg),
    )

    const smoothedBeta = betaSmoother.current
      ? betaSmoother.current.add(normalizedBeta)
      : normalizedBeta
    const smoothedGamma = gammaSmoother.current
      ? gammaSmoother.current.add(normalizedGamma)
      : normalizedGamma

    return {
      beta: smoothedBeta,
      gamma: smoothedGamma,
    }
  }, [orientation.beta, orientation.gamma, betaDeadzone, gammaDeadzone, maxBetaDeg, maxGammaDeg, enableSmoothing])

  return {
    transform: `perspective(${Math.max(1, perspective)}px) rotateX(${beta.toFixed(2)}deg) rotateY(${(
      -gamma
    ).toFixed(2)}deg)`,
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

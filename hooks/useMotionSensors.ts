"use client";

import * as React from 'react'

import {
  MotionPermissionState,
  MotionSnapshot,
  motionManager,
} from '@/lib/sensors/motion'

export interface UseMotionSensorsResult {
  permissionState: MotionPermissionState
  snapshot: MotionSnapshot
  isSupported: boolean
  isSecureContext: boolean
  requestAccess: () => Promise<MotionPermissionState>
  start: () => void
  stop: () => void
}

export function useMotionSensors(): UseMotionSensorsResult {
  const [permissionState, setPermissionState] = React.useState<MotionPermissionState>(motionManager.getPermissionState())
  const [snapshot, setSnapshot] = React.useState<MotionSnapshot>(motionManager.getSnapshot())

  const isSupported = motionManager.isSupported
  const isSecureContext = motionManager.isSecureContext

  React.useEffect(() => {
    const unsubscribe = motionManager.subscribe((nextSnapshot) => {
      setSnapshot(nextSnapshot)
    })

    return () => {
      unsubscribe()
      motionManager.stop()
    }
  }, [])

  const requestAccess = React.useCallback(async () => {
    const nextState = await motionManager.requestAccess()
    setPermissionState(nextState)
    return nextState
  }, [])

  const start = React.useCallback(() => {
    motionManager.start()
    setPermissionState(motionManager.getPermissionState())
  }, [])

  const stop = React.useCallback(() => {
    motionManager.stop()
    setPermissionState(motionManager.getPermissionState())
  }, [])

  React.useEffect(() => {
    setPermissionState(motionManager.getPermissionState())
  }, [isSupported, isSecureContext])

  return {
    permissionState,
    snapshot,
    isSupported,
    isSecureContext,
    requestAccess,
    start,
    stop,
  }
}

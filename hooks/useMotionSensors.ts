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

  const latestSnapshot = React.useRef<MotionSnapshot>(snapshot)
  const rafRef = React.useRef<number | null>(null)
  const mountedRef = React.useRef(true)

  const isSupported = motionManager.isSupported
  const isSecureContext = motionManager.isSecureContext

  const scheduleSnapshotUpdate = React.useCallback((next: MotionSnapshot) => {
    latestSnapshot.current = next

    if (rafRef.current !== null || !mountedRef.current) {
      return
    }

    if (typeof requestAnimationFrame === 'undefined') {
      setSnapshot(next)
      return
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      if (!mountedRef.current) {
        return
      }

      setSnapshot(latestSnapshot.current)
    })
  }, [])

  React.useEffect(() => {
    mountedRef.current = true

    const unsubscribe = motionManager.subscribe((nextSnapshot) => {
      scheduleSnapshotUpdate(nextSnapshot)
    })

    return () => {
      mountedRef.current = false
      unsubscribe()
      motionManager.stop()

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [scheduleSnapshotUpdate])

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

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

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

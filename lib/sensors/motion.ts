export type MotionPermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported' | 'insecure'

export interface MotionVector {
  x: number
  y: number
  z: number
}

export interface RotationVector {
  alpha: number
  beta: number
  gamma: number
}

export interface OrientationVector {
  alpha: number
  beta: number
  gamma: number
}

export interface MotionSnapshot {
  orientation: OrientationVector
  acceleration: MotionVector
  accelerationIncludingGravity: MotionVector
  rotationRate: RotationVector
  interval: number
  timestamp: number
}

export type MotionSnapshotSubscriber = (snapshot: MotionSnapshot) => void

/**
 * iOS Safari requires permission APIs to run from a direct user gesture.
 * Sensor APIs must also be in a secure context (HTTPS or localhost).
 */
export class MotionSensorManager {
  private readonly defaultSnapshot: MotionSnapshot = {
    orientation: { alpha: 0, beta: 0, gamma: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
    accelerationIncludingGravity: { x: 0, y: 0, z: 0 },
    rotationRate: { alpha: 0, beta: 0, gamma: 0 },
    interval: 0,
    timestamp: 0,
  }

  private readonly subscribers = new Set<MotionSnapshotSubscriber>()

  private snapshot: MotionSnapshot
  private permissionState: MotionPermissionState
  private active = false

  constructor() {
    this.snapshot = this.createSnapshot()
    this.permissionState = 'idle'
  }

  get isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    return (
      typeof (window as Window & { DeviceMotionEvent?: unknown }).DeviceMotionEvent !== 'undefined' &&
      typeof (window as Window & { DeviceOrientationEvent?: unknown }).DeviceOrientationEvent !== 'undefined'
    )
  }

  get isSecureContext(): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    return window.isSecureContext
  }

  getPermissionState(): MotionPermissionState {
    return this.permissionState
  }

  getSnapshot(): MotionSnapshot {
    return this.cloneSnapshot(this.snapshot)
  }

  subscribe(listener: MotionSnapshotSubscriber): () => void {
    this.subscribers.add(listener)
    listener(this.getSnapshot())

    return () => {
      this.subscribers.delete(listener)
    }
  }

  /**
   * On iOS Safari, these requestPermission calls must be made from a user gesture.
   */
  async requestAccess(): Promise<MotionPermissionState> {
    if (typeof window === 'undefined') {
      this.permissionState = 'unsupported'
      return this.permissionState
    }

    if (!this.isSecureContext) {
      this.permissionState = 'insecure'
      return this.permissionState
    }

    if (!this.isSupported) {
      this.permissionState = 'unsupported'
      return this.permissionState
    }

    this.permissionState = 'requesting'

    const MotionEventCtor =
      typeof window.DeviceMotionEvent === 'undefined'
        ? undefined
        : (window.DeviceMotionEvent as { requestPermission?: () => Promise<unknown> } | undefined)

    const OrientationEventCtor =
      typeof window.DeviceOrientationEvent === 'undefined'
        ? undefined
        : (window.DeviceOrientationEvent as { requestPermission?: () => Promise<unknown> } | undefined)

    const requestMotion =
      MotionEventCtor?.requestPermission
        ? await this.requestSinglePermission(MotionEventCtor.requestPermission)
        : 'granted'

    const requestOrientation =
      OrientationEventCtor?.requestPermission
        ? await this.requestSinglePermission(OrientationEventCtor.requestPermission)
        : 'granted'

    const granted = requestMotion === 'granted' && requestOrientation === 'granted'

    this.permissionState = granted ? 'granted' : 'denied'
    return this.permissionState
  }

  start(): void {
    if (typeof window === 'undefined') {
      this.permissionState = 'unsupported'
      return
    }

    if (!this.isSecureContext) {
      this.permissionState = 'insecure'
      return
    }

    if (!this.isSupported) {
      this.permissionState = 'unsupported'
      return
    }

    if (this.active) {
      return
    }

    if (this.requiresExplicitPermission() && this.permissionState !== 'granted') {
      return
    }

    // Safari and other browsers may throttle sensor availability; keep listeners idempotent.
    window.addEventListener('devicemotion', this.onDeviceMotion)
    window.addEventListener('deviceorientation', this.onDeviceOrientation)
    this.active = true
    if (this.permissionState === 'idle') {
      this.permissionState = 'granted'
    }
  }

  stop(): void {
    if (typeof window === 'undefined') {
      return
    }

    if (!this.active) {
      return
    }

    // Remove both listeners on stop to ensure no leaks and no duplicate callbacks.
    window.removeEventListener('devicemotion', this.onDeviceMotion)
    window.removeEventListener('deviceorientation', this.onDeviceOrientation)
    this.active = false
  }

  private async requestSinglePermission(
    requestPermission: () => Promise<unknown>,
  ): Promise<PermissionState> {
    try {
      const result = await requestPermission()
      return result === 'granted' ? 'granted' : 'denied'
    } catch {
      return 'denied'
    }
  }

  private requiresExplicitPermission(): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    const motionRequest =
      typeof (window.DeviceMotionEvent as { requestPermission?: unknown } | undefined)?.requestPermission === 'function'
    const orientationRequest =
      typeof (window.DeviceOrientationEvent as { requestPermission?: unknown } | undefined)?.requestPermission === 'function'
    return motionRequest || orientationRequest
  }

  private onDeviceMotion = (event: DeviceMotionEvent): void => {
    const acceleration = event.acceleration
    const gravity = event.accelerationIncludingGravity
    const rotationRate = event.rotationRate

    this.snapshot = {
      ...this.snapshot,
      acceleration: {
        x: toNumber(acceleration?.x),
        y: toNumber(acceleration?.y),
        z: toNumber(acceleration?.z),
      },
      accelerationIncludingGravity: {
        x: toNumber(gravity?.x),
        y: toNumber(gravity?.y),
        z: toNumber(gravity?.z),
      },
      rotationRate: {
        alpha: toNumber(rotationRate?.alpha),
        beta: toNumber(rotationRate?.beta),
        gamma: toNumber(rotationRate?.gamma),
      },
      interval: toNumber(event.interval),
      timestamp: Date.now(),
    }

    this.emit()
  }

  private onDeviceOrientation = (event: DeviceOrientationEvent): void => {
    this.snapshot = {
      ...this.snapshot,
      orientation: {
        alpha: toNumber(event.alpha),
        beta: toNumber(event.beta),
        gamma: toNumber(event.gamma),
      },
      timestamp: Date.now(),
    }

    this.emit()
  }

  private emit(): void {
    const snapshot = this.getSnapshot()
    for (const listener of [...this.subscribers]) {
      listener(snapshot)
    }
  }

  private createSnapshot(): MotionSnapshot {
    return this.cloneSnapshot(this.defaultSnapshot)
  }

  private cloneSnapshot(snapshot: MotionSnapshot): MotionSnapshot {
    return {
      orientation: {
        alpha: snapshot.orientation.alpha,
        beta: snapshot.orientation.beta,
        gamma: snapshot.orientation.gamma,
      },
      acceleration: {
        x: snapshot.acceleration.x,
        y: snapshot.acceleration.y,
        z: snapshot.acceleration.z,
      },
      accelerationIncludingGravity: {
        x: snapshot.accelerationIncludingGravity.x,
        y: snapshot.accelerationIncludingGravity.y,
        z: snapshot.accelerationIncludingGravity.z,
      },
      rotationRate: {
        alpha: snapshot.rotationRate.alpha,
        beta: snapshot.rotationRate.beta,
        gamma: snapshot.rotationRate.gamma,
      },
      interval: snapshot.interval,
      timestamp: snapshot.timestamp,
    }
  }
}

const motionSensorManager = new MotionSensorManager()

export { motionSensorManager as motionManager }

export function toFixedNumber(value: number, digits: number): string {
  return value.toFixed(digits)
}

/**
 * Tiny moving-average smoothing utility.
 * Disabled by default and designed for opt-in usage where noise reduction is desired.
 */
export interface MovingAverage {
  add(value: number): number
  reset(): void
}

export function createMovingAverage(windowSize: number): MovingAverage {
  const window: number[] = []
  const size = Math.max(1, Math.trunc(windowSize))

  return {
    add(value) {
      window.push(value)
      if (window.length > size) {
        window.shift()
      }

      const sum = window.reduce((acc, item) => acc + item, 0)
      return sum / window.length
    },
    reset() {
      window.length = 0
    },
  }
}

function toNumber(value: number | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

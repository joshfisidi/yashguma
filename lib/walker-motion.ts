export type Obstacle = { left: number; right: number };
export type WalkerWorld = { width: number; size: number; obstacles: Obstacle[] };
export type WalkerState = {
  x: number;
  speed: number;
  phase: number;
  direction: number;
  facing: number;
  mode: "walk" | "pause" | "turn" | "away";
  timer: number;
  trips: number;
};

export function createWalker(size: number): WalkerState {
  return { x: -size, speed: 0, phase: 0, direction: 1, facing: 1, mode: "walk", timer: 0, trips: 0 };
}

// The atlas has transparent margins: the actual silhouette spans about 60% of a cell.
// Include another 12px of personal space around interactive elements.
export function travelCorridor(x: number, world: WalkerWorld) {
  const padding = world.size * 0.32 + 12;
  let left = -world.size;
  let right = world.width + world.size;
  let covered = false;
  for (const obstacle of world.obstacles) {
    const start = obstacle.left - padding;
    const end = obstacle.right + padding;
    if (x > start && x < end) covered = true;
    else if (end <= x) left = Math.max(left, end);
    else if (start >= x) right = Math.min(right, start);
  }
  return { left, right, covered };
}

/** Distance drives the gait, so easing into a stop never leaves the feet running. */
export function advanceWalker(state: WalkerState, world: WalkerWorld, delta: number) {
  const dt = Math.min(Math.max(delta, 0), 0.05);
  const corridor = travelCorridor(state.x, world);
  if (corridor.covered) return;

  if (state.mode !== "walk") {
    state.timer -= dt;
    if (state.mode === "turn") {
      const progress = Math.min(1, Math.max(0, 1 - state.timer / 0.42));
      // A gentle squash through profile instead of an instantaneous mirror flip.
      state.facing = state.direction * Math.cos(Math.PI * progress);
    }
    if (state.timer > 0) return;
    if (state.mode === "pause") {
      state.mode = "turn";
      state.timer = 0.42;
    } else {
      state.direction *= -1;
      state.facing = state.direction;
      state.trips += 1;
      state.mode = "walk";
    }
    return;
  }

  const excursion = state.trips % 3 === 2;
  const destination = state.direction > 0
    ? (excursion ? world.width + world.size : world.width * 0.84)
    : (excursion ? -world.size : world.width * 0.16);
  const target = Math.max(corridor.left, Math.min(corridor.right, destination));
  const distance = Math.max(0, (target - state.x) * state.direction);
  if (distance < 0.35) {
    state.speed = 0;
    const offscreen = state.x < -world.size * 0.6 || state.x > world.width + world.size * 0.6;
    state.mode = offscreen ? "away" : "pause";
    state.timer = offscreen ? 3.5 + (state.trips % 3) : 0.8 + (state.trips % 2) * 0.45;
    return;
  }
  const cruise = world.width < 640 ? 34 : 48;
  const desiredSpeed = Math.min(cruise, Math.sqrt(distance * 130));
  state.speed += (desiredSpeed - state.speed) * (1 - Math.exp(-dt * 5));
  const travel = Math.min(distance, state.speed * dt);
  state.x += travel * state.direction;
  state.phase = (state.phase + travel / (world.size * 0.52)) % 1;
}

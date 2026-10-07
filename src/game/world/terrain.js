// Procedural island terrain. The same height function builds the mesh, places
// props, keeps the player on the ground and feeds the water foam texture.

import { LANDMARKS, ROAD, LANDMARK_BY_ID, doorOf } from '../../data/landmarks'

export const ISLAND_R = 29
export const WORLD_SIZE = 84 // terrain plane covers [-42, 42]
export const WATER_Y = 0

export const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

export function noise2(x, y) {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return ((a + (b - a) * ux) * (1 - uy) + (c + (d - c) * ux) * uy) * 2 - 1
}

// Deterministic pseudo random generator for prop placement.
export function rng(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function coastRadius(angle) {
  return ISLAND_R * (1 + 0.07 * Math.sin(3 * angle + 0.5) + 0.05 * Math.sin(5 * angle + 2) + 0.03 * Math.sin(9 * angle))
}

function rawHeight(x, z) {
  const t = Math.hypot(x, z) / coastRadius(Math.atan2(z, x))
  let h = 1.05 + 0.45 * noise2(x * 0.09, z * 0.09) + 0.2 * noise2(x * 0.23 + 7, z * 0.23 - 3)
  // a soft hill in the north-east gives the skyline some shape
  h += 2.4 * Math.exp(-((x - 4) ** 2 + (z + 23) ** 2) / 30)
  h += 1.6 * Math.exp(-((x + 23) ** 2 + (z - 6) ** 2) / 22)
  const fall = smoothstep(0.8, 1.08, t)
  h = h * (1 - fall) - 2.2 * fall
  if (t > 1.08) h -= Math.min(4, (t - 1.08) * 9)
  return h
}

const FLATS = LANDMARKS.map((l) => ({
  x: l.pos[0],
  z: l.pos[1],
  y: Math.max(rawHeight(l.pos[0], l.pos[1]), 0.55),
  r0: l.footprint + 2,
  r1: l.footprint + 5,
}))

export function heightAt(x, z) {
  let h = rawHeight(x, z)
  for (const f of FLATS) {
    const d = Math.hypot(x - f.x, z - f.z)
    if (d < f.r1) h += (f.y - h) * (1 - smoothstep(f.r0, f.r1, d))
  }
  return h
}

export function isWalkable(x, z) {
  return heightAt(x, z) > 0.15
}

// Smooth closed road through every landmark door, sampled every ~0.5 units.
export function roadPoints() {
  const nodes = ROAD.map((id) => doorOf(LANDMARK_BY_ID[id]))
  const pts = []
  const n = nodes.length - 1
  for (let i = 0; i < n; i++) {
    const p0 = nodes[(i - 1 + n) % n]
    const p1 = nodes[i]
    const p2 = nodes[i + 1]
    const p3 = nodes[(i + 2) % n]
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    const steps = Math.max(4, Math.ceil(len / 0.5))
    for (let s = 0; s < steps; s++) {
      const t = s / steps
      const t2 = t * t
      const t3 = t2 * t
      const cr = (a, b, c, d) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      pts.push([cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  pts.push(pts[0])
  return pts
}

let roadCache = null
export function distanceToRoad(x, z) {
  if (!roadCache) roadCache = roadPoints()
  let best = Infinity
  for (const [px, pz] of roadCache) {
    const d = (px - x) ** 2 + (pz - z) ** 2
    if (d < best) best = d
  }
  return Math.sqrt(best)
}

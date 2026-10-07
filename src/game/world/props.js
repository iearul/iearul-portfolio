// Deterministic placement of trees and rocks, plus the collider list used by
// the player. Computed once at module load.

import { LANDMARKS, ORB_SPOTS } from '../../data/landmarks'
import { heightAt, rng, distanceToRoad, coastRadius } from './terrain'

const rand = rng(20170901)

function clearOfStuff(x, z, margin) {
  for (const l of LANDMARKS) {
    if (Math.hypot(x - l.pos[0], z - l.pos[1]) < l.radius + margin) return false
  }
  for (const [ox, oz] of ORB_SPOTS) {
    if (Math.hypot(x - ox, z - oz) < 1.6) return false
  }
  return distanceToRoad(x, z) > 1.8
}

function scatter(count, { minT, maxT, margin, minH }) {
  const out = []
  let guard = 0
  while (out.length < count && guard++ < count * 60) {
    const a = rand() * Math.PI * 2
    const t = minT + (maxT - minT) * Math.sqrt(rand())
    const r = coastRadius(a) * t
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const y = heightAt(x, z)
    if (y < minH || !clearOfStuff(x, z, margin)) continue
    if (out.some((p) => Math.hypot(p.x - x, p.z - z) < 1.7)) continue
    out.push({ x, y, z, s: 0.75 + rand() * 0.6, r: rand() * Math.PI * 2, v: rand() })
  }
  return out
}

export const TREES = scatter(85, { minT: 0.05, maxT: 0.86, margin: 0.6, minH: 0.5 })
export const ROCKS = scatter(26, { minT: 0.7, maxT: 0.98, margin: 0.2, minH: -0.6 })

export const COLLIDERS = [
  ...LANDMARKS.filter((l) => l.footprint > 0).map((l) => ({ x: l.pos[0], z: l.pos[1], r: l.footprint })),
  ...TREES.map((t) => ({ x: t.x, z: t.z, r: 0.45 * t.s })),
]

export function resolveCollisions(x, z, radius = 0.35) {
  for (const c of COLLIDERS) {
    const dx = x - c.x
    const dz = z - c.z
    const min = c.r + radius
    const d2 = dx * dx + dz * dz
    if (d2 < min * min) {
      const d = Math.sqrt(d2) || 0.0001
      x = c.x + (dx / d) * min
      z = c.z + (dz / d) * min
    }
  }
  return [x, z]
}

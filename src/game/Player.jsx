import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../store/game'
import { LANDMARKS, LANDMARK_BY_ID } from '../data/landmarks'
import { heightAt, isWalkable } from './world/terrain'
import { resolveCollisions } from './world/props'
import { player } from './playerState'

const SPEED = 6.2
const SKIN = '#c98b5b'
const HOODIE = '#2b59c3'

export function panelFor(id) {
  const l = LANDMARK_BY_ID[id]
  if (!l) return null
  if (l.type === 'career') return { type: 'career', id }
  if (l.type === 'welcome') return { type: 'welcome', id }
  return { type: l.type, id }
}

function angleLerp(a, b, t) {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return a + d * t
}

export function Player() {
  const root = useRef()
  const body = useRef()
  const legL = useRef()
  const legR = useRef()
  const armL = useRef()
  const armR = useRef()
  const phase = useRef(0)
  const stuck = useRef({ d: Infinity, t: 0 })
  const near = useRef(null)

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const g = useGame.getState()
    const p = player.pos
    let vx = 0
    let vz = 0

    if (g.phase === 'play' && !g.panel) {
      const k = player.keys
      const ix = (k.has('right') ? 1 : 0) - (k.has('left') ? 1 : 0)
      const iz = (k.has('down') ? 1 : 0) - (k.has('up') ? 1 : 0)
      if (ix || iz) {
        if (g.target) g.clearTarget()
        const l = Math.hypot(ix, iz)
        vx = (ix / l) * SPEED
        vz = (iz / l) * SPEED
        if (!g.seen.walk && g.award('walk', 0, null)) g.unlock('first-steps')
      } else if (g.target) {
        const dx = g.target.x - p.x
        const dz = g.target.z - p.z
        const d = Math.hypot(dx, dz)
        // give up on targets we cannot reach (blocked by a wall or the sea)
        if (d < stuck.current.d - 0.05) stuck.current = { d, t: 0 }
        else stuck.current.t += dt
        const arrived = d < 0.2 || stuck.current.t > 1.2
        if (arrived) {
          const lm = g.target.landmark
          stuck.current = { d: Infinity, t: 0 }
          g.clearTarget()
          if (lm) g.openPanel(panelFor(lm))
        } else {
          const sp = Math.min(SPEED, d / dt)
          vx = (dx / d) * sp
          vz = (dz / d) * sp
        }
      } else {
        stuck.current = { d: Infinity, t: 0 }
      }
    }

    if (vx || vz) {
      let [nx, nz] = resolveCollisions(p.x + vx * dt, p.z + vz * dt)
      if (isWalkable(nx, nz)) {
        p.x = nx
        p.z = nz
      } else if (isWalkable(nx, p.z)) p.x = nx
      else if (isWalkable(p.x, nz)) p.z = nz
      player.heading = angleLerp(player.heading, Math.atan2(vx, vz), Math.min(1, dt * 12))
    }
    player.speed = Math.hypot(vx, vz)
    p.y = heightAt(p.x, p.z)

    // proximity: which landmark are we standing at?
    let best = null
    let bestD = Infinity
    for (const l of LANDMARKS) {
      const d = Math.hypot(p.x - l.pos[0], p.z - l.pos[1])
      if (d < l.radius + 0.6 && d < bestD) {
        best = l.id
        bestD = d
      }
    }
    if (best !== near.current && g.phase === 'play') {
      near.current = best
      best ? g.enterLandmark(best) : g.leaveLandmark()
    }

    // pose + walk cycle
    const moving = player.speed > 0.1
    phase.current += dt * (moving ? 11 : 2)
    const swing = moving ? Math.sin(phase.current) * 0.75 : 0
    if (root.current) {
      root.current.position.copy(p)
      root.current.rotation.y = player.heading
    }
    if (body.current) body.current.position.y = moving ? Math.abs(Math.sin(phase.current)) * 0.08 : Math.sin(phase.current) * 0.015
    if (legL.current) legL.current.rotation.x = swing
    if (legR.current) legR.current.rotation.x = -swing
    if (armL.current) armL.current.rotation.x = -swing * 0.8
    if (armR.current) armR.current.rotation.x = swing * 0.8
  })

  return (
    <group ref={root}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <group ref={body}>
        <group ref={legL} position={[-0.13, 0.55, 0]}>
          <mesh position={[0, -0.27, 0]} castShadow>
            <boxGeometry args={[0.17, 0.55, 0.2]} />
            <meshStandardMaterial color="#26303f" flatShading />
          </mesh>
          <mesh position={[0, -0.52, 0.04]} castShadow>
            <boxGeometry args={[0.19, 0.1, 0.28]} />
            <meshStandardMaterial color="#f5f5f5" flatShading />
          </mesh>
        </group>
        <group ref={legR} position={[0.13, 0.55, 0]}>
          <mesh position={[0, -0.27, 0]} castShadow>
            <boxGeometry args={[0.17, 0.55, 0.2]} />
            <meshStandardMaterial color="#26303f" flatShading />
          </mesh>
          <mesh position={[0, -0.52, 0.04]} castShadow>
            <boxGeometry args={[0.19, 0.1, 0.28]} />
            <meshStandardMaterial color="#f5f5f5" flatShading />
          </mesh>
        </group>
        <mesh position={[0, 0.88, 0]} castShadow>
          <boxGeometry args={[0.5, 0.62, 0.32]} />
          <meshStandardMaterial color={HOODIE} flatShading />
        </mesh>
        <mesh position={[0, 0.98, -0.2]} castShadow>
          <boxGeometry args={[0.36, 0.42, 0.14]} />
          <meshStandardMaterial color="#f2b134" flatShading />
        </mesh>
        <group ref={armL} position={[-0.32, 1.12, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <boxGeometry args={[0.13, 0.5, 0.15]} />
            <meshStandardMaterial color={HOODIE} flatShading />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <boxGeometry args={[0.11, 0.1, 0.12]} />
            <meshStandardMaterial color={SKIN} flatShading />
          </mesh>
        </group>
        <group ref={armR} position={[0.32, 1.12, 0]}>
          <mesh position={[0, -0.24, 0]} castShadow>
            <boxGeometry args={[0.13, 0.5, 0.15]} />
            <meshStandardMaterial color={HOODIE} flatShading />
          </mesh>
          <mesh position={[0, -0.52, 0]}>
            <boxGeometry args={[0.11, 0.1, 0.12]} />
            <meshStandardMaterial color={SKIN} flatShading />
          </mesh>
        </group>
        <mesh position={[0, 1.42, 0]} castShadow>
          <icosahedronGeometry args={[0.27, 1]} />
          <meshStandardMaterial color={SKIN} flatShading />
        </mesh>
        <mesh position={[0, 1.55, -0.03]} scale={[1, 0.7, 1]} castShadow>
          <icosahedronGeometry args={[0.28, 1]} />
          <meshStandardMaterial color="#1d1410" flatShading />
        </mesh>
        {[-0.09, 0.09].map((x) => (
          <mesh key={x} position={[x, 1.43, 0.24]}>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshBasicMaterial color="#111" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function TargetMarker() {
  const ref = useRef()
  useFrame(({ clock }) => {
    const m = ref.current
    if (!m) return
    const t = useGame.getState().target
    m.visible = !!t && !t.landmark
    if (!t) return
    m.position.set(t.x, heightAt(t.x, t.z) + 0.08, t.z)
    const k = (clock.elapsedTime * 1.6) % 1
    m.scale.setScalar(0.6 + k * 0.6)
    m.material.opacity = 1 - k
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.35, 0.5, 24]} />
      <meshBasicMaterial color="#ffffff" transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

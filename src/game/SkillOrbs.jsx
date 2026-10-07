import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { SKILLS } from '../data/profile'
import { ORB_SPOTS } from '../data/landmarks'
import { useGame } from '../store/game'
import { heightAt } from './world/terrain'
import { player } from './playerState'

const ORBS = SKILLS.map((s, i) => {
  const [x, z] = ORB_SPOTS[i % ORB_SPOTS.length]
  return { ...s, x, z, y: heightAt(x, z) + 1.1 }
})

function Orb({ orb }) {
  const group = useRef()
  const label = useRef()
  const collected = useGame((s) => !!s.collected[orb.id])
  const walkTo = useGame((s) => s.walkTo)
  const gone = useRef(collected ? 1 : 0)

  useFrame(({ clock }, dt) => {
    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const dist = Math.hypot(player.pos.x - orb.x, player.pos.z - orb.z)
    const s = useGame.getState()
    if (!collected && s.phase === 'play' && dist < 1.25) s.collectSkill(orb.id)
    if (collected) gone.current = Math.min(1, gone.current + dt * 2.5)
    const k = gone.current
    g.position.y = orb.y + Math.sin(t * 2 + orb.x) * 0.15 + k * 2
    g.rotation.y = t * (1.2 + k * 8)
    g.scale.setScalar(k >= 1 ? 0.0001 : 1 + k * 0.6 - k * k * 1.5)
    g.visible = k < 1
    if (label.current) label.current.style.opacity = !collected && s.phase === 'play' && dist < 7 ? '1' : '0'
  })

  const core = orb.tier === 'core'
  return (
    <group ref={group} position={[orb.x, orb.y, orb.z]}>
      <mesh
        castShadow
        onClick={(e) => {
          e.stopPropagation()
          walkTo(orb.x, orb.z)
        }}
      >
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color={core ? '#ffd166' : '#dbe4ee'}
          emissive={core ? '#ffb703' : '#9fb3c8'}
          emissiveIntensity={1.1}
          flatShading
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.025, 6, 24]} />
        <meshBasicMaterial color={core ? '#fff1b8' : '#ffffff'} toneMapped={false} />
      </mesh>
      {!collected && (
        <Html position={[0, 0.8, 0]} center zIndexRange={[15, 0]} pointerEvents="none">
          <div ref={label} className="orb-label" style={{ opacity: 0 }}>
            {orb.name}
          </div>
        </Html>
      )}
    </group>
  )
}

export function SkillOrbs() {
  return ORBS.map((o) => <Orb key={o.id} orb={o} />)
}

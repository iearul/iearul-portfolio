import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Box, Cyl, Cone, Roof, Plinth } from './parts'
import { useGame } from '../../store/game'
import { SKILLS } from '../../data/profile'

// Local space: +z faces the island centre (the door side).

function useCanvasTexture(width, height, draw, interval = 0.25) {
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.magFilter = THREE.NearestFilter
    return { canvas, texture }
  }, [width, height])
  const acc = useRef(interval)
  useFrame((state, dt) => {
    acc.current += dt
    if (acc.current < interval) return
    acc.current = 0
    draw(canvas.getContext('2d'), state.clock.elapsedTime, width, height)
    texture.needsUpdate = true
  })
  return texture
}

function Rickshaw(props) {
  return (
    <group {...props}>
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.32, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.28, 0.04, 6, 14]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
      <mesh position={[0, 0.27, 1.05]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.24, 0.04, 6, 14]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <Box size={[0.08, 0.08, 1.2]} color="#444" position={[0, 0.42, 0.5]} />
      <Box size={[1, 0.25, 0.6]} color="#e63946" position={[0, 0.72, 0]} />
      <Box size={[1, 0.55, 0.1]} color="#f4a261" position={[0, 1.05, -0.27]} />
      <Box size={[0.04, 0.75, 0.04]} color="#333" position={[0.48, 1.25, -0.25]} />
      <Box size={[0.04, 0.75, 0.04]} color="#333" position={[-0.48, 1.25, -0.25]} />
      <Box size={[1.15, 0.06, 0.85]} color="#2a9d8f" position={[0, 1.62, -0.1]} rotation={[0.15, 0, 0]} />
      <Box size={[0.06, 0.6, 0.06]} color="#444" position={[0, 0.6, 1.05]} />
      <Box size={[0.6, 0.05, 0.05]} color="#444" position={[0, 0.92, 1.05]} />
    </group>
  )
}

export function Campus() {
  const flag = useRef()
  useFrame(({ clock }) => {
    if (flag.current) flag.current.rotation.y = Math.sin(clock.elapsedTime * 2.2) * 0.18
  })
  return (
    <group>
      <Plinth r={3.4} color="#d9cbb0" />
      <Box size={[4.6, 2.4, 2.6]} color="#c8553d" position={[0, 1.45, -0.4]} />
      <Box size={[5, 0.25, 3.1]} color="#efe6d2" position={[0, 2.77, -0.4]} />
      <Box size={[1.8, 1, 1.5]} color="#b5462f" position={[0, 3.4, -0.6]} />
      <Roof w={2.1} d={1.8} h={0.7} color="#7a3326" position={[0, 3.9, -0.6]} />
      <mesh position={[0, 3.45, 0.16]}>
        <circleGeometry args={[0.32, 16]} />
        <meshStandardMaterial color="#fffaf0" />
      </mesh>
      {[-1.65, -0.6, 0.6, 1.65].map((x) => (
        <Box key={x} size={[0.55, 0.7, 0.05]} color="#2c3e50" emissive="#ffd27a" emissiveIntensity={0.25} position={[x, 1.75, 0.92]} />
      ))}
      {[-1.3, -0.45, 0.45, 1.3].map((x) => (
        <Cyl key={x} r={0.13} h={2.2} color="#f4efe4" position={[x, 1.35, 1.3]} />
      ))}
      <Box size={[3.3, 0.18, 0.95]} color="#efe6d2" position={[0, 2.5, 1.25]} />
      <Box size={[0.9, 1.35, 0.05]} color="#5b3a29" position={[0, 0.95, 0.93]} />
      <group position={[2.7, 0.2, 1.7]}>
        <Cyl r={0.05} h={3.6} color="#ddd" position={[0, 1.8, 0]} />
        <group ref={flag} position={[0, 3.2, 0]}>
          <Box size={[1.2, 0.72, 0.03]} color="#006a4e" position={[0.62, 0, 0]} cast={false} />
          <mesh position={[0.56, 0, 0.02]}>
            <circleGeometry args={[0.22, 16]} />
            <meshStandardMaterial color="#f42a41" />
          </mesh>
          <mesh position={[0.56, 0, -0.02]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.22, 16]} />
            <meshStandardMaterial color="#f42a41" />
          </mesh>
        </group>
      </group>
      <Rickshaw position={[-2.7, 0.2, 1.6]} rotation={[0, 0.7, 0]} />
    </group>
  )
}

export function Startup() {
  const rocket = useRef()
  const flame = useRef()
  const leds = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (rocket.current) rocket.current.position.y = 0.4 + Math.max(0, Math.sin(t * 0.7)) * 0.12
    if (flame.current) flame.current.scale.set(1, 0.8 + Math.random() * 0.5, 1)
    leds.current.forEach((m, i) => {
      if (m) m.material.emissiveIntensity = Math.sin(t * 6 + i * 1.7) > 0.2 ? 2 : 0.1
    })
  })
  return (
    <group>
      <Plinth r={3.2} color="#cfd3dc" />
      <group position={[-1.1, 0.2, -0.3]}>
        <Box size={[2.6, 2, 2.4]} color="#f1f1f4" position={[0, 1, 0]} />
        <Box size={[2.8, 0.2, 2.6]} color="#3d3b52" position={[0, 2.08, 0]} />
        <Box size={[1.6, 1.3, 0.05]} color="#7b5cff" position={[0, 0.7, 1.21]} />
        {[0.3, 0.6, 0.9, 1.2].map((y) => (
          <Box key={y} size={[1.62, 0.04, 0.07]} color="#5a3fd6" position={[0, y, 1.22]} cast={false} />
        ))}
        <Box size={[1.9, 0.36, 0.08]} color="#1b1530" emissive="#a78bfa" emissiveIntensity={1.6} position={[0, 1.7, 1.25]} />
        <Box size={[0.55, 1.3, 0.55]} color="#22223a" position={[1.75, 0.65, 0.7]} />
        {[0.3, 0.55, 0.8, 1.05].map((y, i) => (
          <mesh key={y} ref={(m) => (leds.current[i] = m)} position={[1.75, y, 0.98]}>
            <boxGeometry args={[0.35, 0.06, 0.02]} />
            <meshStandardMaterial color="#111" emissive={i % 2 ? '#22d3ee' : '#4ade80'} emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
      <group position={[1.55, 0.2, 0.25]}>
        <Cyl r={0.95} h={0.25} seg={8} color="#5b5f6b" position={[0, 0.12, 0]} />
        <Box size={[0.16, 3.4, 0.16]} color="#9aa0aa" position={[-0.8, 1.7, -0.5]} />
        <Box size={[0.7, 0.08, 0.1]} color="#9aa0aa" position={[-0.45, 2.6, -0.5]} />
        <group ref={rocket} position={[0, 0.4, 0]}>
          <Cyl r={0.38} h={1.8} seg={10} color="#f7f7f7" position={[0, 1.15, 0]} />
          <Cone r={0.38} h={0.8} seg={10} color="#e63946" position={[0, 2.45, 0]} />
          <mesh position={[0, 1.5, 0.35]}>
            <sphereGeometry args={[0.14, 10, 8]} />
            <meshStandardMaterial color="#7dd3fc" emissive="#38bdf8" emissiveIntensity={0.5} />
          </mesh>
          {[0, 1, 2].map((k) => (
            <group key={k} rotation={[0, (k * Math.PI * 2) / 3, 0]}>
              <Box size={[0.06, 0.6, 0.45]} color="#7b5cff" position={[0.4, 0.45, 0]} />
            </group>
          ))}
          <mesh ref={flame} position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.24, 0.6, 8]} />
            <meshBasicMaterial color="#ffb703" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export function University() {
  const car = useRef()
  useFrame(({ clock }) => {
    if (car.current) car.current.position.x = Math.sin(clock.elapsedTime * 0.45) * 3.2
  })
  return (
    <group>
      <Plinth r={3.4} color="#ddd3c0" />
      <Box size={[5, 2.3, 2.6]} color="#efe6d2" position={[0, 1.4, -0.7]} />
      <Box size={[5.4, 0.25, 3.3]} color="#d8ccb2" position={[0, 2.66, -0.45]} />
      <Roof w={5.4} d={3.3} h={1.1} color="#4f6d8a" position={[0, 2.78, -0.45]} />
      {[-2, -1.2, -0.4, 0.4, 1.2, 2].map((x) => (
        <Cyl key={x} r={0.14} h={2.2} color="#fbf7ee" position={[x, 1.4, 0.85]} />
      ))}
      <Box size={[5.2, 0.15, 0.7]} color="#e4dccb" position={[0, 0.35, 1.05]} />
      <Box size={[5.6, 0.15, 0.5]} color="#e4dccb" position={[0, 0.22, 1.45]} />
      <Box size={[0.9, 1.4, 0.05]} color="#3f4a5a" position={[0, 1, 0.61]} />
      {/* Wuppertal's suspension railway */}
      <group position={[0, 0.2, -2.7]}>
        {[-3.6, 0, 3.6].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <Box size={[0.14, 4.2, 0.14]} color="#4a5a6a" position={[0, 2, 0.6]} rotation={[0.28, 0, 0]} />
            <Box size={[0.14, 4.2, 0.14]} color="#4a5a6a" position={[0, 2, -0.6]} rotation={[-0.28, 0, 0]} />
          </group>
        ))}
        <Box size={[8.4, 0.25, 0.3]} color="#3b4a5a" position={[0, 4.05, 0]} />
        <group ref={car} position={[0, 3.1, 0]}>
          <Box size={[0.06, 0.5, 0.06]} color="#333" position={[0, 0.65, 0]} />
          <Box size={[1.9, 0.75, 0.75]} color="#2a5caa" position={[0, 0.1, 0]} />
          <Box size={[1.92, 0.12, 0.77]} color="#f28c28" position={[0, -0.12, 0]} cast={false} />
          <Box size={[1.5, 0.25, 0.78]} color="#cfe8ff" emissive="#cfe8ff" emissiveIntensity={0.2} position={[0, 0.22, 0]} cast={false} />
        </group>
      </group>
    </group>
  )
}

function drawDashboard(ctx, t, w, h) {
  ctx.fillStyle = '#0d1b2a'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#4ade80'
  ctx.font = 'bold 11px monospace'
  ctx.fillText('RIG-01 LIVE', 6, 13)
  for (let i = 0; i < 8; i++) {
    const v = 0.35 + 0.6 * Math.abs(Math.sin(t * 0.9 + i * 0.8) * Math.cos(t * 0.37 + i))
    ctx.fillStyle = i === 5 ? '#f2b134' : '#2ec4b6'
    ctx.fillRect(8 + i * 14, h - 6 - v * (h - 26), 10, v * (h - 26))
  }
}

export function Factory() {
  const kelly = useRef()
  const smoke = useRef([])
  const screen = useCanvasTexture(128, 80, drawDashboard, 0.3)
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    if (kelly.current) {
      kelly.current.rotation.y += dt * 5
      kelly.current.position.y = 2.6 + Math.sin(t * 0.6) * 0.8
    }
    smoke.current.forEach((m, i) => {
      if (!m) return
      const p = (t * 0.35 + i / 3) % 1
      m.position.y = 3.6 + p * 2.4
      m.position.x = -2.2 + Math.sin(p * 3 + i) * 0.3
      m.scale.setScalar(0.25 + p * 0.5)
      m.material.opacity = 0.7 * (1 - p)
    })
  })
  return (
    <group>
      <Plinth r={3.6} color="#c9c3b5" />
      <group position={[-1, 0.2, -0.7]}>
        <Box size={[3.4, 2.4, 2.8]} color="#7d8b99" position={[0, 1.2, 0]} />
        {[-1.13, 0, 1.13].map((x) => (
          <Roof key={x} w={1.13} d={2.8} h={0.7} color="#5f6b78" position={[x, 2.4, 0]} />
        ))}
        <Box size={[1.4, 1.6, 0.05]} color="#4a5560" position={[0, 0.8, 1.41]} />
        <Cyl r={0.2} h={1.6} color="#6b6b6b" position={[-1.2, 3.1, -0.9]} />
        {[0, 1, 2].map((i) => (
          <mesh key={i} ref={(m) => (smoke.current[i] = m)} position={[-1.2, 3.6, -0.9]}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#e5e5e5" transparent opacity={0.6} flatShading depthWrite={false} />
          </mesh>
        ))}
      </group>
      {/* foundation drilling rig */}
      <group position={[1.7, 0.2, 0.5]}>
        <Box size={[0.35, 0.35, 1.8]} color="#2f2f2f" position={[-0.5, 0.18, 0]} />
        <Box size={[0.35, 0.35, 1.8]} color="#2f2f2f" position={[0.5, 0.18, 0]} />
        <Box size={[1.3, 0.4, 1.4]} color="#f2b134" position={[0, 0.55, 0]} />
        <Box size={[0.7, 0.7, 0.7]} color="#f2b134" position={[-0.25, 1.1, -0.25]} />
        <Box size={[0.5, 0.35, 0.05]} color="#1f2937" position={[-0.25, 1.2, 0.11]} cast={false} />
        <Box size={[0.22, 6, 0.22]} color="#f2b134" position={[0.3, 3.75, 0.6]} />
        <Cyl r={0.18} h={0.15} seg={10} color="#333" rotation={[0, 0, Math.PI / 2]} position={[0.3, 6.8, 0.6]} />
        <group ref={kelly} position={[0.3, 2.6, 0.85]}>
          <Cyl r={0.06} h={3} color="#9ca3af" position={[0, 1.2, 0]} />
          <Cyl r={0.22} rTop={0.22} h={0.5} seg={6} color="#6b7280" position={[0, -0.45, 0]} />
          <Cone r={0.22} h={0.4} seg={6} color="#6b7280" position={[0, -0.9, 0]} rotation={[Math.PI, 0, 0]} />
        </group>
      </group>
      <group position={[-2.7, 0.2, 1.3]} rotation={[0, 0.5, 0]}>
        <Cyl r={0.06} h={1.6} color="#555" position={[0, 0.8, 0]} />
        <Box size={[1.5, 1, 0.1]} color="#1f2937" position={[0, 2, 0]} />
        <mesh position={[0, 2, 0.06]}>
          <planeGeometry args={[1.36, 0.85]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

export function Tower() {
  const beacon = useRef()
  const ring = useRef()
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    if (beacon.current) beacon.current.scale.setScalar(1 + Math.sin(t * 3) * 0.25)
    if (ring.current) ring.current.rotation.z += dt * 0.4
  })
  const tiers = [
    [3, 4, 2.2],
    [2.4, 3.4, 5.9],
    [1.7, 2.6, 8.9],
  ]
  return (
    <group>
      <Plinth r={3} color="#cfe7e4" />
      {tiers.map(([w, h, y]) => (
        <group key={y}>
          <mesh position={[0, y, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, w]} />
            <meshStandardMaterial color="#1f6f78" metalness={0.35} roughness={0.25} emissive="#2ec4b6" emissiveIntensity={0.12} flatShading />
          </mesh>
          {[-0.3, 0, 0.3].map((f) => (
            <Box key={f} size={[w + 0.05, 0.07, w + 0.05]} color="#7ff3e6" emissive="#7ff3e6" emissiveIntensity={1.4} position={[0, y + f * h, 0]} cast={false} />
          ))}
        </group>
      ))}
      <Box size={[1, 1.3, 0.05]} color="#bff7f0" emissive="#bff7f0" emissiveIntensity={0.4} position={[0, 0.85, 1.52]} />
      <Cyl r={0.05} h={1.6} color="#ccc" position={[0, 11, 0]} />
      <mesh ref={beacon} position={[0, 11.9, 0]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshBasicMaterial color="#ff4d6d" toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={[0, 6.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.05, 6, 48]} />
        <meshBasicMaterial color="#7ff3e6" toneMapped={false} />
      </mesh>
    </group>
  )
}

function drawArcade(ctx, t, w, h) {
  ctx.fillStyle = '#120626'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = '#ffffff55'
    ctx.fillRect((i * 37 + t * 20 * (1 + (i % 3))) % w, (i * 23) % h, 2, 2)
  }
  const x = w / 2 + Math.sin(t * 1.4) * 30
  ctx.fillStyle = '#ff5d8f'
  ctx.fillRect(x - 6, h - 22, 12, 6)
  ctx.fillRect(x - 2, h - 26, 4, 4)
  ctx.fillStyle = '#7ff3e6'
  for (let i = 0; i < 5; i++) ctx.fillRect(18 + i * 20 + Math.sin(t + i) * 4, 18 + (i % 2) * 8, 10, 6)
  if (Math.floor(t * 2) % 2 === 0) {
    ctx.fillStyle = '#ffd166'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('PRESS START', w / 2, h / 2 + 6)
  }
}

function drawMarquee(ctx, t, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, 0)
  g.addColorStop(0, '#ff5d8f')
  g.addColorStop(1, '#7b5cff')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 20px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('PROJECTS', w / 2, h / 2 + 7)
}

export function Arcade() {
  const screen = useCanvasTexture(128, 96, drawArcade, 0.08)
  const marquee = useCanvasTexture(128, 32, drawMarquee, 10)
  return (
    <group>
      <Plinth r={2.4} color="#f3d1dc" />
      <Box size={[2, 3.4, 1.6]} color="#3a1c71" position={[0, 1.9, -0.2]} />
      <Box size={[0.1, 3.6, 1.8]} color="#ff5d8f" position={[1.05, 1.95, -0.15]} />
      <Box size={[0.1, 3.6, 1.8]} color="#ff5d8f" position={[-1.05, 1.95, -0.15]} />
      <mesh position={[0, 2.6, 0.62]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[1.6, 1.2]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <Box size={[2.1, 0.5, 0.45]} color="#1b0b3a" position={[0, 3.75, 0.4]} />
      <mesh position={[0, 3.75, 0.63]}>
        <planeGeometry args={[2, 0.45]} />
        <meshBasicMaterial map={marquee} toneMapped={false} />
      </mesh>
      <Box size={[1.9, 0.3, 0.8]} color="#2b1458" position={[0, 1.5, 0.8]} rotation={[0.25, 0, 0]} />
      <Cyl r={0.04} h={0.3} color="#222" position={[-0.45, 1.8, 0.85]} />
      <mesh position={[-0.45, 1.98, 0.85]}>
        <sphereGeometry args={[0.1, 10, 8]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>
      {['#ffd166', '#06d6a0', '#118ab2'].map((c, i) => (
        <Cyl key={c} r={0.08} h={0.08} color={c} emissive={c} emissiveIntensity={0.6} position={[0.15 + i * 0.28, 1.72, 0.9]} rotation={[0.25, 0, 0]} />
      ))}
    </group>
  )
}

const BOOKS = [
  [3.6, 0.9, 2.6, '#8e3b46', 0.05],
  [3.2, 0.8, 2.3, '#2a6f97', -0.12],
  [3.4, 0.7, 2.4, '#e9c46a', 0.2],
  [2.8, 0.75, 2.1, '#264653', -0.05],
]

export function Library() {
  const book = useRef()
  useFrame(({ clock }) => {
    if (book.current) {
      book.current.rotation.y = clock.elapsedTime * 0.6
      book.current.position.y = 4.6 + Math.sin(clock.elapsedTime * 1.3) * 0.15
    }
  })
  let y = 0.2
  return (
    <group>
      <Plinth r={2.8} color="#e7dcc6" />
      {BOOKS.map(([w, h, d, c, r]) => {
        const cy = y + h / 2
        y += h
        return (
          <group key={c} position={[0, cy, 0]} rotation={[0, r, 0]}>
            <Box size={[w, h, d]} color={c} />
            <Box size={[w - 0.12, h - 0.14, d + 0.03]} color="#f6efdc" position={[0.08, 0, 0]} cast={false} />
          </group>
        )
      })}
      <Box size={[0.8, 0.7, 0.05]} color="#5b3a29" position={[0, 0.55, 1.33]} />
      <group ref={book} position={[0, 4.6, 0]}>
        <Box size={[0.7, 0.05, 0.9]} color="#fdf6e3" position={[-0.36, 0, 0]} rotation={[0, 0, 0.25]} />
        <Box size={[0.7, 0.05, 0.9]} color="#fdf6e3" position={[0.36, 0, 0]} rotation={[0, 0, -0.25]} />
        <Box size={[1.5, 0.04, 0.95]} color="#8e3b46" position={[0, -0.09, 0]} />
      </group>
    </group>
  )
}

// Fruits sit on the canopy; each lights up once its skill orb is collected.
const FRUITS = SKILLS.map((s, i) => {
  const golden = 2.399963
  const yN = 1 - (i / (SKILLS.length - 1)) * 1.2
  const rad = Math.sqrt(Math.max(0, 1 - yN * yN))
  const th = golden * i
  return { id: s.id, pos: [Math.cos(th) * rad * 2.05, 3.7 + yN * 1.6, Math.sin(th) * rad * 2.05] }
})

export function SkillTree() {
  const collected = useGame((s) => s.collected)
  return (
    <group>
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 2.7, 0.15, Math.sin(a) * 2.7]} castShadow>
            <dodecahedronGeometry args={[0.32, 0]} />
            <meshStandardMaterial color="#a8a29e" flatShading />
          </mesh>
        )
      })}
      <Cyl r={0.5} rTop={0.3} h={2.8} seg={7} color="#7a5133" position={[0, 1.4, 0]} />
      <Cyl r={0.14} rTop={0.08} h={1.4} seg={5} color="#7a5133" position={[0.6, 2.6, 0]} rotation={[0, 0, -0.8]} />
      <Cyl r={0.14} rTop={0.08} h={1.4} seg={5} color="#7a5133" position={[-0.55, 2.7, 0.2]} rotation={[0.2, 0, 0.8]} />
      {[
        [0, 3.6, 0, 1.9, '#4f9a3f'],
        [1.3, 3.1, 0.4, 1.25, '#5daf47'],
        [-1.2, 3.2, -0.3, 1.35, '#3f8a3a'],
        [0.2, 4.7, -0.2, 1.25, '#78b94f'],
      ].map(([x, y, z, r, c]) => (
        <mesh key={x + ',' + y} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color={c} flatShading roughness={0.9} />
        </mesh>
      ))}
      {FRUITS.map((f) => {
        const on = !!collected[f.id]
        return (
          <mesh key={f.id} position={f.pos}>
            <icosahedronGeometry args={[0.17, 0]} />
            <meshStandardMaterial
              color={on ? '#ffcf4a' : '#5b6150'}
              emissive={on ? '#ffb703' : '#000'}
              emissiveIntensity={on ? 1.6 : 0}
              flatShading
            />
          </mesh>
        )
      })}
    </group>
  )
}

export function Mailbox() {
  const flag = useRef()
  const sent = useGame((s) => !!s.seen['message:sent'])
  useFrame((_, dt) => {
    if (!flag.current) return
    const goal = sent ? 0 : Math.PI / 2
    flag.current.rotation.x += (goal - flag.current.rotation.x) * Math.min(1, dt * 4)
  })
  return (
    <group>
      <Box size={[0.16, 1.15, 0.16]} color="#8b5e3c" position={[0, 0.6, 0]} />
      <Box size={[0.62, 0.42, 1.05]} color="#e63946" position={[0, 1.38, 0]} />
      <mesh position={[0, 1.59, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.31, 0.31, 1.05, 12, 1, false, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#e63946" flatShading />
      </mesh>
      <Box size={[0.5, 0.5, 0.04]} color="#b91c1c" position={[0, 1.45, 0.53]} />
      <group ref={flag} position={[0.33, 1.3, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <Box size={[0.04, 0.55, 0.06]} color="#ffd166" position={[0, 0.27, 0]} />
        <Box size={[0.04, 0.18, 0.22]} color="#ffd166" position={[0, 0.48, 0.1]} />
      </group>
    </group>
  )
}

export function Dock() {
  const boat = useRef()
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (boat.current) {
      boat.current.position.y = -0.5 + Math.sin(t * 1.4) * 0.06
      boat.current.rotation.z = Math.sin(t * 1.1) * 0.06
    }
  })
  return (
    <group>
      <Box size={[1.8, 0.15, 8]} color="#a47148" position={[0, 0.08, -3.6]} />
      {[-1, -3, -5, -7].map((z) => (
        <group key={z}>
          <Cyl r={0.1} h={1.6} color="#7a5133" position={[0.85, -0.5, z]} />
          <Cyl r={0.1} h={1.6} color="#7a5133" position={[-0.85, -0.5, z]} />
        </group>
      ))}
      <group ref={boat} position={[2.3, -0.5, -5.4]}>
        <Box size={[0.9, 0.35, 2.1]} color="#e76f51" position={[0, 0, 0]} />
        <Box size={[0.75, 0.05, 1.9]} color="#f4e3c3" position={[0, 0.18, 0]} />
        <Cyl r={0.04} h={1.9} color="#ddd" position={[0, 1.1, 0.1]} />
        <mesh position={[0, 1.15, -0.25]} rotation={[0, Math.PI / 2, 0]}>
          <shapeGeometry args={[sailShape]} />
          <meshStandardMaterial color="#fffaf0" side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[1.5, 0, 1.2]}>
        <Box size={[0.12, 2.2, 0.12]} color="#7a5133" position={[0, 1.1, 0]} />
        <Box size={[1.3, 0.3, 0.06]} color="#c8553d" position={[0.45, 1.9, 0]} rotation={[0, 0.5, 0]} />
        <Box size={[1.3, 0.3, 0.06]} color="#2ec4b6" position={[-0.4, 1.5, 0]} rotation={[0, -0.6, 0]} />
        <Box size={[1.3, 0.3, 0.06]} color="#ff5d8f" position={[0.4, 1.1, 0]} rotation={[0, 2.2, 0]} />
      </group>
    </group>
  )
}

const sailShape = new THREE.Shape()
sailShape.moveTo(-0.7, -0.65)
sailShape.lineTo(0.6, -0.65)
sailShape.lineTo(-0.7, 0.85)
sailShape.lineTo(-0.7, -0.65)

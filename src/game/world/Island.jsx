import { useMemo } from 'react'
import * as THREE from 'three'
import { heightAt, noise2, roadPoints, smoothstep, WORLD_SIZE } from './terrain'
import { useGame } from '../../store/game'

const SAND = new THREE.Color('#ecd3a0')
const WET = new THREE.Color('#cdb184')
const SEABED = new THREE.Color('#9c8a68')
const GRASS_A = new THREE.Color('#8cc760')
const GRASS_B = new THREE.Color('#62a548')
const ROCK = new THREE.Color('#8f9188')

function buildTerrain() {
  const seg = 120
  const g = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, seg, seg)
  g.rotateX(-Math.PI / 2)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)))
  const flat = g.toNonIndexed()
  g.dispose()
  flat.computeVertexNormals()

  const p = flat.attributes.position
  const n = flat.attributes.normal
  const colors = new Float32Array(p.count * 3)
  const c = new THREE.Color()
  for (let i = 0; i < p.count; i += 3) {
    const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3
    const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3
    const z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3
    const up = n.getY(i)
    if (y < -0.25) c.copy(WET).lerp(SEABED, smoothstep(-0.25, -2.5, y))
    else if (y < 0.42) c.copy(SAND)
    else {
      c.copy(GRASS_A).lerp(GRASS_B, noise2(x * 0.18, z * 0.18) * 0.5 + 0.5)
      if (up < 0.86) c.lerp(ROCK, smoothstep(0.86, 0.62, up))
    }
    for (let k = 0; k < 3; k++) colors.set([c.r, c.g, c.b], (i + k) * 3)
  }
  flat.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return flat
}

function buildRoad(width = 1.5) {
  const pts = roadPoints()
  const verts = []
  const idx = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    let tx = b[0] - a[0]
    let tz = b[1] - a[1]
    const l = Math.hypot(tx, tz) || 1
    tx /= l
    tz /= l
    const [x, z] = pts[i]
    const lx = x - tz * (width / 2)
    const lz = z + tx * (width / 2)
    const rx = x + tz * (width / 2)
    const rz = z - tx * (width / 2)
    verts.push(lx, heightAt(lx, lz) + 0.05, lz, rx, heightAt(rx, rz) + 0.05, rz)
    if (i < pts.length - 1) {
      const o = i * 2
      idx.push(o, o + 2, o + 1, o + 1, o + 2, o + 3)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

export function Island() {
  const terrain = useMemo(buildTerrain, [])
  const road = useMemo(() => buildRoad(), [])
  const walkTo = useGame((s) => s.walkTo)

  const onClick = (e) => {
    if (e.delta > 10) return
    e.stopPropagation()
    walkTo(e.point.x, e.point.z)
  }

  return (
    <group>
      <mesh geometry={terrain} receiveShadow onClick={onClick}>
        <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
      </mesh>
      <mesh geometry={road} receiveShadow onClick={onClick}>
        <meshStandardMaterial color="#e9cf9a" roughness={1} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
    </group>
  )
}

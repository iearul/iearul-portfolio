import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TREES, ROCKS } from './props'

const tmp = new THREE.Object3D()
const col = new THREE.Color()
const LEAVES = ['#4f9a3f', '#5daf47', '#3f8a3a', '#78b94f']

function useInstances(ref, items, place) {
  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    items.forEach((it, i) => {
      place(it, i)
      tmp.updateMatrix()
      mesh.setMatrixAt(i, tmp.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [ref, items, place])
}

export function Trees() {
  const trunks = useRef()
  const crownA = useRef()
  const crownB = useRef()

  useInstances(trunks, TREES, (t) => {
    tmp.position.set(t.x, t.y + 0.45 * t.s, t.z)
    tmp.rotation.set(0, t.r, 0)
    tmp.scale.setScalar(t.s)
  })
  const placeA = useMemo(
    () => (t, i) => {
      tmp.position.set(t.x, t.y + 1.45 * t.s, t.z)
      tmp.rotation.set(0, t.r, 0)
      tmp.scale.setScalar(t.s)
      crownA.current.setColorAt(i, col.set(LEAVES[Math.floor(t.v * LEAVES.length)]))
    },
    [],
  )
  const placeB = useMemo(
    () => (t, i) => {
      tmp.position.set(t.x, t.y + 2.2 * t.s, t.z)
      tmp.rotation.set(0, t.r + 0.5, 0)
      tmp.scale.setScalar(t.s * 0.72)
      crownB.current.setColorAt(i, col.set(LEAVES[(Math.floor(t.v * LEAVES.length) + 1) % LEAVES.length]))
    },
    [],
  )
  useInstances(crownA, TREES, placeA)
  useInstances(crownB, TREES, placeB)

  return (
    <group>
      <instancedMesh ref={trunks} args={[null, null, TREES.length]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 0.9, 5]} />
        <meshStandardMaterial color="#7a5133" flatShading />
      </instancedMesh>
      <instancedMesh ref={crownA} args={[null, null, TREES.length]} castShadow>
        <coneGeometry args={[0.95, 1.6, 6]} />
        <meshStandardMaterial flatShading roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={crownB} args={[null, null, TREES.length]} castShadow>
        <coneGeometry args={[0.95, 1.4, 6]} />
        <meshStandardMaterial flatShading roughness={0.9} />
      </instancedMesh>
    </group>
  )
}

export function Rocks() {
  const ref = useRef()
  useInstances(ref, ROCKS, (r) => {
    tmp.position.set(r.x, r.y + 0.1, r.z)
    tmp.rotation.set(r.r, r.r * 2, 0)
    tmp.scale.set(r.s * 0.8, r.s * 0.55, r.s * 0.7)
  })
  return (
    <instancedMesh ref={ref} args={[null, null, ROCKS.length]} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#9a9c94" flatShading />
    </instancedMesh>
  )
}

// High and far enough that neither the intro orbit nor the follow camera flies through them.
const CLOUDS = [
  [-48, 44, -40, 1.6], [36, 48, -56, 2], [64, 40, 6, 1.4], [-66, 46, 20, 1.8], [10, 50, 64, 1.5], [-20, 42, -70, 1.3],
]

export function Clouds() {
  const group = useRef()
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.01
  })
  return (
    <group ref={group}>
      {CLOUDS.map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          {[[0, 0, 0, 2.2], [2.1, -0.3, 0.4, 1.6], [-2, -0.4, -0.2, 1.5], [0.6, 0.9, -0.3, 1.4]].map(([a, b, c, r], k) => (
            <mesh key={k} position={[a, b, c]}>
              <icosahedronGeometry args={[r, 0]} />
              <meshStandardMaterial color="#ffffff" flatShading roughness={1} emissive="#ffffff" emissiveIntensity={0.25} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

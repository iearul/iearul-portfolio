// Small low-poly building blocks shared by the landmarks.

export function Box({ size = [1, 1, 1], color = '#fff', position, rotation, emissive, emissiveIntensity = 1, cast = true, ...rest }) {
  return (
    <mesh position={position} rotation={rotation} castShadow={cast} receiveShadow {...rest}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={0.85}
        emissive={emissive || '#000'}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
      />
    </mesh>
  )
}

export function Cyl({ r = 0.2, rTop, h = 1, seg = 8, color = '#fff', position, rotation, emissive, emissiveIntensity = 1, ...rest }) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow {...rest}>
      <cylinderGeometry args={[rTop ?? r, r, h, seg]} />
      <meshStandardMaterial
        color={color}
        flatShading
        roughness={0.85}
        emissive={emissive || '#000'}
        emissiveIntensity={emissive ? emissiveIntensity : 0}
      />
    </mesh>
  )
}

export function Cone({ r = 0.5, h = 1, seg = 6, color = '#fff', position, rotation, ...rest }) {
  return (
    <mesh position={position} rotation={rotation} castShadow {...rest}>
      <coneGeometry args={[r, h, seg]} />
      <meshStandardMaterial color={color} flatShading roughness={0.85} />
    </mesh>
  )
}

// Triangular roof spanning `w` along x and `d` along z; `position` is the
// centre of its base. A 3-sided cylinder laid on its side is a prism.
export function Roof({ w = 4, d = 3, h = 1.2, color = '#8a4b3b', position = [0, 0, 0] }) {
  const [x, y, z] = position
  return (
    <mesh position={[x, y + h / 3, z]} rotation={[-Math.PI / 2, 0, 0]} castShadow scale={[w / 1.732, d, h / 1.5]}>
      <cylinderGeometry args={[1, 1, 1, 3, 1]} />
      <meshStandardMaterial color={color} flatShading roughness={0.9} />
    </mesh>
  )
}

export function Plinth({ r = 3, h = 0.3, color = '#d8cdb8' }) {
  return <Cyl r={r} h={h} seg={10} color={color} position={[0, h / 2 - 0.05, 0]} />
}

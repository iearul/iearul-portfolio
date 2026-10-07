import { useMemo } from 'react'
import * as THREE from 'three'

export const HORIZON = '#ffe2c4'
const TOP = '#6fb3f2'

export function Sky() {
  const uniforms = useMemo(
    () => ({ uTop: { value: new THREE.Color(TOP) }, uHorizon: { value: new THREE.Color(HORIZON) } }),
    [],
  )
  return (
    <mesh scale={260} renderOrder={-1}>
      <sphereGeometry args={[1, 32, 16]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform vec3 uTop; uniform vec3 uHorizon; varying vec3 vP;
          void main(){ float t = smoothstep(-0.05, 0.6, normalize(vP).y); gl_FragColor = vec4(mix(uHorizon, uTop, t), 1.0);
          #include <colorspace_fragment>
          }`}
      />
    </mesh>
  )
}

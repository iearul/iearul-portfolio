import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { heightAt } from './terrain'

const SPAN = 84 // must match the terrain area the height texture covers
const RES = 128

// Bake terrain height into a small texture so the water shader can draw
// depth-based colour and shoreline foam.
function heightTexture() {
  const data = new Uint8Array(RES * RES * 4)
  for (let j = 0; j < RES; j++) {
    for (let i = 0; i < RES; i++) {
      const x = (i / (RES - 1) - 0.5) * SPAN
      const z = (j / (RES - 1) - 0.5) * SPAN
      const h = Math.max(-6, Math.min(2, heightAt(x, z)))
      const v = Math.round(((h + 6) / 8) * 255)
      data.set([v, v, v, 255], (j * RES + i) * 4)
    }
  }
  const tex = new THREE.DataTexture(data, RES, RES, THREE.RGBAFormat)
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearFilter
  tex.needsUpdate = true
  return tex
}

const vertex = /* glsl */ `
  uniform float uTime;
  varying vec2 vXZ;
  #include <fog_pars_vertex>
  void main() {
    vec3 p = position;
    p.y += sin(p.x * 0.35 + uTime * 1.1) * 0.05 + cos(p.z * 0.31 + uTime * 0.8) * 0.05;
    vXZ = p.xz;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uSpan;
  uniform sampler2D uHeight;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uFoam;
  varying vec2 vXZ;
  #include <fog_pars_fragment>
  void main() {
    vec2 uv = vXZ / uSpan + 0.5;
    float h = -6.0;
    if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) h = texture2D(uHeight, uv).r * 8.0 - 6.0;
    float depth = clamp(-h / 4.5, 0.0, 1.0);
    vec3 col = mix(uShallow, uDeep, smoothstep(0.05, 1.0, depth));
    float ripple = sin(h * 10.0 - uTime * 1.8) * 0.5 + 0.5;
    float foam = smoothstep(-0.85, -0.05, h) * (0.45 + 0.55 * ripple);
    float sp = sin(vXZ.x * 1.3 + sin(vXZ.y * 0.37) * 3.0 + uTime * 1.2) * sin(vXZ.y * 1.7 + sin(vXZ.x * 0.29) * 3.0 - uTime * 0.9);
    col += smoothstep(0.93, 1.0, sp) * 0.18;
    col = mix(col, uFoam, foam * 0.8);
    float alpha = max(mix(0.5, 0.94, depth), foam * 0.9);
    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`

export function Water() {
  const mat = useRef()
  const { geometry, uniforms } = useMemo(() => {
    const g = new THREE.PlaneGeometry(420, 420, 140, 140)
    g.rotateX(-Math.PI / 2)
    return {
      geometry: g,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.fog,
        {
          uTime: { value: 0 },
          uSpan: { value: SPAN },
          uHeight: { value: null },
          uDeep: { value: new THREE.Color('#1d5f86') },
          uShallow: { value: new THREE.Color('#4fc3c9') },
          uFoam: { value: new THREE.Color('#f4fbff') },
        },
      ]),
    }
  }, [])
  // merge() clones values, so the texture is assigned afterwards
  useMemo(() => {
    uniforms.uHeight.value = heightTexture()
  }, [uniforms])

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt
  })

  return (
    <mesh geometry={geometry} position={[0, 0, 0]} renderOrder={1}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        fog
      />
    </mesh>
  )
}

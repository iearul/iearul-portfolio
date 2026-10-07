import { Canvas } from '@react-three/fiber'
import { Island } from './world/Island'
import { Water } from './world/Water'
import { Sky, HORIZON } from './world/Sky'
import { Trees, Rocks, Clouds } from './world/Vegetation'
import { Landmarks } from './landmarks/Landmarks'
import { SkillOrbs } from './SkillOrbs'
import { Player, TargetMarker } from './Player'
import { CameraRig } from './CameraRig'

export default function Scene({ onReady }) {
  return (
    <Canvas
      className="scene"
      shadows
      dpr={[1, 1.75]}
      camera={{ fov: 45, near: 0.5, far: 600, position: [0, 34, 60] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={() => onReady?.()}
    >
      <color attach="background" args={[HORIZON]} />
      <fog attach="fog" args={[HORIZON, 70, 210]} />
      <hemisphereLight args={['#dff1ff', '#6b8f4e', 0.9]} />
      <directionalLight
        position={[28, 40, 18]}
        intensity={2.1}
        color="#fff3df"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-38}
        shadow-camera-right={38}
        shadow-camera-top={38}
        shadow-camera-bottom={-38}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-bias={-0.0006}
        shadow-normalBias={0.04}
      />
      <Sky />
      <Clouds />
      <Island />
      <Water />
      <Trees />
      <Rocks />
      <Landmarks />
      <SkillOrbs />
      <Player />
      <TargetMarker />
      <CameraRig />
    </Canvas>
  )
}

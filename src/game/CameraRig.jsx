import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../store/game'
import { player } from './playerState'

const OFFSET = new THREE.Vector3(0, 15, 15.5)
const look = new THREE.Vector3()
const goal = new THREE.Vector3()

// Intro: slow orbit around the island. Play: follow the player at a fixed
// angle; wheel / pinch zooms.
export function CameraRig() {
  const { camera, gl } = useThree()
  const lookAt = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    const el = gl.domElement
    const onWheel = (e) => {
      e.preventDefault()
      const g = useGame.getState()
      g.setZoom(g.zoom * (1 + Math.sign(e.deltaY) * 0.08))
    }
    let pinch = null
    const onTouchMove = (e) => {
      if (e.touches.length !== 2) return
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
      if (pinch) {
        const g = useGame.getState()
        g.setZoom(g.zoom * (pinch / d))
      }
      pinch = d
    }
    const onTouchEnd = () => (pinch = null)
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [gl])

  useFrame(({ clock, size }, dt) => {
    const g = useGame.getState()
    const narrow = size.width < 700
    if (g.phase === 'intro') {
      const t = clock.elapsedTime * 0.06
      const r = narrow ? 62 : 50
      goal.set(Math.sin(t) * r, narrow ? 36 : 30, Math.cos(t) * r)
      look.set(0, 0, 0)
    } else {
      const zoom = g.zoom * (narrow ? 1.25 : 1)
      goal.copy(player.pos).addScaledVector(OFFSET, zoom)
      look.copy(player.pos).add({ x: 0, y: 1, z: 0 })
      // when a panel covers the right side on desktop, shift the view so the
      // player stays visible on the left
      if (g.panel && !narrow) {
        goal.x += 4 * zoom
        look.x += 4 * zoom
      }
    }
    const k = 1 - Math.exp(-dt * (g.phase === 'intro' ? 1 : 3.2))
    camera.position.lerp(goal, k)
    lookAt.current.lerp(look, k)
    camera.lookAt(lookAt.current)
  })
  return null
}

import { useState } from 'react'
import { Html } from '@react-three/drei'
import { useGame } from '../../store/game'
import { doorOf } from '../../data/landmarks'
import { heightAt } from '../world/terrain'

// Positions a landmark on the terrain, faces it towards the island centre and
// makes it clickable (walk to its door, then open its panel).
export function Landmark({ l, labelHeight = 5, children }) {
  const [hover, setHover] = useState(false)
  const walkTo = useGame((s) => s.walkTo)
  const done = useGame((s) =>
    l.type === 'career' ? !!s.seen[`career:${l.id}`] : !!s.seen[`visit:${l.id}`],
  )
  const playing = useGame((s) => s.phase === 'play')
  const [x, z] = l.pos
  const y = heightAt(x, z)
  const face = Math.atan2(1 - x, 4 - z)

  const go = (e) => {
    e?.stopPropagation?.()
    const [dx, dz] = doorOf(l)
    walkTo(dx, dz, l.id)
  }

  return (
    <group position={[x, y, z]}>
      <group
        rotation={[0, face, 0]}
        onClick={(e) => e.delta < 10 && go(e)}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = ''
        }}
        scale={hover ? 1.03 : 1}
      >
        {children}
      </group>
      {playing && (
      <Html position={[0, labelHeight, 0]} center zIndexRange={[20, 0]} wrapperClass="lm-label-wrap">
        <button
          type="button"
          className={`lm-label${done ? ' is-done' : ''}${hover ? ' is-hover' : ''}`}
          style={{ '--accent': l.color }}
          onClick={go}
          tabIndex={playing ? 0 : -1}
        >
          <span className="lm-tag">{l.tag}</span>
          <span className="lm-name">{l.name}</span>
          {done && <span className="lm-check" aria-label="visited">✓</span>}
        </button>
      </Html>
      )}
    </group>
  )
}

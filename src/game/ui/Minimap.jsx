import { useEffect, useMemo, useRef } from 'react'
import { LANDMARKS, doorOf } from '../../data/landmarks'
import { coastRadius } from '../world/terrain'
import { useGame } from '../../store/game'
import { player } from '../playerState'

export function Minimap() {
  const dot = useRef()
  const walkTo = useGame((s) => s.walkTo)
  const seen = useGame((s) => s.seen)

  const coast = useMemo(() => {
    const pts = []
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2
      const r = coastRadius(a) * 0.96
      pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`)
    }
    return pts.join(' ')
  }, [])

  useEffect(() => {
    let raf
    const tick = () => {
      if (dot.current) {
        dot.current.setAttribute('cx', player.pos.x.toFixed(2))
        dot.current.setAttribute('cy', player.pos.z.toFixed(2))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="minimap card" aria-label="Island map">
      <svg viewBox="-33 -33 66 66">
        <polygon points={coast} className="mm-land" />
        {LANDMARKS.map((l) => {
          const done = l.type === 'career' ? seen[`career:${l.id}`] : seen[`visit:${l.id}`]
          return (
            <g
              key={l.id}
              className="mm-lm"
              role="button"
              tabIndex={0}
              aria-label={`Walk to ${l.name}`}
              onClick={() => walkTo(...doorOf(l), l.id)}
              onKeyDown={(e) => e.key === 'Enter' && walkTo(...doorOf(l), l.id)}
            >
              <title>{l.name}</title>
              <circle cx={l.pos[0]} cy={l.pos[1]} r={done ? 2.4 : 2} fill={l.color} stroke="#fff" strokeWidth={done ? 0.9 : 0.4} />
            </g>
          )
        })}
        <circle ref={dot} r="1.6" className="mm-player" />
      </svg>
    </div>
  )
}

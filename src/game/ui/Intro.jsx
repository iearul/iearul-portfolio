import { Link } from 'wouter'
import { useGame } from '../../store/game'
import { PROFILE } from '../../data/profile'
import { Icon } from './Icon'

export function Intro({ ready }) {
  const start = useGame((s) => s.start)
  const returning = useGame((s) => s.xp > 0)
  return (
    <div className="intro">
      <div className="intro-card card">
        <div className="kicker">A playable portfolio</div>
        <h1>Career Island</h1>
        <p className="intro-who">
          <strong>{PROFILE.name}</strong> · {PROFILE.role} · {PROFILE.location}
        </p>
        <p>
          Seven years of work, five levels, one island. Walk from my first classroom in Dhaka to my current job in
          Germany, collect skills on the way and play the project arcade.
        </p>
        <div className="links">
          <button type="button" className="primary-btn big" onClick={start} disabled={!ready} autoFocus>
            <Icon name="play" /> {ready ? (returning ? 'Continue exploring' : 'Start exploring') : 'Building the island…'}
          </button>
          <Link href="/cv" className="ghost-btn big">
            Recruiter mode (plain CV)
          </Link>
        </div>
        <div className="intro-keys">Click or tap to walk · WASD / arrows · E to enter · Q quest log</div>
      </div>
    </div>
  )
}

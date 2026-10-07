import { Link } from 'wouter'
import { useGame } from '../../../store/game'
import { LANDMARK_BY_ID, doorOf } from '../../../data/landmarks'
import { PROFILE } from '../../../data/profile'
import { PanelHeader } from './common'
import { Icon } from '../Icon'

export function WelcomePanel() {
  const walkTo = useGame((s) => s.walkTo)
  const first = LANDMARK_BY_ID.campus
  return (
    <>
      <PanelHeader kicker="Harbour sign" title={`Hi, I'm ${PROFILE.name}`} sub={`${PROFILE.role} · ${PROFILE.location}`} />
      <p>{PROFILE.summary}</p>
      <p>
        This island is my career as a game. Walk the road clockwise from the harbour: every building is a level, from my
        school years in Dhaka to my current job in Germany. Collect the glowing skill orbs on the way.
      </p>
      <ul className="controls">
        <li>
          <kbd>Click</kbd> / <kbd>Tap</kbd> walk somewhere
        </li>
        <li>
          <kbd>W A S D</kbd> / arrows walk
        </li>
        <li>
          <kbd>E</kbd> enter a building · <kbd>Q</kbd> quest log · <kbd>Esc</kbd> close
        </li>
      </ul>
      <div className="links">
        <button type="button" className="primary-btn" onClick={() => walkTo(...doorOf(first), first.id)}>
          Start at Level 1 <Icon name="next" />
        </button>
        <Link href="/cv" className="ghost-btn">
          In a hurry? Plain CV
        </Link>
      </div>
    </>
  )
}

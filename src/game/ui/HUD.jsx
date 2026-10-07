import { Link } from 'wouter'
import { useGame, levelFor, completion } from '../../store/game'
import { LANDMARK_BY_ID } from '../../data/landmarks'
import { SKILLS, PROFILE } from '../../data/profile'
import { panelFor } from '../Player'
import { Minimap } from './Minimap'
import { Icon } from './Icon'

const VERB = { career: 'Enter', welcome: 'Read', projects: 'Play', journal: 'Browse', skills: 'Inspect', contact: 'Open' }

export function HUD() {
  const s = useGame()
  const { level, progress, next } = levelFor(s.xp)
  const pct = Math.round(completion(s) * 100)
  const skills = Object.keys(s.collected).length
  const near = s.nearby ? LANDMARK_BY_ID[s.nearby] : null

  return (
    <>
      <div className="hud-player card">
        <div className="avatar" aria-hidden>MI</div>
        <div className="hud-player-info">
          <div className="hud-name">
            {PROFILE.short} <span className="lvl">Lv {level}</span>
          </div>
          <div className="xpbar" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Experience to next level">
            <span style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="hud-sub">
            {s.xp}
            {next ? ` / ${next}` : ''} XP · {pct}% explored
          </div>
        </div>
      </div>

      <nav className="hud-actions" aria-label="Game menu">
        <button type="button" className="hud-btn" onClick={s.toggleQuests} aria-expanded={s.questsOpen} title="Quest log (Q)">
          <Icon name="map" /> <span>Quests</span>
        </button>
        <button type="button" className="hud-btn" onClick={() => s.openPanel({ type: 'skills', id: 'tree' })} title="Skill tree">
          <Icon name="spark" /> <span>{skills}/{SKILLS.length}</span>
        </button>
        <Link href="/cv" className="hud-btn" title="Recruiter mode: the plain CV">
          <Icon name="file" /> <span>CV</span>
        </Link>
        <button type="button" className="hud-btn icon-only" onClick={s.toggleMute} aria-label={s.muted ? 'Unmute sound' : 'Mute sound'}>
          <Icon name={s.muted ? 'mute' : 'sound'} />
        </button>
      </nav>

      {near && !s.panel && (
        <button type="button" className="prompt" style={{ '--accent': near.color }} onClick={() => s.openPanel(panelFor(near.id))}>
          <kbd>E</kbd> {VERB[near.type]} <strong>{near.name}</strong>
        </button>
      )}

      <Minimap />

      {!s.seen.walk && !s.panel && (
        <div className="hint card">
          <strong>Click or tap</strong> the ground to walk · <strong>WASD</strong> / arrows · <strong>E</strong> to enter · scroll to zoom
        </div>
      )}
    </>
  )
}

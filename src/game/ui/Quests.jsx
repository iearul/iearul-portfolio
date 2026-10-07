import { useGame, ACHIEVEMENTS } from '../../store/game'
import { CAREER_LANDMARKS, LANDMARK_BY_ID, doorOf } from '../../data/landmarks'
import { SKILLS } from '../../data/profile'
import { Icon } from './Icon'

function Row({ done, title, sub, onGo }) {
  return (
    <li className={`quest${done ? ' is-done' : ''}`}>
      <span className="quest-box" aria-hidden>{done && <Icon name="check" size={14} />}</span>
      <div className="quest-text">
        <div>{title}</div>
        {sub && <div className="quest-sub">{sub}</div>}
      </div>
      {onGo && (
        <button type="button" className="mini-btn" onClick={onGo}>
          Go
        </button>
      )}
    </li>
  )
}

export function Quests() {
  const s = useGame()
  if (!s.questsOpen) return null
  const go = (id) => {
    const l = LANDMARK_BY_ID[id]
    s.toggleQuests()
    s.walkTo(...doorOf(l), id)
  }
  const skills = Object.keys(s.collected).length

  return (
    <aside className="quests card" aria-label="Quest log">
      <header className="quests-head">
        <h2>Quest log</h2>
        <button type="button" className="icon-btn" onClick={s.toggleQuests} aria-label="Close quest log">
          <Icon name="close" />
        </button>
      </header>
      <h3>Career levels</h3>
      <ul>
        {CAREER_LANDMARKS.map((l) => (
          <Row key={l.id} done={s.seen[`career:${l.id}`]} title={`${l.tag.replace(' · NOW', '')} · ${l.name}`} sub={l.years} onGo={() => go(l.id)} />
        ))}
      </ul>
      <h3>Side quests</h3>
      <ul>
        <Row done={skills === SKILLS.length} title={`Collect skill orbs (${skills}/${SKILLS.length})`} sub="Glowing orbs are scattered along the road" />
        <Row done={s.seen['panel:projects']} title="Play at the Project Arcade" onGo={() => go('arcade')} />
        <Row done={s.seen['panel:journal']} title="Visit the Journal Library" onGo={() => go('library')} />
        <Row done={s.seen['panel:skills']} title="Inspect the Skill Tree" onGo={() => go('tree')} />
        <Row done={s.seen['message:sent']} title="Send a letter from the Mailbox" onGo={() => go('mailbox')} />
      </ul>
      <h3>Achievements</h3>
      <ul className="achievements">
        {Object.entries(ACHIEVEMENTS).map(([id, a]) => (
          <li key={id} className={s.achievements[id] ? 'is-done' : ''} title={a.text}>
            <Icon name="trophy" size={16} /> {a.title}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="link-btn"
        onClick={() => {
          if (window.confirm('Reset your island progress?')) s.resetProgress()
        }}
      >
        Reset progress
      </button>
    </aside>
  )
}

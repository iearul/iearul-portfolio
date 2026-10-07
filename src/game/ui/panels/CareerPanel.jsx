import { useContent, careerForZone } from '../../../store/content'
import { useGame } from '../../../store/game'
import { CAREER_LANDMARKS, doorOf } from '../../../data/landmarks'
import { renderMarkdown } from '../../../lib/markdown'
import { PanelHeader, Chips } from './common'
import { Icon } from '../Icon'

const KIND = { education: 'Education', work: 'Work', founder: 'Founder' }

export function CareerPanel({ landmark }) {
  const career = useContent((s) => s.career)
  const walkTo = useGame((s) => s.walkTo)
  const entries = careerForZone(career, landmark.zone)
  const idx = CAREER_LANDMARKS.findIndex((l) => l.id === landmark.id)
  const prev = CAREER_LANDMARKS[idx - 1]
  const next = CAREER_LANDMARKS[idx + 1]
  const travel = (l) => walkTo(...doorOf(l), l.id)

  return (
    <>
      <PanelHeader kicker={`${landmark.tag} · ${landmark.years}`} title={landmark.name} />
      {entries.length === 0 && <p className="muted">This level is still being written.</p>}
      <ol className="timeline">
        {entries.map((e) => (
          <li key={e.id} className="timeline-item">
            <div className="timeline-meta">
              <span className={`badge badge-${e.kind}`}>{KIND[e.kind] ?? e.kind}</span>
              <span>{e.period}</span>
            </div>
            <h3>{e.title}</h3>
            <div className="org">
              {e.organization}
              {e.location && (
                <span className="loc">
                  <Icon name="pin" size={13} /> {e.location}
                </span>
              )}
            </div>
            {e.summary && <p>{e.summary}</p>}
            {e.highlights && <div className="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(e.highlights) }} />}
            <Chips items={e.tech} />
          </li>
        ))}
      </ol>
      <footer className="panel-nav">
        {prev ? (
          <button type="button" className="ghost-btn" onClick={() => travel(prev)}>
            <Icon name="back" /> {prev.name}
          </button>
        ) : (
          <span />
        )}
        {next && (
          <button type="button" className="primary-btn" onClick={() => travel(next)}>
            Next level: {next.name} <Icon name="next" />
          </button>
        )}
      </footer>
    </>
  )
}

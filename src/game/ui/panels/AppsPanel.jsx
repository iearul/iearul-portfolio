import { APPS, RELEASE_STAGES } from '../../../data/profile'
import { PanelHeader, Chips } from './common'
import { Icon } from '../Icon'

function ReleaseTrack({ stage }) {
  return (
    <ol className="release-track" aria-label={`Release stage: ${RELEASE_STAGES[stage]}`}>
      {RELEASE_STAGES.map((name, i) => (
        <li key={name} className={i < stage ? 'is-done' : i === stage ? 'is-now' : ''}>
          {name}
        </li>
      ))}
    </ol>
  )
}

export function AppsPanel() {
  return (
    <>
      <PanelHeader
        kicker="App Studio · Android & iOS"
        title="Apps I ship"
        sub="Small, focused apps I design, build and publish myself: Kotlin and Jetpack Compose on Android, Swift and SwiftUI on iOS."
      />
      <div className="app-list">
        {APPS.map((a) => (
          <article key={a.slug} className="app-card">
            <header className="app-card-head">
              <img className="app-icon" src={a.icon} alt="" width="56" height="56" loading="lazy" />
              <div>
                <h3>{a.name}</h3>
                <div className="app-status">{a.status}</div>
              </div>
            </header>
            <ReleaseTrack stage={a.stage} />
            <p>{a.summary}</p>
            <Chips items={a.tech} />
            {/* Plain <a>: the app pages are static, outside the SPA. */}
            <div className="links">
              <a className="primary-btn" href={a.page}>
                App page <Icon name="next" size={16} />
              </a>
              {a.cta && (
                <a className="ghost-btn" href={a.cta.url} target="_blank" rel="noopener noreferrer">
                  {a.cta.label} <Icon name="ext" size={16} />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

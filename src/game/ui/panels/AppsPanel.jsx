import { useContent } from '../../../store/content'
import { RELEASE_STAGES } from '../../../data/profile'
import { PanelHeader, Chips } from './common'
import { Icon } from '../Icon'

function ReleaseTrack({ stage }) {
  const now = Math.max(0, RELEASE_STAGES.findIndex((s) => s.id === stage))
  return (
    <ol className="release-track" aria-label={`Release stage: ${RELEASE_STAGES[now].label}`}>
      {RELEASE_STAGES.map((s, i) => (
        <li key={s.id} className={i < now ? 'is-done' : i === now ? 'is-now' : ''}>
          {s.label}
        </li>
      ))}
    </ol>
  )
}

function AppIcon({ app }) {
  if (app.icon_url) return <img className="app-icon" src={app.icon_url} alt="" width="56" height="56" loading="lazy" />
  const hue = [...app.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <div className="app-icon cover-gen" style={{ '--h': hue }} aria-hidden>
      <span>{app.name.slice(0, 1)}</span>
    </div>
  )
}

// Store buttons once an app is live, then its page and the extra button (beta).
export function AppLinks({ app }) {
  const stores = [
    app.play_store_url && ['Google Play', app.play_store_url],
    app.app_store_url && ['App Store', app.app_store_url],
  ].filter(Boolean)
  return (
    <div className="links">
      {stores.map(([label, url]) => (
        <a key={label} className="primary-btn" href={url} target="_blank" rel="noopener noreferrer">
          {label} <Icon name="ext" size={16} />
        </a>
      ))}
      {/* Plain <a>: the app pages are static, outside the SPA. */}
      {app.page_url && (
        <a className={stores.length ? 'ghost-btn' : 'primary-btn'} href={app.page_url}>
          App page <Icon name="next" size={16} />
        </a>
      )}
      {app.cta_label && app.cta_url && (
        <a className="ghost-btn" href={app.cta_url} target="_blank" rel="noopener noreferrer">
          {app.cta_label} <Icon name="ext" size={16} />
        </a>
      )}
    </div>
  )
}

export function AppsPanel() {
  const apps = useContent((s) => s.apps)
  return (
    <>
      <PanelHeader
        kicker="App Studio · Android & iOS"
        title="Apps I ship"
        sub="Small, focused apps I design, build and publish myself: Kotlin and Jetpack Compose on Android, Swift and SwiftUI on iOS."
      />
      <div className="app-list">
        {apps.map((a) => (
          <article key={a.slug} className="app-card">
            <header className="app-card-head">
              <AppIcon app={a} />
              <div>
                <h3>{a.name}</h3>
                {a.status && <div className="app-status">{a.status}</div>}
              </div>
            </header>
            <ReleaseTrack stage={a.stage} />
            {a.summary && <p>{a.summary}</p>}
            <Chips items={a.tech} />
            <AppLinks app={a} />
          </article>
        ))}
      </div>
    </>
  )
}

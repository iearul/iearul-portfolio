import { useEffect, useState } from 'react'
import { useContent } from '../../../store/content'
import { useGame } from '../../../store/game'
import { api } from '../../../lib/api'
import { renderMarkdown } from '../../../lib/markdown'
import { PanelHeader, Chips } from './common'
import { Icon } from '../Icon'

function Cover({ p, large }) {
  if (p.cover_url) return <img className={`cover${large ? ' cover-lg' : ''}`} src={p.cover_url} alt="" loading="lazy" />
  const hue = [...p.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
  return (
    <div className={`cover cover-gen${large ? ' cover-lg' : ''}`} style={{ '--h': hue }} aria-hidden>
      <span>{p.title.slice(0, 1)}</span>
    </div>
  )
}

export function ProjectLinks({ p }) {
  return (
    <div className="links">
      {p.project_url && (
        <a className="primary-btn" href={p.project_url} target="_blank" rel="noopener noreferrer">
          Visit <Icon name="ext" size={16} />
        </a>
      )}
      {p.repo_url && (
        <a className="ghost-btn" href={p.repo_url} target="_blank" rel="noopener noreferrer">
          <Icon name="github" size={16} /> Code
        </a>
      )}
    </div>
  )
}

export function ProjectsPanel() {
  const projects = useContent((s) => s.projects)
  const open = useGame((s) => s.openPanel)
  return (
    <>
      <PanelHeader kicker="Project Arcade" title="Pick a game" sub="Things I built for clients, communities and myself." />
      <div className="project-grid">
        {projects.map((p) => (
          <button key={p.slug} type="button" className="project-card" onClick={() => open({ type: 'project', id: 'arcade', slug: p.slug })}>
            <Cover p={p} />
            <div className="project-card-body">
              <div className="project-card-top">
                <h3>{p.title}</h3>
                {p.is_featured && <span className="badge badge-featured">Featured</span>}
              </div>
              <p>{p.summary}</p>
              <div className="project-meta">
                {[p.category, p.year].filter(Boolean).join(' · ')}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

export function ProjectDetail({ panel }) {
  const list = useContent((s) => s.projects)
  const open = useGame((s) => s.openPanel)
  const base = list.find((p) => p.slug === panel.slug)
  const [full, setFull] = useState(null)

  useEffect(() => {
    let alive = true
    api
      .project(panel.slug)
      .then((p) => alive && setFull(p))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [panel.slug])

  const p = full || base
  if (!p) return <p className="muted">Project not found.</p>
  return (
    <>
      <button type="button" className="link-btn back" onClick={() => open({ type: 'projects', id: 'arcade' })}>
        <Icon name="back" size={16} /> All projects
      </button>
      <PanelHeader kicker={[p.category, p.year].filter(Boolean).join(' · ')} title={p.title} sub={p.summary} />
      <Cover p={p} large />
      <Chips items={p.tech} />
      {p.body && <div className="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />}
      <ProjectLinks p={p} />
    </>
  )
}

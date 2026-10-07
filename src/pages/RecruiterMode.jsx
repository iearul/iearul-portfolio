import { useEffect } from 'react'
import { Link } from 'wouter'
import { Page } from './Page'
import { useContent } from '../store/content'
import { PROFILE, SKILLS } from '../data/profile'
import { renderMarkdown } from '../lib/markdown'
import { Icon } from '../game/ui/Icon'
import { ContactLinks } from '../game/ui/panels/ContactPanel'
import { ProjectLinks } from '../game/ui/panels/ProjectsPanel'
import { Chips } from '../game/ui/panels/common'

function Entry({ e }) {
  return (
    <article className="cv-entry">
      <div className="cv-when">{e.period}</div>
      <div>
        <h3>{e.title}</h3>
        <div className="org">
          {e.organization}
          {e.location ? ` · ${e.location}` : ''}
        </div>
        {e.summary && <p>{e.summary}</p>}
        {e.highlights && <div className="md" dangerouslySetInnerHTML={{ __html: renderMarkdown(e.highlights) }} />}
        <Chips items={e.tech} />
      </div>
    </article>
  )
}

export default function RecruiterMode({ notice }) {
  const { career, projects, load } = useContent()
  useEffect(() => {
    load()
  }, [load])

  const byNewest = [...career].sort((a, b) => b.level - a.level)
  const work = byNewest.filter((c) => c.kind !== 'education')
  const edu = byNewest.filter((c) => c.kind === 'education')
  const groups = [...new Set(SKILLS.map((s) => s.group))]

  return (
    <Page title="CV" className="cv">
      {notice && <p className="notice">{notice}</p>}
      <section className="cv-hero">
        <div>
          <div className="kicker">Recruiter mode</div>
          <h1>{PROFILE.name}</h1>
          <p className="cv-role">
            {PROFILE.role} · <Icon name="pin" size={15} /> {PROFILE.location}
          </p>
          <p className="cv-summary">{PROFILE.summary}</p>
          <ContactLinks />
        </div>
        <div className="cv-actions no-print">
          <Link href="/" className="primary-btn">
            <Icon name="play" /> Play the island
          </Link>
          <button type="button" className="ghost-btn" onClick={() => window.print()}>
            Print / save as PDF
          </button>
        </div>
      </section>

      <section className="cv-section">
        <h2>Experience</h2>
        {work.map((e) => (
          <Entry key={e.id} e={e} />
        ))}
      </section>

      <section className="cv-section">
        <h2>Education</h2>
        {edu.map((e) => (
          <Entry key={e.id} e={e} />
        ))}
      </section>

      <section className="cv-section">
        <h2>Skills</h2>
        <div className="cv-skills">
          {groups.map((g) => (
            <div key={g}>
              <h3>{g}</h3>
              <Chips items={SKILLS.filter((s) => s.group === g).map((s) => s.name)} />
            </div>
          ))}
          <div>
            <h3>Languages</h3>
            <Chips items={PROFILE.languages.map((l) => `${l.name} ${l.level}`)} />
          </div>
        </div>
      </section>

      <section className="cv-section">
        <h2>Projects</h2>
        <div className="cv-projects">
          {projects.map((p) => (
            <article key={p.slug} className="cv-project">
              <h3>{p.title}</h3>
              <div className="org">{[p.category, p.year].filter(Boolean).join(' · ')}</div>
              <p>{p.summary}</p>
              <Chips items={p.tech} />
              <ProjectLinks p={p} />
            </article>
          ))}
        </div>
      </section>
    </Page>
  )
}

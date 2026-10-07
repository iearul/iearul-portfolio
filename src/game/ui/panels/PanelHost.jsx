import { useEffect, useRef } from 'react'
import { useGame } from '../../../store/game'
import { LANDMARK_BY_ID } from '../../../data/landmarks'
import { Icon } from '../Icon'
import { CareerPanel } from './CareerPanel'
import { ProjectsPanel, ProjectDetail } from './ProjectsPanel'
import { JournalPanel } from './JournalPanel'
import { SkillsPanel } from './SkillsPanel'
import { ContactPanel } from './ContactPanel'
import { WelcomePanel } from './WelcomePanel'

const BODIES = {
  career: CareerPanel,
  projects: ProjectsPanel,
  project: ProjectDetail,
  journal: JournalPanel,
  skills: SkillsPanel,
  contact: ContactPanel,
  welcome: WelcomePanel,
}

export function PanelHost() {
  const panel = useGame((s) => s.panel)
  const close = useGame((s) => s.closePanel)
  const ref = useRef()

  useEffect(() => {
    if (panel) ref.current?.focus()
  }, [panel])

  if (!panel) return null
  const Body = BODIES[panel.type]
  const lm = LANDMARK_BY_ID[panel.id] || LANDMARK_BY_ID.dock

  return (
    <section
      ref={ref}
      tabIndex={-1}
      className="panel card"
      style={{ '--accent': lm.color }}
      role="dialog"
      aria-modal="false"
      aria-label={lm.name}
    >
      <button type="button" className="icon-btn panel-close" onClick={close} aria-label="Close (Esc)">
        <Icon name="close" />
      </button>
      <div className="panel-scroll">{Body && <Body panel={panel} landmark={lm} />}</div>
    </section>
  )
}

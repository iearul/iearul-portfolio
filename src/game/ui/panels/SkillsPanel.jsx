import { useGame } from '../../../store/game'
import { SKILLS } from '../../../data/profile'
import { PanelHeader } from './common'

export function SkillsPanel() {
  const collected = useGame((s) => s.collected)
  const groups = [...new Set(SKILLS.map((s) => s.group))]
  const count = Object.keys(collected).length
  return (
    <>
      <PanelHeader
        kicker={`Skill Tree · ${count}/${SKILLS.length} unlocked`}
        title="What I work with"
        sub="Every glowing orb on the island is a skill. Collect them and the tree lights up. Gold = daily tools, silver = familiar."
      />
      <div className="skill-progress">
        <span style={{ width: `${(count / SKILLS.length) * 100}%` }} />
      </div>
      {groups.map((g) => (
        <section key={g} className="skill-group">
          <h3>{g}</h3>
          <ul className="skills">
            {SKILLS.filter((s) => s.group === g).map((s) => {
              const on = !!collected[s.id]
              return (
                <li key={s.id} className={`skill ${s.tier}${on ? ' is-on' : ''}`} title={on ? 'Collected' : 'Find this orb on the island'}>
                  <span className="skill-gem" aria-hidden />
                  {s.name}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      <p className="muted small">Not collected yet? They are still my skills. The orbs are just more fun.</p>
    </>
  )
}

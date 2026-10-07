import { LANDMARKS } from '../../data/landmarks'
import { Landmark } from './Landmark'
import { Arcade, Campus, Dock, Factory, Library, Mailbox, SkillTree, Startup, Tower, University } from './Buildings'

const MODELS = {
  dock: [Dock, 3.2],
  campus: [Campus, 5.6],
  startup: [Startup, 4.6],
  university: [University, 5.8],
  factory: [Factory, 7.8],
  tower: [Tower, 13],
  arcade: [Arcade, 5],
  library: [Library, 6],
  tree: [SkillTree, 7],
  mailbox: [Mailbox, 2.8],
}

export function Landmarks() {
  return LANDMARKS.map((l) => {
    const [Model, labelHeight] = MODELS[l.id]
    return (
      <Landmark key={l.id} l={l} labelHeight={labelHeight}>
        <Model />
      </Landmark>
    )
  })
}

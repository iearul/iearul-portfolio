// Island layout. Positions are [x, z] on the ground plane (y is up).
// Career zones are walked clockwise from the harbour, oldest to newest.
// `zone` links a landmark to career levels from the API (career_levels.zone).

export const LANDMARKS = [
  {
    id: 'dock', type: 'welcome', name: 'Harbour', tag: 'Start',
    pos: [0, 24.5], radius: 3.6, footprint: 0, color: '#f2d7a1',
  },
  {
    id: 'campus', type: 'career', zone: 'campus', stage: 1, name: 'Dhaka Campus', tag: 'LV 1',
    years: '2009 – 2016', pos: [-16, 14], radius: 5, footprint: 2.6, color: '#c8553d',
  },
  {
    id: 'startup', type: 'career', zone: 'startup', stage: 2, name: 'Zettabyte Launchpad', tag: 'LV 2',
    years: '2017 – 2022', pos: [-19.5, -3.5], radius: 5, footprint: 2.4, color: '#7b5cff',
  },
  {
    id: 'university', type: 'career', zone: 'university', stage: 3, name: 'Wuppertal University', tag: 'LV 3',
    years: '2018 –', pos: [-9, -19], radius: 5, footprint: 2.8, color: '#3f7cac',
  },
  {
    id: 'factory', type: 'career', zone: 'factory', stage: 4, name: 'Bauer Machine Yard', tag: 'LV 4',
    years: '2023', pos: [11, -19], radius: 5.2, footprint: 2.8, color: '#f2b134',
  },
  {
    id: 'tower', type: 'career', zone: 'tower', stage: 5, name: 'Weezly Tower', tag: 'LV 5 · NOW',
    years: '2024 – now', pos: [21, -3], radius: 5, footprint: 2.4, color: '#2ec4b6',
  },
  {
    id: 'arcade', type: 'projects', name: 'Project Arcade', tag: 'Projects',
    pos: [13, 10], radius: 4.4, footprint: 1.8, color: '#ff5d8f',
  },
  {
    id: 'library', type: 'journal', name: 'Journal Library', tag: 'Journal',
    pos: [-5.5, 6.5], radius: 4.4, footprint: 2, color: '#a0522d',
  },
  {
    id: 'tree', type: 'skills', name: 'Skill Tree', tag: 'Skills',
    pos: [3, -6], radius: 5, footprint: 1.6, color: '#5fae4f',
  },
  {
    id: 'mailbox', type: 'contact', name: 'Mailbox', tag: 'Contact',
    pos: [9, 21.5], radius: 3.4, footprint: 0.7, color: '#e63946',
  },
]

export const LANDMARK_BY_ID = Object.fromEntries(LANDMARKS.map((l) => [l.id, l]))

export const CAREER_LANDMARKS = LANDMARKS.filter((l) => l.type === 'career')

export const SPAWN = [0, 21]

// The walkable "road" visits every landmark once, in story order.
export const ROAD = ['dock', 'campus', 'startup', 'university', 'tree', 'factory', 'tower', 'arcade', 'mailbox', 'dock']

// The point in front of a landmark where the player stops (towards the centre).
export function doorOf(l) {
  const [x, z] = l.pos
  const dx = 1 - x
  const dz = 4 - z
  const d = Math.hypot(dx, dz) || 1
  const off = l.footprint + 1.4
  return [x + (dx / d) * off, z + (dz / d) * off]
}

// Skill orbs, scattered roughly along the road.
export const ORB_SPOTS = [
  [-6, 20], [-11, 18], [-20, 9], [-24, 2], [-18, -10], [-14, -15],
  [-3, -14], [4, -13], [16, -14], [19, -10], [24, 3], [18, 6],
  [7, 15], [-1, 12], [-11, 1], [9, -1], [0, 2],
]

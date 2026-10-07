import { create } from 'zustand'
import { SKILLS } from '../data/profile'
import { CAREER_LANDMARKS, LANDMARK_BY_ID } from '../data/landmarks'
import { sfx, setMuted } from '../lib/sound'

const SAVE_KEY = 'career-island:v1'

export const LEVELS = [0, 150, 400, 700, 1050, 1450]

export const ACHIEVEMENTS = {
  'first-steps': { title: 'First steps', text: 'Walked onto the island.' },
  'time-traveler': { title: 'Time traveler', text: 'Explored all five career levels.' },
  polyglot: { title: 'Polyglot', text: 'Collected 8 skill orbs.' },
  collector: { title: 'Full stack', text: 'Collected every skill orb.' },
  'arcade-regular': { title: 'Arcade regular', text: 'Looked at 3 projects.' },
  bookworm: { title: 'Bookworm', text: 'Opened the journal.' },
  hello: { title: 'Say hello', text: 'Sent a message from the mailbox.' },
  completionist: { title: 'Completionist', text: 'Explored 100% of the island.' },
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persist(state) {
  try {
    const { xp, seen, collected, achievements, muted } = state
    localStorage.setItem(SAVE_KEY, JSON.stringify({ xp, seen, collected, achievements, muted }))
  } catch {
    /* storage unavailable (private mode) — progress just isn't kept */
  }
}

export function levelFor(xp) {
  let lvl = 1
  LEVELS.forEach((need, i) => {
    if (xp >= need) lvl = i + 1
  })
  const cur = LEVELS[lvl - 1]
  const next = LEVELS[lvl] ?? null
  return { level: lvl, progress: next ? (xp - cur) / (next - cur) : 1, next }
}

// Checklist that defines "100% explored".
export function completion(state) {
  const goals = [
    ...CAREER_LANDMARKS.map((l) => !!state.seen[`career:${l.id}`]),
    ...SKILLS.map((s) => !!state.collected[s.id]),
    !!state.seen['panel:projects'],
    !!state.seen['panel:journal'],
    !!state.seen['panel:skills'],
    !!state.seen['panel:contact'],
  ]
  return goals.filter(Boolean).length / goals.length
}

const saved = loadSave()
if (saved?.muted) setMuted(true)

let toastId = 0

export const useGame = create((set, get) => ({
  phase: 'intro', // intro | play
  panel: null, // { type, id?, slug? }
  nearby: null, // landmark id in range
  target: null, // { x, z, landmark? }
  xp: saved?.xp ?? 0,
  seen: saved?.seen ?? {},
  collected: saved?.collected ?? {},
  achievements: saved?.achievements ?? {},
  muted: saved?.muted ?? false,
  toasts: [],
  zoom: 1,
  questsOpen: false,

  start: () => set({ phase: 'play' }),

  toast: (toast) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts.slice(-3), { id, ...toast }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), toast.ttl ?? 3400)
  },

  // Grant XP once per key. Returns true when it was new.
  award: (key, xp, label) => {
    const s = get()
    if (s.seen[key]) return false
    const before = levelFor(s.xp).level
    const nextXp = s.xp + xp
    set({ seen: { ...s.seen, [key]: true }, xp: nextXp })
    if (label) get().toast({ kind: 'xp', text: label, xp })
    const after = levelFor(nextXp).level
    if (after > before) {
      sfx.levelUp()
      get().toast({ kind: 'level', text: `Level up! You are now level ${after}.`, ttl: 4200 })
    }
    get().checkAchievements()
    persist(get())
    return true
  },

  unlock: (id) => {
    const s = get()
    if (s.achievements[id] || !ACHIEVEMENTS[id]) return
    set({ achievements: { ...s.achievements, [id]: Date.now() } })
    sfx.achievement()
    get().toast({ kind: 'achievement', text: ACHIEVEMENTS[id].title, sub: ACHIEVEMENTS[id].text, ttl: 4600 })
    persist(get())
  },

  checkAchievements: () => {
    const s = get()
    const careers = CAREER_LANDMARKS.filter((l) => s.seen[`career:${l.id}`]).length
    const skills = Object.keys(s.collected).length
    const projects = Object.keys(s.seen).filter((k) => k.startsWith('project:')).length
    if (careers === CAREER_LANDMARKS.length) s.unlock('time-traveler')
    if (skills >= 8) s.unlock('polyglot')
    if (skills >= SKILLS.length) s.unlock('collector')
    if (projects >= 3) s.unlock('arcade-regular')
    if (s.seen['panel:journal']) s.unlock('bookworm')
    if (s.seen['message:sent']) s.unlock('hello')
    if (completion(get()) >= 1) get().unlock('completionist')
  },

  collectSkill: (id) => {
    const s = get()
    if (s.collected[id]) return
    const skill = SKILLS.find((k) => k.id === id)
    set({ collected: { ...s.collected, [id]: Date.now() } })
    sfx.collect()
    get().award(`skill:${id}`, 30, `Skill unlocked: ${skill?.name ?? id}`)
  },

  enterLandmark: (id) => {
    set({ nearby: id })
    if (id) get().award(`visit:${id}`, 25, `Discovered ${LANDMARK_BY_ID[id].name}`)
  },
  leaveLandmark: () => set({ nearby: null }),

  openPanel: (panel) => {
    sfx.open()
    set({ panel, target: null, questsOpen: false })
    const g = get()
    const lm = panel.id ? LANDMARK_BY_ID[panel.id] : null
    if (panel.type === 'career' && lm) g.award(`career:${lm.id}`, 100, `${lm.tag}: ${lm.name}`)
    if (panel.type === 'projects') g.award('panel:projects', 60, 'Opened the Project Arcade')
    if (panel.type === 'project') g.award(`project:${panel.slug}`, 15, null)
    if (panel.type === 'journal') g.award('panel:journal', 60, 'Opened the Journal Library')
    if (panel.type === 'skills') g.award('panel:skills', 40, 'Inspected the Skill Tree')
    if (panel.type === 'contact') g.award('panel:contact', 30, 'Found the Mailbox')
    if (panel.type === 'welcome') g.award('panel:welcome', 20, null)
  },
  closePanel: () => set({ panel: null }),

  walkTo: (x, z, landmark = null) => {
    if (get().phase !== 'play') return
    set({ target: { x, z, landmark, t: performance.now() }, panel: null })
    get().award('walk', 0, null) && get().unlock('first-steps')
  },
  clearTarget: () => set({ target: null }),

  setZoom: (zoom) => set({ zoom: Math.min(1.7, Math.max(0.55, zoom)) }),
  toggleQuests: () => set((s) => ({ questsOpen: !s.questsOpen })),

  toggleMute: () => {
    const muted = !get().muted
    setMuted(muted)
    set({ muted })
    persist(get())
  },

  resetProgress: () => {
    set({ xp: 0, seen: {}, collected: {}, achievements: {}, panel: null })
    persist(get())
  },
}))

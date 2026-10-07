import { create } from 'zustand'
import { api } from '../lib/api'
import { FALLBACK_CAREER, FALLBACK_PROJECTS, FALLBACK_POSTS } from '../data/profile'

// Portfolio content from the admin API, with built-in fallbacks so the island
// is always playable even when the API is unreachable.
export const useContent = create((set, get) => ({
  career: FALLBACK_CAREER,
  projects: FALLBACK_PROJECTS,
  posts: FALLBACK_POSTS,
  status: 'idle', // idle | loading | ready
  online: false,

  load: async () => {
    if (get().status !== 'idle') return
    set({ status: 'loading' })
    const [career, projects, posts] = await Promise.allSettled([api.career(), api.projects(), api.posts()])
    const ok = (r) => r.status === 'fulfilled' && Array.isArray(r.value)
    set({
      career: ok(career) && career.value.length ? career.value : FALLBACK_CAREER,
      projects: ok(projects) && projects.value.length ? projects.value : FALLBACK_PROJECTS,
      posts: ok(posts) ? posts.value : FALLBACK_POSTS,
      online: ok(career) || ok(projects) || ok(posts),
      status: 'ready',
    })
  },
}))

export function careerForZone(career, zone) {
  return career.filter((c) => c.zone === zone).sort((a, b) => a.level - b.level)
}

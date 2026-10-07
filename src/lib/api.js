const BASE = (import.meta.env.VITE_API_BASE || 'https://admin.iearul.xyz/api/portfolio').replace(/\/$/, '')

async function request(path, { method = 'GET', body, timeout = 8000 } = {}) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeout)
  try {
    const res = await fetch(BASE + path, {
      method,
      signal: ctrl.signal,
      headers: { Accept: 'application/json', ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(json.message || `Request failed (${res.status})`)
      err.status = res.status
      err.errors = json.errors || {}
      throw err
    }
    return json
  } finally {
    clearTimeout(timer)
  }
}

export const api = {
  career: () => request('/career').then((r) => r.data),
  projects: () => request('/projects').then((r) => r.data),
  project: (slug) => request(`/projects/${encodeURIComponent(slug)}`).then((r) => r.data),
  posts: () => request('/posts').then((r) => r.data),
  post: (slug) => request(`/posts/${encodeURIComponent(slug)}`).then((r) => r.data),
  sendMessage: (payload) => request('/messages', { method: 'POST', body: payload, timeout: 12000 }),
}

import { useEffect, useState } from 'react'
import Scene from './Scene'
import { HUD } from './ui/HUD'
import { Quests } from './ui/Quests'
import { Toasts } from './ui/Toasts'
import { Intro } from './ui/Intro'
import { PanelHost } from './ui/panels/PanelHost'
import { useGame } from '../store/game'
import { useContent } from '../store/content'
import { panelFor } from './Player'
import { player } from './playerState'

// Dev-only handle for poking at the game from the console.
if (import.meta.env.DEV) window.__island = { useGame, player }

const KEYS = {
  KeyW: 'up',
  ArrowUp: 'up',
  KeyS: 'down',
  ArrowDown: 'down',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

export default function Game() {
  const [ready, setReady] = useState(false)
  const phase = useGame((s) => s.phase)
  const load = useContent((s) => s.load)

  useEffect(() => {
    load()
    document.title = 'Career Island · Md Iearulislam'
    document.documentElement.classList.add('is-game')
    return () => document.documentElement.classList.remove('is-game')
  }, [load])

  // First visit: show the harbour sign once the camera has landed.
  useEffect(() => {
    if (phase !== 'play') return
    const t = setTimeout(() => {
      const g = useGame.getState()
      if (!g.seen['panel:welcome'] && !g.panel) g.openPanel({ type: 'welcome', id: 'dock' })
    }, 1100)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    const typing = (e) => e.target.closest?.('input, textarea, select, [contenteditable="true"]')
    const down = (e) => {
      if (typing(e)) return
      const g = useGame.getState()
      if (e.key === 'Escape') {
        if (g.panel) g.closePanel()
        else if (g.questsOpen) g.toggleQuests()
        return
      }
      if (g.phase !== 'play' || g.panel) return
      const dir = KEYS[e.code]
      if (dir) {
        player.keys.add(dir)
        e.preventDefault()
      } else if (e.code === 'KeyE' && g.nearby) {
        g.openPanel(panelFor(g.nearby))
      } else if (e.code === 'KeyQ') {
        g.toggleQuests()
      }
    }
    const up = (e) => {
      const dir = KEYS[e.code]
      if (dir) player.keys.delete(dir)
    }
    const clear = () => player.keys.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
      clear()
    }
  }, [])

  return (
    <div className={`game phase-${phase}`}>
      <Scene onReady={() => setReady(true)} />
      {phase === 'intro' ? (
        <Intro ready={ready} />
      ) : (
        <>
          <HUD />
          <Quests />
          <PanelHost />
        </>
      )}
      <Toasts />
    </div>
  )
}

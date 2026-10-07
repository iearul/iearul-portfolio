import { useGame } from '../../store/game'
import { Icon } from './Icon'

export function Toasts() {
  const toasts = useGame((s) => s.toasts)
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          {t.kind === 'achievement' && <Icon name="trophy" size={20} />}
          <div>
            <div className="toast-text">
              {t.kind === 'achievement' && <span className="toast-kicker">Achievement · </span>}
              {t.text}
            </div>
            {t.sub && <div className="toast-sub">{t.sub}</div>}
          </div>
          {t.xp > 0 && <span className="toast-xp">+{t.xp} XP</span>}
        </div>
      ))}
    </div>
  )
}

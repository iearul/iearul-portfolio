import { Link } from 'wouter'
import { useContent } from '../../../store/content'
import { formatDate } from '../../../lib/markdown'
import { PanelHeader, Chips } from './common'

export function JournalPanel() {
  const { posts, status } = useContent()
  return (
    <>
      <PanelHeader kicker="Journal Library" title="Notes from the road" sub="Writing about code, work and the occasional side quest." />
      {status !== 'ready' && <p className="muted">Fetching the shelves…</p>}
      {status === 'ready' && posts.length === 0 && <p className="muted">The shelves are empty for now. Come back soon.</p>}
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/journal/${p.slug}`} className="post-item">
              <div className="post-date">
                {formatDate(p.published_at)} · {p.reading_minutes} min read
              </div>
              <h3>{p.title}</h3>
              {p.excerpt && <p>{p.excerpt}</p>}
              <Chips items={p.tags} />
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/journal" className="ghost-btn">
        Open the full journal
      </Link>
    </>
  )
}

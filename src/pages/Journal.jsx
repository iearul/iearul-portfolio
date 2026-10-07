import { useEffect, useState } from 'react'
import { Link, useParams } from 'wouter'
import { Page } from './Page'
import { useContent } from '../store/content'
import { api } from '../lib/api'
import { renderMarkdown, formatDate } from '../lib/markdown'
import { Chips } from '../game/ui/panels/common'
import { Icon } from '../game/ui/Icon'

export function JournalList() {
  const { posts, status, load } = useContent()
  useEffect(() => {
    load()
  }, [load])
  return (
    <Page title="Journal" className="journal">
      <div className="kicker">Journal</div>
      <h1>Notes from the road</h1>
      <p className="lead">Writing about code, work and the occasional side quest.</p>
      {status !== 'ready' && <p className="muted">Loading…</p>}
      {status === 'ready' && posts.length === 0 && <p className="muted">No entries yet.</p>}
      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/journal/${p.slug}`} className="post-item">
              <div className="post-date">
                {formatDate(p.published_at)} · {p.reading_minutes} min read
              </div>
              <h2>{p.title}</h2>
              {p.excerpt && <p>{p.excerpt}</p>}
              <Chips items={p.tags} />
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  )
}

export function PostPage() {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', post: null })

  useEffect(() => {
    let alive = true
    setState({ status: 'loading', post: null })
    api
      .post(slug)
      .then((post) => alive && setState({ status: 'ready', post }))
      .catch((err) => alive && setState({ status: err.status === 404 ? 'missing' : 'error', post: null }))
    return () => {
      alive = false
    }
  }, [slug])

  const { status, post } = state
  return (
    <Page title={post?.title || 'Journal'} className="journal post">
      <Link href="/journal" className="link-btn back">
        <Icon name="back" size={16} /> All entries
      </Link>
      {status === 'loading' && <p className="muted">Loading…</p>}
      {status === 'missing' && <p>This entry does not exist (anymore).</p>}
      {status === 'error' && <p>Could not load this entry. Please try again later.</p>}
      {post && (
        <article>
          <div className="post-date">
            {formatDate(post.published_at)} · {post.reading_minutes} min read
          </div>
          <h1>{post.title}</h1>
          <Chips items={post.tags} />
          {post.cover_url && <img className="post-cover" src={post.cover_url} alt="" />}
          <div className="md prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
          <p className="post-end">
            <Link href="/" className="primary-btn">
              <Icon name="play" /> Back to the island
            </Link>
          </p>
        </article>
      )}
    </Page>
  )
}

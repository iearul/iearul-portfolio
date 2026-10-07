import { lazy, Suspense } from 'react'
import { Route, Switch, Link } from 'wouter'
import RecruiterMode from './pages/RecruiterMode'
import { JournalList, PostPage } from './pages/Journal'
import { Page } from './pages/Page'

const Game = lazy(() => import('./game/Game'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function Loading() {
  return (
    <div className="boot">
      <div className="boot-island" aria-hidden />
      <p>Raising the island…</p>
    </div>
  )
}

function NotFound() {
  return (
    <Page title="Lost at sea">
      <h1>Lost at sea</h1>
      <p>This page drifted away.</p>
      <Link href="/" className="primary-btn">
        Back to the island
      </Link>
    </Page>
  )
}

export default function App() {
  return (
    <Switch>
      <Route path="/cv" component={RecruiterMode} />
      <Route path="/journal" component={JournalList} />
      <Route path="/journal/:slug" component={PostPage} />
      <Route path="/">
        {hasWebGL() ? (
          <Suspense fallback={<Loading />}>
            <Game />
          </Suspense>
        ) : (
          <RecruiterMode notice="Your browser cannot run the 3D island, so here is the plain version." />
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  )
}

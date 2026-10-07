import { useEffect } from 'react'
import { Link } from 'wouter'

// Shared shell for the plain (non-3D) pages.
export function Page({ title, children, className = '' }) {
  useEffect(() => {
    document.title = title ? `${title} · Md Iearulislam` : 'Md Iearulislam'
    window.scrollTo(0, 0)
  }, [title])
  return (
    <div className={`page ${className}`}>
      <header className="page-bar">
        <Link href="/" className="brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          Career Island
        </Link>
        <nav>
          <Link href="/">Play</Link>
          <Link href="/cv">CV</Link>
          <Link href="/journal">Journal</Link>
        </nav>
      </header>
      <main className="page-main">{children}</main>
      <footer className="page-foot">
        © {new Date().getFullYear()} Md Iearulislam · Built with React, Three.js and a Laravel API
      </footer>
    </div>
  )
}

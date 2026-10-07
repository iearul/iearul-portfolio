export function PanelHeader({ kicker, title, sub }) {
  return (
    <header className="panel-head">
      {kicker && <div className="kicker">{kicker}</div>}
      <h2>{title}</h2>
      {sub && <p className="panel-sub">{sub}</p>}
    </header>
  )
}

export function Chips({ items }) {
  if (!items?.length) return null
  return (
    <ul className="chips">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  )
}

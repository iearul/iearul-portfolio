const PATHS = {
  map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14',
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6m-6 4h6',
  sound: 'M4 9v6h4l5 4V5L8 9H4Zm12.5-.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12',
  mute: 'M4 9v6h4l5 4V5L8 9H4Zm12 1 5 5m0-5-5 5',
  close: 'M6 6l12 12M18 6 6 18',
  ext: 'M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  code: 'm8 8-4 4 4 4m8-8 4 4-4 4m-6 3 4-14',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5v1a3 3 0 0 0 3 3m8-4h3v1a3 3 0 0 1-3 3m-4 3v4m-4 3h8',
  check: 'm5 12 4.5 4.5L19 7',
  play: 'M7 5v14l11-7L7 5Z',
  back: 'M15 6l-6 6 6 6',
  next: 'M9 6l6 6-6 6',
  book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h13',
  github:
    'M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.5A5 5 0 0 0 18.8 6 4.7 4.7 0 0 0 18.7 2.5S17.6 2.2 15 4a12.4 12.4 0 0 0-6 0C6.4 2.2 5.3 2.5 5.3 2.5A4.7 4.7 0 0 0 5.2 6 5 5 0 0 0 4 9.6c0 5 3 6.2 6 6.5a3 3 0 0 0-.9 2.4V22',
  linkedin: 'M4 9h4v11H4zM6 4.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10 9h3.8v1.6c.6-1 1.9-1.9 3.7-1.9 3.5 0 4.5 2.2 4.5 5.4V20h-4v-5.3c0-1.5-.3-2.8-1.9-2.8s-2.1 1.2-2.1 2.8V20h-4z',
}

export function Icon({ name, size = 18, className = '', title }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={PATHS[name]} />
    </svg>
  )
}

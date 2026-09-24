// Small hand-drawn style icons. They use currentColor, so they follow the text colour.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const PencilIcon = (props) => (
  <svg {...base} className="icon-pencil" {...props}>
    <path d="M4 20l1.2-4.6L16.5 4.1a2 2 0 012.8 0l.6.6a2 2 0 010 2.8L8.6 18.8z" />
    <path d="M14.5 6l3.5 3.5" />
  </svg>
)

export const EraserIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M8.5 20H20" />
    <path d="M4.6 14.6l9-9a2 2 0 012.8 0l3 3a2 2 0 010 2.8L12 19.8a1 1 0 01-.7.3H8.6a1 1 0 01-.7-.3l-3.3-3.3a1.4 1.4 0 010-1.9z" />
    <path d="M9 10.2l5 5" />
  </svg>
)

export const SunIcon = (props) => (
  <svg {...base} className="icon-sun" {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
  </svg>
)

export const MoonIcon = (props) => (
  <svg {...base} className="icon-moon" {...props}>
    <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />
  </svg>
)

export const CloseIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const LogoMark = (props) => (
  <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" {...props}>
    <rect x="8" y="6" width="48" height="54" rx="6" style={{ fill: 'var(--outline)' }} />
    <rect
      x="6"
      y="4"
      width="48"
      height="54"
      rx="6"
      strokeWidth="3"
      style={{ fill: 'var(--highlight)', stroke: 'var(--outline)' }}
    />
    <path d="M6 18h48M6 30h48M6 42h48" strokeWidth="2" style={{ stroke: 'var(--outline)', opacity: 0.15 }} />
    <path
      d="M18 32l8 8 16-18"
      fill="none"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ stroke: 'var(--logo-check)' }}
    />
  </svg>
)

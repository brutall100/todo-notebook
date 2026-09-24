import { useMemo } from 'react'
import { useReducedMotion } from '../hooks/use-reduced-motion.js'

const random = (min, max) => min + Math.random() * (max - min)
const NOTE_COLORS = ['var(--note-1)', 'var(--note-2)', 'var(--note-3)']

// Every note gets its own size, speed, delay, spin and sway, so the fall looks natural
function makeNotes(count) {
  return Array.from({ length: count }, (_, index) => {
    const duration = random(18, 34)
    return {
      id: index,
      style: {
        '--x': `${random(-2, 98)}%`,
        '--size': `${random(22, 58)}px`,
        '--duration': `${duration}s`,
        '--delay': `${-random(0, duration)}s`,
        '--spin-from': `${random(-40, 40)}deg`,
        '--spin-to': `${random(-220, 220)}deg`,
        '--drift': `${random(-12, 12)}vw`,
        '--sway': `${random(8, 26)}px`,
        '--sway-duration': `${random(2.5, 5)}s`,
        '--color': NOTE_COLORS[index % NOTE_COLORS.length],
        '--tape': Math.random() > 0.6 ? 1 : 0,
      },
    }
  })
}

function PaperBackground() {
  const reduced = useReducedMotion()
  // Half as many notes on phones to keep things light
  const notes = useMemo(
    () => makeNotes(window.matchMedia('(max-width: 600px)').matches ? 7 : 14),
    [],
  )

  return (
    <div className="desk" aria-hidden="true">
      <div className="desk__glow desk__glow--lamp" />
      <div className="desk__glow desk__glow--ink" />
      {!reduced &&
        notes.map((note) => (
          <div key={note.id} className="note-fall" style={note.style}>
            <div className="note-fall__paper" />
          </div>
        ))}
    </div>
  )
}

export default PaperBackground

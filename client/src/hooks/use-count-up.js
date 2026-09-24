import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './use-reduced-motion.js'

// Smoothly counts from the previous number to the new one
export function useCountUp(target, duration = 700) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    if (reduced) {
      fromRef.current = target
      setValue(target)
      return undefined
    }

    const from = fromRef.current
    const start = performance.now()
    let frame

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      const current = Math.round(from + (target - from) * eased)
      fromRef.current = current
      setValue(current)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])

  return value
}

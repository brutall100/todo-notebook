import PropTypes from 'prop-types'
import { useReducedMotion } from '../hooks/use-reduced-motion.js'

// A button that leaves a spreading ink blot where you press it
function InkButton({ variant, size, className = '', onPointerDown, children, ...props }) {
  const reduced = useReducedMotion()

  const spillInk = (event) => {
    onPointerDown?.(event)
    if (reduced) return
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const blot = document.createElement('span')
    blot.className = 'ink'
    blot.style.left = `${event.clientX - rect.left}px`
    blot.style.top = `${event.clientY - rect.top}px`
    blot.addEventListener('animationend', () => blot.remove())
    button.append(blot)
  }

  const classes = ['btn', variant && `btn--${variant}`, size && `btn--${size}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} onPointerDown={spillInk} {...props}>
      {children}
    </button>
  )
}

InkButton.propTypes = {
  variant: PropTypes.oneOf(['soft', 'icon']),
  size: PropTypes.oneOf(['small']),
  className: PropTypes.string,
  onPointerDown: PropTypes.func,
  children: PropTypes.node.isRequired,
}

export default InkButton

import { useTheme } from '../hooks/use-theme.js'
import InkButton from './ink-button.jsx'
import { MoonIcon, SunIcon } from './icons.jsx'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <InkButton
      variant="icon"
      className="btn--soft theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <SunIcon />
      <MoonIcon />
    </InkButton>
  )
}

export default ThemeToggle

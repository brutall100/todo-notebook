import { useCallback, useEffect, useState } from 'react'

// Stored as a plain string so public/theme-init.js can read it before React loads
const KEY = 'todo-notebook:theme'

function savedTheme() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Storage blocked: the choice lasts until the page reloads
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Follow the system setting until the user picks a theme themselves
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (!savedTheme()) setTheme(query.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      saveTheme(next)
      return next
    })
  }, [])

  return { theme, toggle }
}

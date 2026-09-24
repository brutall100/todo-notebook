// localStorage can throw (private mode, blocked storage), so every access is guarded
export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage is unavailable: the app still works until the page reloads
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

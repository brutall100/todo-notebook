import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { api, isDemo } from '../api/index.js'
import { DEMO_USER } from '../api/demo-api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Demo mode is always "logged in" as the made-up Alex Doe
  const [user, setUser] = useState(isDemo ? DEMO_USER : null)
  const [checking, setChecking] = useState(!isDemo && api.hasSession())

  // Server mode: if a token was saved earlier, ask the API who it belongs to
  useEffect(() => {
    if (!checking) return
    api
      .currentUser()
      .then(setUser)
      .catch(() => api.logout())
      .finally(() => setChecking(false))
  }, [checking])

  const login = useCallback(async (email, password) => setUser(await api.login(email, password)), [])
  const register = useCallback(
    async (name, email, password) => setUser(await api.register(name, email, password)),
    [],
  )
  const logout = useCallback(() => {
    api.logout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, checking, isDemo, login, register, logout }),
    [user, checking, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

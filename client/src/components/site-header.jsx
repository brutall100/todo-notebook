import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/auth-context.jsx'
import ThemeToggle from './theme-toggle.jsx'
import InkButton from './ink-button.jsx'
import Avatar from './avatar.jsx'
import AuthDialog from './auth-dialog.jsx'
import { LogoMark } from './icons.jsx'

function SiteHeader() {
  const { user, isDemo, logout } = useAuth()
  const [dialogMode, setDialogMode] = useState(null)

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label="Todo Notebook, home">
          <LogoMark className="brand__logo" />
          <span className="brand__name">
            todo <span>notebook</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main">
          <ul className="site-nav__links">
            <li>
              <NavLink to="/" end className="site-nav__link">
                Notebook
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="site-nav__link">
                About
              </NavLink>
            </li>
          </ul>

          <div className="account">
            <ThemeToggle />
            {user ? (
              <>
                <Avatar name={user.name} />
                <span className="account__name visually-hidden">Signed in as {user.name}</span>
                {isDemo ? (
                  <span className="badge">Demo</span>
                ) : (
                  <InkButton variant="soft" size="small" onClick={logout}>
                    Log out
                  </InkButton>
                )}
              </>
            ) : (
              <InkButton size="small" onClick={() => setDialogMode('login')}>
                Log in
              </InkButton>
            )}
          </div>
        </nav>
      </div>

      {dialogMode && <AuthDialog initialMode={dialogMode} onClose={() => setDialogMode(null)} />}
    </header>
  )
}

export default SiteHeader

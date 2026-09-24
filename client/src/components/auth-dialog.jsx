import { useEffect, useId, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useAuth } from '../context/auth-context.jsx'
import InkButton from './ink-button.jsx'
import { CloseIcon } from './icons.jsx'

// Log in / create account form in a native <dialog> (Esc closes it, focus stays inside)
function AuthDialog({ initialMode, onClose }) {
  const { login, register } = useAuth()
  const dialogRef = useRef(null)
  const [mode, setMode] = useState(initialMode)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const id = useId()
  const isLogin = mode === 'login'

  useEffect(() => {
    // The dialog is removed from the page when this component unmounts
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setBusy(true)
    setMessage('')
    try {
      if (isLogin) {
        await login(form.get('email'), form.get('password'))
      } else {
        await register(form.get('name'), form.get('email'), form.get('password'))
      }
      onClose()
    } catch (error) {
      setMessage(error.message)
      setBusy(false)
    }
  }

  return (
    <dialog ref={dialogRef} className="auth-dialog" aria-labelledby={`${id}-title`} onClose={onClose}>
      <form className="auth-dialog__body" onSubmit={handleSubmit}>
        <div className="auth-dialog__head">
          <h2 id={`${id}-title`}>{isLogin ? 'Welcome back' : 'Start a notebook'}</h2>
          <InkButton variant="icon" className="btn--soft" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </InkButton>
        </div>

        {!isLogin && (
          <div className="field">
            <label htmlFor={`${id}-name`}>Name</label>
            <input id={`${id}-name`} className="input" name="name" autoComplete="name" required />
          </div>
        )}
        <div className="field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input id={`${id}-email`} className="input" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor={`${id}-password`}>
            Password {!isLogin && <span className="field__hint">(at least 8 characters)</span>}
          </label>
          <input
            id={`${id}-password`}
            className="input"
            name="password"
            type="password"
            minLength={isLogin ? undefined : 8}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />
        </div>

        <p className="form-message" role="alert" aria-live="assertive">
          {message}
        </p>

        <InkButton type="submit" disabled={busy}>
          {busy ? 'One moment…' : isLogin ? 'Log in' : 'Create account'}
        </InkButton>

        <p className="auth-dialog__switch">
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <button
            type="button"
            className="link-button"
            onClick={() => {
              setMode(isLogin ? 'register' : 'login')
              setMessage('')
            }}
          >
            {isLogin ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </form>
    </dialog>
  )
}

AuthDialog.propTypes = {
  initialMode: PropTypes.oneOf(['login', 'register']).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default AuthDialog

import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { roleHome, useAuth } from '../context/AuthContext'

export function GuestSignInPage() {
  const { user, signInGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/explore'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const result = signInGuest({ email, password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    const blocked =
      from.startsWith('/admin') || from.startsWith('/list-property') || from.startsWith('/host')
    navigate(blocked ? '/explore' : from, { replace: true })
  }

  return (
    <section className="auth-shell auth-shell--guest">
      <div className="auth-atmosphere" aria-hidden>
        <span className="auth-blob auth-blob--a" />
        <span className="auth-blob auth-blob--b" />
        <span className="auth-blob auth-blob--c" />
      </div>

      <div className="container auth-page">
        <div className="auth-panel">
          <div className="auth-panel-accent" aria-hidden />
          <header className="auth-header">
            <p className="eyebrow">Guest</p>
            <h1>Guest sign in</h1>
            <p>Browse stays, save favorites, and message hosts from your traveler account.</p>
          </header>

          <form className="auth-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="guest-signin-email">Email</label>
              <input
                id="guest-signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="guest-signin-password">Password</label>
              <input
                id="guest-signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn btn-sage btn-block">
              Sign in as guest
            </button>

            <p className="auth-switch">
              New traveler? <Link to="/guest/signup">Create a guest account</Link>
            </p>
            <p className="auth-switch muted">
              Looking to list a stay? <Link to="/host/signin">Host sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

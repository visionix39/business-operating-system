import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { DEMO_ADMIN, roleHome, useAuth } from '../context/AuthContext'

export function AdminSignInPage() {
  const { user, signInAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const result = signInAdmin({ email, password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(from.startsWith('/list-property') || from.startsWith('/host') ? '/admin' : from, {
      replace: true,
    })
  }

  return (
    <section className="auth-shell auth-shell--admin">
      <div className="auth-atmosphere" aria-hidden>
        <span className="auth-blob auth-blob--a" />
        <span className="auth-blob auth-blob--b" />
        <span className="auth-blob auth-blob--c" />
      </div>

      <div className="container auth-page">
        <div className="auth-panel">
          <div className="auth-panel-accent" aria-hidden />
          <header className="auth-header">
            <p className="eyebrow">Admin</p>
            <h1>Admin sign in</h1>
            <p>Platform operators only. Manage all listings, bookings, and reviews across Portico.</p>
          </header>

          <form className="auth-form" onSubmit={submit}>
            <div className="auth-demo-hint">
              <strong>Demo access</strong>
              <span>{DEMO_ADMIN.email}</span>
              <span>{DEMO_ADMIN.password}</span>
            </div>

            <div className="field">
              <label htmlFor="admin-signin-email">Email</label>
              <input
                id="admin-signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portico.demo"
                autoComplete="username"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="admin-signin-password">Password</label>
              <input
                id="admin-signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn btn-sage btn-block">
              Sign in as admin
            </button>

            <p className="auth-switch muted">
              Looking for a stay? <Link to="/guest/signin">Guest sign in</Link>
            </p>
            <p className="auth-switch muted">
              Looking to list a property? <Link to="/host/signin">Host sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

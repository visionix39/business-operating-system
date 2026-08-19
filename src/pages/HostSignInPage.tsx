import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { roleHome, useAuth } from '../context/AuthContext'
//import { DEMO_HOST } from '../context/AuthContext'

export function HostSignInPage() {
  const { user, signInHost } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/list-property'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const result = signInHost({ email, password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(from.startsWith('/admin') ? '/list-property' : from, { replace: true })
  }

  return (
    <section className="auth-shell auth-shell--host">
      <div className="auth-atmosphere" aria-hidden>
        <span className="auth-blob auth-blob--a" />
        <span className="auth-blob auth-blob--b" />
        <span className="auth-blob auth-blob--c" />
      </div>

      <div className="container auth-page">
        <div className="auth-panel">
          <div className="auth-panel-accent" aria-hidden />
          <header className="auth-header">
            <p className="eyebrow">Host</p>
            <h1>Host sign in</h1>
            <p>Sign in to list properties and manage your hosting account.</p>
          </header>

          <form className="auth-form" onSubmit={submit}>
            {/* <div className="auth-demo-hint">
              <strong>Demo access</strong>
              <span>{DEMO_HOST.email}</span>
              <span>{DEMO_HOST.password}</span>
            </div> */}

            <div className="field">
              <label htmlFor="host-signin-email">Email</label>
              <input
                id="host-signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="host@portico.demo"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="host-signin-password">Password</label>
              <input
                id="host-signin-password"
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
              Sign in as host
            </button>

            <p className="auth-switch">
              New to hosting? <Link to="/host/signup">Create a host account</Link>
            </p>
            <p className="auth-switch muted">
              Looking for a stay? <Link to="/guest/signin">Guest sign in</Link>
            </p>
            <p className="auth-switch muted">
              Platform staff? <Link to="/admin/signin">Admin sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

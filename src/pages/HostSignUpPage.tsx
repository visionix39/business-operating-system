import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { roleHome, useAuth } from '../context/AuthContext'

export function HostSignUpPage() {
  const { user, signUpHost } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    const result = signUpHost({ name, email, password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/list-property', { replace: true })
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
            <h1>Create a host account</h1>
            <p>Sign up to publish listings. Accounts are stored in this browser only — no database.</p>
          </header>

          <form className="auth-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="host-signup-name">Full name</label>
              <input
                id="host-signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="host-signup-email">Email</label>
              <input
                id="host-signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="host-signup-password">Password</label>
              <input
                id="host-signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="host-signup-confirm">Confirm password</label>
              <input
                id="host-signup-confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="btn btn-sage btn-block">
              Create host account
            </button>

            <p className="auth-switch">
              Already a host? <Link to="/host/signin">Sign in</Link>
            </p>
            <p className="auth-switch muted">
              Looking for a stay? <Link to="/guest/signup">Create a guest account</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

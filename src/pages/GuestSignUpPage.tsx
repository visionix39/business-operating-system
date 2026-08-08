import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { roleHome, useAuth } from '../context/AuthContext'

export function GuestSignUpPage() {
  const { user, signUpGuest } = useAuth()
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

    const result = signUpGuest({ name, email, password })
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/explore', { replace: true })
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
            <h1>Create a guest account</h1>
            <p>
              Sign up to browse stays, save a wishlist, and chat with hosts. Accounts are stored in
              this browser only — no database.
            </p>
          </header>

          <form className="auth-form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="guest-signup-name">Full name</label>
              <input
                id="guest-signup-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="guest-signup-email">Email</label>
              <input
                id="guest-signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="guest-signup-password">Password</label>
              <input
                id="guest-signup-password"
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
              <label htmlFor="guest-signup-confirm">Confirm password</label>
              <input
                id="guest-signup-confirm"
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
              Create guest account
            </button>

            <p className="auth-switch">
              Already have an account? <Link to="/guest/signin">Sign in</Link>
            </p>
            <p className="auth-switch muted">
              Want to host instead? <Link to="/host/signup">Become a host</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

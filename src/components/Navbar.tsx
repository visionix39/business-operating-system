import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'

function roleLabel(role: string) {
  if (role === 'admin') return 'Admin'
  if (role === 'host') return 'Host'
  return 'Guest'
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, isGuest, isHost, isAdmin, signOut } = useAuth()
  const { ids: wishlistIds } = useWishlist()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  const handleSignOut = () => {
    signOut()
    close()
    navigate('/')
  }

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-mark" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 18V9l8-5 8 5v9"
                stroke="#5A8F78"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 18v-4h6v4"
                stroke="#A67C52"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Portico
        </Link>

        <nav className={`nav-links${open ? ' open' : ''}`} aria-label="Primary">
          <NavLink to="/explore" onClick={close}>
            Explore
          </NavLink>
          <NavLink to="/map" onClick={close}>
            Map
          </NavLink>
          {isHost ? (
            <NavLink to="/list-property" onClick={close}>
              List property
            </NavLink>
          ) : !isAdmin ? (
            <NavLink to="/host/signin" onClick={close}>
              Host
            </NavLink>
          ) : null}
          {(isGuest || !user) && (
            <NavLink to="/wishlist" onClick={close}>
              Wishlist
              {isGuest && wishlistIds.length > 0 ? (
                <span className="nav-count">{wishlistIds.length}</span>
              ) : null}
            </NavLink>
          )}
          {(isGuest || isHost) && (
            <NavLink to="/chat" onClick={close}>
              Inbox
            </NavLink>
          )}
          {isAdmin ? (
            <NavLink to="/admin" onClick={close}>
              Admin
            </NavLink>
          ) : !user ? (
            <NavLink to="/admin/signin" onClick={close}>
              Admin
            </NavLink>
          ) : null}
          {user && (
            <button type="button" className="nav-mobile-signout" onClick={handleSignOut}>
              Sign out ({roleLabel(user.role)})
            </button>
          )}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user" title={user.email}>
                <span className="nav-role">{roleLabel(user.role)}</span>
                <span className="nav-user-name">{user.name}</span>
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleSignOut}>
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/guest/signin" className="btn btn-ghost btn-sm" onClick={close}>
                Sign in
              </Link>
              <Link to="/guest/signup" className="btn btn-primary btn-sm" onClick={close}>
                Join
              </Link>
            </>
          )}
          <button
            type="button"
            className="nav-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  )
}

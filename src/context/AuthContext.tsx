import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type UserRole = 'guest' | 'host' | 'admin'

export interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: string
}

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextValue {
  user: SessionUser | null
  isGuest: boolean
  isHost: boolean
  isAdmin: boolean
  signUpGuest: (input: { name: string; email: string; password: string }) => { ok: true } | { ok: false; error: string }
  signInGuest: (input: { email: string; password: string }) => { ok: true } | { ok: false; error: string }
  signUpHost: (input: { name: string; email: string; password: string }) => { ok: true } | { ok: false; error: string }
  signInHost: (input: { email: string; password: string }) => { ok: true } | { ok: false; error: string }
  signInAdmin: (input: { email: string; password: string }) => { ok: true } | { ok: false; error: string }
  signOut: () => void
}

const USERS_KEY = 'portico_users'
const SESSION_KEY = 'portico_session'

const DEFAULT_ADMIN: StoredUser = {
  id: 'admin-1',
  name: 'Portico Admin',
  email: 'admin@portico.demo',
  password: 'admin123',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) {
      const seeded = [DEFAULT_ADMIN]
      localStorage.setItem(USERS_KEY, JSON.stringify(seeded))
      return seeded
    }
    const parsed = JSON.parse(raw) as StoredUser[]
    if (!parsed.some((u) => u.role === 'admin' && u.email === DEFAULT_ADMIN.email)) {
      const withAdmin = [...parsed, DEFAULT_ADMIN]
      localStorage.setItem(USERS_KEY, JSON.stringify(withAdmin))
      return withAdmin
    }
    return parsed
  } catch {
    return [DEFAULT_ADMIN]
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

function writeSession(user: SessionUser | null) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY)
    return
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function toSession(user: StoredUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function homeForRole(role: UserRole) {
  if (role === 'host') return '/list-property'
  if (role === 'admin') return '/admin'
  return '/explore'
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readSession())

  const signUpWithRole = useCallback(
    (role: 'guest' | 'host', input: { name: string; email: string; password: string }) => {
      const name = input.name.trim()
      const email = normalizeEmail(input.email)
      const password = input.password

      if (!name || !email || !password) {
        return { ok: false as const, error: 'Please fill in all fields.' }
      }
      if (password.length < 6) {
        return { ok: false as const, error: 'Password must be at least 6 characters.' }
      }

      const users = readUsers()
      if (users.some((u) => normalizeEmail(u.email) === email)) {
        return { ok: false as const, error: 'An account with this email already exists.' }
      }

      const next: StoredUser = {
        id: `${role}-${Date.now()}`,
        name,
        email,
        password,
        role,
        createdAt: new Date().toISOString(),
      }
      writeUsers([...users, next])
      const session = toSession(next)
      writeSession(session)
      setUser(session)
      return { ok: true as const }
    },
    [],
  )

  const signInWithRole = useCallback((role: UserRole, input: { email: string; password: string }, label: string) => {
    const email = normalizeEmail(input.email)
    const users = readUsers()
    const match = users.find(
      (u) => u.role === role && normalizeEmail(u.email) === email && u.password === input.password,
    )
    if (!match) {
      return { ok: false as const, error: `Invalid ${label} email or password.` }
    }
    const session = toSession(match)
    writeSession(session)
    setUser(session)
    return { ok: true as const }
  }, [])

  const signUpGuest = useCallback(
    (input: { name: string; email: string; password: string }) => signUpWithRole('guest', input),
    [signUpWithRole],
  )

  const signInGuest = useCallback(
    (input: { email: string; password: string }) => signInWithRole('guest', input, 'guest'),
    [signInWithRole],
  )

  const signUpHost = useCallback(
    (input: { name: string; email: string; password: string }) => signUpWithRole('host', input),
    [signUpWithRole],
  )

  const signInHost = useCallback(
    (input: { email: string; password: string }) => signInWithRole('host', input, 'host'),
    [signInWithRole],
  )

  const signInAdmin = useCallback(
    (input: { email: string; password: string }) => signInWithRole('admin', input, 'admin'),
    [signInWithRole],
  )

  const signOut = useCallback(() => {
    writeSession(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isGuest: user?.role === 'guest',
      isHost: user?.role === 'host',
      isAdmin: user?.role === 'admin',
      signUpGuest,
      signInGuest,
      signUpHost,
      signInHost,
      signInAdmin,
      signOut,
    }),
    [user, signUpGuest, signInGuest, signUpHost, signInHost, signInAdmin, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

export function roleHome(role: UserRole) {
  return homeForRole(role)
}

/** Demo credentials shown on the admin sign-in page */
export const DEMO_ADMIN = {
  email: DEFAULT_ADMIN.email,
  password: DEFAULT_ADMIN.password,
}

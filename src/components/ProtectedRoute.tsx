import { Navigate, useLocation } from 'react-router-dom'
import { roleHome, useAuth, type UserRole } from '../context/AuthContext'

interface ProtectedRouteProps {
  role: UserRole | UserRole[]
  children: React.ReactNode
}

function signInPathFor(role: UserRole | UserRole[]) {
  const roles = Array.isArray(role) ? role : [role]
  if (roles.length === 1 && roles[0] === 'admin') return '/admin/signin'
  if (roles.length === 1 && roles[0] === 'host') return '/host/signin'
  if (roles.includes('guest')) return '/guest/signin'
  if (roles.includes('host')) return '/host/signin'
  return '/guest/signin'
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()
  const allowed = Array.isArray(role) ? role : [role]

  if (!user) {
    return <Navigate to={signInPathFor(role)} replace state={{ from: location.pathname }} />
  }

  if (!allowed.includes(user.role)) {
    return <Navigate to={roleHome(user.role)} replace />
  }

  return <>{children}</>
}

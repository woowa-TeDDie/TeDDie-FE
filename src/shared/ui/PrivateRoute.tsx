import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'

export function PrivateRoute() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn())
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <Outlet />
}

export function AdminRoute() {
  const isAdmin = useAuthStore((s) => s.isAdmin())
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn())
  if (!isLoggedIn || !isAdmin) return <Navigate to="/login" replace />
  return <Outlet />
}

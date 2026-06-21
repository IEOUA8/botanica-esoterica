import { Navigate, Outlet } from 'react-router-dom'
import { clearToken, isTokenValid } from '../utils/auth'

export default function ProtectedRoute() {
  if (isTokenValid()) return <Outlet />
  clearToken()
  return <Navigate to="/admin/login" replace />
}

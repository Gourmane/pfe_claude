import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function GuardSpinner() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#dbeafe] border-t-[#2563eb]" />
        <p className="text-sm text-[#6b7280]">Chargement de votre espace...</p>
      </div>
    </main>
  )
}

function getDashboardPath(role) {
  if (role === 'admin') {
    return '/admin/dashboard'
  }

  if (role === 'technicien') {
    return '/technician/dashboard'
  }

  return '/login'
}

function RoleRoute({ allowedRole, children }) {
  const { loading, user } = useAuth()

  if (loading) {
    return <GuardSpinner />
  }

  if (!user) {
    return <Navigate replace to="/login" />
  }

  if (user.role !== allowedRole) {
    return <Navigate replace to={getDashboardPath(user.role)} />
  }

  return children ?? <Outlet />
}

export default RoleRoute

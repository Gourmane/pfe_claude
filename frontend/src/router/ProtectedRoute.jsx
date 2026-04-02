import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function GuardSpinner() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-container-lowest px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-container border-t-primary" />
        <p className="text-sm font-medium text-slate-500">
          Vérification de votre accès...
        </p>
      </div>
    </main>
  )
}

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth()

  if (loading) {
    return <GuardSpinner />
  }

  if (!user) {
    return <Navigate replace to="/login" />
  }

  return children ?? <Outlet />
}

export default ProtectedRoute

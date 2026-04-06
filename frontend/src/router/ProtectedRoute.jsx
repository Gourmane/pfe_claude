import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import GuardSpinner from './GuardSpinner'

function ProtectedRoute({ children }) {
  const { loading, user } = useAuth()

  if (loading) {
    return <GuardSpinner label="Vérification de votre accès..." />
  }

  if (!user) {
    return <Navigate replace to="/login" />
  }

  return children ?? <Outlet />
}

export default ProtectedRoute

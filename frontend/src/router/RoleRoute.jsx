import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getDashboardPath } from '../utils/routeHelpers'
import GuardSpinner from './GuardSpinner'

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

/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import AuthLayout from '../layouts/AuthLayout'
import TechnicianLayout from '../layouts/TechnicianLayout'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'

const LoginPage = lazy(() => import('../pages/LoginPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))
const AdminDashboardPage = lazy(() => import('../pages/admin/DashboardPage'))
const AdminClientsPage = lazy(() => import('../pages/admin/ClientsPage'))
const AdminClientCreatePage = lazy(
  () => import('../pages/admin/ClientCreatePage'),
)
const AdminClientEditPage = lazy(
  () => import('../pages/admin/ClientEditPage'),
)
const AdminTicketCreatePage = lazy(
  () => import('../pages/admin/TicketCreatePage'),
)
const AdminTicketDetailPage = lazy(
  () => import('../pages/admin/TicketDetailPage'),
)
const AdminTicketsPage = lazy(() => import('../pages/admin/TicketsPage'))
const TechnicianDashboardPage = lazy(
  () => import('../pages/technician/DashboardPage'),
)
const TechnicianTicketDetailPage = lazy(
  () => import('../pages/technician/TicketDetailPage'),
)
const TechnicianTicketsPage = lazy(
  () => import('../pages/technician/TicketsPage'),
)

function RouteSpinner() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#dbeafe] border-t-[#2563eb]" />
        <p className="text-sm text-[#6b7280]">Loading page...</p>
      </div>
    </main>
  )
}

function renderLazyPage(Page) {
  const Component = Page

  return (
    <Suspense fallback={<RouteSpinner />}>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/login" />,
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: renderLazyPage(LoginPage),
      },
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRole="admin" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <Navigate replace to="dashboard" />,
              },
              {
                path: 'dashboard',
                element: renderLazyPage(AdminDashboardPage),
              },
              {
                path: 'clients',
                element: renderLazyPage(AdminClientsPage),
              },
              {
                path: 'clients/new',
                element: renderLazyPage(AdminClientCreatePage),
              },
              {
                path: 'clients/:clientId/edit',
                element: renderLazyPage(AdminClientEditPage),
              },
              {
                path: 'tickets',
                element: renderLazyPage(AdminTicketsPage),
              },
              {
                path: 'tickets/new',
                element: renderLazyPage(AdminTicketCreatePage),
              },
              {
                path: 'tickets/:ticketId',
                element: renderLazyPage(AdminTicketDetailPage),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/technician',
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute allowedRole="technicien" />,
        children: [
          {
            element: <TechnicianLayout />,
            children: [
              {
                index: true,
                element: <Navigate replace to="dashboard" />,
              },
              {
                path: 'dashboard',
                element: renderLazyPage(TechnicianDashboardPage),
              },
              {
                path: 'tickets',
                element: renderLazyPage(TechnicianTicketsPage),
              },
              {
                path: 'tickets/:ticketId',
                element: renderLazyPage(TechnicianTicketDetailPage),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: renderLazyPage(NotFoundPage),
  },
])

export default router

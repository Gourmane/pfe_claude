import { useEffect, useState } from 'react'
import { getAdminDashboard } from '../../api/dashboard'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatDate, formatLabel } from '../../utils/ticketHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

const STAT_CARDS = [
  {
    key: 'total_clients',
    label: 'Total clients',
    secondary: 'Clients currently managed in the platform.',
  },
  {
    key: 'total_tickets',
    label: 'Total tickets',
    secondary: 'All support requests tracked across the workspace.',
  },
  {
    key: 'pending_tickets',
    label: 'Pending tickets',
    secondary: 'Requests waiting for review or assignment.',
  },
  {
    key: 'resolved_tickets',
    label: 'Resolved tickets',
    secondary: 'Issues completed and ready for closure follow-up.',
  },
]

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const response = await getAdminDashboard()

        if (!isMounted) {
          return
        }

        setDashboard(response.data)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        if (requestError.response?.status === 403) {
          setError("Vous n'avez pas accès à cette ressource")
        } else {
          setError(
            requestError.response?.data?.message || FALLBACK_ERROR_MESSAGE,
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Overview of client activity and current support workload.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-16 shadow-sm">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm text-[#6b7280]">
              Chargement du tableau de bord...
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Overview of client activity and current support workload.
          </p>
        </div>

        <Alert message={error} type="error" />
      </section>
    )
  }

  if (!dashboard) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Dashboard</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Overview of client activity and current support workload.
          </p>
        </div>

        <EmptyState message="Aucune donnée de tableau de bord n'est disponible pour le moment." />
      </section>
    )
  }

  const stats = {
    total_clients: dashboard.total_clients ?? 0,
    total_tickets: dashboard.total_tickets ?? 0,
    pending_tickets: dashboard.tickets_by_status?.pending ?? 0,
    resolved_tickets: dashboard.tickets_by_status?.resolved ?? 0,
  }
  const recentTickets = Array.isArray(dashboard.recent_tickets)
    ? dashboard.recent_tickets
    : []

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#2563eb]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">Dashboard</h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Overview of client activity and current support workload.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <article
            key={card.key}
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-[#6b7280]">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111827]">
              {stats[card.key]}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              {card.secondary}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-[#e5e7eb] px-6 py-5">
          <h2 className="text-lg font-semibold text-[#111827]">
            Recent tickets
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            The latest support requests created in the platform.
          </p>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-6">
            <EmptyState message="Aucun ticket récent à afficher pour le moment." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] bg-white">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="transition-colors duration-200 hover:bg-[#f8fafc]"
                  >
                    <td className="px-6 py-4 align-top">
                      <div>
                        <p className="text-sm font-medium text-[#111827]">
                          {ticket.title || '--'}
                        </p>
                        <p className="mt-1 text-sm text-[#6b7280]">
                          #{ticket.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-[#6b7280]">
                      {ticket.client?.name || '--'}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <Badge variant={ticket.status}>
                        {formatLabel(ticket.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <Badge variant={ticket.priority}>
                        {formatLabel(ticket.priority)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-[#6b7280]">
                      {formatDate(ticket.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}

export default DashboardPage

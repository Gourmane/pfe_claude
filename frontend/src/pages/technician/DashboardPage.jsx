import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTechnicianDashboard } from '../../api/dashboard'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatDate, formatLabel } from '../../utils/ticketHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

const STAT_CARDS = [
  {
    key: 'assigned_count',
    label: 'Tickets assignés',
    secondary: 'Tous les tickets actuellement affectés à votre compte.',
  },
  {
    key: 'in_progress_count',
    label: 'En cours',
    secondary: 'Tickets sur lesquels une intervention est en cours.',
  },
  {
    key: 'resolved_count',
    label: 'Résolus',
    secondary: 'Tickets terminés en attente de clôture ou de suivi.',
  },
]

function DashboardPage() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const response = await getTechnicianDashboard()

        if (!isMounted) {
          return
        }

        setDashboard(response.data)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        if (requestError.response?.status === 403) {
          setError("Vous n'avez pas accès à cette ressource.")
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
          <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Suivez vos tickets assignés et les interventions les plus récentes.
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
          <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Suivez vos tickets assignés et les interventions les plus récentes.
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
          <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Suivez vos tickets assignés et les interventions les plus récentes.
          </p>
        </div>

        <EmptyState message="Aucune donnée n'est disponible pour le moment." />
      </section>
    )
  }

  const stats = {
    assigned_count: dashboard.assigned_count ?? 0,
    in_progress_count: dashboard.in_progress_count ?? 0,
    resolved_count: dashboard.resolved_count ?? 0,
  }
  const recentTickets = Array.isArray(dashboard.recent_assigned)
    ? dashboard.recent_assigned
    : []

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">
          Tableau de bord
        </h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Suivez vos tickets assignés et les interventions les plus récentes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
            Tickets récents
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Les derniers tickets qui vous sont actuellement assignés.
          </p>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-6">
            <EmptyState
              action="Voir mes tickets"
              message="Aucun ticket assigné récemment."
              onAction={() => navigate('/technician/tickets')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#e5e7eb]">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                    Priorité
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
                    className="cursor-pointer transition-colors duration-200 hover:bg-[#f8fafc]"
                    onClick={() => navigate(`/technician/tickets/${ticket.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(`/technician/tickets/${ticket.id}`)
                      }
                    }}
                    role="link"
                    tabIndex={0}
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
                      {ticket.client?.nom || '--'}
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

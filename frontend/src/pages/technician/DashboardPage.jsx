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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Suivez vos tickets assignés et les interventions les plus récentes.
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest px-6 py-16 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm font-medium text-navy-400">
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-navy-400">
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-navy-400">
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
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
          Tableau de bord
        </h1>
        <p className="mt-2 text-sm text-navy-400">
          Suivez vos tickets assignés et les interventions les plus récentes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <article
            key={card.key}
            className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)] transition-transform hover:-translate-y-0.5"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-navy-400">{card.label}</p>
            <p className="mt-4 font-display text-4xl font-bold tracking-tighter text-navy-900">
              {stats[card.key]}
            </p>
            <p className="mt-2.5 text-xs font-medium leading-relaxed text-navy-400">
              {card.secondary}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-2xl bg-surface-container-lowest shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
        <div className="px-6 lg:px-8 py-5">
          <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">
            Tickets récents
          </h2>
          <p className="mt-1 text-sm text-navy-400">
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
            <table className="min-w-full text-left">
              <thead className="bg-surface-section">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                    Titre
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                    Client
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                    Priorité
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100/50 bg-transparent">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="cursor-pointer transition-colors duration-200 hover:bg-navy-50/50"
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
                        <p className="text-sm font-semibold text-navy-800">
                          {ticket.title || '--'}
                        </p>
                        <p className="mt-1 text-xs font-medium text-navy-400">
                          #{ticket.id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-sm font-medium text-navy-600">
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
                    <td className="px-6 py-4 align-top text-sm text-navy-400">
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

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
    secondary: 'Clients actuellement suivis dans la plateforme.',
  },
  {
    key: 'total_tickets',
    label: 'Total tickets',
    secondary: 'Demandes de support enregistrées dans l\u2019espace de travail.',
  },
  {
    key: 'pending_tickets',
    label: 'Tickets en attente',
    secondary: 'Demandes à qualifier, affecter ou reprendre en charge.',
  },
  {
    key: 'resolved_tickets',
    label: 'Tickets résolus',
    secondary: 'Incidents terminés en attente de clôture ou de validation.',
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Admin</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Vue d'ensemble de l'activité client et de la charge de support.
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Admin</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Vue d'ensemble de l'activité client et de la charge de support.
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Admin</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Tableau de bord
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Vue d'ensemble de l'activité client et de la charge de support.
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
    <section className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
          Tableau de bord
        </h1>
        <p className="mt-2 text-sm text-navy-400">
          Vue d'ensemble de l'activité client et de la charge de support.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="px-6 py-5 lg:px-8">
          <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">
            Tickets récents
          </h2>
          <p className="mt-1 text-sm text-navy-400">
            Les dernières demandes de support créées dans la plateforme.
          </p>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-6">
            <EmptyState message="Aucun ticket récent à afficher pour le moment." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-surface-section">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400 lg:px-8">
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
              <tbody className="divide-y divide-navy-100/50">
                {recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="transition-colors duration-200 hover:bg-navy-50/50"
                  >
                    <td className="px-6 py-4 align-top lg:px-8">
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

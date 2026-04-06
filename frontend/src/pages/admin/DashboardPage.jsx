import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminDashboard } from '../../api/dashboard'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { formatDate, formatLabel } from '../../utils/ticketHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

const SECONDARY_STATS = [
  {
    key: 'total_tickets',
    label: 'Total tickets',
    to: '/admin/tickets',
  },
  {
    key: 'resolved_tickets',
    label: 'Tickets résolus',
    to: '/admin/tickets?status=resolved',
  },
  {
    key: 'total_clients',
    label: 'Clients suivis',
    to: '/admin/clients',
  },
]

function PendingFeatureTile({ count, onNavigate }) {
  return (
    <article
      aria-label={`${count} ticket${count !== 1 ? 's' : ''} en attente`}
      className="app-hero-card relative overflow-hidden px-6 py-7 sm:px-8 sm:py-8"
    >
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="app-page-header-kicker">File en attente</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-display text-[5rem] font-extrabold leading-none tracking-[-0.06em] text-navy-900 tabular-nums sm:text-[5.5rem]">
              {count}
            </span>
            <span className="text-base font-medium text-navy-500">
              ticket{count !== 1 ? 's' : ''} en attente
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-navy-500">
            Demandes à qualifier, affecter ou relancer en priorité.
          </p>
        </div>
        <div className="shrink-0">
          <Button onClick={() => onNavigate('/admin/tickets?status=pending')}>
            Ouvrir la file
          </Button>
        </div>
      </div>
    </article>
  )
}

function SecondaryStatsPanel({ stats, onNavigate }) {
  return (
    <div className="app-panel overflow-hidden">
      <div className="grid grid-cols-1 divide-y divide-navy-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {SECONDARY_STATS.map((stat) => (
          <button
            key={stat.key}
            className="group flex flex-col gap-1 px-5 py-5 text-left transition-colors hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/20"
            onClick={() => onNavigate(stat.to)}
            type="button"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-400 transition-colors group-hover:text-primary">
              {stat.label}
            </span>
            <span className="mt-1.5 font-display text-[2rem] font-bold leading-none tracking-tight text-navy-900 tabular-nums">
              {stats[stat.key]}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function RecentTicketCard({ ticket, onOpen }) {
  return (
    <article className="app-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy-900">{ticket.title || '--'}</p>
          <p className="mt-1 text-xs font-medium text-navy-400">#{ticket.id}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
          <Badge variant={ticket.priority}>{formatLabel(ticket.priority)}</Badge>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
            Client
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy-700">
            {ticket.client?.nom || '--'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
            Date
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy-700">
            {formatDate(ticket.created_at)}
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <Button onClick={() => onOpen(ticket.id)} size="sm" variant="secondary">
          Ouvrir le ticket
        </Button>
      </div>
    </article>
  )
}

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

  function openTicket(ticketId) {
    navigate(`/admin/tickets/${ticketId}`)
  }

  const pageHeader = (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="app-page-header-kicker">Admin</p>
        <h1 className="app-page-title">Tableau de bord</h1>
        <p className="app-page-copy">
          Priorisez les demandes en attente, surveillez la charge en cours et
          gardez une vue nette sur les tickets récents.
        </p>
      </div>

      <Button onClick={() => navigate('/admin/tickets/new')}>Nouveau ticket</Button>
    </div>
  )

  if (loading) {
    return (
      <section className="space-y-6">
        {pageHeader}
        <div className="app-panel px-6 py-16">
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
        {pageHeader}
        <Alert message={error} type="error" />
      </section>
    )
  }

  if (!dashboard) {
    return (
      <section className="space-y-6">
        {pageHeader}
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
      {pageHeader}

      <PendingFeatureTile count={stats.pending_tickets} onNavigate={navigate} />

      <SecondaryStatsPanel stats={stats} onNavigate={navigate} />

      <section className="app-table-shell">
        <div className="flex flex-col gap-3 border-b border-navy-100 px-4 py-4 sm:px-5 sm:py-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-navy-900">
              Tickets récents
            </h2>
            <p className="mt-1 text-sm text-navy-500">
              Dernières demandes créées dans la plateforme.
            </p>
          </div>
          <Button onClick={() => navigate('/admin/tickets')} size="sm" variant="secondary">
            Voir toute la liste
          </Button>
        </div>

        {recentTickets.length === 0 ? (
          <div className="p-4 sm:p-5">
            <EmptyState message="Aucun ticket récent à afficher pour le moment." />
          </div>
        ) : (
          <>
            <div className="grid gap-4 p-4 lg:hidden sm:p-5 md:grid-cols-2">
              {recentTickets.map((ticket) => (
                <RecentTicketCard key={ticket.id} onOpen={openTicket} ticket={ticket} />
              ))}
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full text-left">
                <caption className="sr-only">
                  Liste des tickets récents avec leur client, statut, priorité et date.
                </caption>
                <thead className="bg-surface">
                  <tr>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Titre
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Client
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Statut
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Priorité
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {recentTickets.map((ticket) => (
                    <tr className="bg-white" key={ticket.id}>
                      <td className="px-5 py-4 align-top">
                        <button
                          className="block rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-200"
                          onClick={() => openTicket(ticket.id)}
                          type="button"
                        >
                          <p className="line-clamp-2 max-w-sm text-sm font-semibold text-navy-900">
                            {ticket.title || '--'}
                          </p>
                          <p className="mt-1 text-xs font-medium text-navy-400">
                            #{ticket.id}
                          </p>
                        </button>
                      </td>
                      <td className="px-5 py-4 align-top text-sm font-medium text-navy-700">
                        {ticket.client?.nom || '--'}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <Badge variant={ticket.status}>
                          {formatLabel(ticket.status)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <Badge variant={ticket.priority}>
                          {formatLabel(ticket.priority)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 align-top text-sm text-navy-500">
                        {formatDate(ticket.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </section>
  )
}

export default DashboardPage

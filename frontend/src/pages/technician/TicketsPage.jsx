import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getTickets } from '../../api/tickets'
import TicketFilters from '../../components/tickets/TicketFilters'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'
import {
  formatDate,
  formatLabel,
  parsePage,
} from '../../utils/ticketHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

function TicketsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [ticketsPage, setTicketsPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const status = searchParams.get('status') ?? ''
  const priority = searchParams.get('priority') ?? ''
  const search = searchParams.get('search') ?? ''
  const page = parsePage(searchParams.get('page'))
  const [searchInput, setSearchInput] = useState(search)
  const searchParamsKey = searchParams.toString()

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    let isMounted = true

    async function loadTickets() {
      setLoading(true)
      setError('')

      try {
        const response = await getTickets({
          page,
          priority: priority || undefined,
          search: search || undefined,
          status: status || undefined,
        })

        if (!isMounted) {
          return
        }

        setTicketsPage(response.data)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        if (requestError.response?.status === 403) {
          setError("Vous n'avez pas acc\u00e8s \u00e0 cette ressource.")
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

    loadTickets()

    return () => {
      isMounted = false
    }
  }, [page, priority, search, status])

  useEffect(() => {
    if (searchInput === search) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParamsKey)
      const nextSearchValue = searchInput.trim()

      if (nextSearchValue) {
        nextParams.set('search', nextSearchValue)
      } else {
        nextParams.delete('search')
      }

      nextParams.delete('page')
      setSearchParams(nextParams, { replace: true })
    }, 300)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [search, searchInput, searchParamsKey, setSearchParams])

  function updateSearchParams(updates, { resetPage = false } = {}) {
    const nextParams = new URLSearchParams(searchParamsKey)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        nextParams.set(key, value)
      } else {
        nextParams.delete(key)
      }
    })

    if (resetPage) {
      nextParams.delete('page')
    }

    setSearchParams(nextParams)
  }

  function handleFilterChange(name, value) {
    updateSearchParams({ [name]: value }, { resetPage: true })
  }

  function handlePageChange(nextPage) {
    updateSearchParams(
      { page: nextPage > 1 ? String(nextPage) : '' },
      { resetPage: false },
    )
  }

  function handleResetFilters() {
    setSearchInput('')
    setSearchParams({})
  }

  function handleRowNavigation(ticketId) {
    navigate(`/technician/tickets/${ticketId}`)
  }

  const tickets = ticketsPage?.data ?? []
  const hasActiveFilters = Boolean(status || priority || search)

  return (
    <section className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">Mes tickets</h1>
        <p className="mt-2 text-sm text-navy-400">
          Suivez vos tickets assign\u00e9s et les priorit\u00e9s en cours.
        </p>
      </div>

      <TicketFilters
        filters={{
          priority,
          status,
        }}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchInput}
        searchValue={searchInput}
        variant="technician"
      />

      {loading ? (
        <div className="rounded-2xl bg-surface-container-lowest px-6 py-16 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm font-medium text-navy-400">
              Chargement des tickets...
            </p>
          </div>
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
      ) : tickets.length === 0 ? (
        <EmptyState
          action={hasActiveFilters ? 'R\u00e9initialiser les filtres' : undefined}
          message={
            hasActiveFilters
              ? 'Aucun ticket ne correspond aux filtres actuels.'
              : 'Aucun ticket assign\u00e9 n\u2019est disponible pour le moment.'
          }
          onAction={hasActiveFilters ? handleResetFilters : undefined}
        />
      ) : (
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
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
                      Technicien
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                      Priorit\u00e9
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100/50 bg-transparent">
                  {tickets.map((ticket) => (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-navy-50/50"
                      key={ticket.id}
                      onClick={() => handleRowNavigation(ticket.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault()
                          handleRowNavigation(ticket.id)
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
                      <td className="px-6 py-4 align-top text-sm font-medium text-navy-600">
                        {ticket.technician?.name || '--'}
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
          </section>

          <Pagination meta={ticketsPage} onPageChange={handlePageChange} />
        </div>
      )}
    </section>
  )
}

export default TicketsPage

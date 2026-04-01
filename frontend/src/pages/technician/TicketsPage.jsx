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
        <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">Mes tickets</h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Suivez vos tickets assignés et les priorités en cours.
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
        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-16 shadow-sm">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm text-[#6b7280]">
              Chargement des tickets...
            </p>
          </div>
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
      ) : tickets.length === 0 ? (
        <EmptyState
          action={hasActiveFilters ? 'Réinitialiser les filtres' : undefined}
          message={
            hasActiveFilters
              ? 'Aucun ticket ne correspond aux filtres actuels.'
              : 'Aucun ticket assigné n’est disponible pour le moment.'
          }
          onAction={hasActiveFilters ? handleResetFilters : undefined}
        />
      ) : (
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
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
                      Technicien
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
                  {tickets.map((ticket) => (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-[#f8fafc]"
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
                      <td className="px-6 py-4 align-top text-sm text-[#6b7280]">
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
                      <td className="px-6 py-4 align-top text-sm text-[#6b7280]">
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

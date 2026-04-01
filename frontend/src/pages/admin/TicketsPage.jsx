import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getClients } from '../../api/clients'
import { getTickets } from '../../api/tickets'
import TicketFilters from '../../components/tickets/TicketFilters'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
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
  const [clients, setClients] = useState([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [clientsError, setClientsError] = useState('')
  const status = searchParams.get('status') ?? ''
  const priority = searchParams.get('priority') ?? ''
  const clientId = searchParams.get('client_id') ?? ''
  const search = searchParams.get('search') ?? ''
  const page = parsePage(searchParams.get('page'))
  const [searchInput, setSearchInput] = useState(search)
  const searchParamsKey = searchParams.toString()

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    let isMounted = true

    async function loadClients() {
      setClientsLoading(true)
      setClientsError('')

      try {
        const firstResponse = await getClients()
        const firstPage = firstResponse.data
        const firstClients = Array.isArray(firstPage?.data) ? firstPage.data : []
        const lastPage = firstPage?.last_page ?? 1
        let allClients = firstClients

        if (lastPage > 1) {
          const remainingResponses = await Promise.all(
            Array.from({ length: lastPage - 1 }, (_, index) =>
              getClients({ page: index + 2 }),
            ),
          )

          allClients = [
            ...firstClients,
            ...remainingResponses.flatMap(
              (response) => response.data?.data ?? [],
            ),
          ]
        }

        if (!isMounted) {
          return
        }

        setClients(allClients)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setClientsError(
          requestError.response?.data?.message || FALLBACK_ERROR_MESSAGE,
        )
      } finally {
        if (isMounted) {
          setClientsLoading(false)
        }
      }
    }

    loadClients()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    async function loadTickets() {
      setLoading(true)
      setError('')

      try {
        const response = await getTickets({
          client_id: clientId || undefined,
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
  }, [clientId, page, priority, search, status])

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
    navigate(`/admin/tickets/${ticketId}`)
  }

  const tickets = ticketsPage?.data ?? []
  const hasActiveFilters = Boolean(status || priority || clientId || search)

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Tickets</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Consultez, filtrez et pilotez les demandes de support de tous les
            clients.
          </p>
        </div>

        <Button onClick={() => navigate('/admin/tickets/new')} type="button">
          Nouveau ticket
        </Button>
      </div>

      {clientsError ? <Alert message={clientsError} type="error" /> : null}

      <TicketFilters
        clients={clients}
        clientsLoading={clientsLoading}
        filters={{
          clientId,
          priority,
          status,
        }}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchInput}
        searchValue={searchInput}
        variant="admin"
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
              : 'Aucun ticket n’est disponible pour le moment.'
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

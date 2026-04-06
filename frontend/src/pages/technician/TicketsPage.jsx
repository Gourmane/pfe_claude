import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getTickets } from '../../api/tickets'
import TicketFilters from '../../components/tickets/TicketFilters'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'
import { withSearch } from '../../utils/routeHelpers'
import { formatDate, formatLabel, parsePage } from '../../utils/ticketHelpers'

const FALLBACK_ERROR_MESSAGE = 'Impossible de charger la liste des tickets.'

function TicketCard({ onOpen, ticket }) {
  return (
    <article className="app-panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="line-clamp-2 text-sm font-semibold text-navy-900"
            title={ticket.title || ''}
          >
            {ticket.title || '--'}
          </p>
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
        <Button onClick={onOpen} size="sm" variant="secondary">
          Ouvrir le ticket
        </Button>
      </div>
    </article>
  )
}

function TicketsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [ticketsPage, setTicketsPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(-1)
  const tableRef = useRef(null)
  const status = searchParams.get('status') ?? ''
  const priority = searchParams.get('priority') ?? ''
  const search = searchParams.get('search') ?? ''
  const page = parsePage(searchParams.get('page'))
  const [searchInput, setSearchInput] = useState(search)
  const searchParamsKey = searchParams.toString()
  const hasActiveFilters = Boolean(status || priority || search)
  const listSearch = location.search
  const detailState = listSearch ? { fromSearch: listSearch } : undefined
  const activeFilterLabels = [
    status && 'Statut',
    priority && 'Priorite',
    search && 'Recherche',
  ].filter(Boolean)

  useEffect(() => {
    if (!location.state?.successMessage) {
      return
    }

    setSuccessMessage(location.state.successMessage)
    navigate(withSearch(location.pathname, location.search), {
      replace: true,
      state: null,
    })
  }, [location.pathname, location.search, location.state, navigate])

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
          setError("Vous n'avez pas acces a cette ressource.")
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
    navigate(`/technician/tickets/${ticketId}`, { state: detailState })
  }

  const tickets = ticketsPage?.data ?? []
  const totalTickets = ticketsPage?.total ?? tickets.length

  useEffect(() => {
    setKeyboardFocusIndex(-1)
  }, [searchParamsKey])

  useEffect(() => {
    if (keyboardFocusIndex < 0 || !tableRef.current) {
      return undefined
    }

    const row = tableRef.current.querySelector(`[data-row-index="${keyboardFocusIndex}"]`)
    if (row) {
      row.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [keyboardFocusIndex])

  useEffect(() => {
    function handleKeyDown(event) {
      const tag = event.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        return
      }

      if (event.key === 'j' || event.key === 'ArrowDown') {
        event.preventDefault()
        setKeyboardFocusIndex((prev) => Math.min(prev + 1, tickets.length - 1))
      } else if (event.key === 'k' || event.key === 'ArrowUp') {
        event.preventDefault()
        setKeyboardFocusIndex((prev) => Math.max(prev - 1, 0))
      } else if (event.key === 'Enter' && keyboardFocusIndex >= 0 && tickets[keyboardFocusIndex]) {
        event.preventDefault()
        handleRowNavigation(tickets[keyboardFocusIndex].id)
      } else if (event.key === 'Escape') {
        setKeyboardFocusIndex(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [tickets, keyboardFocusIndex])

  return (
    <section className="space-y-6">
      <div>
        <p className="app-page-header-kicker">Technicien</p>
        <h1 className="app-page-title">Mes tickets</h1>
        <p className="app-page-copy">
          Filtrez votre file de travail, repérez le bon contexte et ouvrez les
          tickets à traiter en priorité.
        </p>
      </div>

      {successMessage ? (
        <Alert
          message={successMessage}
          onClose={() => setSuccessMessage('')}
          type="success"
        />
      ) : null}

      <TicketFilters
        filters={{
          priority,
          status,
        }}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onSearchChange={setSearchInput}
        searchValue={searchInput}
        variant="technician"
      />

      <section className="app-panel flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-400">
            Resultats
          </p>
          <p className="mt-1 text-sm text-navy-500">
            {totalTickets} ticket(s) dans votre file courante.
          </p>
          <p className="mt-1 hidden text-[10px] text-navy-400 xl:block">
            ↑↓ · j/k pour naviguer &middot; Entrée pour ouvrir
          </p>
        </div>
        {hasActiveFilters ? (
          <div className="flex flex-wrap gap-2">
            {activeFilterLabels.map((label) => (
              <span
                className="inline-flex items-center rounded-full border border-navy-100 bg-surface px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-navy-500"
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {loading ? (
        <div className="app-panel px-6 py-16">
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
          action={hasActiveFilters ? 'Réinitialiser les filtres' : undefined}
          hint={
            hasActiveFilters
              ? 'Retirez un ou plusieurs filtres pour afficher davantage de tickets.'
              : 'Les tickets qui vous seront assignes apparaitront ici.'
          }
          message={
            hasActiveFilters
              ? 'Aucun ticket ne correspond aux filtres actuels.'
              : "Aucun ticket assigne n'est disponible pour le moment."
          }
          onAction={hasActiveFilters ? handleResetFilters : undefined}
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:hidden">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                onOpen={() => handleRowNavigation(ticket.id)}
                ticket={ticket}
              />
            ))}
          </div>

          <section className="app-table-shell hidden xl:block">
            <div ref={tableRef} className="overflow-x-auto">
              <table className="min-w-full text-left">
                <caption className="sr-only">
                  Liste des tickets assignes avec client, technicien, statut, priorite et date.
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
                      Technicien
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Statut
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Priorite
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100 bg-white">
                  {tickets.map((ticket, index) => (
                    <tr
                      className={[
                        'group cursor-pointer transition-colors focus-within:bg-surface',
                        keyboardFocusIndex === index
                          ? 'bg-primary/5 ring-2 ring-inset ring-primary/20'
                          : 'hover:bg-surface',
                      ].join(' ')}
                      data-row-index={index}
                      key={ticket.id}
                      onClick={() => handleRowNavigation(ticket.id)}
                    >
                      <td className="px-5 py-4 align-top">
                        <button
                          className="block rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy-100"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleRowNavigation(ticket.id)
                          }}
                          type="button"
                        >
                          <p className="text-sm font-semibold text-navy-900">
                            {ticket.title || '--'}
                          </p>
                          <p className="mt-1 text-xs font-medium text-navy-400">
                            #{ticket.id}
                          </p>
                        </button>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span
                          className="block max-w-[180px] truncate text-sm font-medium text-navy-700"
                          title={ticket.client?.nom || ''}
                        >
                          {ticket.client?.nom || '--'}
                        </span>
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span
                          className="block max-w-[180px] truncate text-sm font-medium text-navy-700"
                          title={ticket.technician?.name || ''}
                        >
                          {ticket.technician?.name || '--'}
                        </span>
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
                      <td className="px-5 py-4 align-top">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm text-navy-500">
                            {formatDate(ticket.created_at)}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-primary opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                            Voir
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
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

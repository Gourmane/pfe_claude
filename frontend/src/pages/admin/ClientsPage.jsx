import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteClient, getClients } from '../../api/clients'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Pagination from '../../components/ui/Pagination'
import Spinner from '../../components/ui/Spinner'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

function ClientCard({ client, onDelete, onEdit }) {
  return (
    <article className="app-panel p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy-900">{client.nom}</p>
          <p className="mt-1 text-sm text-navy-500">
            {client.entreprise || 'Entreprise non renseignee'}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
            Telephone
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy-700">
            {client.telephone}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
            E-mail
          </dt>
          <dd className="mt-1 break-all text-sm font-medium text-navy-700">
            {client.email || '--'}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onEdit} size="sm" variant="secondary">
          Modifier
        </Button>
        <Button onClick={onDelete} size="sm" variant="danger">
          Supprimer
        </Button>
      </div>
    </article>
  )
}

function ClientsPage() {
  const navigate = useNavigate()
  const [clientsPage, setClientsPage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadClients() {
      setLoading(true)
      setError('')

      try {
        const response = await getClients({
          page,
          search: searchQuery || undefined,
        })

        if (!isMounted) {
          return
        }

        setClientsPage(response.data)
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

    loadClients()

    return () => {
      isMounted = false
    }
  }, [page, refreshKey, searchQuery])

  function handleSearchSubmit(event) {
    event.preventDefault()
    const nextSearchQuery = searchInput.trim()

    if (page !== 1) {
      setPage(1)
    }

    if (nextSearchQuery !== searchQuery) {
      setSearchQuery(nextSearchQuery)
      return
    }

    setRefreshKey((currentValue) => currentValue + 1)
  }

  function handleClearSearch() {
    setSearchInput('')

    if (page !== 1) {
      setPage(1)
    }

    if (searchQuery) {
      setSearchQuery('')
      return
    }

    setRefreshKey((currentValue) => currentValue + 1)
  }

  function handleDeleteClick(client) {
    setDeleteError('')
    setDeleteTarget(client)
  }

  function handleCloseModal() {
    if (deleteLoading) {
      return
    }

    setDeleteError('')
    setDeleteTarget(null)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget || deleteLoading) {
      return
    }

    setDeleteLoading(true)
    setDeleteError('')

    try {
      await deleteClient(deleteTarget.id)

      const clients = clientsPage?.data ?? []
      const nextPage = page > 1 && clients.length === 1 ? page - 1 : page

      setDeleteTarget(null)

      if (nextPage !== page) {
        setPage(nextPage)
      } else {
        setRefreshKey((currentValue) => currentValue + 1)
      }
    } catch (requestError) {
      setDeleteError(
        requestError.response?.data?.message || FALLBACK_ERROR_MESSAGE,
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  const clients = clientsPage?.data ?? []
  const totalClients = clientsPage?.total ?? clients.length

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-navy-900">
            Clients
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-navy-500">
            Gardez l'annuaire client propre, consultable et fiable pour toutes
            les operations de support.
          </p>
        </div>

        <Button onClick={() => navigate('/admin/clients/new')} type="button">
          Nouveau client
        </Button>
      </div>

      <section className="app-panel p-4 sm:p-5">
        <div className="flex flex-col gap-3 border-b border-navy-100 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Recherche
            </p>
            <h2 className="mt-1 font-display text-[1.25rem] font-semibold tracking-tight text-navy-900">
              Filtrer les fiches client
            </h2>
          </div>
          <p className="text-sm text-navy-500">
            {totalClients} client(s) dans le resultat courant.
          </p>
        </div>

        <form
          className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end"
          onSubmit={handleSearchSubmit}
        >
          <div className="min-w-0 flex-1">
            <Input
              label="Rechercher un client"
              name="search"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Rechercher par nom ou telephone"
              value={searchInput}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="primary">
              Rechercher
            </Button>
            <Button onClick={handleClearSearch} type="button" variant="secondary">
              Réinitialiser
            </Button>
          </div>
        </form>
      </section>

      {loading ? (
        <div className="app-panel px-6 py-16">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm font-medium text-navy-400">
              Chargement des clients...
            </p>
          </div>
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
      ) : clients.length === 0 ? (
        <EmptyState
          action={searchQuery ? 'Effacer la recherche' : 'Creer un client'}
          message={
            searchQuery
              ? 'Aucun client ne correspond a votre recherche.'
              : "Aucun client n'est disponible pour le moment."
          }
          onAction={
            searchQuery
              ? handleClearSearch
              : () => navigate('/admin/clients/new')
          }
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:hidden md:grid-cols-2">
            {clients.map((client) => (
              <ClientCard
                client={client}
                key={client.id}
                onDelete={() => handleDeleteClick(client)}
                onEdit={() => navigate(`/admin/clients/${client.id}/edit`)}
              />
            ))}
          </div>

          <section className="app-table-shell hidden lg:block">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-surface">
                  <tr>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Nom
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Telephone
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      E-mail
                    </th>
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Entreprise
                    </th>
                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {clients.map((client) => (
                    <tr className="hover:bg-surface" key={client.id}>
                      <td className="px-5 py-4 text-sm font-semibold text-navy-900">
                        {client.nom}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-navy-700">
                        {client.telephone}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-navy-700">
                        {client.email || '--'}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-navy-700">
                        {client.entreprise || '--'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-3">
                          <Button
                            onClick={() => navigate(`/admin/clients/${client.id}/edit`)}
                            size="sm"
                            type="button"
                            variant="secondary"
                          >
                            Modifier
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(client)}
                            size="sm"
                            type="button"
                            variant="danger"
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Pagination meta={clientsPage} onPageChange={setPage} />
        </div>
      )}

      <Modal
        onClose={handleCloseModal}
        open={Boolean(deleteTarget)}
        title="Supprimer le client"
      >
        <div className="space-y-4">
          <p className="leading-6 text-navy-600">
            Supprimer{' '}
            <span className="font-semibold text-navy-900">{deleteTarget?.nom}</span>{' '}
            ? Cette action est definitive.
          </p>

          {deleteError ? <Alert message={deleteError} type="error" /> : null}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              disabled={deleteLoading}
              onClick={handleCloseModal}
              type="button"
              variant="secondary"
            >
              Annuler
            </Button>
            <Button
              loading={deleteLoading}
              onClick={handleConfirmDelete}
              type="button"
              variant="danger"
            >
              Supprimer le client
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default ClientsPage

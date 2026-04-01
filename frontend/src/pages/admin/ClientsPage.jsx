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

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">Clients</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Gérez l’annuaire client utilisé dans tout le flux de support.
          </p>
        </div>

        <Button onClick={() => navigate('/admin/clients/new')} type="button">
          Nouveau client
        </Button>
      </div>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <form
          className="flex flex-col gap-4 lg:flex-row lg:items-end"
          onSubmit={handleSearchSubmit}
        >
          <div className="min-w-0 flex-1">
            <Input
              label="Rechercher un client"
              name="search"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Rechercher par nom ou téléphone"
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
        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-16 shadow-sm">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm text-[#6b7280]">
              Chargement des clients...
            </p>
          </div>
        </div>
      ) : error ? (
        <Alert message={error} type="error" />
      ) : clients.length === 0 ? (
        <EmptyState
          action={searchQuery ? 'Effacer la recherche' : 'Créer un client'}
          message={
            searchQuery
              ? 'Aucun client ne correspond à votre recherche.'
              : 'Aucun client n’est disponible pour le moment.'
          }
          onAction={
            searchQuery
              ? handleClearSearch
              : () => navigate('/admin/clients/new')
          }
        />
      ) : (
        <div className="space-y-4">
          <section className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e5e7eb]">
                <thead className="bg-[#f8fafc]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                      Téléphone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                      E-mail
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                      Entreprise
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb] bg-white">
                  {clients.map((client) => (
                    <tr
                      className="transition-colors duration-200 hover:bg-[#f8fafc]"
                      key={client.id}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#111827]">
                        {client.nom}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">
                        {client.telephone}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">
                        {client.email || '--'}
                      </td>
                      <td className="px-6 py-4 text-sm text-[#6b7280]">
                        {client.entreprise || '--'}
                      </td>
                      <td className="px-6 py-4">
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
          <p className="leading-6 text-[#6b7280]">
            Supprimer {deleteTarget?.nom} ? Cette action est définitive.
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

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getClients } from '../../api/clients'
import { createTicket } from '../../api/tickets'
import TicketForm from '../../components/tickets/TicketForm'
import Alert from '../../components/ui/Alert'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { mapValidationErrors } from '../../utils/formHelpers'
import { withSearch } from '../../utils/routeHelpers'

const FALLBACK_ERROR_MESSAGE = "Impossible d'enregistrer le ticket."

function TicketCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const backTarget = withSearch(
    '/admin/tickets',
    location.state?.fromSearch || '',
  )
  const [clients, setClients] = useState([])
  const [clientsLoading, setClientsLoading] = useState(true)
  const [clientsLoaded, setClientsLoaded] = useState(false)
  const [clientsError, setClientsError] = useState('')
  const [clientSearch, setClientSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let isMounted = true
    const timeoutId = window.setTimeout(async () => {
      setClientsLoading(true)
      setClientsError('')

      try {
        const response = await getClients({
          search: clientSearch.trim() || undefined,
        })

        if (!isMounted) {
          return
        }

        setClients(response.data?.data ?? [])
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setClientsError(
          requestError.response?.data?.message ||
            'Impossible de charger la liste des clients.',
        )
      } finally {
        if (isMounted) {
          setClientsLoading(false)
          setClientsLoaded(true)
        }
      }
    }, 300)

    return () => {
      isMounted = false
      window.clearTimeout(timeoutId)
    }
  }, [clientSearch])

  async function handleSubmit(formValues) {
    if (loading) {
      return
    }

    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      await createTicket(formValues)
      navigate(backTarget, {
        replace: true,
        state: { successMessage: 'Le ticket a ete cree avec succes.' },
      })
    } catch (requestError) {
      if (requestError.response?.status === 422) {
        setFieldErrors(mapValidationErrors(requestError.response?.data?.errors))
      }

      setError(
        requestError.response?.data?.message || FALLBACK_ERROR_MESSAGE,
      )
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    navigate(backTarget)
  }

  const header = (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Admin
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-navy-900">
          Nouveau ticket
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-navy-500">
          Renseignez le contexte essentiel puis envoyez le ticket dans le flux
          sans surcharger la saisie.
        </p>
      </div>
    </div>
  )

  if (!clientsLoaded && clientsLoading) {
    return (
      <section className="space-y-6">
        {header}
        <div className="app-panel px-6 py-16">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm font-medium text-navy-400">
              Chargement des clients...
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (clientsLoaded && clientsError && clients.length === 0 && !clientSearch) {
    return (
      <section className="space-y-6">
        {header}
        <Alert message={clientsError} type="error" />
      </section>
    )
  }

  if (
    clientsLoaded &&
    !clientsLoading &&
    !clientsError &&
    clients.length === 0 &&
    !clientSearch
  ) {
    return (
      <section className="space-y-6">
        {header}
        <EmptyState
          hint="Ajoutez un client avant d'ouvrir un premier ticket."
          message="Aucun client n'est disponible pour ouvrir un ticket."
        />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      {header}

      <section className="app-panel p-4 sm:p-5 lg:p-6">
        <div className="border-b border-navy-100 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Creation
          </p>
          <h2 className="mt-1 font-display text-[1.25rem] font-semibold tracking-tight text-navy-900">
            Informations du ticket
          </h2>
          <p className="mt-1 text-sm text-navy-500">
            Decrivez le probleme, choisissez la priorite puis liez le ticket au
            bon client.
          </p>
        </div>

        <div className="mt-5">
          <TicketForm
            clientSearch={clientSearch}
            clients={clients}
            clientsError={clientsError}
            clientsLoading={clientsLoading}
            error={error}
            fieldErrors={fieldErrors}
            loading={loading}
            onCancel={handleCancel}
            onClientSearchChange={setClientSearch}
            onSubmit={handleSubmit}
            submitLabel="Creer le ticket"
          />
        </div>
      </section>
    </section>
  )
}

export default TicketCreatePage

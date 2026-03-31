import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClients } from '../../api/clients'
import { createTicket } from '../../api/tickets'
import TicketForm from '../../components/tickets/TicketForm'
import Alert from '../../components/ui/Alert'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { mapValidationErrors } from '../../utils/formHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

function TicketCreatePage() {
  const navigate = useNavigate()
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
          requestError.response?.data?.message || FALLBACK_ERROR_MESSAGE,
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
      navigate('/admin/tickets', { replace: true })
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
    navigate('/admin/tickets')
  }

  if (!clientsLoaded && clientsLoading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">New ticket</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Create a new support request and link it to an existing client.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-16 shadow-sm">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm text-[#6b7280]">
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
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">New ticket</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Create a new support request and link it to an existing client.
          </p>
        </div>

        <Alert message={clientsError} type="error" />
      </section>
    )
  }

  if (clientsLoaded && !clientsLoading && !clientsError && clients.length === 0 && !clientSearch) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">New ticket</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Create a new support request and link it to an existing client.
          </p>
        </div>

        <EmptyState message="No clients are available yet. Create a client before opening a ticket." />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#2563eb]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">New ticket</h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Create a new support request and link it to an existing client.
        </p>
      </div>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#111827]">
            Ticket details
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Fill in the issue details, select a client, and choose the priority
            before submitting.
          </p>
        </div>

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
          submitLabel="Create ticket"
        />
      </section>
    </section>
  )
}

export default TicketCreatePage

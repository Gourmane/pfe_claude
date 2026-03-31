import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClient, updateClient } from '../../api/clients'
import ClientForm from '../../components/clients/ClientForm'
import Alert from '../../components/ui/Alert'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { mapValidationErrors } from '../../utils/formHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

function ClientEditPage() {
  const navigate = useNavigate()
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    let isMounted = true

    async function loadClient() {
      setLoading(true)
      setError('')

      try {
        const response = await getClient(clientId)

        if (!isMounted) {
          return
        }

        setClient(response.data)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        if (requestError.response?.status === 403) {
          setError("Vous n'avez pas accès à cette ressource")
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

    loadClient()

    return () => {
      isMounted = false
    }
  }, [clientId])

  async function handleSubmit(formValues) {
    setSaving(true)
    setError('')
    setFieldErrors({})

    try {
      await updateClient(clientId, formValues)
      navigate('/admin/clients', { replace: true })
    } catch (requestError) {
      if (requestError.response?.status === 422) {
        setFieldErrors(mapValidationErrors(requestError.response?.data?.errors))
      }

      setError(
        requestError.response?.data?.message || FALLBACK_ERROR_MESSAGE,
      )
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    navigate('/admin/clients')
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Edit client
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Update the client profile and keep contact data accurate.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-16 shadow-sm">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm text-[#6b7280]">
              Chargement du client...
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (error && !client) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Edit client
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Update the client profile and keep contact data accurate.
          </p>
        </div>

        <Alert message={error} type="error" />
      </section>
    )
  }

  if (!client) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Edit client
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Update the client profile and keep contact data accurate.
          </p>
        </div>

        <EmptyState message="Client introuvable." />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#2563eb]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">Edit client</h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Update the client profile and keep contact data accurate.
        </p>
      </div>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#111827]">
            Client details
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            Edit the stored information for {client.nom}.
          </p>
        </div>

        <ClientForm
          error={error}
          fieldErrors={fieldErrors}
          initialValues={client}
          loading={saving}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel="Save changes"
        />
      </section>
    </section>
  )
}

export default ClientEditPage

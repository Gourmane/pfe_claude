import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '../../api/clients'
import ClientForm from '../../components/clients/ClientForm'
import { mapValidationErrors } from '../../utils/formHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'

function ClientCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  async function handleSubmit(formValues) {
    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      await createClient(formValues)
      navigate('/admin/clients', { replace: true })
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
    navigate('/admin/clients')
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Admin</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
          Nouveau client
        </h1>
        <p className="mt-2 text-sm text-navy-400">
          Ajoutez une fiche client avant de créer des tickets et des
          affectations.
        </p>
      </div>

      <section className="rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
        <div className="mb-6">
          <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">
            Informations du client
          </h2>
          <p className="mt-1 text-sm text-navy-400">
            Renseignez les coordonnées essentielles pour ce client.
          </p>
        </div>

        <ClientForm
          error={error}
          fieldErrors={fieldErrors}
          initialValues={null}
          loading={loading}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel="Créer le client"
        />
      </section>
    </section>
  )
}

export default ClientCreatePage

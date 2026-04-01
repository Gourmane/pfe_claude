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
        <p className="text-sm font-medium text-[#2563eb]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">
          Nouveau client
        </h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Ajoutez une fiche client avant de créer des tickets et des
          affectations.
        </p>
      </div>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#111827]">
            Informations du client
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
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

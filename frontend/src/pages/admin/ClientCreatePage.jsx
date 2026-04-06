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
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Admin
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-navy-900">
          Nouveau client
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-navy-500">
          Ajoutez une fiche client claire avant de creer des tickets et des
          affectations.
        </p>
      </div>

      <section className="app-panel p-4 sm:p-5 lg:p-6">
        <div className="border-b border-navy-100 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Fiche
          </p>
          <h2 className="mt-1 font-display text-[1.25rem] font-semibold tracking-tight text-navy-900">
            Informations du client
          </h2>
          <p className="mt-1 text-sm text-navy-500">
            Renseignez les coordonnees essentielles pour ce client.
          </p>
        </div>

        <div className="mt-5">
          <ClientForm
            error={error}
            fieldErrors={fieldErrors}
            initialValues={null}
            loading={loading}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            submitLabel="Creer le client"
          />
        </div>
      </section>
    </section>
  )
}

export default ClientCreatePage

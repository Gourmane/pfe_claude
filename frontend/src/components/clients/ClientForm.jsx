import { useEffect, useState } from 'react'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'

const DEFAULT_FORM_VALUES = {
  nom: '',
  telephone: '',
  email: '',
  adresse: '',
  entreprise: '',
}

function getFormValues(initialValues) {
  return {
    nom: initialValues?.nom ?? DEFAULT_FORM_VALUES.nom,
    telephone: initialValues?.telephone ?? DEFAULT_FORM_VALUES.telephone,
    email: initialValues?.email ?? DEFAULT_FORM_VALUES.email,
    adresse: initialValues?.adresse ?? DEFAULT_FORM_VALUES.adresse,
    entreprise: initialValues?.entreprise ?? DEFAULT_FORM_VALUES.entreprise,
  }
}

function ClientForm({
  initialValues,
  submitLabel,
  loading = false,
  error = '',
  fieldErrors = {},
  onSubmit,
  onCancel,
}) {
  const [formValues, setFormValues] = useState(getFormValues(initialValues))

  useEffect(() => {
    setFormValues(getFormValues(initialValues))
  }, [initialValues])

  function handleChange(event) {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (loading) {
      return
    }

    onSubmit(formValues)
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? <Alert message={error} type="error" /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          error={fieldErrors.nom}
          label="Nom"
          name="nom"
          onChange={handleChange}
          required
          value={formValues.nom}
        />
        <Input
          error={fieldErrors.telephone}
          label="Téléphone"
          name="telephone"
          onChange={handleChange}
          required
          value={formValues.telephone}
        />
        <Input
          error={fieldErrors.email}
          label="E-mail"
          name="email"
          onChange={handleChange}
          type="email"
          value={formValues.email}
        />
        <Input
          error={fieldErrors.entreprise}
          label="Entreprise"
          name="entreprise"
          onChange={handleChange}
          value={formValues.entreprise}
        />
      </div>

      <div className="grid gap-5">
        <Input
          error={fieldErrors.adresse}
          label="Adresse"
          name="adresse"
          onChange={handleChange}
          value={formValues.adresse}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-6 sm:flex-row sm:justify-between">
        <Button onClick={onCancel} type="button" variant="secondary">
          Annuler
        </Button>
        <Button loading={loading} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default ClientForm

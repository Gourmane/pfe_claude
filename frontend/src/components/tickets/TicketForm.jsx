import { useMemo, useState } from 'react'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

const DEFAULT_FORM_VALUES = {
  title: '',
  description: '',
  priority: '',
  client_id: '',
}

const PRIORITY_OPTIONS = [
  { label: 'Selectionner une priorite', value: '' },
  { label: 'Faible', value: 'low' },
  { label: 'Moyenne', value: 'medium' },
  { label: 'Haute', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
]

function getFormValues(initialValues) {
  return {
    title: initialValues?.title ?? DEFAULT_FORM_VALUES.title,
    description: initialValues?.description ?? DEFAULT_FORM_VALUES.description,
    priority: initialValues?.priority ?? DEFAULT_FORM_VALUES.priority,
    client_id: initialValues?.client_id
      ? String(initialValues.client_id)
      : DEFAULT_FORM_VALUES.client_id,
  }
}

function TicketForm({
  initialValues,
  submitLabel,
  loading = false,
  error = '',
  fieldErrors = {},
  clients = [],
  clientsLoading = false,
  clientsError = '',
  clientSearch = '',
  onClientSearchChange,
  onSubmit,
  onCancel,
}) {
  const [formValues, setFormValues] = useState(getFormValues(initialValues))
  const selectedClientLabel =
    clients.find((client) => String(client.id) === formValues.client_id)?.nom ??
    initialValues?.client?.nom ??
    ''

  const clientOptions = useMemo(() => {
    const options = [
      {
        label: clientsLoading
          ? 'Chargement des clients...'
          : 'Selectionner un client',
        value: '',
      },
    ]

    if (
      formValues.client_id &&
      selectedClientLabel &&
      !clients.some((client) => String(client.id) === formValues.client_id)
    ) {
      options.push({
        label: selectedClientLabel,
        value: formValues.client_id,
      })
    }

    clients.forEach((client) => {
      options.push({
        label: client.nom,
        value: String(client.id),
      })
    })

    return options
  }, [clients, clientsLoading, formValues.client_id, selectedClientLabel])

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

    onSubmit({
      title: formValues.title,
      description: formValues.description,
      priority: formValues.priority,
      client_id: formValues.client_id,
    })
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error ? <Alert message={error} type="error" /> : null}

      <section className="app-panel-soft p-4 sm:p-5">
        <div className="border-b border-navy-100 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Contexte
          </p>
          <h3 className="mt-1 font-display text-[1.25rem] font-semibold tracking-tight text-navy-900">
            Informations du ticket
          </h3>
          <p className="mt-1 text-sm text-navy-500">
            Resumez le probleme de maniere claire et choisissez la bonne
            priorite.
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Input
            error={fieldErrors.title}
            label="Titre"
            name="title"
            onChange={handleChange}
            required
            value={formValues.title}
          />
          <Select
            error={fieldErrors.priority}
            label="Priorite"
            name="priority"
            onChange={handleChange}
            options={PRIORITY_OPTIONS}
            required
            value={formValues.priority}
          />
        </div>

        <div className="mt-4">
          <Textarea
            error={fieldErrors.description}
            label="Description"
            name="description"
            onChange={handleChange}
            required
            value={formValues.description}
          />
        </div>
      </section>

      <section className="app-panel p-4 sm:p-5">
        <div className="border-b border-navy-100 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Liaison
          </p>
          <h3 className="mt-1 font-display text-[1.25rem] font-semibold tracking-tight text-navy-900">
            Client concerne
          </h3>
          <p className="mt-1 text-sm text-navy-500">
            Recherchez le client, puis selectionnez la fiche a lier au ticket.
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Input
            label="Recherche client"
            name="client-search"
            onChange={(event) => onClientSearchChange(event.target.value)}
            placeholder="Rechercher par nom ou telephone"
            value={clientSearch}
          />

          <Select
            error={fieldErrors.client_id}
            label="Client"
            name="client_id"
            onChange={handleChange}
            options={clientOptions}
            required
            value={formValues.client_id}
          />
        </div>

        {clientsError ? (
          <p className="mt-3 text-sm text-red-600">{clientsError}</p>
        ) : null}

        {!clientsLoading && clients.length === 0 && !clientsError ? (
          <p className="mt-3 text-sm text-navy-500">
            Aucun client ne correspond a cette recherche.
          </p>
        ) : null}
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-4 sm:flex-row sm:justify-end">
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

export default TicketForm

import { useMemo, useState } from 'react'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'

const DEFAULT_FORM_VALUES = {
  title: '',
  description: '',
  priority: '',
  client_id: '',
}

const PRIORITY_OPTIONS = [
  { label: 'Select priority', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

function TextareaField({ error, id, label, name, onChange, required, value }) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#111827]" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'min-h-36 w-full rounded-xl border bg-white px-3 py-3 text-sm text-[#111827] outline-none transition focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-200 focus:border-blue-600 focus:ring-blue-100',
        ].join(' ')}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      />
      {error ? (
        <p className="text-sm text-red-600" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function SelectField({
  error,
  id,
  label,
  name,
  onChange,
  options,
  required,
  value,
}) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#111827]" htmlFor={id}>
        {label}
      </label>
      <select
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-[#111827] outline-none transition focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-200 focus:border-blue-600 focus:ring-blue-100',
        ].join(' ')}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      >
        {options.map((option) => (
          <option key={`${name}-${option.value || 'empty'}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-red-600" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

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
      { label: clientsLoading ? 'Loading clients...' : 'Select client', value: '' },
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

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          error={fieldErrors.title}
          label="Title"
          name="title"
          onChange={handleChange}
          required
          value={formValues.title}
        />
        <SelectField
          error={fieldErrors.priority}
          id="priority"
          label="Priority"
          name="priority"
          onChange={handleChange}
          options={PRIORITY_OPTIONS}
          required
          value={formValues.priority}
        />
      </div>

      <TextareaField
        error={fieldErrors.description}
        id="description"
        label="Description"
        name="description"
        onChange={handleChange}
        required
        value={formValues.description}
      />

      <section className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-5">
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">Client</h3>
          <p className="mt-1 text-sm text-[#6b7280]">
            Search for a client, then select the matching record.
          </p>
        </div>

        <Input
          label="Search client"
          name="client-search"
          onChange={(event) => onClientSearchChange(event.target.value)}
          placeholder="Search by name or telephone"
          value={clientSearch}
        />

        <SelectField
          error={fieldErrors.client_id}
          id="client_id"
          label="Client"
          name="client_id"
          onChange={handleChange}
          options={clientOptions}
          required
          value={formValues.client_id}
        />

        {clientsError ? (
          <p className="text-sm text-red-600">{clientsError}</p>
        ) : null}

        {!clientsLoading && clients.length === 0 && !clientsError ? (
          <p className="text-sm text-[#6b7280]">
            No clients match the current search.
          </p>
        ) : null}
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-6 sm:flex-row sm:justify-between">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button loading={loading} type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default TicketForm

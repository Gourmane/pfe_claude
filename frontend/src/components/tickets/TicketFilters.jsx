import Input from '../ui/Input'

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
]

const PRIORITY_OPTIONS = [
  { label: 'All priorities', value: '' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
]

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
  disabled = false,
}) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-[#111827]"
        htmlFor={name}
      >
        {label}
      </label>
      <select
        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-[#9ca3af]"
        disabled={disabled}
        id={name}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={`${name}-${option.value || 'all'}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function TicketFilters({
  variant = 'admin',
  filters,
  searchValue,
  clients = [],
  clientsLoading = false,
  onFilterChange,
  onSearchChange,
}) {
  const clientOptions =
    clientsLoading && clients.length === 0
      ? [{ label: 'Loading clients...', value: '' }]
      : [
          { label: 'All clients', value: '' },
          ...clients.map((client) => ({
            label: client.nom,
            value: String(client.id),
          })),
        ]

  return (
    <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SelectField
          label="Status"
          name="status"
          onChange={onFilterChange}
          options={STATUS_OPTIONS}
          value={filters.status}
        />
        <SelectField
          label="Priority"
          name="priority"
          onChange={onFilterChange}
          options={PRIORITY_OPTIONS}
          value={filters.priority}
        />
        {variant === 'admin' ? (
          <SelectField
            disabled={clientsLoading && clients.length === 0}
            label="Client"
            name="client_id"
            onChange={onFilterChange}
            options={clientOptions}
            value={filters.clientId}
          />
        ) : null}
        <div className={variant === 'admin' ? '' : 'xl:col-span-2'}>
          <Input
            label="Search"
            name="search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or description"
            value={searchValue}
          />
        </div>
      </div>
    </section>
  )
}

export default TicketFilters

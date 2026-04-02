import Input from '../ui/Input'

const STATUS_OPTIONS = [
  { label: 'Tous les statuts', value: '' },
  { label: 'En attente', value: 'pending' },
  { label: 'En cours', value: 'in_progress' },
  { label: 'Résolu', value: 'resolved' },
  { label: 'Clôturé', value: 'closed' },
]

const PRIORITY_OPTIONS = [
  { label: 'Toutes les priorités', value: '' },
  { label: 'Faible', value: 'low' },
  { label: 'Moyenne', value: 'medium' },
  { label: 'Haute', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
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
        className="block text-[10px] font-bold uppercase tracking-wider text-navy-400"
        htmlFor={name}
      >
        {label}
      </label>
      <select
        className="h-11 w-full rounded-xl bg-surface-section px-3.5 text-sm text-navy-900 border border-transparent outline-none transition-all focus:bg-surface-container-lowest focus:border-navy-200 focus:ring-4 focus:ring-navy-100 hover:border-navy-100 disabled:cursor-not-allowed disabled:bg-surface-section/50 disabled:text-navy-400"
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
      ? [{ label: 'Chargement des clients...', value: '' }]
      : [
        { label: 'Tous les clients', value: '' },
        ...clients.map((client) => ({
          label: client.nom,
          value: String(client.id),
        })),
      ]

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SelectField
          label="Statut"
          name="status"
          onChange={onFilterChange}
          options={STATUS_OPTIONS}
          value={filters.status}
        />
        <SelectField
          label="Priorité"
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
            label="Recherche"
            name="search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher par titre ou description"
            value={searchValue}
          />
        </div>
      </div>
    </section>
  )
}

export default TicketFilters

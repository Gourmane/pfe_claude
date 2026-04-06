import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

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

function TicketFilters({
  variant = 'admin',
  filters,
  searchValue,
  clientSearchValue = '',
  clients = [],
  clientsLoading = false,
  hasActiveFilters = false,
  onClientSearchChange,
  onFilterChange,
  onReset,
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
    <section className="app-panel p-4 sm:p-5">
      <div className="flex flex-col gap-4 border-b border-navy-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Triage
          </p>
          <h2 className="mt-1 font-display text-[1.35rem] font-semibold tracking-tight text-navy-900">
            Filtres de recherche
          </h2>
          <p className="mt-1 text-sm leading-6 text-navy-500">
            Réduisez la liste aux tickets à traiter maintenant et gardez la
            prochaine action visible.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <span className="inline-flex items-center rounded-full border border-primary-pale bg-primary-ghost px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-vivid">
            {hasActiveFilters ? 'Filtres actifs' : 'Vue complète'}
          </span>
          {hasActiveFilters && onReset ? (
            <Button
              className="sm:w-auto"
              onClick={onReset}
              size="sm"
              type="button"
              variant="secondary"
            >
              Réinitialiser
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="md:col-span-2 xl:col-span-4">
          <Input
            label="Recherche"
            name="search"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Rechercher par titre ou description"
            value={searchValue}
          />
        </div>

        <Select
          label="Statut"
          name="status"
          onChange={(event) => onFilterChange('status', event.target.value)}
          options={STATUS_OPTIONS}
          value={filters.status}
        />

        <Select
          label="Priorite"
          name="priority"
          onChange={(event) => onFilterChange('priority', event.target.value)}
          options={PRIORITY_OPTIONS}
          value={filters.priority}
        />

        {variant === 'admin' ? (
          <>
            <Input
              label="Recherche client"
              name="client_search"
              onChange={(event) => onClientSearchChange?.(event.target.value)}
              placeholder="Nom ou telephone"
              value={clientSearchValue}
            />
            <Select
              disabled={clientsLoading && clients.length === 0}
              label="Client"
              name="client_id"
              onChange={(event) => onFilterChange('client_id', event.target.value)}
              options={clientOptions}
              value={filters.clientId}
            />
          </>
        ) : null}
      </div>
    </section>
  )
}

export default TicketFilters

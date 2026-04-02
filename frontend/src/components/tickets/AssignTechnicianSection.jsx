import { useState } from 'react'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

function AssignTechnicianSection({
  technicians = [],
  currentTechnicianId,
  currentTechnicianName,
  loading = false,
  error = '',
  onAssign,
}) {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(
    currentTechnicianId ? String(currentTechnicianId) : '',
  )

  function handleSubmit(event) {
    event.preventDefault()

    if (
      !selectedTechnicianId ||
      loading ||
      selectedTechnicianId === String(currentTechnicianId ?? '')
    ) {
      return
    }

    onAssign?.(selectedTechnicianId)
  }

  return (
    <section className="space-y-5 rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
      <div>
        <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">Assignation</h2>
        <p className="mt-1 text-sm text-navy-400">
          Attribuez ce ticket au technicien responsable de l'intervention.
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy-400">
          Technicien actuel
        </p>
        <p className="mt-1.5 text-sm font-medium text-navy-900">
          {currentTechnicianName || 'Non assigné'}
        </p>
      </div>

      {error ? <Alert message={error} type="error" /> : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label
            className="block text-[10px] font-bold uppercase tracking-wider text-navy-400"
            htmlFor="technician_id"
          >
            Technicien
          </label>
          <select
            className="h-11 w-full rounded-xl bg-surface-section px-3.5 text-sm text-navy-900 border border-transparent outline-none transition-all focus:bg-surface-container-lowest focus:border-navy-200 focus:ring-4 focus:ring-navy-100 hover:border-navy-100"
            id="technician_id"
            onChange={(event) => setSelectedTechnicianId(event.target.value)}
            value={selectedTechnicianId}
          >
            <option value="">Sélectionner un technicien</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={String(technician.id)}>
                {technician.name}
              </option>
            ))}
          </select>
        </div>

        {technicians.length === 0 ? (
          <p className="text-sm font-medium text-navy-400">
            Aucun technicien n'est disponible pour le moment.
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button
            disabled={
              !selectedTechnicianId ||
              selectedTechnicianId === String(currentTechnicianId ?? '')
            }
            loading={loading}
            type="submit"
          >
            Assigner un technicien
          </Button>
        </div>
      </form>
    </section>
  )
}

export default AssignTechnicianSection

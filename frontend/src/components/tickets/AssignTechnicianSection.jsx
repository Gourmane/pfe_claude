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
    <section className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Assignation</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Attribuez ce ticket au technicien responsable de l'intervention.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
          Technicien actuel
        </p>
        <p className="mt-2 text-sm font-medium text-[#111827]">
          {currentTechnicianName || 'Non assigné'}
        </p>
      </div>

      {error ? <Alert message={error} type="error" /> : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="block text-sm font-medium text-[#111827]"
            htmlFor="technician_id"
          >
            Technicien
          </label>
          <select
            className="h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#dbeafe]"
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
          <p className="text-sm text-[#6b7280]">
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

import { useState } from 'react'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Select from '../ui/Select'

function AssignTechnicianSection({
  technicians = [],
  currentTechnicianId,
  currentTechnicianName,
  loading = false,
  error = '',
  onAssign,
  plainHeader = false,
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

  const content = (
    <>
      <div className="app-ticket-detail-group p-[14px_16px]">
        <p className="app-panel-kicker mb-[6px]">Technicien actuel</p>
        <p className="break-words text-[0.9375rem] font-semibold text-navy">
          {currentTechnicianName || "Aucun technicien n'est encore assigné."}
        </p>
      </div>

      {error ? <div className="mt-4"><Alert message={error} type="error" /></div> : null}

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <Select
          label="Technicien"
          name="technician_id"
          onChange={(event) => setSelectedTechnicianId(event.target.value)}
          options={[
            { label: 'Sélectionner un technicien', value: '' },
            ...technicians.map((technician) => ({
              label: technician.name,
              value: String(technician.id),
            })),
          ]}
          value={selectedTechnicianId}
        />

        {technicians.length === 0 ? (
          <p className="text-[12.5px] font-medium text-text-muted">
            Aucun technicien n'est disponible pour le moment.
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            className="sm:w-auto"
            disabled={
              !selectedTechnicianId ||
              selectedTechnicianId === String(currentTechnicianId ?? '') ||
              loading
            }
            type="submit"
            variant="secondary"
          >
            {loading ? 'Assignation...' : 'Assigner'}
          </Button>
        </div>
      </form>
    </>
  )

  if (plainHeader) {
    return <div className="w-full">{content}</div>
  }

  return (
    <section className="app-panel p-[20px]">
      <div className="mb-4 border-b border-border-light pb-4">
        <h2 className="app-panel-title mt-0">Assignation</h2>
        <p className="app-panel-copy mt-1">
          Orientez rapidement le ticket vers le bon technicien.
        </p>
      </div>

      {content}
    </section>
  )
}

export default AssignTechnicianSection

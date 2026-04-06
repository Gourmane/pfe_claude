import { useState } from 'react'
import Button from '../ui/Button'

const STATUS_STEPS = [
  { key: 'pending', label: 'Attente' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'resolved', label: 'Résolu' },
  { key: 'closed', label: 'Clôturé' },
]

const STATUS_INDEX = {
  pending: 0,
  in_progress: 1,
  resolved: 2,
  closed: 3,
}

const TRANSITIONS = {
  admin: {
    resolved: {
      helperText:
        'Le ticket est résolu. Confirmez sa clôture quand la résolution est vérifiée.',
      label: 'Clôturer',
      confirmLabel: 'Confirmer la clôture',
      nextStatus: 'closed',
    },
  },
  technicien: {
    pending: {
      helperText:
        "Passez le ticket en cours dès que l'intervention a réellement commencé.",
      label: 'Démarrer',
      confirmLabel: "Confirmer le démarrage",
      nextStatus: 'in_progress',
    },
    in_progress: {
      helperText:
        "Marquez le ticket comme résolu quand l'intervention est terminée et documentée.",
      label: 'Résoudre',
      confirmLabel: 'Confirmer la résolution',
      nextStatus: 'resolved',
    },
  },
}

function StatusStepper({ status }) {
  const currentIndex = STATUS_INDEX[status] ?? 0

  return (
    <div className="app-ticket-detail-group rounded-[14px] p-[14px_16px]">
      <p className="app-panel-kicker mb-[10px]">Progression</p>
      <div className="flex items-start">
        {STATUS_STEPS.map((step, i) => {
          const isDone = i < currentIndex
          const isCurrent = i === currentIndex
          const isLast = i === STATUS_STEPS.length - 1

          return (
            <div className="flex flex-1 items-start min-w-0" key={step.key}>
              <div className="flex flex-col items-center min-w-0">
                <div
                  className={[
                    'h-2 w-2 shrink-0 rounded-full transition-colors',
                    isDone ? 'bg-emerald-ink' : isCurrent ? 'bg-primary' : 'bg-navy-200',
                  ].join(' ')}
                />
                <span
                  className={[
                    'mt-1.5 text-[9px] font-bold uppercase tracking-[0.08em] whitespace-nowrap',
                    isDone ? 'text-emerald-ink' : isCurrent ? 'text-primary' : 'text-navy-300',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={[
                    'mt-1 h-px flex-1 mx-1',
                    i < currentIndex ? 'bg-emerald-ink/25' : 'bg-navy-100',
                  ].join(' ')}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusTransitionButton({
  role,
  status,
  loading = false,
  onTransition,
}) {
  const [confirming, setConfirming] = useState(false)
  const transition = TRANSITIONS[role]?.[status]

  function handleFirstClick() {
    setConfirming(true)
  }

  function handleConfirm() {
    setConfirming(false)
    onTransition?.(transition.nextStatus)
  }

  function handleCancel() {
    setConfirming(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <StatusStepper status={status} />

      {transition ? (
        <>
          <div className="app-ticket-detail-group rounded-[14px] p-[14px_16px]">
            <p className="app-panel-kicker mb-[6px]">Prochaine étape</p>
            <p className="app-panel-copy mt-0">{transition.helperText}</p>
          </div>

          {confirming ? (
            <div className="flex flex-col gap-2">
              <div className="rounded-[10px] border border-navy-100 bg-surface px-4 py-3">
                <p className="text-[11px] font-semibold text-navy-600">
                  Confirmer l'action — cette transition ne peut pas être annulée.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 sm:flex-1"
                  loading={loading}
                  onClick={handleConfirm}
                  type="button"
                >
                  {transition.confirmLabel}
                </Button>
                <Button
                  className="sm:w-auto"
                  disabled={loading}
                  onClick={handleCancel}
                  type="button"
                  variant="secondary"
                >
                  Annuler
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="sm:w-full"
              onClick={handleFirstClick}
              type="button"
            >
              {transition.label}
            </Button>
          )}
        </>
      ) : null}
    </div>
  )
}

export default StatusTransitionButton

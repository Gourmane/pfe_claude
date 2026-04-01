import Button from '../ui/Button'

const TRANSITIONS = {
  admin: {
    resolved: {
      label: 'Clôturer',
      nextStatus: 'closed',
    },
  },
  technicien: {
    pending: {
      label: 'Démarrer',
      nextStatus: 'in_progress',
    },
    in_progress: {
      label: 'Résoudre',
      nextStatus: 'resolved',
    },
  },
}

function StatusTransitionButton({
  role,
  status,
  loading = false,
  onTransition,
}) {
  const transition = TRANSITIONS[role]?.[status]

  if (!transition) {
    return null
  }

  return (
    <Button
      loading={loading}
      onClick={() => onTransition?.(transition.nextStatus)}
      type="button"
    >
      {transition.label}
    </Button>
  )
}

export default StatusTransitionButton

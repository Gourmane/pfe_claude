const DISPLAY_LABELS = {
  closed: 'Clôturé',
  high: 'Haute',
  in_progress: 'En cours',
  low: 'Faible',
  medium: 'Moyenne',
  pending: 'En attente',
  resolved: 'Résolu',
  urgent: 'Urgente',
}

export function parsePage(value) {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return 1
  }

  return parsedValue
}

export function formatDate(value) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatLabel(value) {
  if (!value) {
    return '--'
  }

  if (DISPLAY_LABELS[value]) {
    return DISPLAY_LABELS[value]
  }

  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

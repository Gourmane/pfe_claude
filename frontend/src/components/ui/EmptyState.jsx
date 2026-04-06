import Button from './Button'

function EmptyState({
  title = 'Aucun résultat',
  message,
  hint = "Vérifiez le contexte en cours ou relancez l'action principale pour continuer.",
  action,
  actionVariant = 'primary',
  onAction,
}) {
  return (
    <div className="app-panel px-5 py-12 text-left sm:px-6 sm:py-14">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-navy-400">
        {title}
      </p>
      <p className="mt-3 max-w-2xl break-words text-sm font-medium leading-6 text-navy-700">
        {message}
      </p>
      {hint ? (
        <p className="mt-2 max-w-xl text-xs leading-5 text-navy-400">
          {hint}
        </p>
      ) : null}
      {action && onAction ? (
        <div className="mt-6 flex justify-start">
          <Button onClick={onAction} type="button" variant={actionVariant}>
            {action}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default EmptyState

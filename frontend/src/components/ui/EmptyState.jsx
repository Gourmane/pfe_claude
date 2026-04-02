import Button from './Button'

function EmptyState({ message, action, onAction }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest px-6 py-16 text-center shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-300">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <p className="mt-5 text-sm font-medium text-navy-400">{message}</p>
      {action && onAction ? (
        <div className="mt-6 flex justify-center">
          <Button onClick={onAction} type="button">
            {action}
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default EmptyState

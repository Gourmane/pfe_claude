import Button from './Button'

function EmptyState({ message, action, onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#2563eb]">
        <span className="text-lg">?</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#6b7280]">{message}</p>
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

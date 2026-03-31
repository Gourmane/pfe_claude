const TYPE_CLASS_NAMES = {
  success: 'border-green-200 bg-green-50 text-green-700',
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
}

function Alert({ type = 'info', message, onClose }) {
  const typeClassName = TYPE_CLASS_NAMES[type] ?? TYPE_CLASS_NAMES.info

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${typeClassName}`}
      role="alert"
    >
      <p className="leading-6">{message}</p>
      {onClose ? (
        <button
          aria-label="Close alert"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition duration-200 hover:bg-white/60"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      ) : null}
    </div>
  )
}

export default Alert

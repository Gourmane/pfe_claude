const TYPE_CLASS_NAMES = {
  success: 'bg-emerald-50/70 text-emerald-800 border-l-[3px] border-l-emerald-500',
  error: 'bg-red-50/70 text-red-800 border-l-[3px] border-l-red-500',
  info: 'bg-navy-50 text-navy-700 border-l-[3px] border-l-navy-400',
}

function Alert({ type = 'info', message, onClose }) {
  const typeClassName = TYPE_CLASS_NAMES[type] ?? TYPE_CLASS_NAMES.info

  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl px-4 py-3 text-sm ${typeClassName}`}
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

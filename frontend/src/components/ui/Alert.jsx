const TYPE_CLASS_NAMES = {
  success:
    'border border-emerald-200 bg-[#F8FCF9] text-emerald-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
  error:
    'border border-red-200 bg-[#FFF8F8] text-red-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
  info:
    'border border-navy-200 bg-[#FBFAF7] text-navy-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]',
}

const ICON_WRAPPER_CLASS_NAMES = {
  success: 'bg-emerald-100 text-emerald-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-[#F1ECE5] text-[#5F6C80]',
}

const TYPE_LABELS = {
  success: 'Succes',
  error: 'Attention',
  info: 'Information',
}

function AlertIcon({ type }) {
  if (type === 'success') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M5 13l4 4L19 7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
      </svg>
    )
  }

  if (type === 'error') {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
        <path
          d="M12 8v4m0 4h.01M10.29 3.86l-7.5 13A1 1 0 003.66 18h16.68a1 1 0 00.87-1.14l-7.5-13a1 1 0 00-1.74 0z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.9"
        />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 8h.01M11 12h1v4h1m-1-13a9 9 0 110 18 9 9 0 010-18z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  )
}

function Alert({ type = 'info', message, onClose }) {
  const typeClassName = TYPE_CLASS_NAMES[type] ?? TYPE_CLASS_NAMES.info
  const iconWrapperClassName =
    ICON_WRAPPER_CLASS_NAMES[type] ?? ICON_WRAPPER_CLASS_NAMES.info
  const typeLabel = TYPE_LABELS[type] ?? TYPE_LABELS.info

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-[14px] px-4 py-3.5 text-sm ${typeClassName}`}
      role="alert"
    >
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] ${iconWrapperClassName}`}
        >
          <AlertIcon type={type} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-current/70">
            {typeLabel}
          </p>
          <p className="mt-1 min-w-0 leading-6">{message}</p>
        </div>
      </div>
      {onClose ? (
        <button
          aria-label="Fermer l'alerte"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-current/70 transition duration-200 hover:bg-white/70 hover:text-current active:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-200 -my-1.5 -mr-1.5"
          onClick={onClose}
          type="button"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            &times;
          </span>
        </button>
      ) : null}
    </div>
  )
}

export default Alert

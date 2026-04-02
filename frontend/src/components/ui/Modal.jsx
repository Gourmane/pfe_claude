function Modal({ open, onClose, title, children }) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2A44]/30 px-4 py-6 backdrop-blur-md transition-all"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-surface-container-lowest p-6 shadow-[0_12px_48px_rgba(15,42,68,0.12)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold tracking-tight text-navy-900">{title}</h2>
          <button
            aria-label="Close modal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-navy-400 transition-colors duration-200 hover:bg-navy-50 hover:text-navy-600 focus:outline-none"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="mt-4 text-sm text-navy-500">{children}</div>
      </div>
    </div>
  )
}

export default Modal

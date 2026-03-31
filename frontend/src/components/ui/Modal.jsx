function Modal({ open, onClose, title, children }) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/35 px-4 py-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_24px_60px_rgba(17,24,39,0.16)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
          <button
            aria-label="Close modal"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-[#9ca3af] transition duration-200 hover:bg-gray-50 hover:text-[#6b7280]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <div className="mt-5 text-sm text-[#6b7280]">{children}</div>
      </div>
    </div>
  )
}

export default Modal

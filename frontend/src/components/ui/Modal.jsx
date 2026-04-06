import { useEffect, useId, useRef } from 'react'

function Modal({ open, onClose, title, children }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    previousFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'

    const frameId = requestAnimationFrame(() => {
      dialogRef.current?.focus()
    })

    return () => {
      cancelAnimationFrame(frameId)
      document.body.style.overflow = previousOverflow

      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return undefined
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusableElements = dialogRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(27,43,75,0.42)] px-3 py-3 backdrop-blur-[2px] sm:items-center sm:px-4 sm:py-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-[20px] border border-[#F4C9A8] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(254,240,231,0.9)_100%)] p-5 shadow-[0_24px_60px_rgba(27,43,75,0.16)] sm:rounded-[20px] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            className="font-display text-[1.35rem] font-semibold tracking-tight text-navy-900"
            id={titleId}
          >
            {title}
          </h2>
          <button
            aria-label="Fermer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] text-navy-400 transition-colors duration-150 hover:bg-white/80 hover:text-primary-vivid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-vivid/15"
            onClick={onClose}
            type="button"
          >
            x
          </button>
        </div>
        <div className="mt-4 text-sm text-navy-500">{children}</div>
      </div>
    </div>
  )
}

export default Modal

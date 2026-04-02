import Button from './Button'

function Pagination({ meta, onPageChange }) {
  if (!meta || !meta.current_page || !meta.last_page || meta.last_page <= 1) {
    return null
  }

  const currentPage = meta.current_page
  const lastPage = meta.last_page
  const pageNumbers = Array.from({ length: lastPage }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-[0_2px_8px_rgba(15,42,68,0.04)] sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-navy-400">
        Page <span className="font-semibold tracking-tight text-navy-900">{currentPage}</span> sur{' '}
        <span className="font-semibold tracking-tight text-navy-900">{lastPage}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          size="sm"
          variant="secondary"
        >
          Précédent
        </Button>

        {pageNumbers.map((pageNumber) => (
          <button
            className={[
              'inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-medium transition-all duration-200',
              pageNumber === currentPage
                ? 'bg-navy-50 text-navy-800 shadow-[0_1px_2px_rgba(15,42,68,0.08)]'
                : 'bg-surface-section text-navy-500 hover:bg-navy-50 hover:text-navy-800',
            ].join(' ')}
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            type="button"
          >
            {pageNumber}
          </button>
        ))}

        <Button
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          size="sm"
          variant="secondary"
        >
          Suivant
        </Button>
      </div>
    </nav>
  )
}

export default Pagination

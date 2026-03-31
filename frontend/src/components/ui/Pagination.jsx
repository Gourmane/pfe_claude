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
      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-[#6b7280]">
        Page <span className="font-medium text-[#111827]">{currentPage}</span> of{' '}
        <span className="font-medium text-[#111827]">{lastPage}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          size="sm"
          variant="secondary"
        >
          Previous
        </Button>

        {pageNumbers.map((pageNumber) => (
          <button
            className={[
              'inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-medium transition duration-200',
              pageNumber === currentPage
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-[#6b7280] hover:bg-gray-50 hover:text-[#111827]',
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
          Next
        </Button>
      </div>
    </nav>
  )
}

export default Pagination

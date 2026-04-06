import Button from './Button'

function getVisiblePages(currentPage, lastPage) {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1)
  }

  const pages = [1]

  if (currentPage > 3) {
    pages.push('...')
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(lastPage - 1, currentPage + 1)

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  if (currentPage < lastPage - 2) {
    pages.push('...')
  }

  pages.push(lastPage)

  return pages
}

function Pagination({ meta, onPageChange }) {
  if (!meta || !meta.current_page || !meta.last_page || meta.last_page <= 1) {
    return null
  }

  const currentPage = meta.current_page
  const lastPage = meta.last_page
  const visiblePages = getVisiblePages(currentPage, lastPage)

  return (
    <nav
      aria-label="Pagination des resultats"
      className="app-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-navy-400">
          Navigation
        </p>
        <p className="mt-1 text-sm text-navy-400">
          Page{' '}
          <span className="font-semibold tracking-tight text-navy-900">
            {currentPage}
          </span>{' '}
          sur{' '}
          <span className="font-semibold tracking-tight text-navy-900">
            {lastPage}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          size="sm"
          variant="secondary"
        >
          Precedent
        </Button>

        <div className="inline-flex min-h-10 items-center rounded-[10px] border border-navy-100 bg-surface px-3 text-sm font-medium text-navy-500 sm:hidden">
          {currentPage} / {lastPage}
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          {visiblePages.map((entry, index) =>
            entry === '...' ? (
              <span
                className="inline-flex h-11 min-w-11 items-center justify-center text-sm text-navy-400"
                key={`ellipsis-${index}`}
              >
                ...
              </span>
            ) : (
              <button
                aria-current={entry === currentPage ? 'page' : undefined}
                aria-label={`Aller a la page ${entry}`}
                className={[
                  'inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] border px-3 text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(27,43,75,0.08)]',
                  entry === currentPage
                    ? 'border-navy-200 bg-[#F6F2ED] text-navy-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]'
                    : 'border-navy-200 bg-white text-navy-500 hover:border-navy-300 hover:bg-[#F8F6F1] hover:text-navy-800',
                ].join(' ')}
                key={entry}
                onClick={() => onPageChange(entry)}
                type="button"
              >
                {entry}
              </button>
            ),
          )}
        </div>

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

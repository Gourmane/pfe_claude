import { useId } from 'react'

function Select({ label, error, id, options = [], disabled = false, ...rest }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="space-y-2">
      <label
        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-400"
        htmlFor={inputId}
      >
        {label}
      </label>
      <div className="relative">
        <select
          aria-describedby={errorId}
          aria-invalid={error ? 'true' : 'false'}
          className={[
            'min-h-11 w-full appearance-none rounded-[10px] border border-navy-200 bg-white px-3.5 pr-11 text-[13px] leading-6 text-navy-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] outline-none transition-[border-color,box-shadow,background-color] disabled:cursor-not-allowed disabled:border-navy-100 disabled:bg-surface-section/70 disabled:text-navy-400',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 animate-shake'
              : 'hover:border-primary-pale focus:border-primary-vivid focus:ring-4 focus:ring-primary-vivid/10',
          ].join(' ')}
          disabled={disabled}
          id={inputId}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value ?? ''} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-navy-400"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      {error ? (
        <p className="text-xs font-medium leading-5 text-red-600" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Select

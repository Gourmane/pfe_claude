import { useId } from 'react'

function Input({ label, error, type = 'text', id, ...rest }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-400" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'h-11 w-full rounded-xl bg-surface-section px-3.5 text-sm text-navy-900 border border-transparent outline-none transition-all',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'focus:bg-surface-container-lowest focus:border-navy-200 focus:ring-4 focus:ring-navy-100 hover:border-navy-100',
        ].join(' ')}
        id={inputId}
        type={type}
        {...rest}
      />
      {error ? (
        <p className="text-sm text-red-600" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Input

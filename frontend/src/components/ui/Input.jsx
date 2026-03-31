import { useId } from 'react'

function Input({ label, error, type = 'text', id, ...rest }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#111827]" htmlFor={inputId}>
        {label}
      </label>
      <input
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-[#111827] outline-none transition focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-gray-200 focus:border-blue-600 focus:ring-blue-100',
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

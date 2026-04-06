import { useId } from 'react'

function Textarea({ label, error, id, ...rest }) {
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
      <textarea
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'min-h-36 w-full rounded-[10px] border border-navy-200 bg-white px-3.5 py-3 text-[13px] leading-6 text-navy-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-navy-300 disabled:cursor-not-allowed disabled:border-navy-100 disabled:bg-surface-section/70 disabled:text-navy-400 disabled:placeholder:text-navy-300',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'hover:border-primary-pale focus:border-primary-vivid focus:ring-4 focus:ring-primary-vivid/10',
        ].join(' ')}
        id={inputId}
        {...rest}
      />
      {error ? (
        <p className="text-xs font-medium leading-5 text-red-600" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default Textarea

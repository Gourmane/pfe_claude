const VARIANT_CLASS_NAMES = {
  primary:
    'border border-transparent bg-linear-to-b from-[#30466E] to-[#1B2B4B] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_22px_rgba(27,43,75,0.14)] hover:from-[#39527F] hover:to-[#18253D] focus-visible:ring-[rgba(27,43,75,0.16)]',
  secondary:
    'border border-navy-200 bg-white text-navy-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] hover:border-navy-300 hover:bg-[#F8F6F1] hover:text-navy-900 focus-visible:ring-[rgba(27,43,75,0.1)]',
  danger:
    'border border-red-200 bg-linear-to-b from-red-50 to-red-100/60 text-red-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] hover:border-red-300 hover:from-red-100 hover:to-red-100 focus-visible:ring-red-100/60',
}

const SIZE_CLASS_NAMES = {
  sm: 'min-h-9 px-3.5 text-sm',
  md: 'min-h-10 px-4 text-[0.9375rem]',
  lg: 'min-h-11 px-5 text-base',
}

const SPINNER_SIZE_CLASS_NAMES = {
  sm: 'h-3 w-3 border-[1.5px]',
  md: 'h-4 w-4 border-2',
  lg: 'h-4.5 w-4.5 border-2',
}

const SPINNER_TONE_CLASS_NAMES = {
  primary: 'border-white/35 border-t-current',
  secondary: 'border-navy-300/35 border-t-current',
  danger: 'border-red-300/35 border-t-current',
}

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const isDisabled = disabled || loading
  const variantClassName =
    VARIANT_CLASS_NAMES[variant] ?? VARIANT_CLASS_NAMES.primary
  const sizeClassName = SIZE_CLASS_NAMES[size] ?? SIZE_CLASS_NAMES.md
  const spinnerSizeClassName =
    SPINNER_SIZE_CLASS_NAMES[size] ?? SPINNER_SIZE_CLASS_NAMES.md
  const spinnerToneClassName =
    SPINNER_TONE_CLASS_NAMES[variant] ?? SPINNER_TONE_CLASS_NAMES.primary

  return (
    <button
      aria-busy={loading ? 'true' : undefined}
      className={[
        'inline-flex w-full items-center justify-center gap-2 rounded-[10px] font-semibold tracking-[0.01em] transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-none focus-visible:ring-4 enabled:active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto',
        variantClassName,
        sizeClassName,
        className,
      ].join(' ')}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className={`shrink-0 animate-spin rounded-full ${spinnerToneClassName} ${spinnerSizeClassName}`}
        />
      ) : null}
      {children}
    </button>
  )
}

export default Button

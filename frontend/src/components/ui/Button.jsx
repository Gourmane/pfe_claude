const VARIANT_CLASS_NAMES = {
  primary:
    'bg-gradient-to-b from-[#0F2A44] to-[#245381] text-white hover:from-[#0a1f35] hover:to-[#1a3d5c] shadow-[0_2px_4px_rgba(15,42,68,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]',
  secondary:
    'bg-surface-section hover:bg-navy-100 text-navy-800 shadow-[0_1px_2px_rgba(15,42,68,0.06)]',
  danger:
    'bg-red-50 text-red-700 hover:bg-red-100 shadow-[0_1px_2px_rgba(15,42,68,0.04)]',
}

const SIZE_CLASS_NAMES = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

const SPINNER_SIZE_CLASS_NAMES = {
  sm: 'h-3 w-3 border-[1.5px]',
  md: 'h-4 w-4 border-2',
  lg: 'h-4.5 w-4.5 border-2',
}

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  ...rest
}) {
  const isDisabled = disabled || loading
  const variantClassName =
    VARIANT_CLASS_NAMES[variant] ?? VARIANT_CLASS_NAMES.primary
  const sizeClassName = SIZE_CLASS_NAMES[size] ?? SIZE_CLASS_NAMES.md
  const spinnerSizeClassName =
    SPINNER_SIZE_CLASS_NAMES[size] ?? SPINNER_SIZE_CLASS_NAMES.md

  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale-[0.5]',
        variantClassName,
        sizeClassName,
      ].join(' ')}
      disabled={isDisabled}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className={`animate-spin rounded-full border-white/35 border-t-current ${spinnerSizeClassName}`}
        />
      ) : null}
      <span>{children}</span>
    </button>
  )
}

export default Button

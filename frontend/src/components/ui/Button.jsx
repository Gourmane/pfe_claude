const VARIANT_CLASS_NAMES = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-200',
  secondary:
    'border border-gray-200 bg-white text-[#111827] hover:bg-gray-50 focus-visible:ring-gray-200',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-200',
}

const SIZE_CLASS_NAMES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

const SPINNER_SIZE_CLASS_NAMES = {
  sm: 'h-3.5 w-3.5 border-[1.5px]',
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
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-70',
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

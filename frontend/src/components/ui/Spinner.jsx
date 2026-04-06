const SIZE_CLASS_NAMES = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

function Spinner({ size = 'md', label = 'Chargement en cours' }) {
  const sizeClassName = SIZE_CLASS_NAMES[size] ?? SIZE_CLASS_NAMES.md

  return (
    <div className="flex items-center justify-center" role="status">
      <div className="relative">
        <div
          aria-hidden="true"
          className={`animate-spin rounded-full border-primary-pale border-t-primary-vivid ${sizeClassName}`}
        />
        <div
          aria-hidden="true"
          className="absolute inset-[28%] rounded-full border border-primary/20"
        />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

export default Spinner

const SIZE_CLASS_NAMES = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

function Spinner({ size = 'md' }) {
  const sizeClassName = SIZE_CLASS_NAMES[size] ?? SIZE_CLASS_NAMES.md

  return (
    <div className="flex items-center justify-center">
      <div
        aria-label="Loading"
        className={`animate-spin rounded-full border-blue-100 border-t-blue-600 ${sizeClassName}`}
        role="status"
      />
    </div>
  )
}

export default Spinner

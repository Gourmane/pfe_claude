const VARIANT_CLASS_NAMES = {
  pending: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-sky-100 text-sky-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-[#6b7280]',
  low: 'bg-gray-100 text-[#6b7280]',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
}

function Badge({ variant = 'closed', children }) {
  const variantClassName =
    VARIANT_CLASS_NAMES[variant] ?? VARIANT_CLASS_NAMES.closed

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClassName}`}
    >
      {children}
    </span>
  )
}

export default Badge

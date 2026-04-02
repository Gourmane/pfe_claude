const VARIANT_CLASS_NAMES = {
  pending: 'bg-navy-50 text-navy-600 border-l-[3px] border-l-navy-300',
  in_progress: 'bg-sky-50/60 text-sky-800 border-l-[3px] border-l-sky-500',
  resolved: 'bg-emerald-50/60 text-emerald-800 border-l-[3px] border-l-emerald-500',
  closed: 'bg-surface-section text-navy-400 border-l-[3px] border-l-navy-200',
  low: 'bg-surface-section text-navy-400 border-l-[3px] border-l-navy-200',
  medium: 'bg-sky-50/60 text-sky-800 border-l-[3px] border-l-sky-400',
  high: 'bg-amber-50/60 text-amber-800 border-l-[3px] border-l-amber-500',
  urgent: 'bg-red-50/60 text-red-800 border-l-[3px] border-l-red-500 font-semibold',
}

function Badge({ variant = 'closed', children }) {
  const variantClassName =
    VARIANT_CLASS_NAMES[variant] ?? VARIANT_CLASS_NAMES.closed

  return (
    <span
      className={`inline-flex rounded-[4px] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${variantClassName}`}
    >
      {children}
    </span>
  )
}

export default Badge

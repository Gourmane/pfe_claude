const VARIANT_CLASS_NAMES = {
  pending: 'border border-[#DFDAD0] bg-[#F5F2EC] text-[#5D6776]',
  in_progress: 'border border-[#D4E5F2] bg-[#F0F6FB] text-[#2A628A]',
  resolved: 'border border-[#D8E9DE] bg-[#F1F7F3] text-[#2C6647]',
  closed: 'border border-[#DFDAD0] bg-[#F3F1EB] text-[#8A95A3]',
  low: 'border border-[#DFDAD0] bg-[#F3F1EB] text-[#8A95A3]',
  medium: 'border border-[#D4E5F2] bg-[#F0F6FB] text-[#2A628A]',
  high: 'border border-[#EADCC7] bg-[#F8F1E8] text-[#8D6131]',
  urgent: 'border border-[#EDD8DC] bg-[#FAF1F3] text-[#8E4A56]',
}

const INDICATOR_CLASS_NAMES = {
  pending: 'bg-[#8A95A3]',
  in_progress: 'bg-[#5B8FB3]',
  resolved: 'bg-[#5E9270]',
  closed: 'bg-[#B3B7C0]',
  low: 'bg-[#B3B7C0]',
  medium: 'bg-[#5B8FB3]',
  high: 'bg-[#C59A63]',
  urgent: 'bg-[#B86C78]',
}

function Badge({ variant = 'closed', children, className = '' }) {
  const variantClassName =
    VARIANT_CLASS_NAMES[variant] ?? VARIANT_CLASS_NAMES.closed
  const indicatorClassName =
    INDICATOR_CLASS_NAMES[variant] ?? INDICATOR_CLASS_NAMES.closed

  return (
    <span
      className={`inline-flex items-center gap-[5px] rounded-[20px] px-[10px] py-[3px] text-[11px] font-semibold tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${variantClassName} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-[5.5px] w-[5.5px] rounded-full ${indicatorClassName}`}
      />
      {children}
    </span>
  )
}

export default Badge

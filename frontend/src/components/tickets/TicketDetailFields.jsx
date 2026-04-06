export function TicketDetailFieldItem({ label, value }) {
  return (
    <div className="mb-[10px] last:mb-0">
      <div className="mb-[3px] text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        {label}
      </div>
      <div className="break-words text-[0.9375rem] font-semibold text-text-primary">
        {value || '--'}
      </div>
    </div>
  )
}

export function TicketDetailFieldGroup({ children, title }) {
  return (
    <div className="app-ticket-detail-group p-[16px_18px]">
      <div className="mb-[12px] text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

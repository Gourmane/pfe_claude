import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate, formatLabel } from '../../utils/ticketHelpers'

function TicketDetailHero({
  backTarget,
  description,
  onBack,
  roleLabel,
  ticket,
}) {
  return (
    <div className="app-ticket-hero">
      <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="app-ticket-hero-kicker">{roleLabel}</p>
          <h1 className="app-ticket-hero-title break-words">
            {ticket ? `Ticket #${ticket.id}` : 'Détail du ticket'}
          </h1>
          <p className="app-ticket-hero-copy">{description}</p>

          {ticket ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge className="app-ticket-hero-badge" variant={ticket.status}>
                {formatLabel(ticket.status)}
              </Badge>
              <Badge className="app-ticket-hero-badge" variant={ticket.priority}>
                {formatLabel(ticket.priority)}
              </Badge>
              <span className="app-ticket-meta-chip">
                Créé le {formatDate(ticket.created_at)}
              </span>
            </div>
          ) : null}
        </div>

        <Button
          className="gap-[7px] sm:w-auto !border-white/18 !bg-white/10 !text-white hover:!border-white/28 hover:!bg-white/16"
          onClick={() => onBack?.(backTarget)}
          size="lg"
          type="button"
          variant="secondary"
        >
          <svg viewBox="0 0 24 24" strokeWidth="2" className="h-[13px] w-[13px] stroke-current fill-none">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour à la liste
        </Button>
      </div>
    </div>
  )
}

export default TicketDetailHero

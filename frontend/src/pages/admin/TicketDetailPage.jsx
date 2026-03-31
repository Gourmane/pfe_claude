import { useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/ui/Button'

function TicketDetailPage() {
  const navigate = useNavigate()
  const { ticketId } = useParams()

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-[#2563eb]">Admin</p>
        <h1 className="mt-1 text-2xl font-bold text-[#111827]">
          Ticket #{ticketId}
        </h1>
        <p className="mt-2 text-sm text-[#6b7280]">
          Ticket detail will be implemented in Phase 9.
        </p>
      </div>

      <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <p className="text-sm leading-6 text-[#6b7280]">
          This placeholder route exists so row navigation from the Phase 7 ticket
          list lands on a dedicated detail path.
        </p>

        <div className="mt-6">
          <Button onClick={() => navigate('/admin/tickets')} variant="secondary">
            Back to tickets
          </Button>
        </div>
      </section>
    </section>
  )
}

export default TicketDetailPage

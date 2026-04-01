import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  addTicketComment,
  generateTicketSummary,
  getTicket,
  updateTicketStatus,
} from '../../api/tickets'
import AiSummaryCard from '../../components/ai/AiSummaryCard'
import GenerateSummaryButton from '../../components/ai/GenerateSummaryButton'
import CommentSection from '../../components/tickets/CommentSection'
import StatusTransitionButton from '../../components/tickets/StatusTransitionButton'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { formatDate, formatLabel } from '../../utils/ticketHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'
const FORBIDDEN_MESSAGE = "Vous n'avez pas accès à cette ressource"

function getApiErrorMessage(requestError) {
  if (requestError?.response?.status === 403) {
    return FORBIDDEN_MESSAGE
  }

  return requestError?.response?.data?.message || FALLBACK_ERROR_MESSAGE
}

function getTicketSummary(ticket) {
  return ticket?.ai_summary ?? ticket?.aiSummary ?? null
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
        {label}
      </p>
      <p className="mt-2 text-sm text-[#111827]">{value || '--'}</p>
    </div>
  )
}

function TicketDetailPage() {
  const navigate = useNavigate()
  const { ticketId } = useParams()
  const { user } = useAuth()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusError, setStatusError] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [summaryError, setSummaryError] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadTicket() {
      setLoading(true)
      setError('')

      try {
        const response = await getTicket(ticketId)

        if (!isMounted) {
          return
        }

        setTicket(response.data)
      } catch (requestError) {
        if (!isMounted) {
          return
        }

        setTicket(null)
        setError(getApiErrorMessage(requestError))
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTicket()

    return () => {
      isMounted = false
    }
  }, [ticketId])

  async function refreshTicket() {
    const response = await getTicket(ticketId)
    setTicket(response.data)
    return response.data
  }

  async function handleStatusTransition(nextStatus) {
    if (statusLoading) {
      return
    }

    setStatusLoading(true)
    setStatusError('')

    try {
      await updateTicketStatus(ticket.id, nextStatus)
      await refreshTicket()
    } catch (requestError) {
      setStatusError(getApiErrorMessage(requestError))
    } finally {
      setStatusLoading(false)
    }
  }

  async function handleCommentSubmit(comment) {
    if (commentLoading) {
      return false
    }

    setCommentLoading(true)
    setCommentError('')

    try {
      await addTicketComment(ticket.id, comment)
      await refreshTicket()
      return true
    } catch (requestError) {
      setCommentError(getApiErrorMessage(requestError))
      return false
    } finally {
      setCommentLoading(false)
    }
  }

  async function handleGenerateSummary() {
    if (summaryLoading) {
      return
    }

    setSummaryLoading(true)
    setSummaryError('')

    try {
      await generateTicketSummary(ticket.id)
      await refreshTicket()
    } catch (requestError) {
      setSummaryError(getApiErrorMessage(requestError))
    } finally {
      setSummaryLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Détail du ticket
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Consultez votre intervention, faites progresser le ticket et tenez
            l'équipe informée.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white px-6 py-16 shadow-sm">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm text-[#6b7280]">
              Chargement du ticket...
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
            <h1 className="mt-1 text-2xl font-bold text-[#111827]">
              Détail du ticket
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              Consultez votre intervention, faites progresser le ticket et tenez
              l'équipe informée.
            </p>
          </div>
          <Button
            onClick={() => navigate('/technician/tickets')}
            variant="secondary"
          >
            Retour aux tickets
          </Button>
        </div>

        <Alert message={error} type="error" />
      </section>
    )
  }

  if (!ticket) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
            <h1 className="mt-1 text-2xl font-bold text-[#111827]">
              Détail du ticket
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">
              Consultez votre intervention, faites progresser le ticket et tenez
              l'équipe informée.
            </p>
          </div>
          <Button
            onClick={() => navigate('/technician/tickets')}
            variant="secondary"
          >
            Retour aux tickets
          </Button>
        </div>

        <EmptyState message="Ce ticket est introuvable." />
      </section>
    )
  }

  const comments = Array.isArray(ticket.comments) ? ticket.comments : []
  const summary = getTicketSummary(ticket)
  const canComment = ticket.technician?.id === user?.id

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#2563eb]">Technicien</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Ticket #{ticket.id}
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Consultez votre intervention, faites progresser le ticket et tenez
            l'équipe informée.
          </p>
        </div>

        <Button
          onClick={() => navigate('/technician/tickets')}
          variant="secondary"
        >
          Retour aux tickets
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-[#e5e7eb] pb-5">
              <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
              <Badge variant={ticket.priority}>
                {formatLabel(ticket.priority)}
              </Badge>
            </div>

            <div className="space-y-6 pt-6">
              <div>
                <p className="text-sm text-[#6b7280]">
                  Créé le {formatDate(ticket.created_at)}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-[#111827]">
                  {ticket.title || '--'}
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6b7280]">
                  {ticket.description || '--'}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-5">
                  <h3 className="text-base font-semibold text-[#111827]">
                    Informations du client
                  </h3>
                  <DetailItem label="Nom" value={ticket.client?.nom} />
                  <DetailItem label="E-mail" value={ticket.client?.email} />
                  <DetailItem
                    label="Téléphone"
                    value={ticket.client?.telephone}
                  />
                  <DetailItem
                    label="Entreprise"
                    value={ticket.client?.entreprise}
                  />
                </section>

                <section className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-5">
                  <h3 className="text-base font-semibold text-[#111827]">
                    Responsabilité
                  </h3>
                  <DetailItem
                    label="Technicien"
                    value={ticket.technician?.name || 'Non assigné'}
                  />
                  <DetailItem label="Créé par" value={ticket.creator?.name} />
                  <DetailItem
                    label="Résolu le"
                    value={formatDate(ticket.resolved_at)}
                  />
                  <DetailItem
                    label="Clôturé le"
                    value={formatDate(ticket.closed_at)}
                  />
                </section>
              </div>
            </div>
          </section>

          <CommentSection
            canComment={canComment}
            comments={comments}
            error={commentError}
            loading={commentLoading}
            onSubmit={handleCommentSubmit}
          />
        </div>

        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-[#111827]">
                Flux de traitement
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                Faites avancer le ticket selon son statut actuel.
              </p>
            </div>

            {statusError ? <Alert message={statusError} type="error" /> : null}

            <div className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                Statut actuel
              </p>
              <div className="mt-3">
                <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
              </div>
            </div>

            <StatusTransitionButton
              loading={statusLoading}
              onTransition={handleStatusTransition}
              role="technicien"
              status={ticket.status}
            />
          </section>

          <div className="space-y-4">
            <AiSummaryCard summary={summary} />

            {summaryError ? <Alert message={summaryError} type="error" /> : null}

            <GenerateSummaryButton
              hasSummary={Boolean(summary?.summary)}
              loading={summaryLoading}
              onGenerate={handleGenerateSummary}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TicketDetailPage

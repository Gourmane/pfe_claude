import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  addTicketComment,
  generateTicketSummary,
  getTicket,
  updateTicketStatus,
} from '../../api/tickets'
import AiSummaryCard from '../../components/ai/AiSummaryCard'
import GenerateSummaryButton from '../../components/ai/GenerateSummaryButton'
import CommentSection from '../../components/tickets/CommentSection'
import TicketDetailHero from '../../components/tickets/TicketDetailHero'
import {
  TicketDetailFieldGroup,
  TicketDetailFieldItem,
} from '../../components/tickets/TicketDetailFields'
import StatusTransitionButton from '../../components/tickets/StatusTransitionButton'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { withSearch } from '../../utils/routeHelpers'
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

function TicketDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
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

  const backTarget = withSearch('/technician/tickets', location.state?.fromSearch || '')

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

  const header = (
    <TicketDetailHero
      backTarget={backTarget}
      description="Reprenez le contexte, documentez le suivi et faites avancer le ticket sans perdre le fil de l'intervention."
      onBack={navigate}
      roleLabel="Technicien"
      ticket={ticket}
    />
  )

  if (loading) {
    return (
      <section className="space-y-[24px]">
        {header}
        <div className="app-panel p-6 py-16">
          <div className="flex flex-col items-center space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-[12.5px] font-medium text-text-muted">
              Chargement du ticket...
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="space-y-[24px]">
        {header}
        <Alert message={error} type="error" />
      </section>
    )
  }

  if (!ticket) {
    return (
      <section className="space-y-[24px]">
        {header}
        <EmptyState message="Ce ticket est introuvable." />
      </section>
    )
  }

  const comments = Array.isArray(ticket.comments) ? ticket.comments : []
  const summary = getTicketSummary(ticket)
  const canComment = ticket.technician?.id === user?.id

  return (
    <section className="flex flex-col gap-[24px]">
      {header}

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          <div className="app-panel app-ticket-primary-panel overflow-hidden">
            <div className="p-5 sm:p-[20px_22px]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="app-panel-kicker mb-[8px] text-primary">
                    Contexte
                  </div>
                  <div className="mb-[6px] break-words font-display text-[1.6rem] font-bold tracking-[-0.03em] text-navy">
                    {ticket.title || '--'}
                  </div>
                </div>
              </div>
              <div className="app-ticket-prose mb-[22px] whitespace-pre-wrap break-words">
                {ticket.description || '--'}
              </div>

              <div className="grid grid-cols-1 gap-[16px] lg:grid-cols-2">
                <TicketDetailFieldGroup title="Vue d'ensemble">
                  <TicketDetailFieldItem label="Client" value={ticket.client?.nom} />
                  <TicketDetailFieldItem label="Technicien" value={ticket.technician?.name || 'Non assigné'} />
                  <TicketDetailFieldItem label="Créé par" value={ticket.creator?.name} />
                  <TicketDetailFieldItem label="Résolue le" value={ticket.resolved_at ? formatDate(ticket.resolved_at) : null} />
                  <TicketDetailFieldItem label="Clôturée le" value={ticket.closed_at ? formatDate(ticket.closed_at) : null} />
                </TicketDetailFieldGroup>

                <TicketDetailFieldGroup title="Coordonnées client">
                  <TicketDetailFieldItem label="Nom" value={ticket.client?.nom} />
                  {ticket.client?.email ? (
                    <div className="mb-[10px] last:mb-0">
                      <div className="app-panel-kicker mb-[3px] text-text-muted">
                        E-mail
                      </div>
                      <div className="break-words text-[0.9375rem] font-semibold text-navy-mid">
                        {ticket.client.email}
                      </div>
                    </div>
                  ) : (
                    <TicketDetailFieldItem label="E-mail" value={null} />
                  )}
                  <TicketDetailFieldItem label="Téléphone" value={ticket.client?.telephone} />
                  <TicketDetailFieldItem label="Entreprise" value={ticket.client?.entreprise} />
                </TicketDetailFieldGroup>
              </div>
            </div>
          </div>

          <div className="app-panel overflow-hidden">
            <div className="p-5 sm:p-[20px_22px]">
              <div className="app-panel-title mt-0 mb-[3px]">
                Historique et commentaires
              </div>
              <div className="app-panel-copy mt-0 mb-[16px]">
                Gardez la trace des actions et des décisions prises sur ce ticket.
              </div>

              <CommentSection
                canComment={canComment}
                comments={comments}
                error={commentError}
                loading={commentLoading}
                onSubmit={handleCommentSubmit}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-[16px] md:grid-cols-2 2xl:flex 2xl:flex-col">
          <div className="app-panel app-ticket-rail-card p-[20px]">
            <div className="app-panel-title mt-0 mb-[4px]">
              Flux de traitement
            </div>
            <div className="app-panel-copy mt-0 mb-[16px]">
              Faites avancer le ticket selon son statut actuel.
            </div>

            {statusError ? <Alert message={statusError} type="error" /> : null}

            <div className="app-ticket-detail-group rounded-[14px] p-[14px_16px]">
              <div className="app-panel-kicker mb-[6px]">
                Statut actuel
              </div>
              <div>
                <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
              </div>
            </div>

            <div className="mt-4">
              <StatusTransitionButton
                loading={statusLoading}
                onTransition={handleStatusTransition}
                role="technicien"
                status={ticket.status}
              />
            </div>
          </div>

          <div className="app-panel app-ticket-rail-card p-[20px]">
            <div className="app-panel-title mt-0 mb-[4px]">
              Résumé IA
            </div>
            <div className="app-panel-copy mt-0 mb-[16px]">
              Vue condensée pour accélérer la reprise de contexte.
            </div>

            {summaryError ? <Alert message={summaryError} type="error" /> : null}

            <AiSummaryCard embedded showHeader={false} summary={summary} />

            <GenerateSummaryButton
              hasSummary={Boolean(summary?.summary)}
              loading={summaryLoading}
              onGenerate={handleGenerateSummary}
              premiumLook={true}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TicketDetailPage

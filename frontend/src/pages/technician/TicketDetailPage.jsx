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
const FORBIDDEN_MESSAGE = "Vous n'avez pas acc\u00e8s \u00e0 cette ressource"

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
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-navy-900">{value || '--'}</p>
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            D\u00e9tail du ticket
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Consultez votre intervention, faites progresser le ticket et tenez
            l'\u00e9quipe inform\u00e9e.
          </p>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest px-6 py-16 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
          <div className="space-y-3">
            <Spinner size="lg" />
            <p className="text-center text-sm font-medium text-navy-400">
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
              D\u00e9tail du ticket
            </h1>
            <p className="mt-2 text-sm text-navy-400">
              Consultez votre intervention, faites progresser le ticket et tenez
              l'\u00e9quipe inform\u00e9e.
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
              D\u00e9tail du ticket
            </h1>
            <p className="mt-2 text-sm text-navy-400">
              Consultez votre intervention, faites progresser le ticket et tenez
              l'\u00e9quipe inform\u00e9e.
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700">Technicien</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Ticket #{ticket.id}
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Consultez votre intervention, faites progresser le ticket et tenez
            l'\u00e9quipe inform\u00e9e.
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
          <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
            <div className="flex flex-wrap gap-2 pb-5">
              <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
              <Badge variant={ticket.priority}>
                {formatLabel(ticket.priority)}
              </Badge>
            </div>

            <div className="space-y-6 pt-6">
              <div>
                <p className="text-sm font-medium text-navy-400">
                  Cr\u00e9\u00e9 le {formatDate(ticket.created_at)}
                </p>
                <h2 className="mt-3 font-display text-xl font-bold tracking-tight text-navy-900">
                  {ticket.title || '--'}
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-navy-500">
                  {ticket.description || '--'}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <section className="space-y-4 rounded-2xl bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                      <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-navy-900 uppercase">
                      Informations du client
                    </h3>
                  </div>
                  <DetailItem label="Nom" value={ticket.client?.nom} />
                  <DetailItem label="E-mail" value={ticket.client?.email} />
                  <DetailItem
                    label="T\u00e9l\u00e9phone"
                    value={ticket.client?.telephone}
                  />
                  <DetailItem
                    label="Entreprise"
                    value={ticket.client?.entreprise}
                  />
                </section>

                <section className="space-y-4 rounded-2xl bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
                      <svg className="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0 0v2.5m0-2.5h2.5M7 14H4.5m4.5-4a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm8.5 4.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm-3.5-10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-navy-900 uppercase">
                      Responsabilit\u00e9
                    </h3>
                  </div>
                  <DetailItem
                    label="Technicien"
                    value={ticket.technician?.name || 'Non assign\u00e9'}
                  />
                  <DetailItem label="Cr\u00e9\u00e9 par" value={ticket.creator?.name} />
                  <DetailItem
                    label="R\u00e9solu le"
                    value={formatDate(ticket.resolved_at)}
                  />
                  <DetailItem
                    label="Cl\u00f4tur\u00e9 le"
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
          <section className="space-y-5 rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">
                Flux de traitement
              </h2>
              <p className="mt-1 text-sm text-navy-400">
                Faites avancer le ticket selon son statut actuel.
              </p>
            </div>

            {statusError ? <Alert message={statusError} type="error" /> : null}

            <div className="rounded-2xl bg-surface p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-navy-400">
                Statut actuel
              </p>
              <div className="mt-2">
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

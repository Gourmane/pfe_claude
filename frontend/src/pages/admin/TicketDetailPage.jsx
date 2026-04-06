import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTechnicians } from '../../api/technicians'
import {
  addTicketComment,
  assignTicket,
  generateTicketSummary,
  getTicket,
  updateTicket,
  updateTicketStatus,
} from '../../api/tickets'
import AiSummaryCard from '../../components/ai/AiSummaryCard'
import GenerateSummaryButton from '../../components/ai/GenerateSummaryButton'
import AssignTechnicianSection from '../../components/tickets/AssignTechnicianSection'
import CommentSection from '../../components/tickets/CommentSection'
import TicketDetailHero from '../../components/tickets/TicketDetailHero'
import {
  TicketDetailFieldGroup,
  TicketDetailFieldItem,
} from '../../components/tickets/TicketDetailFields'
import StatusTransitionButton from '../../components/tickets/StatusTransitionButton'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Spinner from '../../components/ui/Spinner'
import Textarea from '../../components/ui/Textarea'
import { mapValidationErrors } from '../../utils/formHelpers'
import { withSearch } from '../../utils/routeHelpers'
import { formatDate, formatLabel } from '../../utils/ticketHelpers'

const FALLBACK_ERROR_MESSAGE = 'Une erreur est survenue.'
const FORBIDDEN_MESSAGE = "Vous n'avez pas accès à cette ressource"
const PRIORITY_OPTIONS = [
  { label: 'Faible', value: 'low' },
  { label: 'Moyenne', value: 'medium' },
  { label: 'Haute', value: 'high' },
  { label: 'Urgente', value: 'urgent' },
]

function getApiErrorMessage(requestError) {
  if (requestError?.response?.status === 403) {
    return FORBIDDEN_MESSAGE
  }

  return requestError?.response?.data?.message || FALLBACK_ERROR_MESSAGE
}

function getEditValues(ticket) {
  return {
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    priority: ticket?.priority ?? '',
  }
}

function getTicketSummary(ticket) {
  return ticket?.ai_summary ?? ticket?.aiSummary ?? null
}

function TicketDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [techniciansError, setTechniciansError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState(getEditValues())
  const [editFieldErrors, setEditFieldErrors] = useState({})
  const [editError, setEditError] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [statusError, setStatusError] = useState('')
  const [statusLoading, setStatusLoading] = useState(false)
  const [assignError, setAssignError] = useState('')
  const [assignLoading, setAssignLoading] = useState(false)
  const [commentError, setCommentError] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [summaryError, setSummaryError] = useState('')
  const [summaryLoading, setSummaryLoading] = useState(false)

  const backTarget = withSearch('/admin/tickets', location.state?.fromSearch || '')

  useEffect(() => {
    let isMounted = true

    async function loadPage() {
      setLoading(true)
      setError('')
      setTechniciansError('')

      const [ticketResult, techniciansResult] = await Promise.allSettled([
        getTicket(ticketId),
        getTechnicians(),
      ])

      if (!isMounted) {
        return
      }

      if (ticketResult.status === 'fulfilled') {
        setTicket(ticketResult.value.data)
        setEditValues(getEditValues(ticketResult.value.data))
      } else {
        setTicket(null)
        setError(getApiErrorMessage(ticketResult.reason))
      }

      if (techniciansResult.status === 'fulfilled') {
        setTechnicians(techniciansResult.value.data ?? [])
      } else {
        setTechnicians([])
        setTechniciansError(getApiErrorMessage(techniciansResult.reason))
      }

      setLoading(false)
    }

    loadPage()

    return () => {
      isMounted = false
    }
  }, [ticketId])

  async function refreshTicket() {
    const response = await getTicket(ticketId)
    setTicket(response.data)
    return response.data
  }

  function handleEditChange(event) {
    const { name, value } = event.target

    setEditValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  function handleStartEditing() {
    setEditValues(getEditValues(ticket))
    setEditFieldErrors({})
    setEditError('')
    setIsEditing(true)
  }

  function handleCancelEditing() {
    setEditValues(getEditValues(ticket))
    setEditFieldErrors({})
    setEditError('')
    setIsEditing(false)
  }

  async function handleSaveEdit(event) {
    event.preventDefault()

    if (editLoading) {
      return
    }

    setEditLoading(true)
    setEditError('')
    setEditFieldErrors({})

    try {
      await updateTicket(ticket.id, editValues)
      const nextTicket = await refreshTicket()
      setEditValues(getEditValues(nextTicket))
      setIsEditing(false)
    } catch (requestError) {
      if (requestError.response?.status === 422) {
        setEditFieldErrors(mapValidationErrors(requestError.response?.data?.errors))
      }

      setEditError(getApiErrorMessage(requestError))
    } finally {
      setEditLoading(false)
    }
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

  async function handleAssignTechnician(nextTechnicianId) {
    if (assignLoading) {
      return
    }

    setAssignLoading(true)
    setAssignError('')

    try {
      await assignTicket(ticket.id, nextTechnicianId)
      await refreshTicket()
    } catch (requestError) {
      setAssignError(getApiErrorMessage(requestError))
    } finally {
      setAssignLoading(false)
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
      description="Centralisez le contexte utile, l'assignation et la prochaine action sans perdre le fil de l'intervention."
      onBack={navigate}
      roleLabel="Administrateur"
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
  const isClosed = ticket.status === 'closed'

  return (
    <section className="flex flex-col gap-[24px]">
      {header}

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-[16px]">
          <div className="app-panel app-ticket-primary-panel overflow-hidden">
            <div className="p-5 sm:p-[20px_22px]">
              {isEditing ? (
                <form className="space-y-5" onSubmit={handleSaveEdit}>
                  {editError ? <Alert message={editError} type="error" /> : null}

                  <Input
                    error={editFieldErrors.title}
                    label="Titre"
                    name="title"
                    onChange={handleEditChange}
                    required
                    value={editValues.title}
                  />

                  <Textarea
                    error={editFieldErrors.description}
                    label="Description"
                    name="description"
                    onChange={handleEditChange}
                    required
                    value={editValues.description}
                  />

                  <Select
                    error={editFieldErrors.priority}
                    label="Priorité"
                    name="priority"
                    onChange={handleEditChange}
                    options={[
                      { label: 'Sélectionner une priorité', value: '' },
                      ...PRIORITY_OPTIONS,
                    ]}
                    required
                    value={editValues.priority}
                  />

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                    <Button onClick={handleCancelEditing} type="button" variant="secondary">
                      Annuler
                    </Button>
                    <Button
                      className="sm:w-auto"
                      loading={editLoading}
                      type="submit"
                    >
                      Enregistrer les modifications
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="app-panel-kicker mb-[8px] text-primary">
                        Contexte
                      </div>
                      <div className="mb-[6px] break-words font-display text-[1.6rem] font-bold tracking-[-0.03em] text-navy">
                        {ticket.title || '--'}
                      </div>
                    </div>
                    {!isClosed ? (
                      <Button
                        className="sm:w-auto"
                        onClick={handleStartEditing}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Modifier
                      </Button>
                    ) : null}
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
                </>
              )}
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
                canComment={true}
                comments={comments}
                error={commentError}
                loading={commentLoading}
                onSubmit={handleCommentSubmit}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-[16px] md:grid-cols-2 2xl:flex 2xl:flex-col">
          <div className="app-panel app-ticket-rail-card p-[20px] md:col-span-2 2xl:col-span-1">
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
                role="admin"
                status={ticket.status}
              />
            </div>
          </div>

          {!isClosed ? (
            <div className="app-panel app-ticket-rail-card p-[20px]">
              <div className="app-panel-title mt-0 mb-[4px]">
                Assignation technicien
              </div>
              <div className="app-panel-copy mt-0 mb-[16px]">
                Transférez ce ticket pour prise en charge.
              </div>
              <AssignTechnicianSection
                currentTechnicianId={ticket.technician?.id}
                currentTechnicianName={ticket.technician?.name}
                error={assignError || techniciansError}
                key={ticket.technician?.id ?? 'unassigned'}
                loading={assignLoading}
                onAssign={handleAssignTechnician}
                technicians={technicians}
                plainHeader={true}
              />
            </div>
          ) : null}

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

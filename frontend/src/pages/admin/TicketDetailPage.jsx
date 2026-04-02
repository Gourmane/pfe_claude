import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import StatusTransitionButton from '../../components/tickets/StatusTransitionButton'
import Alert from '../../components/ui/Alert'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import { mapValidationErrors } from '../../utils/formHelpers'
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

function TextareaField({ error, id, label, name, onChange, required, value }) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-400" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'min-h-36 w-full rounded-xl bg-surface-section px-3.5 py-3 text-sm text-navy-900 border border-transparent outline-none transition-all',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'focus:bg-surface-container-lowest focus:border-navy-200 focus:ring-4 focus:ring-navy-100 hover:border-navy-100',
        ].join(' ')}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      />
      {error ? (
        <p className="text-sm text-red-600" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function SelectField({
  error,
  id,
  label,
  name,
  onChange,
  options,
  required,
  value,
}) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-wider text-navy-400" htmlFor={id}>
        {label}
      </label>
      <select
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'h-11 w-full rounded-xl bg-surface-section px-3.5 text-sm text-navy-900 border border-transparent outline-none transition-all',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'focus:bg-surface-container-lowest focus:border-navy-200 focus:ring-4 focus:ring-navy-100 hover:border-navy-100',
        ].join(' ')}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        value={value}
      >
        <option value="">Sélectionner une priorité</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-sm text-red-600" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-medium text-navy-900">{value || '--'}</p>
    </div>
  )
}

function TicketDetailPage() {
  const navigate = useNavigate()
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

  if (loading) {
    return (
      <section className="space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Administrateur</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Détail du ticket
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Consultez la demande, gérez l'assignation et faites avancer le
            traitement.
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Administrateur</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
              Détail du ticket
            </h1>
            <p className="mt-2 text-sm text-navy-400">
              Consultez la demande, gérez l'assignation et faites avancer le
              traitement.
            </p>
          </div>
          <Button onClick={() => navigate('/admin/tickets')} variant="secondary">
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
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Administrateur</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
              Détail du ticket
            </h1>
            <p className="mt-2 text-sm text-navy-400">
              Consultez la demande, gérez l'assignation et faites avancer le
              traitement.
            </p>
          </div>
          <Button onClick={() => navigate('/admin/tickets')} variant="secondary">
            Retour aux tickets
          </Button>
        </div>

        <EmptyState message="Ce ticket est introuvable." />
      </section>
    )
  }

  const comments = Array.isArray(ticket.comments) ? ticket.comments : []
  const summary = getTicketSummary(ticket)
  const isClosed = ticket.status === 'closed'

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Administrateur</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-navy-900">
            Détail du ticket
          </h1>
          <p className="mt-2 text-sm text-navy-400">
            Consultez la demande, gérez l'assignation et faites avancer le
            traitement.
          </p>
        </div>

        <Button onClick={() => navigate('/admin/tickets')} variant="secondary">
          Retour aux tickets
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-surface-container-lowest p-6 lg:p-8 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
            <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
                  <Badge variant={ticket.priority}>
                    {formatLabel(ticket.priority)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm font-medium text-navy-400">
                  Créé le {formatDate(ticket.created_at)}
                </p>
              </div>

              {!isClosed && !isEditing ? (
                <Button onClick={handleStartEditing} variant="secondary">
                  Modifier le ticket
                </Button>
              ) : null}
            </div>

            {isEditing ? (
              <form className="space-y-5 pt-6" onSubmit={handleSaveEdit}>
                {editError ? <Alert message={editError} type="error" /> : null}

                <Input
                  error={editFieldErrors.title}
                  label="Titre"
                  name="title"
                  onChange={handleEditChange}
                  required
                  value={editValues.title}
                />

                <TextareaField
                  error={editFieldErrors.description}
                  id="description"
                  label="Description"
                  name="description"
                  onChange={handleEditChange}
                  required
                  value={editValues.description}
                />

                <SelectField
                  error={editFieldErrors.priority}
                  id="priority"
                  label="Priorité"
                  name="priority"
                  onChange={handleEditChange}
                  options={PRIORITY_OPTIONS}
                  required
                  value={editValues.priority}
                />

                <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:justify-between">
                  <Button
                    onClick={handleCancelEditing}
                    type="button"
                    variant="secondary"
                  >
                    Annuler
                  </Button>
                  <Button loading={editLoading} type="submit">
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 pt-6">
                <div>
                  <h2 className="font-display text-xl font-bold tracking-tight text-navy-900">
                    {ticket.title || '--'}
                  </h2>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-navy-500">
                    {ticket.description || '--'}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <section className="space-y-4 rounded-2xl bg-surface p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold tracking-tight text-navy-900 uppercase">
                        Informations du client
                      </h3>
                    </div>
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

                  <section className="space-y-4 rounded-2xl bg-surface p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 013 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v4m0-4V11" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-bold tracking-tight text-navy-900 uppercase">
                        Responsabilité
                      </h3>
                    </div>
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
            )}
          </section>

          <CommentSection
            canComment
            comments={comments}
            error={commentError}
            loading={commentLoading}
            onSubmit={handleCommentSubmit}
          />
        </div>

        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">
                Flux de traitement
              </h2>
              <p className="mt-1 text-sm text-navy-400">
                Faites avancer le ticket selon son statut actuel.
              </p>
            </div>

            {statusError ? <Alert message={statusError} type="error" /> : null}

            <div className="rounded-2xl bg-surface p-5 text-center flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                Statut actuel
              </p>
              <div className="mt-2.5">
                <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
              </div>
            </div>

            <StatusTransitionButton
              loading={statusLoading}
              onTransition={handleStatusTransition}
              role="admin"
              status={ticket.status}
            />
          </section>

          {!isClosed ? (
            <AssignTechnicianSection
              currentTechnicianId={ticket.technician?.id}
              currentTechnicianName={ticket.technician?.name}
              error={assignError || techniciansError}
              key={ticket.technician?.id ?? 'unassigned'}
              loading={assignLoading}
              onAssign={handleAssignTechnician}
              technicians={technicians}
            />
          ) : null}

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

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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#111827]" htmlFor={id}>
        {label}
      </label>
      <textarea
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'min-h-36 w-full rounded-xl border bg-white px-3 py-3 text-sm text-[#111827] outline-none transition focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#dbeafe]',
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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#111827]" htmlFor={id}>
        {label}
      </label>
      <select
        aria-describedby={errorId}
        aria-invalid={error ? 'true' : 'false'}
        className={[
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-[#111827] outline-none transition focus:ring-4',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
            : 'border-[#e5e7eb] focus:border-[#2563eb] focus:ring-[#dbeafe]',
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
          <p className="text-sm font-medium text-[#2563eb]">Administrateur</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Détail du ticket
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Consultez la demande, gérez l'assignation et faites avancer le
            traitement.
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
            <p className="text-sm font-medium text-[#2563eb]">Administrateur</p>
            <h1 className="mt-1 text-2xl font-bold text-[#111827]">
              Détail du ticket
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">
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
            <p className="text-sm font-medium text-[#2563eb]">Administrateur</p>
            <h1 className="mt-1 text-2xl font-bold text-[#111827]">
              Détail du ticket
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">
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
          <p className="text-sm font-medium text-[#2563eb]">Administrateur</p>
          <h1 className="mt-1 text-2xl font-bold text-[#111827]">
            Ticket #{ticket.id}
          </h1>
          <p className="mt-2 text-sm text-[#6b7280]">
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
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 border-b border-[#e5e7eb] pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={ticket.status}>{formatLabel(ticket.status)}</Badge>
                  <Badge variant={ticket.priority}>
                    {formatLabel(ticket.priority)}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-[#6b7280]">
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

                <div className="flex flex-col-reverse gap-3 border-t border-[#e5e7eb] pt-6 sm:flex-row sm:justify-between">
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
                  <h2 className="text-xl font-semibold text-[#111827]">
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

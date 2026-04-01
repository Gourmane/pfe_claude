import { useState } from 'react'
import { formatDate } from '../../utils/ticketHelpers'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'

function getAuthorLabel(comment) {
  return comment?.user?.name || comment?.user?.email || 'Utilisateur'
}

function CommentSection({
  comments = [],
  canComment,
  loading = false,
  error = '',
  onSubmit,
}) {
  const [comment, setComment] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmedComment = comment.trim()

    if (!trimmedComment || loading) {
      return
    }

    const didSucceed = await onSubmit?.(trimmedComment)

    if (didSucceed) {
      setComment('')
    }
  }

  return (
    <section className="space-y-5 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Commentaires</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Suivez l'historique du ticket et ajoutez des notes de suivi.
        </p>
      </div>

      {error ? <Alert message={error} type="error" /> : null}

      {comments.length === 0 ? (
        <EmptyState message="Aucun commentaire n'a encore été ajouté à ce ticket." />
      ) : (
        <div className="space-y-4">
          {comments.map((entry) => (
            <article
              className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4"
              key={entry.id}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#111827]">
                  {getAuthorLabel(entry)}
                </p>
                <p className="text-xs text-[#9ca3af]">
                  {formatDate(entry.created_at)}
                </p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6b7280]">
                {entry.comment}
              </p>
            </article>
          ))}
        </div>
      )}

      {canComment ? (
        <form
          className="space-y-3 border-t border-[#e5e7eb] pt-5"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <label
              className="block text-sm font-medium text-[#111827]"
              htmlFor="ticket-comment"
            >
              Ajouter un commentaire
            </label>
            <textarea
              className="min-h-32 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-3 text-sm text-[#111827] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#dbeafe]"
              id="ticket-comment"
              onChange={(event) => setComment(event.target.value)}
              placeholder="Saisissez une mise à jour claire pour l'équipe."
              value={comment}
            />
          </div>

          <div className="flex justify-end">
            <Button disabled={!comment.trim()} loading={loading} type="submit">
              Ajouter un commentaire
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  )
}

export default CommentSection

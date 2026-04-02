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
    <section className="space-y-6 rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
      <div>
        <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">Commentaires</h2>
        <p className="mt-1 text-sm text-navy-400">
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
              className="rounded-2xl bg-primary-container/30 p-4"
              key={entry.id}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-navy-900">
                  {getAuthorLabel(entry)}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                  {formatDate(entry.created_at)}
                </p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-navy-600">
                {entry.comment}
              </p>
            </article>
          ))}
        </div>
      )}

      {canComment ? (
        <form
          className="space-y-4 pt-6 mt-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <label
              className="block text-[10px] font-bold uppercase tracking-wider text-navy-400"
              htmlFor="ticket-comment"
            >
              Ajouter un commentaire
            </label>
            <textarea
              className="min-h-32 w-full rounded-xl bg-surface-section px-3.5 py-3 text-sm text-navy-900 border border-transparent outline-none transition-all focus:bg-surface-container-lowest focus:border-navy-200 focus:ring-4 focus:ring-navy-100 hover:border-navy-100"
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

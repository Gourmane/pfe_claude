import { useState } from 'react'
import { formatDate } from '../../utils/ticketHelpers'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import Textarea from '../ui/Textarea'

function getAuthorLabel(comment) {
  return comment?.user?.name || comment?.user?.email || 'Utilisateur'
}

function CommentSection({
  comments = [],
  canComment,
  loading = false,
  error = '',
  successMessage = '',
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
    <div className="flex flex-col">
      <div className="flex flex-col gap-3">
        {successMessage ? <Alert message={successMessage} type="success" /> : null}
        {error ? <Alert message={error} type="error" /> : null}

        {comments.length === 0 ? (
          <EmptyState
            hint="Ajoutez une premiere note de suivi pour documenter la prise en charge."
            message="Aucun commentaire n'a encore ete ajoute a ce ticket."
          />
        ) : (
          comments.map((entry) => (
            <div
              className="app-panel-soft rounded-[10px] p-[13px_16px]"
              key={entry.id}
            >
              <div className="mb-[7px] flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <span className="min-w-0 break-words text-[12.5px] font-semibold text-navy">
                  {getAuthorLabel(entry)}
                </span>
                <span className="text-[11px] font-medium tracking-[0.5px] text-text-muted uppercase sm:shrink-0">
                  {formatDate(entry.created_at)}
                </span>
              </div>
              <div className="break-words text-[13px] text-text-secondary whitespace-pre-wrap">
                {entry.comment}
              </div>
            </div>
          ))
        )}
      </div>

      {canComment ? (
        <form className="mt-[20px]" onSubmit={handleSubmit}>
          <Textarea
            disabled={loading}
            label="Ajouter un commentaire"
            name="comment"
            onChange={(event) => setComment(event.target.value)}
            placeholder="Documentez l'action, le diagnostic ou la prochaine etape."
            value={comment}
          />

          <div className="mt-[12px] flex justify-end">
            <Button
              className="sm:w-auto"
              disabled={!comment.trim() || loading}
              loading={loading}
              type="submit"
            >
              Ajouter un commentaire
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  )
}

export default CommentSection

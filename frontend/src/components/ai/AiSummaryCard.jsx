function AiSummaryCard({ summary }) {
  const suggestedCategory = summary?.suggested_category

  return (
    <section className="space-y-5 rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_8px_rgba(15,42,68,0.04)]">
      <div>
        <h2 className="font-display text-lg font-bold tracking-tight text-navy-900">Résumé IA</h2>
        <p className="mt-1 text-sm text-navy-400">
          Contexte généré pour accélérer le traitement du ticket.
        </p>
      </div>

      {summary?.summary ? (
        <div className="space-y-4">
          <p className="rounded-2xl bg-surface p-4 text-sm leading-7 text-navy-600">
            {summary.summary}
          </p>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
              Catégorie suggérée
            </p>
            <div className="mt-2.5 inline-flex rounded-[4px] bg-navy-50 px-3 py-1 text-[11px] font-bold tracking-wide text-navy-700 border-l-[3px] border-l-navy-400">
              {suggestedCategory || '--'}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-surface-section p-5 text-sm font-medium text-navy-400 text-center">
          Aucun résumé pour le moment.
        </div>
      )}
    </section>
  )
}

export default AiSummaryCard

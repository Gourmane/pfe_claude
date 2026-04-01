function AiSummaryCard({ summary }) {
  const suggestedCategory = summary?.suggested_category

  return (
    <section className="space-y-4 rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-[#111827]">Résumé IA</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Contexte généré pour accélérer le traitement du ticket.
        </p>
      </div>

      {summary?.summary ? (
        <div className="space-y-4">
          <p className="rounded-2xl border border-[#e5e7eb] bg-[#f8fafc] p-4 text-sm leading-6 text-[#6b7280]">
            {summary.summary}
          </p>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
              Catégorie suggérée
            </p>
            <div className="mt-2 inline-flex rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-semibold text-[#2563eb]">
              {suggestedCategory || '--'}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-[#f8fafc] p-5 text-sm text-[#6b7280]">
          Aucun résumé pour le moment.
        </div>
      )}
    </section>
  )
}

export default AiSummaryCard

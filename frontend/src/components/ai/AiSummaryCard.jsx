function AiSummaryCard({ summary, embedded = false, showHeader = true }) {
  const suggestedCategory = summary?.suggested_category
  const content = summary?.summary ? (
    <div className="space-y-4">
      <p className="break-words rounded-[14px] border border-[#E7B892] bg-[linear-gradient(135deg,#FFF8F2_0%,#FDEAD9_100%)] p-4 text-[0.9375rem] leading-7 text-[#7A2E00] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
        {summary.summary}
      </p>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-400">
          Categorie suggeree
        </p>
        <div className="mt-2 inline-flex items-center rounded-full border border-navy-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(244,243,238,0.92)_100%)] px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-navy-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
          {suggestedCategory || '--'}
        </div>
      </div>
    </div>
  ) : (
    <div className="rounded-[14px] border border-dashed border-navy-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(244,243,238,0.9)_100%)] p-4 text-sm font-medium text-navy-500">
      Aucun resume n'est disponible pour le moment.
    </div>
  )

  if (embedded) {
    return content
  }

  return (
    <section className="app-panel p-4 sm:p-5">
      {showHeader ? (
        <div className="border-b border-navy-100 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            IA
          </p>
          <h2 className="mt-1 font-display text-[1.25rem] font-semibold tracking-tight text-navy-900">
            Resume IA
          </h2>
          <p className="mt-1 text-sm text-navy-500">
            Vue condensee pour accelerer la reprise de contexte.
          </p>
        </div>
      ) : null}

      <div className={showHeader ? 'mt-4' : ''}>{content}</div>
    </section>
  )
}

export default AiSummaryCard

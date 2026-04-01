import Button from '../ui/Button'

function GenerateSummaryButton({
  hasSummary = false,
  loading = false,
  onGenerate,
}) {
  return (
    <Button loading={loading} onClick={onGenerate} type="button" variant="secondary">
      {hasSummary ? 'Régénérer le résumé IA' : 'Générer le résumé IA'}
    </Button>
  )
}

export default GenerateSummaryButton

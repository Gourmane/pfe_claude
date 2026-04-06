import Button from '../ui/Button'

function GenerateSummaryButton({
  hasSummary = false,
  loading = false,
  onGenerate,
  premiumLook = false,
}) {
  return (
    <Button
      className={premiumLook ? 'mt-[14px] sm:w-full' : ''}
      loading={loading}
      onClick={onGenerate}
      type="button"
      variant="secondary"
    >
      {hasSummary ? 'Generer a nouveau le resume IA' : 'Generer le resume IA'}
    </Button>
  )
}

export default GenerateSummaryButton

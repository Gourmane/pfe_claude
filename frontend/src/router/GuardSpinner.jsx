import Spinner from '../components/ui/Spinner'

function GuardSpinner({ label = 'Chargement de votre espace...' }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="app-panel flex flex-col items-center gap-3 px-8 py-10 text-center">
        <Spinner size="lg" label={label} />
        <p className="text-sm font-medium text-navy-400">{label}</p>
      </div>
    </main>
  )
}

export default GuardSpinner

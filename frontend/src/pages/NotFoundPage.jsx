import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10 text-navy-900">
      <section className="app-hero-card w-full max-w-xl p-8 text-center sm:p-10">
        <p className="app-page-header-kicker justify-center opacity-80">
          404
        </p>
        <h1 className="font-display text-[clamp(2.3rem,6vw,3rem)] font-semibold tracking-tight text-navy-900">
          Page introuvable
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-navy-400">
          La page demandee n&apos;existe pas ou n&apos;est pas disponible dans
          cette version de l&apos;application.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate('/login')}>
            Retour a la connexion
          </Button>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import { useAuth } from '../hooks/useAuth'
import { getDashboardPath } from '../utils/routeHelpers'

function LoginPage() {
  const { user, login, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Une erreur est survenue.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
          <p className="text-sm font-medium text-navy-400">
            Restauration de votre session...
          </p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate replace to={getDashboardPath(user.role)} />
  }

  return (
    <section className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="app-auth-grid">
        <div className="app-auth-side order-2 flex flex-col justify-between p-5 text-white sm:p-8 lg:order-1 lg:p-10">
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-linear-to-br from-white/18 to-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] ring-1 ring-white/10">
                <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D7C5B8]">
                  Precision IT
                </p>
                <p className="mt-1 font-display text-[1.45rem] font-semibold tracking-tight text-white">
                  Support Console
                </p>
              </div>
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D7C5B8]">
              Plateforme interne
            </p>
            <h1 className="mt-3 max-w-xl font-display text-[clamp(2.3rem,8vw,3.75rem)] font-semibold leading-tight tracking-tight text-white">
              Connexion a la plateforme support
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/72">
              Outil interne pour superviser les tickets, affecter les
              interventions et reprendre rapidement le traitement en cours.
            </p>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2">
            <article className="rounded-[16px] border border-white/8 bg-white/5 p-4 backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                Usage
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/86">
                Priorisation rapide des tickets et suivi des resolutions.
              </p>
            </article>
            <article className="rounded-[16px] border border-white/8 bg-white/5 p-4 backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/48">
                Attendu
              </p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/86">
                Reprendre le contexte sans perdre le fil des priorités.
              </p>
            </article>
          </div>
        </div>

        <div className="app-hero-card order-1 p-5 sm:p-6 lg:order-2 lg:p-8">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-navy-400">
              Acces securise
            </p>
            <h2 className="mt-2 font-display text-[2rem] font-semibold tracking-tight text-navy-900">
              Ouvrir la session
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-navy-500">
              Utilisez vos identifiants internes pour acceder a votre espace de
              travail.
            </p>
          </div>

          <form className="relative z-10 mt-6 space-y-5" onSubmit={handleSubmit}>
            <Input
              autoComplete="email"
              disabled={isSubmitting}
              id="email"
              label="E-mail"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vous@entreprise.com"
              required
              type="email"
              value={email}
            />

            <Input
              autoComplete="current-password"
              disabled={isSubmitting}
              id="password"
              label="Mot de passe"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Saisissez votre mot de passe"
              required
              type="password"
              value={password}
            />

            {error ? (
              <Alert message={error} type="error" />
            ) : null}

            <Button
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default LoginPage

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const INPUT_CLASS_NAME =
  'mt-2 h-11 w-full rounded-xl bg-surface-section px-3.5 text-sm text-navy-900 border border-transparent outline-none transition-all focus:bg-surface-container-lowest focus:border-navy-200 focus:ring-4 focus:ring-navy-100 hover:border-navy-100 disabled:cursor-not-allowed disabled:bg-surface-section/50'

const PANEL_CLASS_NAME =
  'w-full max-w-md rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_48px_rgba(15,42,68,0.08)]'

function getDashboardPath(role) {
  if (role === 'admin') {
    return '/admin/dashboard'
  }

  if (role === 'technicien') {
    return '/technician/dashboard'
  }

  return '/login'
}

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
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-navy-100 border-t-navy-700" />
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
    <section className={PANEL_CLASS_NAME}>
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">Precision IT</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900">
          Connexion à votre espace
        </h1>
        <p className="text-sm leading-7 text-navy-400">
          Accédez à la plateforme interne pour gérer les tickets, suivre les
          opérations et reprendre votre session en toute sécurité.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-navy-400" htmlFor="email">
            E-mail
          </label>
          <input
            autoComplete="email"
            className={INPUT_CLASS_NAME}
            disabled={isSubmitting}
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@entreprise.com"
            required
            type="email"
            value={email}
          />
        </div>

        <div>
          <label
            className="text-[10px] font-bold uppercase tracking-wider text-navy-400"
            htmlFor="password"
          >
            Mot de passe
          </label>
          <input
            autoComplete="current-password"
            className={INPUT_CLASS_NAME}
            disabled={isSubmitting}
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Saisissez votre mot de passe"
            required
            type="password"
            value={password}
          />
        </div>

        {error ? (
          <div
            className="rounded-xl border-l-[3px] border-l-red-500 bg-red-50/70 px-4 py-3 text-sm font-medium text-red-800"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <button
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#0F2A44] to-[#245381] px-4 text-sm font-semibold text-white shadow-[0_2px_4px_rgba(15,42,68,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-[0.5px] hover:shadow-[0_4px_12px_rgba(15,42,68,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] active:translate-y-[0.5px] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </section>
  )
}

export default LoginPage

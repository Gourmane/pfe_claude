import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const INPUT_CLASS_NAME =
  'mt-2 h-11 w-full rounded-xl border border-[#e5e7eb] bg-white px-3 text-sm text-[#111827] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#dbeafe] disabled:cursor-not-allowed disabled:bg-slate-50'

const PANEL_CLASS_NAME =
  'w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-8 shadow-[0_18px_40px_rgba(17,24,39,0.06)]'

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
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#dbeafe] border-t-[#2563eb]" />
          <p className="text-sm text-[#6b7280]">
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
        <p className="text-sm font-medium text-[#2563eb]">AI IT Assistant</p>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">
          Connexion à votre espace
        </h1>
        <p className="text-sm leading-6 text-[#6b7280]">
          Accédez à la plateforme interne pour gérer les tickets, suivre les
          opérations et reprendre votre session en toute sécurité.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-[#111827]" htmlFor="email">
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
            className="text-sm font-medium text-[#111827]"
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
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <button
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#2563eb] px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70"
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

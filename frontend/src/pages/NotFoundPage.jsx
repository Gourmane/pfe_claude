import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-container-low px-4 py-10 text-navy-900">
      <section className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-8 text-center shadow-[0_12px_48px_rgba(15,42,68,0.08)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-light opacity-70">404</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900">
          Page introuvable
        </h1>
        <p className="mt-3 text-sm leading-7 text-navy-400">
          La page demandée n'existe pas ou n'est pas disponible dans cette
          version de l'application.
        </p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#0F2A44] to-[#245381] px-5 text-sm font-semibold text-white shadow-[0_2px_4px_rgba(15,42,68,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200 hover:-translate-y-[0.5px] hover:shadow-[0_4px_12px_rgba(15,42,68,0.3),inset_0_1px_0_rgba(255,255,255,0.06)] active:translate-y-[0.5px] active:scale-[0.98]"
          to="/login"
        >
          Retour à la connexion
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage

import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-10 text-[#111827]">
      <section className="w-full max-w-lg rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center shadow-[0_18px_40px_rgba(17,24,39,0.06)]">
        <p className="text-sm font-medium text-[#2563eb]">404</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#6b7280]">
          The page you requested does not exist or is not available in this
          phase of the app.
        </p>
        <Link
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#2563eb] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#1d4ed8]"
          to="/login"
        >
          Back to login
        </Link>
      </section>
    </main>
  )
}

export default NotFoundPage

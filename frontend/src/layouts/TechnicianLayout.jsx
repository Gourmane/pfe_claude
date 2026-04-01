import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const NAV_ITEMS = [
  { label: 'Tableau de bord', to: '/technician/dashboard' },
  { label: 'Mes tickets', to: '/technician/tickets' },
]

function TechnicianLayout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    if (isLoggingOut) {
      return
    }

    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#111827] lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="border-b border-[#e5e7eb] bg-white px-5 py-6 lg:min-h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563eb]">
              Espace technicien
            </p>
            <h1 className="mt-2 text-lg font-semibold text-[#111827]">
              AI IT Assistant
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6b7280]">
              Suivez vos interventions, l’activité des tickets et les priorités
              en cours.
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-[#dbeafe] text-[#1d4ed8]'
                      : 'text-[#6b7280] hover:bg-[#f8fafc] hover:text-[#111827]',
                  ].join(' ')
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-[#e5e7eb] px-4 text-sm font-semibold text-[#111827] transition hover:-translate-y-0.5 hover:border-[#cbd5e1] hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-70 lg:mt-auto"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="border-b border-[#e5e7eb] bg-[#f8fafc] px-5 py-4 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                Connecté en tant que
              </p>
              <p className="mt-1 text-base font-semibold text-[#111827]">
                {user?.name || user?.email || 'Utilisateur technicien'}
              </p>
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9ca3af]">
                Rôle
              </p>
              <p className="mt-1 text-sm font-medium text-[#2563eb]">
                Technicien
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default TechnicianLayout

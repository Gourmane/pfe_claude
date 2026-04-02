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
    <div className="min-h-screen bg-surface-container-low text-navy-900 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] font-sans antialiased">
      <aside className="bg-surface-container-lowest px-6 py-8 lg:min-h-screen relative z-20">
        <div className="flex h-full flex-col">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F2A44] to-[#245381] flex items-center justify-center shadow-lg rotate-3">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 opacity-80">
                  Operations
                </span>
                <span className="font-display text-xl font-extrabold tracking-tight text-navy-900">
                  Precision IT
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-400">
              Suivez vos interventions, l'activité des tickets et les priorités
              en cours.
            </p>
          </div>

          <nav className="mt-10 flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-[#0F2A44] text-white shadow-md'
                      : 'text-navy-400 hover:bg-navy-50 hover:text-navy-900',
                  ].join(' ')
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-surface-section px-4 text-sm font-medium text-navy-400 transition hover:-translate-y-0.5 hover:bg-navy-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-70 lg:mt-auto"
            disabled={isLoggingOut}
            onClick={handleLogout}
            type="button"
          >
            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col bg-surface-content">
        <header className="sticky top-0 z-10 bg-surface-content/90 backdrop-blur-md px-6 py-4 lg:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-navy-400">
                Connecté en tant que
              </p>
              <p className="mt-0.5 text-sm font-semibold text-navy-900">
                {user?.name || user?.email || 'Utilisateur technicien'}
              </p>
            </div>

            <div className="rounded-xl bg-surface-container-lowest px-4 py-2 flex items-center gap-2 shadow-[0_1px_3px_rgba(15,42,68,0.06)]">
              <div className="h-2 w-2 rounded-full bg-cyan-600 shadow-[0_0_8px_rgba(8,145,178,0.4)]"></div>
              <p className="text-xs font-bold tracking-wide text-cyan-700">
                TECH
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default TechnicianLayout

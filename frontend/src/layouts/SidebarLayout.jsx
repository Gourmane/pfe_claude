import { useEffect, useId, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function getNavItemClassName(isActive, compact = false) {
  if (compact) {
    return [
      'flex flex-col gap-1 min-h-11 items-center justify-center rounded-[10px] px-2.5 py-2 text-center text-[11px] leading-[1.2] font-normal transition-colors duration-150 sm:px-3',
      isActive
        ? 'border-l-[2px] border-primary bg-primary/12 pl-[10px] font-medium text-navy-800'
        : 'text-navy-500 hover:bg-white/70 hover:text-navy-900',
    ].join(' ')
  }

  return [
    'mb-[3px] flex items-center gap-2.5 min-h-11 w-full rounded-[7px] px-3 py-[9px] text-left text-[13px] transition-colors',
    isActive
      ? 'border-l-[2px] border-primary bg-primary/10 pl-[10px] font-medium text-white'
      : 'font-normal text-white/55 hover:bg-white/7 hover:text-white/90',
  ].join(' ')
}

function isNavItemActive(currentPathname, itemPath) {
  if (currentPathname === itemPath) {
    return true
  }

  if (itemPath.endsWith('/dashboard')) {
    return false
  }

  return currentPathname.startsWith(`${itemPath}/`)
}

function SidebarLayout({
  navItems,
  roleLabel,
  roleBadge,
  subtitle,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const mobileDrawerId = 'app-navigation-drawer'
  const mobileDrawerLabelId = useId()
  const drawerRef = useRef(null)
  const menuButtonRef = useRef(null)
  const previousOverflowRef = useRef('')

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!drawerOpen) {
      return undefined
    }

    const menuButton = menuButtonRef.current
    previousOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setDrawerOpen(false)
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) {
        return
      }

      const focusableElements = drawerRef.current.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    const frameId = requestAnimationFrame(() => {
      const firstFocusableElement = drawerRef.current?.querySelector(
        'button:not([disabled]), a[href], textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (firstFocusableElement instanceof HTMLElement) {
        firstFocusableElement.focus()
        return
      }

      drawerRef.current?.focus()
    })

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frameId)
      document.body.style.overflow = previousOverflowRef.current
      document.removeEventListener('keydown', handleKeyDown)

      if (menuButton instanceof HTMLElement) {
        menuButton.focus()
      }
    }
  }, [drawerOpen])

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

  const sidebarContent = (
    <div className="flex h-full w-full flex-col">
      <div className="text-[10px] font-semibold tracking-[2px] text-primary-light uppercase mb-[5px]">
        {roleLabel}
      </div>
      
      <div className="mb-[6px] flex items-center gap-[10px]">
        <div className="w-[32px] h-[32px] rounded-lg bg-linear-to-br from-white/18 to-white/10 flex items-center justify-center shrink-0 border border-white/10">
          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-display text-[17px] font-semibold leading-none text-white tracking-[-0.3px]">
          Fixora AI
        </span>
      </div>
      
      <p className="mb-[32px] text-[11px] leading-relaxed text-white/38">
        {subtitle}
      </p>

      <div className="mb-[10px] text-[9.5px] font-semibold tracking-[1.8px] text-white/25 uppercase">
        Navigation
      </div>
      
      <nav aria-label={`Navigation ${roleLabel}`} className="flex flex-col">
        {navItems.map((item) => (
          <button
            aria-current={isNavItemActive(location.pathname, item.to) ? 'page' : undefined}
            key={item.to}
            className={getNavItemClassName(
              isNavItemActive(location.pathname, item.to),
            )}
            onClick={() => navigate(item.to)}
            type="button"
          >
            {item.icon ? (
              <span aria-hidden="true" className="h-[15px] w-[15px] shrink-0">{item.icon}</span>
            ) : null}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/8 pt-[18px]">
        <div className="text-[9.5px] tracking-[1.5px] text-white/25 uppercase mb-1.5">
          Session
        </div>
        <div className="text-[13px] text-white/75 font-medium mb-[18px] break-words">
          {user?.name || user?.email || 'Utilisateur'}
        </div>
        
        <button
          className="block min-h-11 w-full rounded-[8px] border border-white/12 bg-transparent py-2 text-[12px] text-white/40 transition-colors hover:border-white/25 hover:text-white/70 disabled:opacity-50"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-transparent font-sans text-text-primary antialiased xl:flex">
      <aside className="relative hidden w-[210px] shrink-0 flex-col overflow-y-auto bg-[#1B2B4B] px-5 pt-[28px] pb-[28px] xl:sticky xl:top-0 xl:flex xl:h-screen [&::after]:content-[''] [&::after]:absolute [&::after]:right-0 [&::after]:top-0 [&::after]:bottom-0 [&::after]:w-[1px] [&::after]:bg-gradient-to-b [&::after]:from-[rgba(193,138,103,0.35)] [&::after]:to-[rgba(193,138,103,0.04)]">
        {sidebarContent}
      </aside>

      {drawerOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-navy-900/35 backdrop-blur-[1px] xl:hidden"
            onClick={() => setDrawerOpen(false)}
            role="presentation"
          />

          <aside
            aria-labelledby={mobileDrawerLabelId}
            aria-modal="true"
            className="fixed inset-y-0 left-0 z-50 w-[min(88vw,240px)] bg-[#1B2B4B] px-5 pt-[28px] pb-[28px] shadow-[12px_0_28px_rgba(10,20,38,0.18)] xl:hidden [&::after]:content-[''] [&::after]:absolute [&::after]:right-0 [&::after]:top-0 [&::after]:bottom-0 [&::after]:w-[1px] [&::after]:bg-gradient-to-b [&::after]:from-[rgba(193,138,103,0.35)] [&::after]:to-[rgba(193,138,103,0.04)]"
            id={mobileDrawerId}
            ref={drawerRef}
            role="dialog"
            tabIndex={-1}
          >
            <h2 className="sr-only" id={mobileDrawerLabelId}>
              Navigation {roleLabel}
            </h2>
            {sidebarContent}
          </aside>
        </>
      ) : null}

      <div aria-hidden={drawerOpen} className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border-light bg-[rgba(255,255,255,0.82)] px-4 py-3.5 backdrop-blur-xl sm:px-6 xl:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-controls={mobileDrawerId}
              aria-expanded={drawerOpen}
              aria-label={drawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-border bg-white text-text-secondary transition-colors duration-150 hover:border-primary hover:text-primary xl:hidden"
              onClick={() => setDrawerOpen(true)}
              ref={menuButtonRef}
              type="button"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="hidden xl:block">
              <div className="text-[10.5px] tracking-[1.5px] text-text-muted uppercase mb-[2px]">
                Espace {roleLabel}
              </div>
              <div className="text-[14px] font-semibold text-text-primary">
                {user?.name || user?.email || 'Utilisateur'}
              </div>
            </div>
            <div className="min-w-0 xl:hidden">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                Espace {roleLabel}
              </div>
              <div className="truncate text-[14px] font-semibold text-text-primary">
                Fixora AI
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-[7px] rounded-[20px] bg-navy-900 px-3 py-1.5 text-[10px] font-medium tracking-[0.5px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:px-3.5 sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {roleBadge}
          </div>
        </header>

        <nav className="hidden border-b border-border-light bg-[rgba(255,255,255,0.72)] px-4 py-2 backdrop-blur-lg md:block xl:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <button
                aria-current={isNavItemActive(location.pathname, item.to) ? 'page' : undefined}
                key={item.to}
                className={getNavItemClassName(
                  isNavItemActive(location.pathname, item.to),
                  true,
                )}
                onClick={() => navigate(item.to)}
                type="button"
              >
                {item.icon ? (
                  <span aria-hidden="true" className="h-4 w-4 shrink-0">{item.icon}</span>
                ) : null}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main className="flex flex-1 flex-col gap-5 px-4 pt-5 pb-28 sm:gap-6 sm:px-6 sm:pt-6 md:pb-32 xl:px-8 xl:pb-10">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border-light bg-[rgba(255,255,255,0.92)] px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${Math.min(navItems.length, 3)}, minmax(0, 1fr))` }}
          >
            {navItems.map((item) => (
              <button
                aria-current={isNavItemActive(location.pathname, item.to) ? 'page' : undefined}
                key={item.to}
                className={getNavItemClassName(
                  isNavItemActive(location.pathname, item.to),
                  true,
                )}
                onClick={() => navigate(item.to)}
                type="button"
              >
                {item.icon ? (
                  <span aria-hidden="true" className="h-5 w-5 shrink-0">{item.icon}</span>
                ) : null}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default SidebarLayout

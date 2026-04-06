import SidebarLayout from './SidebarLayout'

const NAV_ITEMS = [
  {
    label: 'Tableau de bord',
    to: '/admin/dashboard',
    icon: (
      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect height="7" rx="1" width="7" x="3" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="3" />
        <rect height="7" rx="1" width="7" x="3" y="14" />
        <rect height="7" rx="1" width="7" x="14" y="14" />
      </svg>
    ),
  },
  {
    label: 'Clients',
    to: '/admin/clients',
    icon: (
      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-2a6 6 0 0 1 6-6" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M21 21v-2a4.5 4.5 0 0 0-4.5-4.5" />
      </svg>
    ),
  },
  {
    label: 'Tickets',
    to: '/admin/tickets',
    icon: (
      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12h6M9 16h4M17 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
]

function AdminLayout() {
  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      roleBadge="ADMIN"
      roleLabel="Admin"
      subtitle="Supervision des clients, des tickets et des affectations."
    />
  )
}

export default AdminLayout

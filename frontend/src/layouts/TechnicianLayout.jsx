import SidebarLayout from './SidebarLayout'

const NAV_ITEMS = [
  {
    label: 'Tableau de bord',
    to: '/technician/dashboard',
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
    label: 'Mes tickets',
    to: '/technician/tickets',
    icon: (
      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12h6M9 16h4M17 4H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
]

function TechnicianLayout() {
  return (
    <SidebarLayout
      navItems={NAV_ITEMS}
      roleBadge="TECH"
      roleLabel="Technicien"
      subtitle="Suivez vos interventions, l'activité des tickets et les priorités en cours."
    />
  )
}

export default TechnicianLayout

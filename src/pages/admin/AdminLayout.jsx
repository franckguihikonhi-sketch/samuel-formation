import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Video, Upload, GraduationCap } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/categories', label: 'Catégories', icon: FolderOpen },
  { to: '/admin/formations', label: 'Formations', icon: GraduationCap },
  { to: '/admin/videos', label: 'Vidéos', icon: Video },
  { to: '/admin/upload', label: 'Importer', icon: Upload },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-noir-900 border-r border-noir-700 flex-shrink-0">
        <div className="p-4 border-b border-noir-700">
          <h2 className="text-or-400 font-bold text-sm uppercase tracking-wider">Administration</h2>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-or-500/10 text-or-400 font-medium'
                    : 'text-noir-300 hover:bg-noir-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Contenu */}
      <main className="flex-1 overflow-auto bg-noir-950">
        <Outlet />
      </main>
    </div>
  )
}

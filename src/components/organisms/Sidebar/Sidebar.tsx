import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { NavItem } from '@molecules/NavItem'
import { SearchBox } from '@molecules/SearchBox'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { toggleSidebar } from '@store/slices/uiSlice'
import './Sidebar.css'

interface NavEntry {
  path:  string
  label: string
  icon?: string
}

const NAV_ENTRIES: NavEntry[] = [
  { path: '/reports/pnp-and-pna', label: 'PnP & PnA Report', icon: '📊' },
]

export function Sidebar() {
  const dispatch    = useAppDispatch()
  const collapsed   = useAppSelector((s) => s.ui.sidebarCollapsed)
  const navigate    = useNavigate()
  const location    = useLocation()
  const [search, setSearch] = useState('')

  const filtered = NAV_ENTRIES.filter((e) =>
    e.label.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <aside className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}>
      <div className="sidebar__brand-row">
        <span className="sidebar__brand">
          RT<span>Reports</span>
        </span>
        <button
          className="sidebar__collapse-btn"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar__search">
          <SearchBox
            placeholder="Buscar reporte..."
            value={search}
            onChange={setSearch}
          />
        </div>
      )}

      <nav className="sidebar__nav" aria-label="Reportes">
        {filtered.map((entry) => (
          <NavItem
            key={entry.path}
            label={entry.label}
            icon={entry.icon ? <span aria-hidden="true">{entry.icon}</span> : undefined}
            active={location.pathname === entry.path}
            onClick={() => navigate(entry.path)}
          />
        ))}
      </nav>
    </aside>
  )
}

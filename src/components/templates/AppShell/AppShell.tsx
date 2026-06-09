import { Outlet } from 'react-router-dom'
import { Sidebar } from '@organisms/Sidebar'
import { Topbar } from '@organisms/Topbar'
import { useAppSelector } from '@hooks/useAppSelector'
import './AppShell.css'

export function AppShell() {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed)

  return (
    <div className={`app-shell${collapsed ? ' app-shell--collapsed' : ''}`}>
      <div className="app-shell__sidebar">
        <Sidebar />
      </div>

      <div className="app-shell__main">
        <div className="app-shell__topbar">
          <Topbar />
        </div>
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

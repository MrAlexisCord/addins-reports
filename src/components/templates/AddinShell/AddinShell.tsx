import { Outlet } from 'react-router-dom'
import './AddinShell.css'

/**
 * Layout minimalista para addins de MyGeotab.
 * No incluye Sidebar ni Topbar — MyGeotab provee su propia navegación
 * al incrustar el addin en un iFrame.
 */
export function AddinShell() {
  return (
    <div className="addin-shell">
      <Outlet />
    </div>
  )
}

import type { ReactNode } from 'react'
import './NavItem.css'

interface NavItemProps {
  icon?: ReactNode
  label: string
  active?: boolean
  badge?: string | number
  onClick?: () => void
}

export function NavItem({ icon, label, active = false, badge, onClick }: NavItemProps) {
  return (
    <div
      className={`nav-item${active ? ' nav-item--active' : ''}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <span className="nav-item__label">
        {icon}
        <span className="nav-item__text">{label}</span>
      </span>
      {badge !== undefined && (
        <span className="nav-item__badge">{badge}</span>
      )}
    </div>
  )
}

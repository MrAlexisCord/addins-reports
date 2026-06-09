import './StatusPill.css'

export type StatusPillVariant = 'default' | 'active' | 'inactive' | 'warning' | 'prolonged' | 'unauthorized'

interface StatusPillProps {
  label: string
  variant?: StatusPillVariant
}

export function StatusPill({ label, variant = 'default' }: StatusPillProps) {
  return (
    <span className={`status-pill${variant !== 'default' ? ` status-pill--${variant}` : ''}`}>
      {label}
    </span>
  )
}

import type { ReactNode } from 'react'
import './Topbar.css'

interface TopbarProps {
  /** Contenido izquierdo — selectores de contexto, filtros, etc. */
  left?: ReactNode
  /** Contenido derecho — íconos de acción, usuario, etc. */
  right?: ReactNode
}

export function Topbar({ left, right }: TopbarProps) {
  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">{left}</div>
      <div className="topbar__right">{right}</div>
    </header>
  )
}

import type { ChangeEvent } from 'react'
import './SearchBox.css'

interface SearchBoxProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export function SearchBox({
  placeholder = 'Buscar...',
  value,
  onChange,
}: SearchBoxProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value)

  return (
    <div className="search-box">
      <span className="search-box__icon" aria-hidden="true">
        {/* Ícono de búsqueda — inline SVG para evitar dependencia de iconos */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        className="search-box__input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label={placeholder}
      />
    </div>
  )
}

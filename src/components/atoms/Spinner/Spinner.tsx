import './Spinner.css'

export type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  label?: string
}

export function Spinner({ size = 'md', label = 'Cargando...' }: SpinnerProps) {
  return (
    <span
      className={`spinner spinner--${size}`}
      role="status"
      aria-label={label}
    />
  )
}

import { useEtaTimer } from '@hooks/useEtaTimer'
import { formatDuration } from '@utils/formatters'
import './DurationCell.css'

export interface DurationCellProps {
  /** Duración en segundos. null = alerta activa (muestra ETA en tiempo real). */
  duracion:      number | null
  fechaGenerado: Date
}

/**
 * Átomo que renderiza la celda de duración del grid de alertas.
 *
 * - duracion !== null → alerta finalizada → muestra "HH:mm:ss" en gris
 * - duracion === null → alerta activa    → muestra "ETA HH:mm:ss" en badge naranja
 *   (el contador se incrementa cada segundo via useEtaTimer)
 */
export function DurationCell({ duracion, fechaGenerado }: DurationCellProps) {
  const isActive = duracion === null
  const elapsed  = useEtaTimer(fechaGenerado, isActive)

  if (!isActive) {
    return (
      <span className="duration-cell duration-cell--final">
        {formatDuration(duracion!)}
      </span>
    )
  }

  return (
    <span className="duration-cell duration-cell--active">
      ETA {elapsed !== null ? formatDuration(elapsed) : '--:--:--'}
    </span>
  )
}

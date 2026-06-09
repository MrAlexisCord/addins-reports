import { useState, useEffect } from 'react'

/**
 * Devuelve los segundos transcurridos desde `startDate`, actualizándose cada
 * segundo mientras `isActive` sea true.
 *
 * - Si `isActive` es false o `startDate` es null: retorna null sin montar timer.
 * - El interval se limpia automáticamente al desmontar o cuando cambian las deps.
 */
export function useEtaTimer(startDate: Date | null, isActive: boolean): number | null {
  const [elapsed, setElapsed] = useState<number | null>(null)

  useEffect(() => {
    if (!isActive || !startDate) {
      setElapsed(null)
      return
    }

    const tick = () => {
      setElapsed(Math.floor((Date.now() - startDate.getTime()) / 1000))
    }

    tick() // valor inmediato sin esperar 1 segundo
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isActive, startDate])

  return elapsed
}

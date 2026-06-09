import { useState, useEffect } from 'react'
import type { GeotabState } from '@config/geotab'

const FALLBACK_DATABASE = import.meta.env.VITE_DEV_DATABASE ?? 'demo'

/**
 * Hook que obtiene la sesión Geotab activa.
 *
 * - En modo addin (iFrame MyGeotab): lee la sesión vía `window.geotab.getSession`.
 * - En modo desarrollo: usa la variable VITE_DEV_DATABASE o 'demo'.
 */
export function useGeotabApi() {
  const [session, setSession] = useState<GeotabState>({
    database: FALLBACK_DATABASE,
  })

  useEffect(() => {
    if (window.geotab) {
      window.geotab.getSession((s) => setSession(s))
    }
  }, [])

  return session
}

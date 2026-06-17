import { useState, useEffect } from 'react'
import type { GeotabState } from '@config/geotab'

const FALLBACK_DATABASE = import.meta.env.VITE_DEV_DATABASE ?? 'demo'

/**
 * Hook que obtiene la sesión Geotab activa.
 *
 * - En modo addin (iFrame MyGeotab): extrae la base de datos usando `api.getSession()`
 *   que en el SDK moderno retorna una Promise<{ database, userName, server }>.
 * - En modo desarrollo: usa la variable VITE_DEV_DATABASE o 'demo'.
 */
export function useGeotabApi() {
  const [session, setSession] = useState<GeotabState>({
    database: FALLBACK_DATABASE,
  })

  useEffect(() => {
    window.__onGeotabReady?.((ctx) => {
      console.log('[useGeotabApi] Contexto recibido:', ctx)

      if (ctx.api) {
        // api.getSession(callback) — callback-based, NO retorna Promise.
        // El segundo parámetro es "includeRelayParameters" (boolean); no pasar error callback ahí.
        try {
          ;(ctx.api as any).getSession((geotabSession: any) => {
            console.log('[useGeotabApi] Sesión obtenida:', geotabSession)
            setSession({
              database: geotabSession?.database || FALLBACK_DATABASE,
              userName: geotabSession?.userName,
              server:   geotabSession?.server,
            })
          })
        } catch (err) {
          console.error('[useGeotabApi] Error al obtener sesión:', err)
          setSession({ database: FALLBACK_DATABASE })
        }
      } else {
        // Modo desarrollo sin iframe de MyGeotab
        setSession({ database: FALLBACK_DATABASE })
      }
    })
  }, [])

  return session
}


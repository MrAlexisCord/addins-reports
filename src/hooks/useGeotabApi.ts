import { useState, useEffect } from 'react'
import type { GeotabState, GeotabApi } from '@config/geotab'

const FALLBACK_DATABASE = import.meta.env.VITE_DEV_DATABASE ?? 'demo'

/**
 * Hook que obtiene la sesión Geotab activa.
 *
 * - En modo addin (iFrame MyGeotab): extrae la base de datos usando `api.getSession()`
 * - En modo desarrollo: usa la variable VITE_DEV_DATABASE o 'demo'.
 *
 * El patrón correcto en MyGeotab es usar `api.getSession()` para obtener
 * la sesión actual, que incluye la base de datos.
 */
export function useGeotabApi() {
  const [session, setSession] = useState<GeotabState>({
    database: FALLBACK_DATABASE,
  })

  useEffect(() => {
    window.__onGeotabReady?.((ctx) => {
      console.log('[useGeotabApi] Contexto recibido:', ctx)

      // Si tenemos acceso a MyGeotab (ctx.api), obtener la sesión real
      if (ctx.api) {
        (ctx.api as GeotabApi).getSession(
          (session: { database: string; [key: string]: unknown }) => {
            console.log('[useGeotabApi] Sesión obtenida:', session)
            setSession({
              ...ctx.state,
              database: session.database || FALLBACK_DATABASE,
            } as GeotabState)
          },
          (error: unknown) => {
            console.error('[useGeotabApi] Error al obtener sesión:', error)
            // Fallback a variable de entorno si falla
            setSession({
              ...ctx.state,
              database: FALLBACK_DATABASE,
            } as GeotabState)
          }
        )
      } else if (ctx.state) {
        // Fallback si no hay api.getSession (desarrollo)
        setSession({
          ...ctx.state,
          database: FALLBACK_DATABASE,
        } as GeotabState)
      }
    })
  }, [])

  return session
}


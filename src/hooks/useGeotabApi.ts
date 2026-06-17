import { useState, useEffect } from 'react'
import type { GeotabState } from '@config/geotab'

const FALLBACK_DATABASE = import.meta.env.VITE_DEV_DATABASE ?? 'demo'

/**
 * Hook que obtiene la sesión Geotab activa.
 *
 * - En modo addin (iFrame MyGeotab): extrae la base de datos usando `state.getState()`
 * - En modo desarrollo: usa la variable VITE_DEV_DATABASE o 'demo'.
 */
export function useGeotabApi() {
  const [session, setSession] = useState<GeotabState>({
    database: FALLBACK_DATABASE,
  })

  useEffect(() => {
    window.__onGeotabReady?.((ctx) => {
      console.log('[useGeotabApi] Contexto recibido:', ctx)

      // Si tenemos acceso a state.getState(), obtener el estado actual
      if (ctx.state && typeof ctx.state.getState === 'function') {
        try {
          const currentState = (ctx.state as any).getState()
          console.log('[useGeotabApi] Estado actual:', currentState)
          
          // Extraer la base de datos del estado
          const database = currentState?.database || FALLBACK_DATABASE
          console.log('[useGeotabApi] Database final:', database)
          
          setSession({
            ...ctx.state,
            database,
          } as GeotabState)
        } catch (error) {
          console.error('[useGeotabApi] Error al obtener estado:', error)
          setSession({
            ...ctx.state,
            database: FALLBACK_DATABASE,
          } as GeotabState)
        }
      } else if (ctx.state) {
        // Fallback si no hay getState (desarrollo)
        setSession({
          ...ctx.state,
          database: FALLBACK_DATABASE,
        } as GeotabState)
      }
    })
  }, [])

  return session
}


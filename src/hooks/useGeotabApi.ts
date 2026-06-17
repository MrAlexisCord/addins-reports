import { useState, useEffect } from 'react'
import type { GeotabState } from '@config/geotab'

const FALLBACK_DATABASE = import.meta.env.VITE_DEV_DATABASE ?? 'demo'

/**
 * Hook que obtiene la sesión Geotab activa.
 *
 * - En modo addin (iFrame MyGeotab): lee el `state` inyectado por el callback
 *   `initialize` que fue capturado en el bridge de `index.html`.
 * - En modo desarrollo: usa la variable VITE_DEV_DATABASE o 'demo'.
 *
 * NOTA: `window.geotab.getSession` no existe en versiones modernas de MyGeotab.
 * El patrón correcto es `geotab.addin.<name>.initialize(api, state, cb)`.
 */
export function useGeotabApi() {
  const [session, setSession] = useState<GeotabState>({
    database: FALLBACK_DATABASE,
  })

  useEffect(() => {
    window.__onGeotabReady?.((ctx) => {
      // Debug: verificar qué se está recibiendo de MyGeotab
      console.debug('[useGeotabApi] Contexto recibido:', { 
        hasState: !!ctx.state,
        database: ctx.state?.database,
        userName: ctx.state?.userName,
        server: ctx.state?.server,
      })

      // Si recibimos un state de MyGeotab, úsalo (incluso si falta algún campo)
      if (ctx.state) {
        // database podría venir en state, sino usar el fallback
        const database = ctx.state.database || FALLBACK_DATABASE
        console.debug('[useGeotabApi] Database final:', database)
        setSession({
          ...ctx.state,
          database,
        } as GeotabState)
      }
    })
  }, [])

  return session
}


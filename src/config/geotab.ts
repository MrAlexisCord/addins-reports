/**
 * Integración con la API de MyGeotab.
 *
 * Los addins de MyGeotab reciben un objeto `api` y un objeto `state`
 * al momento de inicializar (initialize callback). Este módulo tipifica
 * esos objetos para uso dentro del SPA React.
 *
 * Patrón oficial:
 *   geotab.addin.<name> = () => ({ initialize(api, state, cb) { … } })
 *
 * Para obtener la sesión actual en MyGeotab moderno, usar `state.getState()`
 * que retorna el estado actual incluyendo la base de datos.
 */

export interface GeotabState {
  /** Base de datos Geotab activa (ej. "b2700") */
  database: string
  /** Nombre de usuario activo */
  userName?: string
  /** Servidor Geotab (ej. "my.geotab.com") */
  server?: string
  /** Filtro de grupos activo (disponible en algunos contextos) */
  getGroupFilter?: () => Array<{ id: string }>
}

export interface GeotabApi {
  call: <T = unknown>(
    method: string,
    params: Record<string, unknown>,
    success: (result: T) => void,
    failure: (error: unknown) => void,
  ) => void
  getSession: (
    success: (session: { database: string; [key: string]: unknown }) => void,
    failure?: (error: unknown) => void,
  ) => void
}

export interface GeotabContext {
  api: GeotabApi | null
  state: GeotabState | null
}

/**
 * Contexto global inicializado por el bridge de addin (index.html).
 * Disponible tanto en modo addin (MyGeotab iframe) como en desarrollo.
 */
declare global {
  interface Window {
    /** Objeto raíz de la plataforma MyGeotab; contiene `addin` y otros. */
    geotab?: {
      addin?: Record<string, unknown>
      [key: string]: unknown
    }
    /** Bridge que almacena api y state capturados en el callback initialize. */
    __GEOTAB_CONTEXT__: GeotabContext
    /** Registra un callback que se ejecuta cuando el contexto Geotab esté listo. */
    __onGeotabReady?: (callback: (ctx: GeotabContext) => void) => void
  }
}


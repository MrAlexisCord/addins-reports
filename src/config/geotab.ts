/**
 * Integración con la API de MyGeotab.
 *
 * Los addins de MyGeotab reciben un objeto `api` y un objeto `state`
 * al momento de inicializar (initialize callback). Este módulo tipifica
 * esos objetos para uso dentro del SPA React.
 *
 * Documentación: https://developers.geotab.com/myGeotab/addIns/addIns
 */

export interface GeotabState {
  /** Base de datos Geotab activa (ej. "b2700") */
  database: string
  /** Nombre de usuario activo */
  userName?: string
  /** Servidor Geotab (ej. "my.geotab.com") */
  server?:   string
}

export interface GeotabApi {
  call: <T = unknown>(
    method: string,
    params: Record<string, unknown>,
    success: (result: T) => void,
    failure: (error: unknown) => void,
  ) => void
  getSession: (callback: (session: GeotabState) => void) => void
}

/**
 * Contexto global inyectado por la plataforma MyGeotab.
 * Solo disponible cuando el SPA se ejecuta como addin embebido.
 * En desarrollo, estos valores son undefined.
 */
declare global {
  interface Window {
    geotab?: GeotabApi
  }
}

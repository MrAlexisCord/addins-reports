/**
 * WrapperResponse<T> — modelo genérico de respuesta del backend.
 *
 * Todos los endpoints retornan esta estructura:
 * {
 *   "succeeded": boolean,
 *   "message":   string | null,
 *   "errors":    string[] | null,
 *   "data":      T | null
 * }
 */
export interface WrapperResponse<T> {
  succeeded: boolean
  message:   string | null | undefined
  errors:    string[] | null | undefined
  data:       T | null | undefined
}

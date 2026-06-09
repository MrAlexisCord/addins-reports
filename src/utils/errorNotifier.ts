/**
 * Notificador centralizado de errores.
 * Llamado desde el interceptor de Axios y el Error Boundary.
 * Las páginas/componentes NO necesitan manejar `catch` para toasts.
 */
import { toast } from 'react-toastify'
import { ApiBusinessError, ApiHttpError } from './errors'

export function notifyError(error: unknown): void {
  if (error instanceof ApiBusinessError) {
    const lines = [error.message, ...(error.errors ?? [])]
      .filter(Boolean)
      .join('\n')
    toast.error(lines, { toastId: 'api-business-error' })
    return
  }

  if (error instanceof ApiHttpError) {
    toast.error(`Error HTTP ${error.status}: ${error.message}`, {
      toastId: `api-http-${error.status}`,
    })
    return
  }

  if (error instanceof Error) {
    toast.error(error.message, { toastId: 'generic-error' })
    return
  }

  toast.error('Ocurrió un error inesperado.', { toastId: 'unknown-error' })
}

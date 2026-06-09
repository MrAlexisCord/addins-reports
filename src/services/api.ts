import axios from 'axios'
import { ENV } from '@config/env'
import { ApiBusinessError, ApiHttpError } from '@utils/errors'
import { notifyError } from '@utils/errorNotifier'
import type { WrapperResponse } from '@models/service/wrapperResponse.model'

/**
 * Instancia Axios configurada para el backend RouteTrackingT2.
 *
 * CORS: el backend debe permitir el origen del frontend.
 * Si se requieren cookies de sesión, habilitar `withCredentials: true`.
 *
 * Interceptor de respuesta:
 *   HTTP 2xx + succeeded === true  → devuelve la respuesta (data extraída por el adapter)
 *   HTTP 2xx + succeeded === false → lanza ApiBusinessError (muestra toast automático)
 *   HTTP 4xx / 5xx / red          → lanza ApiHttpError     (muestra toast automático)
 */
export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, // habilitar si el backend usa cookies de sesión
})

/* ------------------------------------------------------------------ */
/*  Response interceptor                                                */
/* ------------------------------------------------------------------ */
api.interceptors.response.use(
  (response) => {
    const body = response.data as WrapperResponse<unknown>

    // El backend siempre devuelve { succeeded, ... }
    if (typeof body?.succeeded === 'boolean' && !body.succeeded) {
      const err = new ApiBusinessError(
        body.message ?? 'La operación no fue exitosa.',
        body.errors ?? [],
      )
      notifyError(err)
      return Promise.reject(err)
    }

    return response
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      const status  = error.response?.status ?? 0
      const body    = error.response?.data as WrapperResponse<unknown> | undefined
      const message =
        body?.message ??
        error.message ??
        'Error de comunicación con el servidor.'

      const httpErr = new ApiHttpError(status, message)
      notifyError(httpErr)
      return Promise.reject(httpErr)
    }

    // Error de red o de cancelación
    const networkErr = new ApiHttpError(0, 'Sin conexión con el servidor.')
    notifyError(networkErr)
    return Promise.reject(networkErr)
  },
)

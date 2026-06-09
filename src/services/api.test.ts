import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ApiBusinessError, ApiHttpError } from '../utils/errors'

// Mock de errorNotifier antes de importar api
vi.mock('../utils/errorNotifier', () => ({ notifyError: vi.fn() }))

import { notifyError } from '../utils/errorNotifier'

// Importar api DESPUÉS del mock para que el interceptor use el mock
const { api } = await import('./api')

/**
 * Helper para simular un error de Axios con respuesta HTTP
 */
function makeAxiosError(status: number, data: unknown): AxiosError {
  const err = new AxiosError('Request failed')
  err.response = {
    status,
    data,
    headers: {},
    config: {} as InternalAxiosRequestConfig,
    statusText: 'Error',
  }
  return err
}

describe('api interceptors', () => {
  beforeEach(() => {
    vi.mocked(notifyError).mockClear()
  })

  describe('response interceptor — éxito', () => {
    it('pasa la respuesta cuando succeeded=true', async () => {
      const mockAdapter = vi.fn().mockResolvedValue({
        data: { succeeded: true, message: null, errors: null, data: 'ok' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} },
      })
      api.defaults.adapter = mockAdapter

      const response = await api.get('/test')
      expect(response.data.succeeded).toBe(true)
      expect(notifyError).not.toHaveBeenCalled()
    })

    it('lanza ApiBusinessError y llama notifyError cuando succeeded=false', async () => {
      const mockAdapter = vi.fn().mockResolvedValue({
        data: { succeeded: false, message: 'Error negocio', errors: ['campo'] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} },
      })
      api.defaults.adapter = mockAdapter

      await expect(api.get('/test')).rejects.toBeInstanceOf(ApiBusinessError)
      expect(notifyError).toHaveBeenCalledOnce()
    })
  })

  describe('response interceptor — error', () => {
    it('lanza ApiHttpError para errores HTTP 4xx/5xx', async () => {
      const mockAdapter = vi.fn().mockRejectedValue(
        makeAxiosError(404, { message: 'No encontrado' }),
      )
      api.defaults.adapter = mockAdapter

      await expect(api.get('/not-found')).rejects.toBeInstanceOf(ApiHttpError)
      expect(notifyError).toHaveBeenCalledOnce()
    })

    it('lanza ApiHttpError con status 0 para errores de red', async () => {
      const networkErr = new AxiosError('Network Error')
      networkErr.response = undefined
      const mockAdapter = vi.fn().mockRejectedValue(networkErr)
      api.defaults.adapter = mockAdapter

      const caught = await api.get('/test').catch((e) => e)
      expect(caught).toBeInstanceOf(ApiHttpError)
      expect((caught as ApiHttpError).status).toBe(0)
      expect(notifyError).toHaveBeenCalledOnce()
    })
  })
})

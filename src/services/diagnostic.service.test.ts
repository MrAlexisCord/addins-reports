import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkIsAlive, checkHealth } from './diagnostic.service'

vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}))

import { api } from './api'

const mockedGet = vi.mocked(api.get)

describe('diagnostic.service', () => {
  beforeEach(() => { mockedGet.mockClear() })

  describe('checkIsAlive', () => {
    it('retorna true cuando el API está vivo', async () => {
      mockedGet.mockResolvedValue({ data: { succeeded: true, data: true } })
      expect(await checkIsAlive()).toBe(true)
    })

    it('retorna false cuando data es false', async () => {
      mockedGet.mockResolvedValue({ data: { succeeded: true, data: false } })
      expect(await checkIsAlive()).toBe(false)
    })

    it('llama al endpoint correcto', async () => {
      mockedGet.mockResolvedValue({ data: { succeeded: true, data: true } })
      await checkIsAlive()
      expect(mockedGet).toHaveBeenCalledWith('/api/v1/Diagnostic/im-alive')
    })
  })

  describe('checkHealth', () => {
    it('retorna un HealthCheckAppModel cuando succeeded=true', async () => {
      mockedGet.mockResolvedValue({
        data: {
          succeeded: true,
          message: null,
          errors: null,
          data: { apiAlive: true, databaseAlive: true, databaseError: null },
        },
      })
      const result = await checkHealth()
      expect(result.isHealthy).toBe(true)
      expect(result.isApiAlive).toBe(true)
    })

    it('llama al endpoint correcto', async () => {
      mockedGet.mockResolvedValue({
        data: {
          succeeded: true,
          message: null,
          errors: null,
          data: { apiAlive: true, databaseAlive: true, databaseError: null },
        },
      })
      await checkHealth()
      expect(mockedGet).toHaveBeenCalledWith('/api/v1/Diagnostic/health-check')
    })
  })
})

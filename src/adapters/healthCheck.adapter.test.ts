import { describe, it, expect } from 'vitest'
import { toHealthCheckAppModel } from './healthCheck.adapter'
import { ApiBusinessError } from '../utils/errors'

describe('toHealthCheckAppModel', () => {
  it('mapea correctamente una respuesta sana', () => {
    const raw = {
      succeeded: true,
      message: null,
      errors: null,
      data: { apiAlive: true, databaseAlive: true, databaseError: null },
    }
    const result = toHealthCheckAppModel(raw)
    expect(result.isApiAlive).toBe(true)
    expect(result.isDatabaseAlive).toBe(true)
    expect(result.databaseError).toBeNull()
    expect(result.isHealthy).toBe(true)
  })

  it('isHealthy es false cuando databaseAlive es false', () => {
    const raw = {
      succeeded: true,
      message: null,
      errors: null,
      data: { apiAlive: true, databaseAlive: false, databaseError: 'timeout' },
    }
    const result = toHealthCheckAppModel(raw)
    expect(result.isHealthy).toBe(false)
    expect(result.databaseError).toBe('timeout')
  })

  it('lanza ApiBusinessError cuando succeeded=false', () => {
    const raw = {
      succeeded: false,
      message: 'Servicio no disponible',
      errors: [],
      data: null,
    }
    expect(() => toHealthCheckAppModel(raw)).toThrow(ApiBusinessError)
  })
})

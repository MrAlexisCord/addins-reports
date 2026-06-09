import { describe, it, expect } from 'vitest'
import { ApiBusinessError, ApiHttpError } from './errors'

describe('ApiBusinessError', () => {
  it('crea una instancia con message y errors', () => {
    const err = new ApiBusinessError('Error de negocio', ['Campo requerido'])
    expect(err.message).toBe('Error de negocio')
    expect(err.errors).toEqual(['Campo requerido'])
    expect(err.name).toBe('ApiBusinessError')
    expect(err).toBeInstanceOf(Error)
  })

  it('usa array vacío por defecto para errors', () => {
    const err = new ApiBusinessError('Error')
    expect(err.errors).toEqual([])
  })
})

describe('ApiHttpError', () => {
  it('crea una instancia con status y message', () => {
    const err = new ApiHttpError(404, 'No encontrado')
    expect(err.status).toBe(404)
    expect(err.message).toBe('No encontrado')
    expect(err.name).toBe('ApiHttpError')
    expect(err).toBeInstanceOf(Error)
  })
})

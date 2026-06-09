import { describe, it, expect } from 'vitest'
import { unwrapResponse } from './wrapperResponse.adapter'
import { ApiBusinessError } from '../utils/errors'
import { z } from 'zod'

const stringSchema = z.string()

describe('unwrapResponse', () => {
  it('retorna data cuando succeeded=true y data es válida', () => {
    const raw = { succeeded: true, message: null, errors: null, data: 'hola' }
    expect(unwrapResponse(stringSchema, raw)).toBe('hola')
  })

  it('lanza ApiBusinessError cuando succeeded=false', () => {
    const raw = {
      succeeded: false,
      message: 'Error de negocio',
      errors: ['campo requerido'],
      data: null,
    }
    expect(() => unwrapResponse(stringSchema, raw)).toThrow(ApiBusinessError)
  })

  it('usa mensaje por defecto cuando message es null y succeeded=false', () => {
    const raw = { succeeded: false, message: null, errors: null, data: null }
    expect(() => unwrapResponse(stringSchema, raw)).toThrow('La operación no fue exitosa.')
  })

  it('lanza Error cuando data es null y succeeded=true', () => {
    const raw = { succeeded: true, message: null, errors: null, data: null }
    expect(() => unwrapResponse(stringSchema, raw)).toThrow(
      'El servidor retornó succeeded=true pero sin datos',
    )
  })

  it('lanza Error cuando el shape del wrapper no es válido', () => {
    expect(() => unwrapResponse(stringSchema, { malformed: true })).toThrow(
      'La respuesta del servidor no tiene el formato esperado.',
    )
  })

  it('lanza Error cuando data no cumple el schema', () => {
    const raw = { succeeded: true, message: null, errors: null, data: 42 }
    expect(() => unwrapResponse(stringSchema, raw)).toThrow()
  })
})

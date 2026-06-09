import { describe, it, expect } from 'vitest'
import { wrapperResponseSchema } from '../../models/service/wrapperResponse.schema'
import { z } from 'zod'

describe('wrapperResponseSchema', () => {
  const schema = wrapperResponseSchema(z.string())

  it('parsea una respuesta válida con succeeded=true', () => {
    const result = schema.safeParse({
      succeeded: true,
      message: 'OK',
      errors: null,
      data: 'hola',
    })
    expect(result.success).toBe(true)
  })

  it('parsea succeeded=false correctamente', () => {
    const result = schema.safeParse({
      succeeded: false,
      message: 'Error',
      errors: ['campo requerido'],
      data: null,
    })
    expect(result.success).toBe(true)
  })

  it('falla si succeeded no es boolean', () => {
    const result = schema.safeParse({ succeeded: 'yes', data: null })
    expect(result.success).toBe(false)
  })

  it('acepta message y errors como undefined', () => {
    const result = schema.safeParse({ succeeded: true, data: 'x' })
    expect(result.success).toBe(true)
  })

  it('acepta errors como array de strings', () => {
    const result = schema.safeParse({
      succeeded: false,
      errors: ['e1', 'e2'],
      data: null,
    })
    expect(result.success).toBe(true)
  })
})

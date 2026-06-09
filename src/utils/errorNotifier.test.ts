import { describe, it, expect, vi } from 'vitest'
import { notifyError } from './errorNotifier'
import { ApiBusinessError, ApiHttpError } from './errors'

// Mock de react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}))

import { toast } from 'react-toastify'

describe('notifyError', () => {
  it('llama toast.error con el mensaje para ApiBusinessError', () => {
    notifyError(new ApiBusinessError('Error de negocio', ['Campo requerido']))
    expect(toast.error).toHaveBeenCalledWith(
      'Error de negocio\nCampo requerido',
      expect.objectContaining({ toastId: 'api-business-error' }),
    )
  })

  it('llama toast.error para ApiBusinessError sin errors', () => {
    notifyError(new ApiBusinessError('Solo mensaje'))
    expect(toast.error).toHaveBeenCalledWith(
      'Solo mensaje',
      expect.objectContaining({ toastId: 'api-business-error' }),
    )
  })

  it('llama toast.error con status para ApiHttpError', () => {
    notifyError(new ApiHttpError(500, 'Error interno'))
    expect(toast.error).toHaveBeenCalledWith(
      'Error HTTP 500: Error interno',
      expect.objectContaining({ toastId: 'api-http-500' }),
    )
  })

  it('llama toast.error con mensaje para Error genérico', () => {
    notifyError(new Error('Error genérico'))
    expect(toast.error).toHaveBeenCalledWith(
      'Error genérico',
      expect.objectContaining({ toastId: 'generic-error' }),
    )
  })

  it('llama toast.error con mensaje por defecto para error desconocido', () => {
    notifyError('no es un error')
    expect(toast.error).toHaveBeenCalledWith(
      'Ocurrió un error inesperado.',
      expect.objectContaining({ toastId: 'unknown-error' }),
    )
  })
})

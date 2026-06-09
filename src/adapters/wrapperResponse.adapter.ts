import { z } from 'zod'
import { wrapperResponseSchema } from '@models/service/wrapperResponse.schema'
import { ApiBusinessError } from '@utils/errors'

/**
 * Adapter genérico para WrapperResponse<T>.
 *
 * 1. Parsea el raw con Zod.
 * 2. Si `!succeeded` → lanza ApiBusinessError.
 * 3. Si `data` es null/undefined → lanza error de contrato.
 * 4. Retorna el data ya parseado.
 */
export function unwrapResponse<T extends z.ZodTypeAny>(
  dataSchema: T,
  raw: unknown,
): z.infer<T> {
  const schema = wrapperResponseSchema(dataSchema)
  const result = schema.safeParse(raw)

  if (!result.success) {
    console.error('[Adapter] Error de contrato en WrapperResponse:', result.error.format())
    throw new Error('La respuesta del servidor no tiene el formato esperado.')
  }

  const { succeeded, message, errors, data } = result.data

  if (!succeeded) {
    throw new ApiBusinessError(
      message ?? 'La operación no fue exitosa.',
      errors ?? [],
    )
  }

  if (data == null) {
    throw new Error('El servidor retornó succeeded=true pero sin datos (data: null).')
  }

  return data as z.infer<T>
}

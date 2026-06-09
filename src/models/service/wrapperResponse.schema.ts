import { z } from 'zod'

/**
 * Schema Zod genérico para WrapperResponse<T>.
 * Uso: wrapperResponseSchema(myDataSchema)
 */
export const wrapperResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    succeeded: z.boolean(),
    message:   z.string().nullable().optional(),
    errors:    z.array(z.string()).nullable().optional(),
    data:      dataSchema.nullable().optional(),
  })

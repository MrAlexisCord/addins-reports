import { z } from 'zod'
import { unwrapResponse } from './wrapperResponse.adapter'
import type { HealthCheckAppModel } from '@models/app/healthCheck.app.model'

/** Zod schema para HealthCheckDto */
export const healthCheckSchema = z.object({
  apiAlive:      z.boolean(),
  databaseAlive: z.boolean(),
  databaseError: z.string().nullable(),
})

/** Transforma la respuesta cruda del backend al app model */
export function toHealthCheckAppModel(raw: unknown): HealthCheckAppModel {
  const service = unwrapResponse(healthCheckSchema, raw)

  return {
    isApiAlive:      service.apiAlive,
    isDatabaseAlive: service.databaseAlive,
    databaseError:   service.databaseError,
    isHealthy:       service.apiAlive && service.databaseAlive,
  }
}

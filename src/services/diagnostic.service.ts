import { api } from './api'
import { toHealthCheckAppModel } from '@adapters/healthCheck.adapter'
import type { HealthCheckAppModel } from '@models/app/healthCheck.app.model'

/** Verifica que el proceso API esté vivo (no chequea dependencias externas) */
export async function checkIsAlive(): Promise<boolean> {
  const response = await api.get<{ succeeded: boolean; data: boolean }>(
    '/api/v1/Diagnostic/im-alive',
  )
  return response.data.data ?? false
}

/** Chequeo completo de salud: API + base de datos */
export async function checkHealth(): Promise<HealthCheckAppModel> {
  const response = await api.get('/api/v1/Diagnostic/health-check')
  return toHealthCheckAppModel(response.data)
}

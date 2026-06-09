/** Service model — shape exacta del backend para HealthCheckDto */
export interface HealthCheckServiceModel {
  apiAlive:      boolean
  databaseAlive: boolean
  databaseError: string | null
}

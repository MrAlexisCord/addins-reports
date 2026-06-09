/** App model — modelo que usa el frontend para HealthCheck */
export interface HealthCheckAppModel {
  isApiAlive:      boolean
  isDatabaseAlive: boolean
  databaseError:   string | null
  isHealthy:       boolean // computed: apiAlive && databaseAlive
}

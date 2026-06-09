import { useQuery } from '@tanstack/react-query'
import { getPnpAndPnaReport } from '@services/pnpAndPna.service'
import type { PnpAndPnaAppModel } from '@models/app/pnpAndPna.app.model'

/**
 * Hook TanStack Query para el reporte PnP & PnA.
 * Re-fetch automático cada 60 segundos para refrescar alertas activas
 * (la duración ETA se calcula localmente en DurationCell entre re-fetches).
 * @param database — nombre de la base de datos Geotab
 */
export function usePnpAndPnaReport(database: string) {
  return useQuery<PnpAndPnaAppModel[], Error>({
    queryKey:        ['pnpAndPna', database],
    queryFn:         () => getPnpAndPnaReport(database),
    enabled:         !!database,
    refetchInterval: 60_000,
  })
}

import { api } from './api'
import { toPnpAndPnaAppModelList } from '@adapters/pnpAndPna.adapter'
import type { PnpAndPnaAppModel } from '@models/app/pnpAndPna.app.model'

/** Obtiene el reporte PnP & PnA para la base de datos Geotab indicada */
export async function getPnpAndPnaReport(database: string): Promise<PnpAndPnaAppModel[]> {
  const response = await api.get(
    `/api/v1/PnpAndPnaReport/pnp-and-pna-report/${encodeURIComponent(database)}`,
  )

  console.log('Respuesta cruda del backend para PnP & PnA:', response.data)
  return toPnpAndPnaAppModelList(response.data)
}

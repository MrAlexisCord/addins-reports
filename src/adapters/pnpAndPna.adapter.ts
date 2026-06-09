import { z } from 'zod'
import { unwrapResponse } from './wrapperResponse.adapter'
import type { PnpAndPnaAppModel } from '@models/app/pnpAndPna.app.model'

/**
 * Zod schema — refleja PnpAndPnaServiceModel (camelCase JSON de .NET).
 */
export const pnpAndPnaItemSchema = z.object({
  id:                   z.number(),
  alertaId:             z.number().nullable(),
  vehiculoId:           z.number().nullable(),
  fechaGenerado:        z.string().nullable(),
  latitud:              z.number().nullable(),
  longitud:             z.number().nullable(),
  velocidad:            z.number().nullable(),
  duracion:             z.number().nullable(),
  fechainsercion:       z.string().nullable(),
  gestionada:           z.boolean().nullable(),
  idRuta:               z.number().nullable(),
  idViaje:              z.number().nullable(),
  secuencia:            z.number().nullable(),
  version:              z.string().nullable(),
  blnNotificada:        z.boolean().nullable(),
  direccion:            z.string().nullable(),
  ruta:                 z.string().nullable(),
  conductor:            z.string().nullable(),
  tipoAlerta:           z.string().nullable(),
  transportista:        z.string().nullable(),
  placa:                z.string().nullable(),
  codigoViaje:          z.string().nullable(),
  distanciaEntrePuntos: z.number().nullable(),
  dentroDeRango:        z.boolean(),
})

export const pnpAndPnaListSchema = z.array(pnpAndPnaItemSchema)

type PnpAndPnaRaw = z.infer<typeof pnpAndPnaItemSchema>

/** Transforma un item del backend al app model que usa la UI */
function toAppModel(raw: PnpAndPnaRaw): PnpAndPnaAppModel {
  return {
    id:            raw.id,
    transportista: raw.transportista ?? 'Desconocido',
    placa:         raw.placa ?? '',
    conductor:     raw.conductor ?? 'Desconocido',
    codigoViaje:   raw.codigoViaje ?? null,
    tipoAlerta:    raw.tipoAlerta ?? '',
    latitud:       raw.latitud ?? 0,
    longitud:      raw.longitud ?? 0,
    ubicacion:     raw.direccion?.trim() || 'No Disponible',
    fechaGenerado: raw.fechaGenerado ? new Date(raw.fechaGenerado) : new Date(0),
    duracion:      raw.duracion,
  }
}

/** Transforma la respuesta cruda del backend a una lista de app models */
export function toPnpAndPnaAppModelList(raw: unknown): PnpAndPnaAppModel[] {
  const items = unwrapResponse(pnpAndPnaListSchema, raw)
  return items.map(toAppModel)
}

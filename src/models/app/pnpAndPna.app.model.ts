/**
 * App model — campos que consume la UI del reporte PnP & PnA.
 * Transformado desde PnpAndPnaServiceModel vía el adapter.
 */
export interface PnpAndPnaAppModel {
  id:            number
  transportista: string        // "Desconocido" si null en backend
  placa:         string
  conductor:     string        // "Desconocido" si null en backend
  codigoViaje:   string | null // null cuando el vehículo no tiene viaje asignado
  tipoAlerta:    string
  latitud:       number
  longitud:      number
  ubicacion:     string        // "No Disponible" si null o vacío en backend
  fechaGenerado: Date
  duracion:      number | null // segundos; null = activa → ETA en tiempo real
}

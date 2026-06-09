/**
 * Service model — mapeo 1:1 del DTO PnpAndPnaReportDto del backend.
 * Los nombres de campo siguen la convención camelCase de la serialización JSON de .NET.
 */
export interface PnpAndPnaServiceModel {
  id:                      number
  alertaId:                number | null
  vehiculoId:              number | null
  fechaGenerado:           string | null   // ISO 8601
  latitud:                 number | null
  longitud:                number | null
  velocidad:               number | null
  duracion:                number | null   // segundos; null = alerta activa
  fechainsercion:          string | null   // ISO 8601
  gestionada:              boolean | null
  idRuta:                  number | null
  idViaje:                 number | null
  secuencia:               number | null
  version:                 string | null
  blnNotificada:           boolean | null
  direccion:               string | null   // Ubicación en el grid
  ruta:                    string | null
  // JOINs
  conductor:               string | null
  tipoAlerta:              string | null   // Tipo de alerta en el grid
  transportista:           string | null
  placa:                   string | null
  codigoViaje:             string | null
  // Nuevos campos
  distanciaEntrePuntos:    number | null   // Distancia Haversine al punto de ruta
  dentroDeRango:           boolean         // true si el vehículo está dentro del rango permitido
}

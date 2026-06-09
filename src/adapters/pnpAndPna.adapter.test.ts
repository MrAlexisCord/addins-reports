import { describe, it, expect } from 'vitest'
import { toPnpAndPnaAppModelList } from './pnpAndPna.adapter'
import { ApiBusinessError } from '../utils/errors'

/** Fixture mínimo válido de PnpAndPnaReportDto */
const makeItem = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  alertaId: 10,
  vehiculoId: 5,
  fechaGenerado: '2026-04-28T21:25:26',
  latitud: 23.75935,
  longitud: -99.158478,
  velocidad: 0,
  duracion: null,
  fechainsercion: '2026-04-28T21:26:00',
  gestionada: false,
  idRuta: 3,
  idViaje: 7,
  secuencia: 1,
  version: '1.0',
  blnNotificada: false,
  direccion: 'Av. Los Almendros 2554',
  ruta: 'Detenciones prolongadas',
  conductor: 'Desconocido',
  tipoAlerta: 'Alerta de detención prolongada',
  transportista: 'Ab-Inbev',
  placa: '70022225',
  codigoViaje: '20260428FV24',
  distanciaEntrePuntos: 125.5,
  dentroDeRango: false,
  ...overrides,
})

const wrapData = (data: unknown) => ({
  succeeded: true,
  message: null,
  errors: null,
  data,
})

describe('toPnpAndPnaAppModelList', () => {
  it('transforma correctamente los campos principales', () => {
    const raw = wrapData([makeItem()])
    const [item] = toPnpAndPnaAppModelList(raw)

    expect(item.id).toBe(1)
    expect(item.transportista).toBe('Ab-Inbev')
    expect(item.placa).toBe('70022225')
    expect(item.conductor).toBe('Desconocido')
    expect(item.codigoViaje).toBe('20260428FV24')
    expect(item.tipoAlerta).toBe('Alerta de detención prolongada')
    expect(item.latitud).toBe(23.75935)
    expect(item.longitud).toBe(-99.158478)
    expect(item.ubicacion).toBe('Av. Los Almendros 2554')
    expect(item.fechaGenerado).toBeInstanceOf(Date)
    expect(item.duracion).toBeNull()
  })

  it('aplica fallback "Desconocido" cuando conductor y transportista son null', () => {
    const raw = wrapData([makeItem({ conductor: null, transportista: null })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.conductor).toBe('Desconocido')
    expect(item.transportista).toBe('Desconocido')
  })

  it('aplica fallbacks numéricos y de string cuando placa, tipoAlerta, latitud y longitud son null', () => {
    const raw = wrapData([makeItem({ placa: null, tipoAlerta: null, latitud: null, longitud: null })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.placa).toBe('')
    expect(item.tipoAlerta).toBe('')
    expect(item.latitud).toBe(0)
    expect(item.longitud).toBe(0)
  })

  it('usa new Date(0) cuando fechaGenerado es null', () => {
    const raw = wrapData([makeItem({ fechaGenerado: null })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.fechaGenerado).toEqual(new Date(0))
  })

  it('muestra "No Disponible" cuando direccion es null', () => {
    const raw = wrapData([makeItem({ direccion: null })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.ubicacion).toBe('No Disponible')
  })

  it('muestra "No Disponible" cuando direccion es string vacío', () => {
    const raw = wrapData([makeItem({ direccion: '' })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.ubicacion).toBe('No Disponible')
  })

  it('muestra "No Disponible" cuando direccion es solo espacios en blanco', () => {
    const raw = wrapData([makeItem({ direccion: '   ' })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.ubicacion).toBe('No Disponible')
  })

  it('deja codigoViaje como null cuando viene null del backend', () => {
    const raw = wrapData([makeItem({ codigoViaje: null })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.codigoViaje).toBeNull()
  })

  it('asigna duracion cuando la alerta está finalizada', () => {
    const raw = wrapData([makeItem({ duracion: 1840 })])
    const [item] = toPnpAndPnaAppModelList(raw)
    expect(item.duracion).toBe(1840)
  })

  it('retorna un array vacío cuando data es un array vacío', () => {
    expect(toPnpAndPnaAppModelList(wrapData([]))).toEqual([])
  })

  it('lanza ApiBusinessError cuando succeeded=false', () => {
    const raw = { succeeded: false, message: 'Error', errors: [], data: null }
    expect(() => toPnpAndPnaAppModelList(raw)).toThrow(ApiBusinessError)
  })

  it('lanza Error cuando el formato del wrapper es inválido', () => {
    expect(() => toPnpAndPnaAppModelList({ bad: true })).toThrow()
  })
})

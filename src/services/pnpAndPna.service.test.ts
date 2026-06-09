import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getPnpAndPnaReport } from './pnpAndPna.service'

// Mock del módulo api
vi.mock('./api', () => ({
  api: {
    get: vi.fn(),
  },
}))

import { api } from './api'

const mockedGet = vi.mocked(api.get)

/** Fixture mínimo válido del DTO */
const makeItem = () => ({
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
  conductor: 'Ab-Inbev Driver',
  tipoAlerta: 'Alerta de detención prolongada',
  transportista: 'Ab-Inbev',
  placa: '70022225',
  codigoViaje: '20260428FV24',
  distanciaEntrePuntos: 125.5,
  dentroDeRango: false,
})

describe('pnpAndPna.service', () => {
  beforeEach(() => { mockedGet.mockClear() })
  afterEach(() => { vi.restoreAllMocks() })

  it('llama al endpoint correcto con la database codificada', async () => {
    mockedGet.mockResolvedValue({
      data: { succeeded: true, message: null, errors: null, data: [] },
    })
    await getPnpAndPnaReport('mi-db')
    expect(mockedGet).toHaveBeenCalledWith(
      '/api/v1/PnpAndPnaReport/pnp-and-pna-report/mi-db',
    )
  })

  it('codifica la database en la URL', async () => {
    mockedGet.mockResolvedValue({
      data: { succeeded: true, message: null, errors: null, data: [] },
    })
    await getPnpAndPnaReport('db con espacios')
    const url = mockedGet.mock.calls[0][0] as string
    expect(url).toContain('db%20con%20espacios')
  })

  it('retorna el resultado del adapter con el DTO real', async () => {
    const item = makeItem()
    mockedGet.mockResolvedValue({
      data: { succeeded: true, message: null, errors: null, data: [item] },
    })
    const result = await getPnpAndPnaReport('test')
    expect(result).toHaveLength(1)
    expect(result[0].transportista).toBe('Ab-Inbev')
    expect(result[0].placa).toBe('70022225')
    expect(result[0].duracion).toBeNull()
  })
})

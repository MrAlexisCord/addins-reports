import { describe, it, expect } from 'vitest'
import { formatDuration, formatCoordinate, formatDateLocal } from './formatters'

describe('formatDuration', () => {
  it('formatea 0 segundos', () => {
    expect(formatDuration(0)).toBe('00:00:00')
  })

  it('formatea segundos menores a un minuto', () => {
    expect(formatDuration(30)).toBe('00:00:30')
  })

  it('formatea exactamente 1 minuto y 30 segundos', () => {
    expect(formatDuration(90)).toBe('00:01:30')
  })

  it('formatea 1 hora, 1 minuto y 1 segundo', () => {
    expect(formatDuration(3661)).toBe('01:01:01')
  })

  it('formatea exactamente 24 horas', () => {
    expect(formatDuration(86400)).toBe('24:00:00')
  })

  it('HH crece a 3 dígitos cuando supera 99 horas', () => {
    expect(formatDuration(360000)).toBe('100:00:00')
  })

  it('trunca decimales (no redondea hacia arriba)', () => {
    expect(formatDuration(90.9)).toBe('00:01:30')
  })
})

describe('formatCoordinate', () => {
  it('muestra exactamente 8 decimales', () => {
    expect(formatCoordinate(23.75935)).toBe('23.75935000')
  })

  it('muestra coordenada negativa con 8 decimales', () => {
    expect(formatCoordinate(-99.158478)).toBe('-99.15847800')
  })

  it('formatea cero con 8 decimales', () => {
    expect(formatCoordinate(0)).toBe('0.00000000')
  })
})

describe('formatDateLocal', () => {
  it('formatea fecha en dd/mm/aaaa hh:mm:ss (24h)', () => {
    // Fecha fija para evitar dependencia de timezone en CI
    const date = new Date(2026, 3, 28, 21, 25, 26) // 28 Abr 2026 21:25:26 local
    expect(formatDateLocal(date)).toBe('28/04/2026 21:25:26')
  })

  it('rellena con ceros días y meses de un dígito', () => {
    const date = new Date(2026, 0, 5, 9, 3, 7) // 5 Ene 2026 09:03:07
    expect(formatDateLocal(date)).toBe('05/01/2026 09:03:07')
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useGeotabApi } from './useGeotabApi'

describe('useGeotabApi', () => {
  beforeEach(() => {
    // Limpiar window.geotab entre tests
    delete (window as { geotab?: unknown }).geotab
  })

  it('retorna la database de fallback cuando no hay window.geotab', () => {
    const { result } = renderHook(() => useGeotabApi())
    expect(result.current.database).toBeDefined()
    expect(typeof result.current.database).toBe('string')
  })

  it('llama getSession cuando window.geotab está disponible', () => {
    const getSession = vi.fn((cb) => cb({ database: 'test-db' }))
    ;(window as { geotab?: unknown }).geotab = { getSession }

    const { result } = renderHook(() => useGeotabApi())
    expect(getSession).toHaveBeenCalledOnce()
    expect(result.current.database).toBe('test-db')
  })

  it('devuelve el database obtenido de getSession', () => {
    const getSession = vi.fn((cb) => cb({ database: 'mi-empresa' }))
    ;(window as { geotab?: unknown }).geotab = { getSession }

    const { result } = renderHook(() => useGeotabApi())
    expect(result.current.database).toBe('mi-empresa')
  })
})

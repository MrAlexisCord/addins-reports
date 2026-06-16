import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGeotabApi } from './useGeotabApi'
import type { GeotabContext } from '@config/geotab'

describe('useGeotabApi', () => {
  beforeEach(() => {
    // Resetear el bridge antes de cada test
    window.__GEOTAB_CONTEXT__ = { api: null, state: null }
    window.__onGeotabReady = undefined
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('retorna la database de fallback cuando no hay contexto Geotab', () => {
    // Sin bridge registrado, __onGeotabReady es undefined
    const { result } = renderHook(() => useGeotabApi())
    expect(result.current.database).toBeDefined()
    expect(typeof result.current.database).toBe('string')
  })

  it('llama __onGeotabReady cuando está disponible', () => {
    const onReadySpy = vi.fn()
    window.__onGeotabReady = onReadySpy

    renderHook(() => useGeotabApi())

    expect(onReadySpy).toHaveBeenCalledOnce()
  })

  it('actualiza el session cuando el contexto Geotab provee una database', () => {
    // Simular el bridge: __onGeotabReady invoca el callback de inmediato
    window.__onGeotabReady = (cb: (ctx: GeotabContext) => void) => {
      cb({ api: null, state: { database: 'test-db', userName: 'user@test.com' } })
    }

    const { result } = renderHook(() => useGeotabApi())

    expect(result.current.database).toBe('test-db')
    expect(result.current.userName).toBe('user@test.com')
  })

  it('no sobreescribe el fallback si el state carece de database', () => {
    window.__onGeotabReady = (cb: (ctx: GeotabContext) => void) => {
      cb({ api: null, state: null })
    }

    const { result } = renderHook(() => useGeotabApi())

    // Sin database válida, debe mantener el fallback
    expect(typeof result.current.database).toBe('string')
    expect(result.current.database.length).toBeGreaterThan(0)
  })

  it('actualiza el session cuando el bridge notifica con retraso (callback asíncrono)', async () => {
    let capturedCallback: ((ctx: GeotabContext) => void) | null = null

    window.__onGeotabReady = (cb: (ctx: GeotabContext) => void) => {
      capturedCallback = cb
    }

    const { result } = renderHook(() => useGeotabApi())

    // Antes de que el bridge notifique, tiene el fallback
    expect(result.current.database).toBeDefined()

    // Simular que MyGeotab llama initialize más tarde
    act(() => {
      capturedCallback?.({ api: null, state: { database: 'mi-empresa', server: 'my.geotab.com' } })
    })

    expect(result.current.database).toBe('mi-empresa')
    expect(result.current.server).toBe('my.geotab.com')
  })
})


import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useEtaTimer } from './useEtaTimer'

describe('useEtaTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna null cuando isActive es false', () => {
    const start = new Date(Date.now() - 5000)
    const { result } = renderHook(() => useEtaTimer(start, false))
    expect(result.current).toBeNull()
  })

  it('retorna null cuando startDate es null', () => {
    const { result } = renderHook(() => useEtaTimer(null, true))
    expect(result.current).toBeNull()
  })

  it('calcula el elapsed inmediatamente al montar', () => {
    const start = new Date(Date.now() - 30_000) // 30 segundos atrás
    const { result } = renderHook(() => useEtaTimer(start, true))
    expect(result.current).toBe(30)
  })

  it('incrementa el elapsed cada segundo', () => {
    const start = new Date(Date.now() - 10_000)
    const { result } = renderHook(() => useEtaTimer(start, true))

    expect(result.current).toBe(10)

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current).toBe(11)

    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current).toBe(12)
  })

  it('limpia el interval al desmontar', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval')
    const start = new Date()
    const { unmount } = renderHook(() => useEtaTimer(start, true))
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })

  it('detiene el timer cuando isActive cambia a false', () => {
    const start = new Date(Date.now() - 5000)
    let isActive = true
    const { result, rerender } = renderHook(() => useEtaTimer(start, isActive))

    expect(result.current).toBe(5)

    isActive = false
    rerender()

    act(() => { vi.advanceTimersByTime(3000) })
    expect(result.current).toBeNull()
  })
})

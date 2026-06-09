import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useQueryParams } from './useQueryParams'

function wrapper({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>
}

describe('useQueryParams', () => {
  it('retorna los valores por defecto cuando la URL no tiene query params', () => {
    const { result } = renderHook(
      () => useQueryParams({ page: '1', pageSize: '20' }),
      { wrapper },
    )
    expect(result.current.params.page).toBe('1')
    expect(result.current.params.pageSize).toBe('20')
  })

  it('setParam actualiza un parámetro en la URL', () => {
    const { result } = renderHook(
      () => useQueryParams({ page: '1', pageSize: '20' }),
      { wrapper },
    )
    act(() => { result.current.setParam('page', '3') })
    expect(result.current.params.page).toBe('3')
  })

  it('setParam no modifica otros parámetros', () => {
    const { result } = renderHook(
      () => useQueryParams({ page: '1', pageSize: '20' }),
      { wrapper },
    )
    act(() => { result.current.setParam('page', '5') })
    expect(result.current.params.pageSize).toBe('20')
  })

  it('setParams actualiza múltiples parámetros en un solo paso', () => {
    const { result } = renderHook(
      () => useQueryParams({ page: '1', pageSize: '20', filter: '' }),
      { wrapper },
    )
    act(() => { result.current.setParams({ page: '2', pageSize: '50' }) })
    expect(result.current.params.page).toBe('2')
    expect(result.current.params.pageSize).toBe('50')
  })

  it('setParams no modifica parámetros no incluidos en el update', () => {
    const { result } = renderHook(
      () => useQueryParams({ page: '1', pageSize: '20', filter: 'abc' }),
      { wrapper },
    )
    act(() => { result.current.setParams({ page: '3' }) })
    expect(result.current.params.filter).toBe('abc')
  })

  it('resetParams restaura todos los valores por defecto', () => {
    const { result } = renderHook(
      () => useQueryParams({ page: '1', pageSize: '20' }),
      { wrapper },
    )
    act(() => { result.current.setParams({ page: '9', pageSize: '100' }) })
    act(() => { result.current.resetParams() })
    expect(result.current.params.page).toBe('1')
    expect(result.current.params.pageSize).toBe('20')
  })

  it('los parámetros son cadenas de texto (tipo T)', () => {
    const { result } = renderHook(
      () => useQueryParams({ startDate: '2024-01-01', endDate: '' }),
      { wrapper },
    )
    expect(typeof result.current.params.startDate).toBe('string')
    expect(typeof result.current.params.endDate).toBe('string')
  })

  it('setParams ignora keys cuyo valor es undefined (no sobreescribe el param)', () => {
    const { result } = renderHook(
      () => useQueryParams({ page: '1', pageSize: '20' }),
      { wrapper },
    )
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.current.setParams({ page: undefined as any })
    })
    // page no debe cambiar porque el valor era undefined
    expect(result.current.params.page).toBe('1')
  })

  it('mantiene todos los keys del defaults en params', () => {
    const defaults = { a: '1', b: '2', c: '3' }
    const { result } = renderHook(
      () => useQueryParams(defaults),
      { wrapper },
    )
    expect(Object.keys(result.current.params)).toEqual(['a', 'b', 'c'])
  })
})

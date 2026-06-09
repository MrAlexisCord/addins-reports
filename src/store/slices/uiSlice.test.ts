import { describe, it, expect } from 'vitest'
import { uiSlice, toggleSidebar, setSidebarCollapsed, setActiveReport } from '../../store/slices/uiSlice'

const reducer = uiSlice.reducer
const initialState = { sidebarCollapsed: false, activeReport: null }

describe('uiSlice', () => {
  it('tiene el estado inicial correcto', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('toggleSidebar invierte sidebarCollapsed', () => {
    const after = reducer(initialState, toggleSidebar())
    expect(after.sidebarCollapsed).toBe(true)
    const back  = reducer(after, toggleSidebar())
    expect(back.sidebarCollapsed).toBe(false)
  })

  it('setSidebarCollapsed establece el valor exacto', () => {
    expect(reducer(initialState, setSidebarCollapsed(true)).sidebarCollapsed).toBe(true)
    expect(reducer(initialState, setSidebarCollapsed(false)).sidebarCollapsed).toBe(false)
  })

  it('setActiveReport actualiza activeReport', () => {
    const after = reducer(initialState, setActiveReport('/reports/pnp-and-pna'))
    expect(after.activeReport).toBe('/reports/pnp-and-pna')
  })

  it('setActiveReport acepta null', () => {
    const state = { sidebarCollapsed: false, activeReport: '/reports/pnp-and-pna' }
    expect(reducer(state, setActiveReport(null)).activeReport).toBeNull()
  })
})

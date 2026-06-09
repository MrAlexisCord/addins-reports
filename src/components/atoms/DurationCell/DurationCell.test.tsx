import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { DurationCell } from './DurationCell'

describe('DurationCell', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('muestra la duración final en formato HH:mm:ss cuando duracion no es null', () => {
    const fecha = new Date()
    render(<DurationCell duracion={3661} fechaGenerado={fecha} />)
    expect(screen.getByText('01:01:01')).toBeInTheDocument()
  })

  it('aplica la clase duration-cell--final cuando hay duración final', () => {
    const fecha = new Date()
    render(<DurationCell duracion={90} fechaGenerado={fecha} />)
    const el = screen.getByText('00:01:30')
    expect(el).toHaveClass('duration-cell--final')
  })

  it('muestra "ETA HH:mm:ss" cuando duracion es null (alerta activa)', () => {
    const fechaGenerado = new Date(Date.now() - 65_000) // 65 s atrás
    render(<DurationCell duracion={null} fechaGenerado={fechaGenerado} />)
    expect(screen.getByText('ETA 00:01:05')).toBeInTheDocument()
  })

  it('aplica la clase duration-cell--active cuando la alerta está activa', () => {
    const fechaGenerado = new Date(Date.now() - 10_000)
    render(<DurationCell duracion={null} fechaGenerado={fechaGenerado} />)
    const el = screen.getByText('ETA 00:00:10')
    expect(el).toHaveClass('duration-cell--active')
  })

  it('incrementa el ETA cada segundo', () => {
    const fechaGenerado = new Date(Date.now() - 10_000)
    render(<DurationCell duracion={null} fechaGenerado={fechaGenerado} />)

    expect(screen.getByText('ETA 00:00:10')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText('ETA 00:00:11')).toBeInTheDocument()
  })
})

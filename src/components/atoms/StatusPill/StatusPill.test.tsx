import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusPill } from './StatusPill'

describe('StatusPill', () => {
  it('renderiza el label', () => {
    render(<StatusPill label="Activo" />)
    expect(screen.getByText('Activo')).toBeInTheDocument()
  })

  it('variante por defecto no aplica modificador', () => {
    const { container } = render(<StatusPill label="OK" />)
    expect(container.firstChild).not.toHaveClass('status-pill--active')
  })

  it('aplica clase de variante active', () => {
    const { container } = render(<StatusPill label="Activo" variant="active" />)
    expect(container.firstChild).toHaveClass('status-pill--active')
  })

  it('aplica clase de variante inactive', () => {
    const { container } = render(<StatusPill label="Inactivo" variant="inactive" />)
    expect(container.firstChild).toHaveClass('status-pill--inactive')
  })
})

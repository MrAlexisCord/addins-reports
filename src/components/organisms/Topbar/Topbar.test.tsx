import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Topbar } from './Topbar'

describe('Topbar', () => {
  it('renderiza el elemento header con role banner', () => {
    render(<Topbar />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renderiza contenido left', () => {
    render(<Topbar left={<span>Izquierda</span>} />)
    expect(screen.getByText('Izquierda')).toBeInTheDocument()
  })

  it('renderiza contenido right', () => {
    render(<Topbar right={<span>Derecha</span>} />)
    expect(screen.getByText('Derecha')).toBeInTheDocument()
  })

  it('aplica la clase topbar', () => {
    const { container } = render(<Topbar />)
    expect(container.firstChild).toHaveClass('topbar')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renderiza con el rol status', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('aplica el aria-label correcto', () => {
    render(<Spinner label="Procesando..." />)
    expect(screen.getByLabelText('Procesando...')).toBeInTheDocument()
  })

  it('aplica la clase de tamaño correcta', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.firstChild).toHaveClass('spinner--lg')
  })

  it('tamaño por defecto es md', () => {
    const { container } = render(<Spinner />)
    expect(container.firstChild).toHaveClass('spinner--md')
  })
})

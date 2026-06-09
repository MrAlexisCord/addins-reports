import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from './ErrorBoundary'

/** Componente que lanza un error intencionalmente */
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Error de prueba')
  return <p>Contenido OK</p>
}

describe('ErrorBoundary', () => {
  it('renderiza children cuando no hay error', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Contenido OK')).toBeInTheDocument()
  })

  it('muestra fallback cuando hay error', () => {
    // Suprimir console.error de React para el test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/ocurrió un error/i)).toBeInTheDocument()
    spy.mockRestore()
  })

  it('renderiza fallback personalizado cuando se provee', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary fallback={<p>Error custom</p>}>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Error custom')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('muestra el botón Recargar en el fallback por defecto', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    // jsdom no permite vi.spyOn sobre window.location.reload — redefinir con Object.defineProperty
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadMock },
      writable: true,
    })
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>,
    )
    await userEvent.click(screen.getByRole('button', { name: /recargar/i }))
    expect(reloadMock).toHaveBeenCalled()
    spy.mockRestore()
  })
})

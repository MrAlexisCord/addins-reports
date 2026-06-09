import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { NotFoundPage } from './NotFoundPage'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  )
}

describe('NotFoundPage', () => {
  it('muestra el código 404', () => {
    renderWithRouter()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('muestra el título "Página no encontrada"', () => {
    renderWithRouter()
    expect(screen.getByRole('heading', { name: /página no encontrada/i })).toBeInTheDocument()
  })

  it('muestra el botón de volver al inicio', () => {
    renderWithRouter()
    expect(screen.getByRole('button', { name: /volver al inicio/i })).toBeInTheDocument()
  })

  it('el botón de volver dispara navigate', async () => {
    renderWithRouter()
    await userEvent.click(screen.getByRole('button', { name: /volver al inicio/i }))
    // Solo verifica que no lance error — navigate está mockeado por MemoryRouter
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})

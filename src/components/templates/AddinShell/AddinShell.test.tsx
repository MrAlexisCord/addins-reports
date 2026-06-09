import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AddinShell } from './AddinShell'

describe('AddinShell', () => {
  it('renderiza el contenedor principal', () => {
    render(
      <MemoryRouter>
        <AddinShell />
      </MemoryRouter>,
    )
    const shell = document.querySelector('.addin-shell')
    expect(shell).toBeInTheDocument()
  })

  it('NO contiene sidebar', () => {
    render(
      <MemoryRouter>
        <AddinShell />
      </MemoryRouter>,
    )
    expect(document.querySelector('.sidebar')).not.toBeInTheDocument()
  })

  it('NO contiene topbar', () => {
    render(
      <MemoryRouter>
        <AddinShell />
      </MemoryRouter>,
    )
    expect(document.querySelector('.topbar')).not.toBeInTheDocument()
  })

  it('renderiza children via Outlet (slot vacío no rompe el render)', () => {
    expect(() =>
      render(
        <MemoryRouter>
          <AddinShell />
        </MemoryRouter>,
      ),
    ).not.toThrow()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

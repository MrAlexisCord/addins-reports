import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageLayout } from './PageLayout'

describe('PageLayout', () => {
  it('renderiza el título', () => {
    render(<PageLayout title="Mi Página"><p>Contenido</p></PageLayout>)
    expect(screen.getByRole('heading', { name: /mi página/i })).toBeInTheDocument()
  })

  it('renderiza los children', () => {
    render(<PageLayout title="T"><p>Hijo</p></PageLayout>)
    expect(screen.getByText('Hijo')).toBeInTheDocument()
  })

  it('renderiza subtítulo cuando se provee', () => {
    render(<PageLayout title="T" subtitle="Sub"><p /></PageLayout>)
    expect(screen.getByText('Sub')).toBeInTheDocument()
  })

  it('renderiza actions cuando se proveen', () => {
    render(
      <PageLayout title="T" actions={<button>Exportar</button>}>
        <p />
      </PageLayout>,
    )
    expect(screen.getByRole('button', { name: /exportar/i })).toBeInTheDocument()
  })

  it('aplica la clase page-layout al contenedor', () => {
    const { container } = render(<PageLayout title="T"><p /></PageLayout>)
    expect(container.firstChild).toHaveClass('page-layout')
  })
})

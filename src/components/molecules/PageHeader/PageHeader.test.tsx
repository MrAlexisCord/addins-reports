import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renderiza el título', () => {
    render(<PageHeader title="Mi reporte" />)
    expect(screen.getByRole('heading', { name: /mi reporte/i })).toBeInTheDocument()
  })

  it('renderiza el subtítulo cuando se provee', () => {
    render(<PageHeader title="T" subtitle="Sub texto" />)
    expect(screen.getByText('Sub texto')).toBeInTheDocument()
  })

  it('no renderiza subtítulo cuando no se provee', () => {
    const { container } = render(<PageHeader title="T" />)
    expect(container.querySelector('.page-header__subtitle')).toBeNull()
  })

  it('renderiza actions cuando se proveen', () => {
    render(<PageHeader title="T" actions={<button>Acción</button>} />)
    expect(screen.getByRole('button', { name: /acción/i })).toBeInTheDocument()
  })

  it('no renderiza actions container cuando no se proveen', () => {
    const { container } = render(<PageHeader title="T" />)
    expect(container.querySelector('.page-header__actions')).toBeNull()
  })
})

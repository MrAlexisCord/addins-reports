import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavItem } from './NavItem'

describe('NavItem', () => {
  it('renderiza el label', () => {
    render(<NavItem label="Reportes" />)
    expect(screen.getByText('Reportes')).toBeInTheDocument()
  })

  it('aplica clase active cuando active=true', () => {
    const { container } = render(<NavItem label="X" active />)
    expect(container.firstChild).toHaveClass('nav-item--active')
  })

  it('no aplica clase active por defecto', () => {
    const { container } = render(<NavItem label="X" />)
    expect(container.firstChild).not.toHaveClass('nav-item--active')
  })

  it('llama onClick al hacer clic', async () => {
    const onClick = vi.fn()
    render(<NavItem label="Clic" onClick={onClick} />)
    await userEvent.click(screen.getByText('Clic'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('llama onClick al presionar Enter', async () => {
    const onClick = vi.fn()
    render(<NavItem label="Enter" onClick={onClick} />)
    // El nav-item tiene role="button" — enfocar y presionar Enter
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('renderiza badge cuando se provee', () => {
    render(<NavItem label="X" badge={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('no renderiza badge cuando no se provee', () => {
    const { container } = render(<NavItem label="X" />)
    expect(container.querySelector('.nav-item__badge')).toBeNull()
  })

  it('renderiza el ícono cuando se provee', () => {
    render(<NavItem label="X" icon={<span data-testid="icon">🔥</span>} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})

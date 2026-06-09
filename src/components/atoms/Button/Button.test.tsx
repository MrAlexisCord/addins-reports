import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renderiza el texto hijo', () => {
    render(<Button>Guardar</Button>)
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
  })

  it('llama onClick al hacer clic', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clic</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('está deshabilitado cuando disabled=true', () => {
    render(<Button disabled>OK</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('muestra Spinner cuando loading=true', () => {
    render(<Button loading>OK</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('aplica la clase de variante correcta', () => {
    render(<Button variant="secondary">OK</Button>)
    expect(screen.getByRole('button')).toHaveClass('button--secondary')
  })
})

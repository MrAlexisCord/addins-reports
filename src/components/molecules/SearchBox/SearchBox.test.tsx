import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBox } from './SearchBox'

describe('SearchBox', () => {
  it('renderiza el placeholder', () => {
    render(<SearchBox placeholder="Buscar algo" value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Buscar algo')).toBeInTheDocument()
  })

  it('muestra el valor actual', () => {
    render(<SearchBox value="hola" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toHaveValue('hola')
  })

  it('llama onChange al escribir', async () => {
    const onChange = vi.fn()
    render(<SearchBox value="" onChange={onChange} />)
    await userEvent.type(screen.getByRole('searchbox'), 'abc')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('tiene aria-label por defecto', () => {
    render(<SearchBox value="" onChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toHaveAttribute('aria-label')
  })
})

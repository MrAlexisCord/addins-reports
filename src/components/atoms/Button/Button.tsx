import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Spinner } from '../Spinner'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    loading ? 'button--loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading ? (
        <Spinner size="sm" />
      ) : icon ? (
        <span className="button__icon">{icon}</span>
      ) : null}
      {children}
    </button>
  )
}

import { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  children: ReactNode
  dot?: boolean
  className?: string
}

export function Badge({ variant = 'default', children, dot = false, className = '' }: BadgeProps) {
  const variantClass = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    default: 'badge-default',
  }[variant]

  const dotClass = dot ? {
    success: 'status-dot-success',
    warning: 'status-dot-warning',
    error: 'status-dot-error',
    info: 'status-dot',
    default: 'status-dot',
  }[variant] : null

  return (
    <span className={`${variantClass} ${className}`}>
      {dot && dotClass && <span className={dotClass} />}
      {children}
    </span>
  )
}

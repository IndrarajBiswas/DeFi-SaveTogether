import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export function Container({ children, className = '', size = 'lg' }: ContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full'
  }[size]

  return (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ${className}`}>
      {children}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-text-secondary">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-4">{action}</div>}
    </div>
  )
}

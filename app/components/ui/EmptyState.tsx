import { ReactNode } from 'react'
import { Button } from './Button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: string | LucideIcon
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  children?: ReactNode
}

export function EmptyState({ icon, title, message, action, children }: EmptyStateProps) {
  const IconComponent = typeof icon === 'function' ? icon : null

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {IconComponent ? <IconComponent className="w-16 h-16 text-text-muted" /> : icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
          icon={action.icon}
          className="mt-6"
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  )
}

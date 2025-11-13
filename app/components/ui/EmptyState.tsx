import { ReactNode } from 'react'
import { Button } from './Button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: ReactNode | LucideIcon
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
  // Render icon based on type
  const renderIcon = () => {
    if (!icon) return null

    // Check if icon is a component (LucideIcon)
    if (typeof icon === 'function') {
      const IconComponent = icon as LucideIcon
      return <IconComponent className="w-16 h-16 text-text-muted" />
    }

    // Otherwise render as ReactNode (string emoji, JSX, etc.)
    return <>{icon}</>
  }

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {renderIcon()}
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

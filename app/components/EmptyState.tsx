import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: string
  title: string
  message: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && <div>{action}</div>}
    </div>
  )
}

import { ReactNode } from 'react'
import Modal from './Modal'

interface HelpDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  icon?: string
}

export default function HelpDialog({ isOpen, onClose, title, children, icon = '❓' }: HelpDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="help-dialog">
        <div className="help-dialog-header">
          <span className="help-dialog-icon">{icon}</span>
          <h2 className="help-dialog-title">{title}</h2>
        </div>
        <div className="help-dialog-content">
          {children}
        </div>
      </div>
    </Modal>
  )
}

import { ReactNode } from 'react'

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  status: 'pending' | 'success' | 'error' | 'loading'
  title: string
  message?: string
  txHash?: string
  details?: { label: string; value: string }[]
  action?: ReactNode
}

export default function TransactionModal({
  isOpen,
  onClose,
  status,
  title,
  message,
  txHash,
  details,
  action,
}: TransactionModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <div className="tx-status-icon loading">⏳</div>
      case 'success':
        return <div className="tx-status-icon">✅</div>
      case 'error':
        return <div className="tx-status-icon">❌</div>
      case 'pending':
        return <div className="tx-status-icon">⏰</div>
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Transaction Status</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          <div className="tx-modal-status">
            {getIcon()}
            <h3 className="tx-status-title">{title}</h3>
            {message && <p className="tx-status-message">{message}</p>}

            {details && details.length > 0 && (
              <div className="tx-details">
                {details.map((detail, index) => (
                  <div key={index} className="tx-detail-row">
                    <span className="tx-detail-label">{detail.label}</span>
                    <span className="tx-detail-value">{detail.value}</span>
                  </div>
                ))}
              </div>
            )}

            {txHash && (
              <a
                href={`https://explorer.didlab.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-outline"
                style={{ marginTop: '1rem', width: 'auto' }}
              >
                View on Explorer →
              </a>
            )}

            {action && <div style={{ marginTop: '1rem', width: '100%' }}>{action}</div>}

            {status !== 'loading' && (
              <button
                onClick={onClose}
                className="button"
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

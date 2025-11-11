interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showValue?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export default function ProgressBar({
  value,
  max,
  label,
  showValue = true,
  variant = 'default',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="progress-wrapper">
      {(label || showValue) && (
        <div className="progress-header">
          {label && <div className="progress-label">{label}</div>}
          {showValue && (
            <div className="progress-value">
              {value} / {max}
            </div>
          )}
        </div>
      )}
      <div className="progress-bar-wrapper">
        <div className={`progress-bar-fill ${variant}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

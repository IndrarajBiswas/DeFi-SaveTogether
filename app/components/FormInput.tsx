import { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  success?: boolean
}

export default function FormInput({ label, error, hint, success, className = '', ...props }: FormInputProps) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}
        <input
          className={`form-input ${error ? 'error' : ''} ${success ? 'success' : ''} ${className}`}
          {...props}
        />
      </label>
      {error && (
        <div className="form-error">
          <span>⚠️</span>
          {error}
        </div>
      )}
      {hint && !error && <div className="form-hint">{hint}</div>}
    </div>
  )
}

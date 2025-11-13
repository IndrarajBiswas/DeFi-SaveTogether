import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm text-text-muted">{hint}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: Array<{ value: string; label: string }>
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`input ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span>
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm text-text-muted">{hint}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

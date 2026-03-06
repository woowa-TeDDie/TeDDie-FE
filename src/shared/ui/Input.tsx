import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export function Input({ label, error, hint, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <input
        className={[
          'w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary',
          'placeholder:text-text-muted transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error ? 'border-danger' : 'border-border-subtle',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
      {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
    </div>
  )
}

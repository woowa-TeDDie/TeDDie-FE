interface ProgressBarProps {
  value: number
  className?: string
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={['w-full rounded-full bg-surface h-2 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="h-full rounded-full bg-brand-yellow transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

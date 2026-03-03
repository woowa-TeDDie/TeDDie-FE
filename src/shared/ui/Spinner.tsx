type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-4',
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      className={[
        'inline-block animate-spin rounded-full border-brand-yellow border-t-transparent',
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="로딩 중"
    />
  )
}

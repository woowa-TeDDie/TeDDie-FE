import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

describe('ProgressBar', () => {
  it('렌더링된다', () => {
    render(<ProgressBar value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('value에 따라 너비가 설정된다', () => {
    render(<ProgressBar value={75} />)
    const bar = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(bar).toHaveStyle({ width: '75%' })
  })

  it('value=0 경계값이 처리된다', () => {
    render(<ProgressBar value={0} />)
    const bar = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(bar).toHaveStyle({ width: '0%' })
  })

  it('value=100 경계값이 처리된다', () => {
    render(<ProgressBar value={100} />)
    const bar = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(bar).toHaveStyle({ width: '100%' })
  })

  it('aria-valuenow 속성이 올바르게 설정된다', () => {
    render(<ProgressBar value={60} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60')
  })
})

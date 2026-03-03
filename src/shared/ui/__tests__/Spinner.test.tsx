import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from '../Spinner'

describe('Spinner', () => {
  it('렌더링된다', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('size=sm 클래스가 적용된다', () => {
    render(<Spinner size="sm" />)
    expect(screen.getByRole('status')).toHaveClass('w-4')
  })

  it('size=md 클래스가 적용된다 (기본값)', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveClass('w-6')
  })

  it('size=lg 클래스가 적용된다', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByRole('status')).toHaveClass('w-10')
  })
})

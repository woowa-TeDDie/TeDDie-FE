import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../Card'

describe('Card', () => {
  it('children이 올바르게 렌더링된다', () => {
    render(<Card>카드 내용</Card>)
    expect(screen.getByText('카드 내용')).toBeInTheDocument()
  })

  it('기본 배경 스타일이 적용된다', () => {
    render(<Card data-testid="card">내용</Card>)
    expect(screen.getByTestId('card')).toHaveClass('bg-surface')
  })

  it('hover prop이 적용되면 hover 스타일이 추가된다', () => {
    render(<Card hover data-testid="card">내용</Card>)
    expect(screen.getByTestId('card')).toHaveClass('hover:bg-surface-hover')
  })

  it('className prop이 병합된다', () => {
    render(<Card className="p-8" data-testid="card">내용</Card>)
    expect(screen.getByTestId('card')).toHaveClass('p-8')
  })
})

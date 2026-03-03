import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../Badge'

describe('Badge', () => {
  it('텍스트가 올바르게 렌더링된다', () => {
    render(<Badge>초급</Badge>)
    expect(screen.getByText('초급')).toBeInTheDocument()
  })

  it('variant=success 스타일이 적용된다', () => {
    render(<Badge variant="success">정상</Badge>)
    expect(screen.getByText('정상')).toHaveClass('bg-success')
  })

  it('variant=danger 스타일이 적용된다', () => {
    render(<Badge variant="danger">정지</Badge>)
    expect(screen.getByText('정지')).toHaveClass('bg-danger')
  })

  it('variant=warning 스타일이 적용된다', () => {
    render(<Badge variant="warning">대기</Badge>)
    expect(screen.getByText('대기')).toHaveClass('bg-warning')
  })

  it('variant=default 스타일이 적용된다', () => {
    render(<Badge variant="default">기본</Badge>)
    expect(screen.getByText('기본')).toHaveClass('bg-surface')
  })

  it('variant=brand 스타일이 적용된다', () => {
    render(<Badge variant="brand">관리자</Badge>)
    expect(screen.getByText('관리자')).toHaveClass('bg-brand-yellow')
  })
})

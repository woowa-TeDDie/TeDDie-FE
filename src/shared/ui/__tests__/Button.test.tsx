import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  it('텍스트가 올바르게 렌더링된다', () => {
    render(<Button>클릭하세요</Button>)
    expect(screen.getByRole('button', { name: '클릭하세요' })).toBeInTheDocument()
  })

  it('기본 variant는 primary이다', () => {
    render(<Button>버튼</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-brand-yellow')
  })

  it('variant=secondary 스타일이 적용된다', () => {
    render(<Button variant="secondary">버튼</Button>)
    expect(screen.getByRole('button')).toHaveClass('border-brand-yellow')
  })

  it('variant=ghost 스타일이 적용된다', () => {
    render(<Button variant="ghost">버튼</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-text-muted')
  })

  it('variant=danger 스타일이 적용된다', () => {
    render(<Button variant="danger">버튼</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-danger')
  })

  it('클릭 시 onClick 핸들러가 호출된다', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>버튼</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('disabled 상태에서는 클릭 이벤트가 발생하지 않는다', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>버튼</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('disabled 상태에서 opacity 스타일이 적용된다', () => {
    render(<Button disabled>버튼</Button>)
    expect(screen.getByRole('button')).toHaveClass('opacity-50')
  })

  it('type prop이 올바르게 적용된다', () => {
    render(<Button type="submit">버튼</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('fullWidth prop이 적용된다', () => {
    render(<Button fullWidth>버튼</Button>)
    expect(screen.getByRole('button')).toHaveClass('w-full')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

describe('Input', () => {
  it('placeholder가 올바르게 렌더링된다', () => {
    render(<Input placeholder="이메일을 입력하세요" />)
    expect(screen.getByPlaceholderText('이메일을 입력하세요')).toBeInTheDocument()
  })

  it('label이 렌더링된다', () => {
    render(<Input label="이메일" />)
    expect(screen.getByText('이메일')).toBeInTheDocument()
  })

  it('입력값 변경 시 onChange가 호출된다', async () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('에러 메시지가 렌더링된다', () => {
    render(<Input error="유효하지 않은 이메일입니다" />)
    expect(screen.getByText('유효하지 않은 이메일입니다')).toBeInTheDocument()
  })

  it('에러 상태일 때 border 스타일이 변경된다', () => {
    render(<Input error="에러" />)
    expect(screen.getByRole('textbox')).toHaveClass('border-danger')
  })

  it('disabled 상태에서 입력이 불가능하다', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('type prop이 올바르게 적용된다', () => {
    render(<Input type="password" data-testid="pw" />)
    expect(screen.getByTestId('pw')).toHaveAttribute('type', 'password')
  })

  it('hint 메시지가 렌더링된다', () => {
    render(<Input hint="8자 이상 입력해주세요" />)
    expect(screen.getByText('8자 이상 입력해주세요')).toBeInTheDocument()
  })
})

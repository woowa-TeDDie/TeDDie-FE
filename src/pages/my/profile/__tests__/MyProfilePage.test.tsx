import { describe, it, expect, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { MyProfilePage } from '../index'

afterEach(() => {
  useAuthStore.setState({ user: null, accessToken: null, isLoading: false })
})

function renderPage() {
  useAuthStore.setState({
    user: { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
    accessToken: 'mock-token',
    isLoading: false,
  })
  return render(
    <MemoryRouter>
      <MyProfilePage />
    </MemoryRouter>,
  )
}

describe('MyProfilePage', () => {
  it('페이지 제목이 렌더링된다', () => {
    renderPage()
    expect(screen.getByText('내 프로필')).toBeInTheDocument()
  })

  it('닉네임을 표시한다', () => {
    renderPage()
    expect(screen.getByText('테스터')).toBeInTheDocument()
  })

  it('이메일을 표시한다', () => {
    renderPage()
    expect(screen.getByText('test@test.com')).toBeInTheDocument()
  })

  it('역할(role)을 표시한다', () => {
    renderPage()
    expect(screen.getByText('USER')).toBeInTheDocument()
  })
})

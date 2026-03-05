import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { PrivateRoute, AdminRoute } from '../PrivateRoute'

function renderWithRouter(ui: React.ReactNode, initialPath = '/protected') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>로그인 페이지</div>} />
        <Route path="/protected" element={ui}>
          <Route index element={<div>보호된 페이지</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({ user: null, accessToken: null, isLoading: false })
})

describe('PrivateRoute', () => {
  it('로그인 상태가 아니면 /login으로 리다이렉트한다', () => {
    renderWithRouter(<PrivateRoute />)
    expect(screen.getByText('로그인 페이지')).toBeInTheDocument()
  })

  it('로그인 상태이면 자식 컴포넌트를 렌더링한다', () => {
    useAuthStore.setState({ accessToken: 'token-abc' })
    renderWithRouter(<PrivateRoute />)
    expect(screen.getByText('보호된 페이지')).toBeInTheDocument()
  })
})

describe('AdminRoute', () => {
  it('ADMIN이 아니면 /login으로 리다이렉트한다', () => {
    useAuthStore.setState({
      accessToken: 'token-abc',
      user: { id: 1, email: 'user@test.com', nickname: '유저', role: 'USER' },
    })
    renderWithRouter(<AdminRoute />)
    expect(screen.getByText('로그인 페이지')).toBeInTheDocument()
  })

  it('ADMIN이면 자식 컴포넌트를 렌더링한다', () => {
    useAuthStore.setState({
      accessToken: 'admin-token',
      user: { id: 2, email: 'admin@test.com', nickname: '관리자', role: 'ADMIN' },
    })
    renderWithRouter(<AdminRoute />)
    expect(screen.getByText('보호된 페이지')).toBeInTheDocument()
  })
})

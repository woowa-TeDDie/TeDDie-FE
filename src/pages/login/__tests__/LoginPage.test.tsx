import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAuthStore } from '@/features/auth'
import { LoginPage } from '../index'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const server = setupServer(
  http.post('http://localhost:8080/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === 'test@test.com' && body.password === 'password123') {
      return HttpResponse.json({ accessToken: 'mock-token' }, { status: 200 })
    }
    return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 })
  }),
  http.get('http://localhost:8080/auth/me', () => {
    return HttpResponse.json(
      { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
      { status: 200 },
    )
  }),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  mockNavigate.mockReset()
  localStorage.clear()
  useAuthStore.setState({ user: null, accessToken: null, isLoading: false })
})
afterAll(() => server.close())

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  it('이메일, 비밀번호 입력 필드와 로그인 버튼이 렌더링된다', () => {
    renderLoginPage()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('이메일, 비밀번호 미입력 시 버튼이 비활성화된다', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled()
  })

  it('올바른 자격증명으로 로그인 시 /missions로 이동한다', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('이메일'), 'test@test.com')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: '로그인' }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/missions'))
  })

  it('잘못된 자격증명으로 로그인 시 에러 메시지를 표시한다', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('이메일'), 'wrong@test.com')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: '로그인' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument(),
    )
  })

  it('회원가입 링크가 렌더링된다', () => {
    renderLoginPage()
    expect(screen.getByRole('link', { name: /회원가입/ })).toBeInTheDocument()
  })
})

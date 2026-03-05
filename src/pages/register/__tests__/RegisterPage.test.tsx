import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAuthStore } from '@/features/auth'
import { RegisterPage } from '../index'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const server = setupServer(
  http.post('http://localhost:8080/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; password: string; nickname: string }
    if (body.email === 'duplicate@test.com') {
      return HttpResponse.json({ message: '이미 사용 중인 이메일입니다' }, { status: 409 })
    }
    return HttpResponse.json({ accessToken: 'mock-token-new' }, { status: 201 })
  }),
  http.get('http://localhost:8080/auth/me', () => {
    return HttpResponse.json(
      { id: 2, email: 'new@test.com', nickname: '신규유저', role: 'USER' },
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

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  it('이메일, 닉네임, 비밀번호 입력 필드와 회원가입 버튼이 렌더링된다', () => {
    renderRegisterPage()
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('닉네임')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })

  it('모든 필드 미입력 시 버튼이 비활성화된다', () => {
    renderRegisterPage()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeDisabled()
  })

  it('회원가입 성공 시 /missions로 이동한다', async () => {
    renderRegisterPage()
    await userEvent.type(screen.getByLabelText('이메일'), 'new@test.com')
    await userEvent.type(screen.getByLabelText('닉네임'), '신규유저')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: '회원가입' }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/missions'))
  })

  it('중복 이메일로 가입 시 에러 메시지를 표시한다', async () => {
    renderRegisterPage()
    await userEvent.type(screen.getByLabelText('이메일'), 'duplicate@test.com')
    await userEvent.type(screen.getByLabelText('닉네임'), '중복유저')
    await userEvent.type(screen.getByLabelText('비밀번호'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: '회원가입' }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('로그인 링크가 렌더링된다', () => {
    renderRegisterPage()
    expect(screen.getByRole('link', { name: /로그인/ })).toBeInTheDocument()
  })
})

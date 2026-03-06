import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAuthStore } from '@/features/auth'
import { useRegister } from '../useRegister'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const server = setupServer(
  http.post('http://localhost:8080/auth/register', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string; nickname: string }
    if (body.email === 'new@test.com') {
      return HttpResponse.json({ accessToken: 'new-token' }, { status: 201 })
    }
    return HttpResponse.json({ message: '이미 사용 중인 이메일입니다' }, { status: 409 })
  }),
  http.get('http://localhost:8080/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth === 'Bearer new-token') {
      return HttpResponse.json(
        { id: 2, email: 'new@test.com', nickname: '신규유저', role: 'USER' },
        { status: 200 },
      )
    }
    return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
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

describe('useRegister', () => {
  it('회원가입 성공 시 토큰과 유저 정보를 저장한다', async () => {
    const { result } = renderHook(() => useRegister())
    await act(async () => {
      await result.current.register('new@test.com', '신규유저', 'password123')
    })
    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('new-token')
      expect(useAuthStore.getState().user?.email).toBe('new@test.com')
    })
  })

  it('회원가입 성공 시 getMe 호출 시점에 Authorization 헤더가 전송된다', async () => {
    let capturedAuthHeader: string | null = null
    server.use(
      http.get('http://localhost:8080/auth/me', ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization')
        return HttpResponse.json(
          { id: 2, email: 'new@test.com', nickname: '신규유저', role: 'USER' },
          { status: 200 },
        )
      }),
    )
    const { result } = renderHook(() => useRegister())
    await act(async () => {
      await result.current.register('new@test.com', '신규유저', 'password123')
    })
    expect(capturedAuthHeader).toBe('Bearer new-token')
  })

  it('회원가입 성공 시 /missions으로 이동한다', async () => {
    const { result } = renderHook(() => useRegister())
    await act(async () => {
      await result.current.register('new@test.com', '신규유저', 'password123')
    })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/missions')
    })
  })

  it('이미 사용 중인 이메일로 가입 시 에러 메시지를 반환한다', async () => {
    const { result } = renderHook(() => useRegister())
    await act(async () => {
      await result.current.register('duplicate@test.com', '중복유저', 'password123')
    })
    expect(result.current.error).toBe('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다')
  })
})

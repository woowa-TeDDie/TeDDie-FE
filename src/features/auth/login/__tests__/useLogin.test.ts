import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAuthStore } from '@/features/auth'
import { useLogin } from '../useLogin'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const server = setupServer(
  http.post('http://localhost:8080/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }
    if (body.email === 'test@test.com' && body.password === 'password123') {
      return HttpResponse.json({ accessToken: 'mock-token' }, { status: 200 })
    }
    return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 })
  }),
  http.get('http://localhost:8080/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth === 'Bearer mock-token') {
      return HttpResponse.json(
        { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
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

describe('useLogin', () => {
  it('올바른 자격증명으로 로그인 시 토큰과 유저 정보를 저장한다', async () => {
    const { result } = renderHook(() => useLogin())
    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })
    await waitFor(() => {
      expect(useAuthStore.getState().accessToken).toBe('mock-token')
      expect(useAuthStore.getState().user?.email).toBe('test@test.com')
    })
  })

  it('로그인 성공 시 getMe 호출 시점에 Authorization 헤더가 전송된다', async () => {
    let capturedAuthHeader: string | null = null
    server.use(
      http.get('http://localhost:8080/auth/me', ({ request }) => {
        capturedAuthHeader = request.headers.get('Authorization')
        return HttpResponse.json(
          { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
          { status: 200 },
        )
      }),
    )
    const { result } = renderHook(() => useLogin())
    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })
    expect(capturedAuthHeader).toBe('Bearer mock-token')
  })

  it('로그인 성공 시 /missions으로 이동한다', async () => {
    const { result } = renderHook(() => useLogin())
    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/missions')
    })
  })

  it('잘못된 자격증명으로 로그인 시 에러 메시지를 반환한다', async () => {
    const { result } = renderHook(() => useLogin())
    await act(async () => {
      await result.current.login('wrong@test.com', 'wrongpass')
    })
    expect(result.current.error).toBe('이메일 또는 비밀번호가 올바르지 않습니다')
  })

  it('로딩 중에는 isLoading이 true이다', async () => {
    server.use(
      http.post('http://localhost:8080/auth/login', async () => {
        await new Promise((r) => setTimeout(r, 100))
        return HttpResponse.json({ accessToken: 'mock-token' })
      }),
    )
    const { result } = renderHook(() => useLogin())
    act(() => {
      result.current.login('test@test.com', 'password123')
    })
    expect(result.current.isLoading).toBe(true)
  })
})

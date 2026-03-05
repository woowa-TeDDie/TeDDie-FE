import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { authClient } from '../authClient'

const server = setupServer(
  http.post('http://localhost:8080/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === 'test@test.com' && body.password === 'password123') {
      return HttpResponse.json({ accessToken: 'mock-token-abc' }, { status: 200 })
    }
    return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 })
  }),

  http.post('http://localhost:8080/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; password: string; nickname: string }
    if (body.email === 'duplicate@test.com') {
      return HttpResponse.json({ message: '이미 사용 중인 이메일입니다' }, { status: 409 })
    }
    return HttpResponse.json({ accessToken: 'mock-token-new' }, { status: 201 })
  }),

  http.get('http://localhost:8080/auth/me', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (auth === 'Bearer mock-token-abc') {
      return HttpResponse.json({ id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' }, { status: 200 })
    }
    return HttpResponse.json({ message: '인증이 필요합니다' }, { status: 401 })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('authClient', () => {
  describe('login', () => {
    it('올바른 자격증명으로 로그인 시 accessToken을 반환한다', async () => {
      const result = await authClient.login({ email: 'test@test.com', password: 'password123' })
      expect(result.accessToken).toBe('mock-token-abc')
    })

    it('잘못된 자격증명으로 로그인 시 에러를 던진다', async () => {
      await expect(
        authClient.login({ email: 'wrong@test.com', password: 'wrongpass' })
      ).rejects.toThrow()
    })
  })

  describe('register', () => {
    it('신규 회원가입 시 accessToken을 반환한다', async () => {
      const result = await authClient.register({
        email: 'new@test.com',
        password: 'password123',
        nickname: '신규유저',
      })
      expect(result.accessToken).toBe('mock-token-new')
    })

    it('중복 이메일로 회원가입 시 에러를 던진다', async () => {
      await expect(
        authClient.register({ email: 'duplicate@test.com', password: 'password123', nickname: '중복' })
      ).rejects.toThrow()
    })
  })

  describe('getMe', () => {
    it('유효한 토큰으로 내 정보를 가져온다', async () => {
      localStorage.setItem('accessToken', 'mock-token-abc')
      const user = await authClient.getMe()
      expect(user.email).toBe('test@test.com')
      expect(user.role).toBe('USER')
      localStorage.removeItem('accessToken')
    })

    it('토큰 없이 요청 시 에러를 던진다', async () => {
      localStorage.removeItem('accessToken')
      await expect(authClient.getMe()).rejects.toThrow()
    })
  })
})

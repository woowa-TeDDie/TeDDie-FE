import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { handlers } from '../handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const BASE = 'http://localhost:8080'

describe('MSW mock handlers', () => {
  describe('auth handlers', () => {
    it('POST /auth/login 올바른 자격증명으로 accessToken을 반환한다', async () => {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      })
      expect(res.ok).toBe(true)
      const data = await res.json()
      expect(data).toHaveProperty('accessToken')
      expect(typeof data.accessToken).toBe('string')
    })

    it('POST /auth/register accessToken을 반환한다', async () => {
      const res = await fetch(`${BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'new@example.com', password: 'password', nickname: 'new' }),
      })
      expect(res.status).toBe(201)
      const data = await res.json()
      expect(data).toHaveProperty('accessToken')
    })

    it('GET /auth/me 유저 정보를 반환한다', async () => {
      const res = await fetch(`${BASE}/auth/me`, {
        headers: { Authorization: 'Bearer mock-token' },
      })
      expect(res.ok).toBe(true)
      const data = await res.json()
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('email')
      expect(data).toHaveProperty('nickname')
      expect(data).toHaveProperty('role')
    })
  })

  describe('mission handlers', () => {
    it('GET /missions 페이지네이션된 미션 목록을 반환한다', async () => {
      const res = await fetch(`${BASE}/missions`)
      expect(res.ok).toBe(true)
      const data = await res.json()
      expect(data).toHaveProperty('content')
      expect(data).toHaveProperty('totalPages')
      expect(data).toHaveProperty('totalElements')
      expect(Array.isArray(data.content)).toBe(true)
    })

    it('GET /missions/:id 단건 미션을 반환한다', async () => {
      const res = await fetch(`${BASE}/missions/1`)
      expect(res.ok).toBe(true)
      const data = await res.json()
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('title')
      expect(data).toHaveProperty('difficulty')
    })
  })

  describe('generate handlers', () => {
    it('POST /generate jobId를 반환한다', async () => {
      const res = await fetch(`${BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: 'EASY', category: '문자열', language: 'Java' }),
      })
      expect(res.status).toBe(202)
      const data = await res.json()
      expect(data).toHaveProperty('jobId')
      expect(typeof data.jobId).toBe('string')
    })

    it('GET /generate/status/:jobId 생성 상태를 반환한다', async () => {
      const res = await fetch(`${BASE}/generate/status/mock-job-id`)
      expect(res.ok).toBe(true)
      const data = await res.json()
      expect(data).toHaveProperty('status')
      expect(data).toHaveProperty('missionId')
    })
  })
})

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { baseClient } from '../baseClient'

const server = setupServer()

beforeEach(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
  vi.restoreAllMocks()
})
afterAll(() => server.close())

describe('baseClient', () => {
  it('GET 요청이 올바르게 수행된다', async () => {
    server.use(
      http.get('http://localhost:8080/test', () =>
        HttpResponse.json({ message: 'ok' }),
      ),
    )
    const data = await baseClient.get<{ message: string }>('/test')
    expect(data.message).toBe('ok')
  })

  it('POST 요청이 올바르게 수행된다', async () => {
    server.use(
      http.post('http://localhost:8080/test', () =>
        HttpResponse.json({ id: 1 }, { status: 201 }),
      ),
    )
    const data = await baseClient.post<{ id: number }>('/test', { name: 'teddie' })
    expect(data.id).toBe(1)
  })

  it('localStorage에 토큰이 있으면 Authorization 헤더가 자동으로 추가된다', async () => {
    localStorage.setItem('accessToken', 'test-token')
    let capturedHeader = ''
    server.use(
      http.get('http://localhost:8080/auth-test', ({ request }) => {
        capturedHeader = request.headers.get('Authorization') ?? ''
        return HttpResponse.json({})
      }),
    )
    await baseClient.get('/auth-test')
    expect(capturedHeader).toBe('Bearer test-token')
  })

  it('토큰이 없으면 Authorization 헤더가 추가되지 않는다', async () => {
    let capturedHeader: string | null = 'initial'
    server.use(
      http.get('http://localhost:8080/no-auth', ({ request }) => {
        capturedHeader = request.headers.get('Authorization')
        return HttpResponse.json({})
      }),
    )
    await baseClient.get('/no-auth')
    expect(capturedHeader).toBeNull()
  })

  it('응답이 401이면 accessToken을 제거하고 /login으로 리다이렉트한다', async () => {
    localStorage.setItem('accessToken', 'expired-token')
    const replaceSpy = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      replace: replaceSpy,
    })
    server.use(
      http.get('http://localhost:8080/expired', () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      ),
    )
    await expect(baseClient.get('/expired')).rejects.toThrow()
    expect(localStorage.getItem('accessToken')).toBeNull()
    expect(replaceSpy).toHaveBeenCalledWith('/login')
  })

  it('네트워크 에러 시 표준화된 에러가 던져진다', async () => {
    server.use(
      http.get('http://localhost:8080/error', () => HttpResponse.error()),
    )
    await expect(baseClient.get('/error')).rejects.toThrow()
  })

  it('PATCH 요청이 올바르게 수행된다', async () => {
    server.use(
      http.patch('http://localhost:8080/test/1', () =>
        HttpResponse.json({ updated: true }),
      ),
    )
    const data = await baseClient.patch<{ updated: boolean }>('/test/1', { name: 'new' })
    expect(data.updated).toBe(true)
  })

  it('DELETE 요청이 올바르게 수행된다', async () => {
    server.use(
      http.delete('http://localhost:8080/test/1', () =>
        new HttpResponse(null, { status: 204 }),
      ),
    )
    await expect(baseClient.delete('/test/1')).resolves.not.toThrow()
  })

  it('PUT 요청이 올바르게 수행된다', async () => {
    server.use(
      http.put('http://localhost:8080/test/1', () =>
        HttpResponse.json({ replaced: true }),
      ),
    )
    const data = await baseClient.put<{ replaced: boolean }>('/test/1', { value: 'new' })
    expect(data.replaced).toBe(true)
  })
})

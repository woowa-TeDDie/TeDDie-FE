import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useGeneratePolling } from '../useGeneratePolling'
import { useGenerateStore } from '../store'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  vi.clearAllTimers()
  useGenerateStore.setState({ jobId: null, missionId: null, status: 'IDLE', error: null })
})
afterAll(() => server.close())

describe('useGeneratePolling', () => {
  it('COMPLETED 상태 응답 시 store를 COMPLETED로 업데이트한다', async () => {
    server.use(
      http.get('http://localhost:8080/generate/status/:jobId', () => {
        return HttpResponse.json({ status: 'COMPLETED', missionId: 42 })
      }),
    )

    const { result } = renderHook(() => useGeneratePolling())

    act(() => {
      result.current.startPolling('job-done')
    })

    await waitFor(() => {
      expect(useGenerateStore.getState().status).toBe('COMPLETED')
      expect(useGenerateStore.getState().missionId).toBe(42)
    })
  })

  it('FAILED 상태 응답 시 store를 FAILED로 업데이트한다', async () => {
    server.use(
      http.get('http://localhost:8080/generate/status/:jobId', () => {
        return HttpResponse.json({ status: 'FAILED', missionId: null })
      }),
    )

    const { result } = renderHook(() => useGeneratePolling())

    act(() => {
      result.current.startPolling('job-failed')
    })

    await waitFor(() => {
      expect(useGenerateStore.getState().status).toBe('FAILED')
    })
  })

  it('IN_PROGRESS 상태에서 계속 폴링한다', async () => {
    let callCount = 0
    server.use(
      http.get('http://localhost:8080/generate/status/:jobId', () => {
        callCount++
        if (callCount >= 3) {
          return HttpResponse.json({ status: 'COMPLETED', missionId: 1 })
        }
        return HttpResponse.json({ status: 'IN_PROGRESS', missionId: null })
      }),
    )

    const { result } = renderHook(() => useGeneratePolling({ intervalMs: 100 }))

    act(() => {
      result.current.startPolling('job-progress')
    })

    await waitFor(() => {
      expect(useGenerateStore.getState().status).toBe('COMPLETED')
      expect(callCount).toBeGreaterThanOrEqual(3)
    }, { timeout: 2000 })
  })
})

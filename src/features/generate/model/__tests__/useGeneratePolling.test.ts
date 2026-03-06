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

  it('훅 리렌더링 후에도 store 액션이 올바르게 동작한다', async () => {
    server.use(
      http.get('http://localhost:8080/generate/status/:jobId', () => {
        return HttpResponse.json({ status: 'COMPLETED', missionId: 99 })
      }),
    )

    const { result, rerender } = renderHook(() => useGeneratePolling())

    // 리렌더링 후에도 동작해야 한다
    rerender()

    act(() => {
      result.current.startPolling('job-rerender')
    })

    await waitFor(() => {
      expect(useGenerateStore.getState().status).toBe('COMPLETED')
      expect(useGenerateStore.getState().missionId).toBe(99)
    })
  })

  it('stopPolling 호출 시 타이머가 정리되어 추가 폴링이 발생하지 않는다', async () => {
    let callCount = 0
    server.use(
      http.get('http://localhost:8080/generate/status/:jobId', () => {
        callCount++
        return HttpResponse.json({ status: 'IN_PROGRESS', missionId: null })
      }),
    )

    const { result } = renderHook(() => useGeneratePolling({ intervalMs: 100 }))

    act(() => {
      result.current.startPolling('job-stop-test')
    })

    // 첫 번째 폴링 호출이 완료될 때까지 대기
    await waitFor(() => expect(callCount).toBeGreaterThanOrEqual(1))

    // 폴링 중단
    act(() => {
      result.current.stopPolling()
    })

    const countAfterStop = callCount

    // interval(100ms)의 4배 이상 대기 → 타이머가 살아있으면 추가 호출이 발생해야 함
    await new Promise<void>((resolve) => setTimeout(resolve, 400))

    // stopPolling 이후 추가 호출이 없어야 한다
    expect(callCount).toBe(countAfterStop)
  })
})

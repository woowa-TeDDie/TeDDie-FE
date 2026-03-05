import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useGenerateStore } from '../store'

beforeEach(() => {
  useGenerateStore.setState({ jobId: null, missionId: null, status: 'IDLE', error: null })
})

describe('useGenerateStore', () => {
  it('초기 상태는 IDLE이다', () => {
    const { result } = renderHook(() => useGenerateStore())
    expect(result.current.status).toBe('IDLE')
    expect(result.current.jobId).toBeNull()
    expect(result.current.missionId).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('setJobId로 jobId와 상태를 IN_PROGRESS로 변경한다', () => {
    const { result } = renderHook(() => useGenerateStore())
    act(() => {
      result.current.setJobId('job-abc-123')
    })
    expect(result.current.jobId).toBe('job-abc-123')
    expect(result.current.status).toBe('IN_PROGRESS')
  })

  it('setCompleted로 missionId와 상태를 COMPLETED로 변경한다', () => {
    const { result } = renderHook(() => useGenerateStore())
    act(() => {
      result.current.setCompleted(42)
    })
    expect(result.current.missionId).toBe(42)
    expect(result.current.status).toBe('COMPLETED')
  })

  it('setFailed로 에러 메시지와 상태를 FAILED로 변경한다', () => {
    const { result } = renderHook(() => useGenerateStore())
    act(() => {
      result.current.setFailed('생성에 실패했습니다')
    })
    expect(result.current.error).toBe('생성에 실패했습니다')
    expect(result.current.status).toBe('FAILED')
  })

  it('reset으로 초기 상태로 돌아간다', () => {
    const { result } = renderHook(() => useGenerateStore())
    act(() => {
      result.current.setJobId('job-abc-123')
    })
    act(() => {
      result.current.reset()
    })
    expect(result.current.status).toBe('IDLE')
    expect(result.current.jobId).toBeNull()
  })
})

import { useRef, useCallback } from 'react'
import { generateClient } from '@/shared/api/generateClient'
import { useGenerateStore } from './store'

interface PollingOptions {
  intervalMs?: number
}

export function useGeneratePolling({ intervalMs = 2000 }: PollingOptions = {}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { setCompleted, setFailed } = useGenerateStore.getState()

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const poll = useCallback(async (jobId: string) => {
    try {
      const { status, missionId } = await generateClient.getGenerateStatus(jobId)
      if (status === 'COMPLETED' && missionId !== null) {
        stopPolling()
        setCompleted(missionId)
        return
      }
      if (status === 'FAILED') {
        stopPolling()
        setFailed('미션 생성에 실패했습니다')
        return
      }
      timerRef.current = setTimeout(() => poll(jobId), intervalMs)
    } catch {
      stopPolling()
      setFailed('상태 확인 중 오류가 발생했습니다')
    }
  }, [intervalMs, stopPolling, setCompleted, setFailed])

  const startPolling = useCallback((jobId: string) => {
    stopPolling()
    poll(jobId)
  }, [poll, stopPolling])

  return { startPolling, stopPolling }
}

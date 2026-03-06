import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGenerateStore } from '@/features/generate'
import { useGeneratePolling } from '@/features/generate'
import { Spinner } from '@/shared/ui/Spinner'
import { Button } from '@/shared/ui/Button'

export function GenerateLoadingPage() {
  const navigate = useNavigate()
  const { jobId } = useParams<{ jobId: string }>()
  const { startPolling, stopPolling } = useGeneratePolling({ intervalMs: 2000 })
  const status = useGenerateStore((s) => s.status)
  const missionId = useGenerateStore((s) => s.missionId)
  const error = useGenerateStore((s) => s.error)
  const reset = useGenerateStore((s) => s.reset)

  useEffect(() => {
    if (!jobId) return
    startPolling(jobId)
    return () => stopPolling()
  }, [jobId])

  useEffect(() => {
    if (status === 'COMPLETED' && missionId !== null) {
      navigate(`/missions/${missionId}`, { replace: true })
    }
  }, [status, missionId, navigate])

  if (status === 'FAILED') {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <p role="alert" className="text-danger text-lg">
            {error ?? '미션 생성에 실패했습니다.'}
          </p>
          <Button
            onClick={() => {
              reset()
              navigate('/generate')
            }}
          >
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <Spinner size="lg" />
        <p className="text-text-muted text-lg">미션을 생성하고 있습니다...</p>
        <p className="text-text-muted text-sm">잠시만 기다려 주세요</p>
      </div>
    </div>
  )
}

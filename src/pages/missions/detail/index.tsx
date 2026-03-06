import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { missionClient, type Mission } from '@/shared/api/missionClient'
import { MissionViewer } from '@/widgets/mission-viewer'
import { Spinner } from '@/shared/ui/Spinner'

export function MissionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [mission, setMission] = useState<Mission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    missionClient
      .getMission(Number(id))
      .then(setMission)
      .catch(() => setError('미션을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <Spinner role="status" size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <p role="alert" className="text-danger">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-dark px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {mission && <MissionViewer mission={mission} />}
      </div>
    </div>
  )
}

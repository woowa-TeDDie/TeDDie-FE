import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { baseClient } from '@/shared/api/baseClient'
import { type Mission, type MissionPage } from '@/shared/api/missionClient'
import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'
import { Spinner } from '@/shared/ui/Spinner'

export function MyMissionsPage() {
  const navigate = useNavigate()
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    baseClient
      .get<MissionPage>('/my/missions')
      .then((data) => setMissions(data.content))
      .catch(() => setError('미션 목록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-bg-dark px-4 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-primary">내 미션</h1>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner role="status" size="lg" />
          </div>
        )}

        {error && (
          <p role="alert" className="text-danger text-sm">{error}</p>
        )}

        {!isLoading && !error && (
          <ul className="flex flex-col gap-4">
            {missions.map((mission) => (
              <li key={mission.id}>
                <Card
                  hover
                  onClick={() => navigate(`/missions/${mission.id}`)}
                  className="flex flex-col gap-3"
                >
                  <p className="text-text-primary font-semibold text-lg">{mission.title}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={mission.difficulty === 'EASY' ? 'success' : mission.difficulty === 'MEDIUM' ? 'warning' : 'danger'}>
                      {mission.difficulty}
                    </Badge>
                    <Badge variant="default">{mission.category}</Badge>
                    <Badge variant="brand">{mission.language}</Badge>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

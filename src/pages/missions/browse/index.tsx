import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { missionClient, type Mission } from '@/shared/api/missionClient'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Spinner } from '@/shared/ui/Spinner'

export function MissionBrowsePage() {
  const navigate = useNavigate()
  const [missions, setMissions] = useState<Mission[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsLoading(true)
    setError('')
    missionClient
      .getMissions({ page })
      .then((data) => {
        setMissions(data.content)
        setTotalPages(data.totalPages)
      })
      .catch(() => setError('미션 목록을 불러오지 못했습니다.'))
      .finally(() => setIsLoading(false))
  }, [page])

  return (
    <div className="min-h-screen bg-bg-dark px-4 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-primary">미션 목록</h1>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner role="status" size="lg" />
          </div>
        )}

        {error && (
          <p role="alert" className="text-danger text-sm">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <>
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

            <div className="flex justify-center gap-3">
              <Button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                이전
              </Button>
              <span className="text-text-muted self-center text-sm">
                {page + 1} / {totalPages}
              </span>
              <Button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                다음
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

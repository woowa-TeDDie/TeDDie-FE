import ReactMarkdown from 'react-markdown'
import { Badge } from '@/shared/ui/Badge'
import type { Mission, Difficulty } from '@/shared/api/missionClient'

interface MissionViewerProps {
  mission: Mission
}

type BadgeVariant = 'success' | 'warning' | 'danger'

const difficultyVariant: Record<Difficulty, BadgeVariant> = {
  EASY: 'success',
  MEDIUM: 'warning',
  HARD: 'danger',
}

export function MissionViewer({ mission }: MissionViewerProps) {
  const { title, description, difficulty, category, language } = mission

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        <div className="flex flex-wrap gap-2">
          <Badge variant={difficultyVariant[difficulty]}>{difficulty}</Badge>
          <Badge variant="default">{category}</Badge>
          <Badge variant="brand">{language}</Badge>
        </div>
      </div>

      <div className="prose prose-invert max-w-none text-text-primary">
        <ReactMarkdown>{description}</ReactMarkdown>
      </div>
    </div>
  )
}

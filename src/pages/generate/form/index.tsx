import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateClient, type Difficulty } from '@/shared/api/generateClient'
import { useGenerateStore } from '@/features/generate'
import { Button } from '@/shared/ui/Button'

const DIFFICULTIES: Difficulty[] = ['EASY', 'MEDIUM', 'HARD']
const CATEGORIES = ['OOP', 'FP', '자료구조', '알고리즘', '디자인패턴', '리팩토링']
const LANGUAGES = ['Java', 'JavaScript', 'TypeScript', 'Kotlin', 'Python']

export function GenerateFormPage() {
  const navigate = useNavigate()
  const setJobId = useGenerateStore((s) => s.setJobId)

  const [difficulty, setDifficulty] = useState<Difficulty>('EASY')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const { jobId } = await generateClient.generate({ difficulty, category, language })
      setJobId(jobId)
      navigate(`/generate/${jobId}`)
    } catch {
      setError('미션 생성에 실패했습니다. 다시 시도해 주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectClass =
    'w-full rounded-md border border-border-subtle bg-surface px-3 py-2 text-text-primary ' +
    'focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-colors duration-200'

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-text-primary text-center mb-8">미션 생성</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="difficulty" className="text-sm font-medium text-text-secondary">
              난이도
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={selectClass}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-sm font-medium text-text-secondary">
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={selectClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="language" className="text-sm font-medium text-text-secondary">
              언어
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={selectClass}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}

          <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? '생성 중...' : '미션 생성'}
          </Button>
        </form>
      </div>
    </div>
  )
}

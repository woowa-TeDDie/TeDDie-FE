import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MissionViewer } from '../MissionViewer'
import type { Mission } from '@/shared/api/missionClient'

const baseMission: Mission = {
  id: 1,
  title: '자동차 경주 게임',
  description: '## 미션 설명\n자동차 경주 게임을 구현한다.',
  difficulty: 'MEDIUM',
  category: 'OOP',
  language: 'Java',
  createdAt: '2026-03-05T00:00:00Z',
}

describe('MissionViewer', () => {
  it('미션 제목을 렌더링한다', () => {
    render(<MissionViewer mission={baseMission} />)
    expect(screen.getByText('자동차 경주 게임')).toBeInTheDocument()
  })

  it('카테고리와 언어를 렌더링한다', () => {
    render(<MissionViewer mission={baseMission} />)
    expect(screen.getByText('OOP')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
  })

  it('난이도 배지를 렌더링한다', () => {
    render(<MissionViewer mission={baseMission} />)
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  it('EASY 난이도는 success 스타일을 적용한다', () => {
    const mission = { ...baseMission, difficulty: 'EASY' as const }
    render(<MissionViewer mission={mission} />)
    const badge = screen.getByText('EASY')
    expect(badge.className).toContain('bg-success')
  })

  it('MEDIUM 난이도는 warning 스타일을 적용한다', () => {
    render(<MissionViewer mission={baseMission} />)
    const badge = screen.getByText('MEDIUM')
    expect(badge.className).toContain('bg-warning')
  })

  it('HARD 난이도는 danger 스타일을 적용한다', () => {
    const mission = { ...baseMission, difficulty: 'HARD' as const }
    render(<MissionViewer mission={mission} />)
    const badge = screen.getByText('HARD')
    expect(badge.className).toContain('bg-danger')
  })

  it('description을 마크다운으로 렌더링한다', async () => {
    render(<MissionViewer mission={baseMission} />)
    expect(await screen.findByText('미션 설명')).toBeInTheDocument()
    expect(await screen.findByText('자동차 경주 게임을 구현한다.')).toBeInTheDocument()
  })
})

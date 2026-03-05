import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { missionClient } from '../missionClient'

const mockMission = {
  id: 1,
  title: '자동차 경주 게임',
  description: '## 미션 설명\n자동차 경주 게임을 구현한다.',
  difficulty: 'MEDIUM',
  category: 'OOP',
  language: 'Java',
  createdAt: '2026-03-05T00:00:00Z',
}

const server = setupServer(
  http.post('http://localhost:8080/generate', () => {
    return HttpResponse.json({ jobId: 'job-abc-123' }, { status: 202 })
  }),

  http.get('http://localhost:8080/generate/status/:jobId', ({ params }) => {
    if (params.jobId === 'job-done') {
      return HttpResponse.json({ status: 'COMPLETED', missionId: 1 }, { status: 200 })
    }
    if (params.jobId === 'job-failed') {
      return HttpResponse.json({ status: 'FAILED', missionId: null }, { status: 200 })
    }
    return HttpResponse.json({ status: 'IN_PROGRESS', missionId: null }, { status: 200 })
  }),

  http.get('http://localhost:8080/missions/:id', ({ params }) => {
    if (params.id === '1') {
      return HttpResponse.json(mockMission, { status: 200 })
    }
    return HttpResponse.json({ message: '미션을 찾을 수 없습니다' }, { status: 404 })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('missionClient', () => {
  describe('generate', () => {
    it('미션 생성 요청 시 jobId를 반환한다', async () => {
      const result = await missionClient.generate({ difficulty: 'MEDIUM', category: 'OOP', language: 'Java' })
      expect(result.jobId).toBe('job-abc-123')
    })
  })

  describe('getGenerateStatus', () => {
    it('완료 상태일 때 COMPLETED와 missionId를 반환한다', async () => {
      const result = await missionClient.getGenerateStatus('job-done')
      expect(result.status).toBe('COMPLETED')
      expect(result.missionId).toBe(1)
    })

    it('진행 중 상태일 때 IN_PROGRESS를 반환한다', async () => {
      const result = await missionClient.getGenerateStatus('job-abc-123')
      expect(result.status).toBe('IN_PROGRESS')
    })

    it('실패 상태일 때 FAILED를 반환한다', async () => {
      const result = await missionClient.getGenerateStatus('job-failed')
      expect(result.status).toBe('FAILED')
    })
  })

  describe('getMission', () => {
    it('미션 ID로 미션 상세를 조회한다', async () => {
      const result = await missionClient.getMission(1)
      expect(result.title).toBe('자동차 경주 게임')
      expect(result.difficulty).toBe('MEDIUM')
    })

    it('존재하지 않는 미션 조회 시 에러를 던진다', async () => {
      await expect(missionClient.getMission(999)).rejects.toThrow()
    })
  })
})

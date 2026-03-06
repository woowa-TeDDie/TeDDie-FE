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
  http.get('http://localhost:8080/missions', ({ request }) => {
    const url = new URL(request.url)
    const page = url.searchParams.get('page') ?? '0'
    return HttpResponse.json({
      content: [mockMission],
      totalPages: 3,
      totalElements: 25,
      number: Number(page),
    }, { status: 200 })
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
  describe('getMissions', () => {
    it('미션 목록을 페이지 단위로 조회한다', async () => {
      const result = await missionClient.getMissions({ page: 0 })
      expect(result.content).toHaveLength(1)
      expect(result.content[0].title).toBe('자동차 경주 게임')
      expect(result.totalPages).toBe(3)
      expect(result.totalElements).toBe(25)
    })

    it('page 파라미터를 쿼리스트링으로 전달한다', async () => {
      const result = await missionClient.getMissions({ page: 2 })
      expect(result.number).toBe(2)
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

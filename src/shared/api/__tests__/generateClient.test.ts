import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { generateClient } from '../generateClient'

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
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('generateClient', () => {
  describe('generate', () => {
    it('미션 생성 요청 시 jobId를 반환한다', async () => {
      const result = await generateClient.generate({
        difficulty: 'MEDIUM',
        category: 'OOP',
        language: 'Java',
      })
      expect(result.jobId).toBe('job-abc-123')
    })
  })

  describe('getGenerateStatus', () => {
    it('완료 상태일 때 COMPLETED와 missionId를 반환한다', async () => {
      const result = await generateClient.getGenerateStatus('job-done')
      expect(result.status).toBe('COMPLETED')
      expect(result.missionId).toBe(1)
    })

    it('진행 중 상태일 때 IN_PROGRESS를 반환한다', async () => {
      const result = await generateClient.getGenerateStatus('job-abc-123')
      expect(result.status).toBe('IN_PROGRESS')
    })

    it('실패 상태일 때 FAILED를 반환한다', async () => {
      const result = await generateClient.getGenerateStatus('job-failed')
      expect(result.status).toBe('FAILED')
    })
  })
})

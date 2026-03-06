import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useGenerateStore } from '@/features/generate'
import { GenerateLoadingPage } from '../index'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  mockNavigate.mockReset()
  useGenerateStore.setState({ jobId: null, missionId: null, status: 'IDLE', error: null })
  vi.clearAllTimers()
})
afterAll(() => server.close())

function renderPage(jobId = 'job-abc') {
  return render(
    <MemoryRouter initialEntries={[`/generate/${jobId}`]}>
      <Routes>
        <Route path="/generate/:jobId" element={<GenerateLoadingPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('GenerateLoadingPage', () => {
  it('로딩 스피너와 안내 메시지를 렌더링한다', () => {
    server.use(
      http.get('http://localhost:8080/generate/status/job-abc', () =>
        HttpResponse.json({ status: 'IN_PROGRESS', missionId: null }),
      ),
    )
    renderPage()
    expect(screen.getByText(/미션을 생성하고 있습니다/)).toBeInTheDocument()
  })

  it('폴링 완료 시 /missions/:id 로 이동한다', async () => {
    server.use(
      http.get('http://localhost:8080/generate/status/job-abc', () =>
        HttpResponse.json({ status: 'COMPLETED', missionId: 42 }),
      ),
    )
    renderPage()
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/missions/42', { replace: true }),
    )
  })

  it('폴링 실패 시 에러 메시지를 표시한다', async () => {
    server.use(
      http.get('http://localhost:8080/generate/status/job-abc', () =>
        HttpResponse.json({ status: 'FAILED', missionId: null }),
      ),
    )
    renderPage()
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument(),
    )
  })

  it('에러 발생 시 다시 시도 버튼이 렌더링된다', async () => {
    server.use(
      http.get('http://localhost:8080/generate/status/job-abc', () =>
        HttpResponse.json({ status: 'FAILED', missionId: null }),
      ),
    )
    renderPage()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument(),
    )
  })
})

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { MissionDetailPage } from '../index'

const mockMission = {
  id: 1,
  title: '자동차 경주 게임',
  description: '## 요구사항\n자동차 경주 게임을 구현한다.',
  difficulty: 'MEDIUM',
  category: 'OOP',
  language: 'Java',
  createdAt: '2026-03-01T00:00:00Z',
}

const server = setupServer(
  http.get('http://localhost:8080/missions/:id', ({ params }) => {
    if (params.id === '1') return HttpResponse.json(mockMission)
    return HttpResponse.json({ message: '미션을 찾을 수 없습니다' }, { status: 404 })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPage(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/missions/${id}`]}>
      <Routes>
        <Route path="/missions/:id" element={<MissionDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('MissionDetailPage', () => {
  it('로딩 중 스피너를 표시한다', () => {
    renderPage()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('미션 제목을 렌더링한다', async () => {
    renderPage()
    expect(await screen.findByText('자동차 경주 게임')).toBeInTheDocument()
  })

  it('미션 설명을 마크다운으로 렌더링한다', async () => {
    renderPage()
    expect(await screen.findByText('요구사항')).toBeInTheDocument()
  })

  it('난이도·카테고리·언어 배지를 렌더링한다', async () => {
    renderPage()
    expect(await screen.findByText('MEDIUM')).toBeInTheDocument()
    expect(await screen.findByText('OOP')).toBeInTheDocument()
    expect(await screen.findByText('Java')).toBeInTheDocument()
  })

  it('API 실패 시 에러 메시지를 표시한다', async () => {
    renderPage('999')
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument(),
    )
  })
})

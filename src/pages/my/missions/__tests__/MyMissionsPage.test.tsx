import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useAuthStore } from '@/features/auth'
import { MyMissionsPage } from '../index'

const mockMissions = [
  { id: 1, title: '자동차 경주 게임', description: '설명1', difficulty: 'EASY', category: 'OOP', language: 'Java', createdAt: '2026-03-01T00:00:00Z' },
  { id: 2, title: '로또 번호 생성기', description: '설명2', difficulty: 'MEDIUM', category: 'FP', language: 'JavaScript', createdAt: '2026-03-02T00:00:00Z' },
]

const server = setupServer(
  http.get('http://localhost:8080/my/missions', () => {
    return HttpResponse.json({
      content: mockMissions,
      totalPages: 1,
      totalElements: 2,
      number: 0,
    })
  }),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  useAuthStore.setState({ user: null, accessToken: null, isLoading: false })
})
afterAll(() => server.close())

function renderPage() {
  useAuthStore.setState({
    user: { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
    accessToken: 'mock-token',
    isLoading: false,
  })
  return render(
    <MemoryRouter>
      <MyMissionsPage />
    </MemoryRouter>,
  )
}

describe('MyMissionsPage', () => {
  it('페이지 제목이 렌더링된다', async () => {
    renderPage()
    expect(await screen.findByText('내 미션')).toBeInTheDocument()
  })

  it('내 미션 목록을 카드 형태로 렌더링한다', async () => {
    renderPage()
    expect(await screen.findByText('자동차 경주 게임')).toBeInTheDocument()
    expect(await screen.findByText('로또 번호 생성기')).toBeInTheDocument()
  })

  it('로딩 중 스피너를 표시한다', () => {
    renderPage()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('API 실패 시 에러 메시지를 표시한다', async () => {
    server.use(
      http.get('http://localhost:8080/my/missions', () =>
        HttpResponse.json({ message: '서버 오류' }, { status: 500 }),
      ),
    )
    renderPage()
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument(),
    )
  })
})

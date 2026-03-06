import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { MissionBrowsePage } from '../index'

const mockMissions = [
  { id: 1, title: '자동차 경주 게임', description: '설명1', difficulty: 'EASY', category: 'OOP', language: 'Java', createdAt: '2026-03-01T00:00:00Z' },
  { id: 2, title: '로또 번호 생성기', description: '설명2', difficulty: 'MEDIUM', category: 'FP', language: 'JavaScript', createdAt: '2026-03-02T00:00:00Z' },
]

const server = setupServer(
  http.get('http://localhost:8080/missions', () => {
    return HttpResponse.json({
      content: mockMissions,
      totalPages: 2,
      totalElements: 10,
      number: 0,
    })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderPage() {
  return render(
    <MemoryRouter>
      <MissionBrowsePage />
    </MemoryRouter>,
  )
}

describe('MissionBrowsePage', () => {
  it('페이지 제목이 렌더링된다', async () => {
    renderPage()
    expect(await screen.findByText('미션 목록')).toBeInTheDocument()
  })

  it('미션 목록을 불러와 카드 형태로 렌더링한다', async () => {
    renderPage()
    expect(await screen.findByText('자동차 경주 게임')).toBeInTheDocument()
    expect(await screen.findByText('로또 번호 생성기')).toBeInTheDocument()
  })

  it('각 미션 카드에 난이도·카테고리·언어 배지가 표시된다', async () => {
    renderPage()
    expect(await screen.findByText('EASY')).toBeInTheDocument()
    expect(await screen.findByText('OOP')).toBeInTheDocument()
    expect(await screen.findByText('Java')).toBeInTheDocument()
  })

  it('로딩 중 스피너를 표시한다', () => {
    renderPage()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('API 실패 시 에러 메시지를 표시한다', async () => {
    server.use(
      http.get('http://localhost:8080/missions', () =>
        HttpResponse.json({ message: '서버 오류' }, { status: 500 }),
      ),
    )
    renderPage()
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument(),
    )
  })

  it('다음 페이지 버튼 클릭 시 다음 페이지를 불러온다', async () => {
    server.use(
      http.get('http://localhost:8080/missions', ({ request }) => {
        const page = new URL(request.url).searchParams.get('page') ?? '0'
        return HttpResponse.json({
          content: page === '1'
            ? [{ id: 3, title: '블랙잭 게임', description: '설명3', difficulty: 'HARD', category: '알고리즘', language: 'Kotlin', createdAt: '2026-03-03T00:00:00Z' }]
            : mockMissions,
          totalPages: 2,
          totalElements: 10,
          number: Number(page),
        })
      }),
    )
    renderPage()
    await screen.findByText('자동차 경주 게임')
    await userEvent.click(screen.getByRole('button', { name: '다음' }))
    expect(await screen.findByText('블랙잭 게임')).toBeInTheDocument()
  })
})

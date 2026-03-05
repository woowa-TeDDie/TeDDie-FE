import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useGenerateStore } from '@/features/generate'
import { GenerateFormPage } from '../index'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const server = setupServer(
  http.post('http://localhost:8080/generate', () => {
    return HttpResponse.json({ jobId: 'test-job-123' }, { status: 200 })
  }),
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  mockNavigate.mockReset()
  useGenerateStore.setState({ jobId: null, missionId: null, status: 'IDLE', error: null })
})
afterAll(() => server.close())

function renderPage() {
  return render(
    <MemoryRouter>
      <GenerateFormPage />
    </MemoryRouter>,
  )
}

describe('GenerateFormPage', () => {
  it('난이도·카테고리·언어 선택 필드와 생성 버튼이 렌더링된다', () => {
    renderPage()
    expect(screen.getByLabelText('난이도')).toBeInTheDocument()
    expect(screen.getByLabelText('카테고리')).toBeInTheDocument()
    expect(screen.getByLabelText('언어')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '미션 생성' })).toBeInTheDocument()
  })

  it('폼 제출 시 generate API를 호출하고 jobId를 스토어에 저장한다', async () => {
    renderPage()
    await userEvent.selectOptions(screen.getByLabelText('난이도'), 'EASY')
    await userEvent.selectOptions(screen.getByLabelText('카테고리'), 'OOP')
    await userEvent.selectOptions(screen.getByLabelText('언어'), 'Java')
    await userEvent.click(screen.getByRole('button', { name: '미션 생성' }))
    await waitFor(() =>
      expect(useGenerateStore.getState().jobId).toBe('test-job-123'),
    )
  })

  it('생성 요청 성공 시 /generate/:jobId 로 이동한다', async () => {
    renderPage()
    await userEvent.selectOptions(screen.getByLabelText('난이도'), 'EASY')
    await userEvent.selectOptions(screen.getByLabelText('카테고리'), 'OOP')
    await userEvent.selectOptions(screen.getByLabelText('언어'), 'Java')
    await userEvent.click(screen.getByRole('button', { name: '미션 생성' }))
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith('/generate/test-job-123'),
    )
  })

  it('API 실패 시 에러 메시지를 표시한다', async () => {
    server.use(
      http.post('http://localhost:8080/generate', () => {
        return HttpResponse.json({ message: '서버 오류' }, { status: 500 })
      }),
    )
    renderPage()
    await userEvent.selectOptions(screen.getByLabelText('난이도'), 'EASY')
    await userEvent.selectOptions(screen.getByLabelText('카테고리'), 'OOP')
    await userEvent.selectOptions(screen.getByLabelText('언어'), 'Java')
    await userEvent.click(screen.getByRole('button', { name: '미션 생성' }))
    await waitFor(() =>
      expect(screen.getByRole('alert')).toBeInTheDocument(),
    )
  })

  it('로딩 중에는 버튼이 비활성화된다', async () => {
    server.use(
      http.post('http://localhost:8080/generate', async () => {
        await new Promise((r) => setTimeout(r, 100))
        return HttpResponse.json({ jobId: 'test-job-123' }, { status: 200 })
      }),
    )
    renderPage()
    await userEvent.selectOptions(screen.getByLabelText('난이도'), 'EASY')
    await userEvent.selectOptions(screen.getByLabelText('카테고리'), 'OOP')
    await userEvent.selectOptions(screen.getByLabelText('언어'), 'Java')
    await userEvent.click(screen.getByRole('button', { name: '미션 생성' }))
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

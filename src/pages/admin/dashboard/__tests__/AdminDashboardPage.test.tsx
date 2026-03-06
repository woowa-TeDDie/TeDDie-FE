import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminDashboardPage } from '../index'

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminDashboardPage />
    </MemoryRouter>,
  )
}

describe('AdminDashboardPage', () => {
  it('페이지 제목을 렌더링한다', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: '대시보드' })).toBeInTheDocument()
  })

  it('Admin 패널 사이드바를 포함한다', () => {
    renderPage()
    expect(screen.getByText('Admin 패널')).toBeInTheDocument()
  })

  it('요약 통계 카드를 렌더링한다', () => {
    renderPage()
    expect(screen.getByText('총 미션')).toBeInTheDocument()
    expect(screen.getByText('총 유저')).toBeInTheDocument()
    expect(screen.getByText('오늘 생성')).toBeInTheDocument()
  })
})

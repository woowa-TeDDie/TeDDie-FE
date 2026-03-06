import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminAiPage } from '../index'

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminAiPage />
    </MemoryRouter>,
  )
}

describe('AdminAiPage', () => {
  it('페이지 제목을 렌더링한다', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'AI 관리' })).toBeInTheDocument()
  })

  it('Admin 패널 사이드바를 포함한다', () => {
    renderPage()
    expect(screen.getByText('Admin 패널')).toBeInTheDocument()
  })
})

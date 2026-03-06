import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminMissionsPage } from '../index'

function renderPage() {
  return render(
    <MemoryRouter>
      <AdminMissionsPage />
    </MemoryRouter>,
  )
}

describe('AdminMissionsPage', () => {
  it('페이지 제목을 렌더링한다', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: '미션 관리' })).toBeInTheDocument()
  })

  it('Admin 패널 사이드바를 포함한다', () => {
    renderPage()
    expect(screen.getByText('Admin 패널')).toBeInTheDocument()
  })
})

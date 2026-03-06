import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AdminLayout } from '../AdminLayout'

function renderLayout(children = <div>페이지 내용</div>) {
  return render(
    <MemoryRouter>
      <AdminLayout>{children}</AdminLayout>
    </MemoryRouter>,
  )
}

describe('AdminLayout', () => {
  it('Admin 패널 헤딩을 렌더링한다', () => {
    renderLayout()
    expect(screen.getByText('Admin 패널')).toBeInTheDocument()
  })

  it('사이드바 네비게이션 메뉴 항목을 렌더링한다', () => {
    renderLayout()
    expect(screen.getByText('대시보드')).toBeInTheDocument()
    expect(screen.getByText('통계')).toBeInTheDocument()
    expect(screen.getByText('미션')).toBeInTheDocument()
    expect(screen.getByText('유저')).toBeInTheDocument()
    expect(screen.getByText('커뮤니티')).toBeInTheDocument()
    expect(screen.getByText('AI')).toBeInTheDocument()
    expect(screen.getByText('DB')).toBeInTheDocument()
    expect(screen.getByText('로그')).toBeInTheDocument()
    expect(screen.getByText('설정')).toBeInTheDocument()
  })

  it('자식 컴포넌트를 렌더링한다', () => {
    renderLayout(<div>페이지 내용</div>)
    expect(screen.getByText('페이지 내용')).toBeInTheDocument()
  })

  it('각 메뉴 항목이 올바른 href를 가진다', () => {
    renderLayout()
    expect(screen.getByRole('link', { name: '대시보드' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: '통계' })).toHaveAttribute('href', '/admin/stats')
    expect(screen.getByRole('link', { name: '미션' })).toHaveAttribute('href', '/admin/missions')
    expect(screen.getByRole('link', { name: '유저' })).toHaveAttribute('href', '/admin/users')
  })
})

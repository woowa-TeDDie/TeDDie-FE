import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LandingPage } from '../index'

function renderLandingPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )
}

describe('LandingPage', () => {
  it('TeDDie 브랜드명이 표시된다', () => {
    renderLandingPage()
    expect(screen.getAllByText('TeDDie').length).toBeGreaterThanOrEqual(1)
  })

  it('메인 헤드라인이 표시된다', () => {
    renderLandingPage()
    expect(screen.getByText(/AI로 만드는/)).toBeInTheDocument()
    expect(screen.getByText(/나만의 우테코 미션/)).toBeInTheDocument()
  })

  it('미션 생성하기 버튼이 /generate 링크를 가진다', () => {
    renderLandingPage()
    const link = screen.getByRole('link', { name: /미션 생성하기/ })
    expect(link).toHaveAttribute('href', '/generate')
  })

  it('로그인 버튼이 /login 링크를 가진다', () => {
    renderLandingPage()
    const link = screen.getByRole('link', { name: /로그인/ })
    expect(link).toHaveAttribute('href', '/login')
  })

  it('주요 기능 섹션이 표시된다', () => {
    renderLandingPage()
    expect(screen.getByText('주요 기능')).toBeInTheDocument()
    expect(screen.getByText('RAG 기반 학습')).toBeInTheDocument()
    expect(screen.getByText('원클릭 생성')).toBeInTheDocument()
    expect(screen.getByText('JUnit 테스트 포함')).toBeInTheDocument()
  })

  it('CTA 섹션이 표시된다', () => {
    renderLandingPage()
    expect(screen.getByText('지금 바로 미션을 시작하세요')).toBeInTheDocument()
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '../store'
import { act, renderHook } from '@testing-library/react'

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({ user: null, accessToken: null, isLoading: false })
})

describe('useAuthStore', () => {
  it('초기 상태는 비로그인이다', () => {
    const { result } = renderHook(() => useAuthStore())
    expect(result.current.user).toBeNull()
    expect(result.current.accessToken).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('setAuth로 유저와 토큰을 저장하고 localStorage에도 기록한다', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.setAuth(
        { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
        'token-abc',
      )
    })
    expect(result.current.user?.email).toBe('test@test.com')
    expect(result.current.accessToken).toBe('token-abc')
    expect(localStorage.getItem('accessToken')).toBe('token-abc')
  })

  it('logout으로 상태와 localStorage를 초기화한다', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.setAuth(
        { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
        'token-abc',
      )
    })
    act(() => {
      result.current.logout()
    })
    expect(result.current.user).toBeNull()
    expect(result.current.accessToken).toBeNull()
    expect(localStorage.getItem('accessToken')).toBeNull()
  })

  it('isAdmin은 role이 ADMIN일 때만 true를 반환한다', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.setAuth(
        { id: 2, email: 'admin@test.com', nickname: '관리자', role: 'ADMIN' },
        'admin-token',
      )
    })
    expect(result.current.isAdmin()).toBe(true)
  })

  it('isLoggedIn은 accessToken이 있을 때 true를 반환한다', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.setAuth(
        { id: 1, email: 'test@test.com', nickname: '테스터', role: 'USER' },
        'token-abc',
      )
    })
    expect(result.current.isLoggedIn()).toBe(true)
  })
})

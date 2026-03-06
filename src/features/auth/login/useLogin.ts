import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authClient } from '@/shared/api/authClient'
import { useAuthStore } from '@/features/auth'

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>
  isLoading: boolean
  error: string
}

export function useLogin(): UseLoginReturn {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(email: string, password: string): Promise<void> {
    setError('')
    setIsLoading(true)
    try {
      const { accessToken } = await authClient.login({ email, password })
      // 토큰을 먼저 localStorage에 저장해야 getMe 호출 시 Authorization 헤더가 전송된다
      localStorage.setItem('accessToken', accessToken)
      const user = await authClient.getMe()
      setAuth(user, accessToken)
      navigate('/missions')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

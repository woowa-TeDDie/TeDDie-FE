import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authClient } from '@/shared/api/authClient'
import { useAuthStore } from '@/features/auth'

interface UseRegisterReturn {
  register: (email: string, nickname: string, password: string) => Promise<void>
  isLoading: boolean
  error: string
}

export function useRegister(): UseRegisterReturn {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function register(email: string, nickname: string, password: string): Promise<void> {
    setError('')
    setIsLoading(true)
    try {
      const { accessToken } = await authClient.register({ email, nickname, password })
      // 토큰을 먼저 localStorage에 저장해야 getMe 호출 시 Authorization 헤더가 전송된다
      localStorage.setItem('accessToken', accessToken)
      const user = await authClient.getMe()
      setAuth(user, accessToken)
      navigate('/missions')
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}

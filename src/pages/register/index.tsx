import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authClient } from '@/shared/api/authClient'
import { useAuthStore } from '@/features/auth'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isDisabled = !email || !nickname || !password

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const { accessToken } = await authClient.register({ email, nickname, password })
      const user = await authClient.getMe()
      setAuth(user, accessToken)
      navigate('/missions')
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text-primary text-center mb-8">회원가입</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
          <Input
            label="닉네임"
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
          />
          <Input
            label="비밀번호"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />
          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}
          <Button type="submit" disabled={isDisabled || isLoading} fullWidth>
            {isLoading ? '처리 중...' : '회원가입'}
          </Button>
        </form>
        <p className="text-text-muted text-sm text-center mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-brand-yellow hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '@/features/auth'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

export function LoginPage() {
  const { login, isLoading, error } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isDisabled = !email || !password

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text-primary text-center mb-8">로그인</h1>
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
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
        <p className="text-text-muted text-sm text-center mt-6">
          계정이 없으신가요?{' '}
          <Link to="/register" className="text-brand-yellow hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

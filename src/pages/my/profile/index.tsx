import { useAuthStore } from '@/features/auth'
import { Badge } from '@/shared/ui/Badge'
import { Card } from '@/shared/ui/Card'

export function MyProfilePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen bg-bg-dark px-4 py-10">
      <div className="max-w-md mx-auto flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-text-primary">내 프로필</h1>

        {user && (
          <Card className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-text-muted text-xs">닉네임</span>
              <span className="text-text-primary font-semibold text-lg">{user.nickname}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-text-muted text-xs">이메일</span>
              <span className="text-text-muted">{user.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-text-muted text-xs">역할</span>
              <Badge variant={user.role === 'ADMIN' ? 'brand' : 'default'} className="w-fit">
                {user.role}
              </Badge>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

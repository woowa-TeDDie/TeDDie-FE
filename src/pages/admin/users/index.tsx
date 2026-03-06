import { AdminLayout } from '@/widgets/admin-sidebar/AdminLayout'

export function AdminUsersPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">유저 관리</h2>
      <p className="text-text-muted">가입 유저 목록 및 권한 관리가 표시됩니다.</p>
    </AdminLayout>
  )
}

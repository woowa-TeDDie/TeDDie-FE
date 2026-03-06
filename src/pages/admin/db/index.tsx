import { AdminLayout } from '@/widgets/admin-sidebar/AdminLayout'

export function AdminDbPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">DB 관리</h2>
      <p className="text-text-secondary">데이터베이스 상태 및 관리 기능이 표시됩니다.</p>
    </AdminLayout>
  )
}

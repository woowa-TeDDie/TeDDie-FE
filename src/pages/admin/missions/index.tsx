import { AdminLayout } from '@/widgets/admin-sidebar/AdminLayout'

export function AdminMissionsPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">미션 관리</h2>
      <p className="text-text-secondary">전체 미션 목록 및 관리 기능이 표시됩니다.</p>
    </AdminLayout>
  )
}

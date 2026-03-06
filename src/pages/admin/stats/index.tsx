import { AdminLayout } from '@/widgets/admin-layout/AdminLayout'

export function AdminStatsPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">통계</h2>
      <p className="text-text-secondary">미션 생성·풀이 통계 데이터가 표시됩니다.</p>
    </AdminLayout>
  )
}

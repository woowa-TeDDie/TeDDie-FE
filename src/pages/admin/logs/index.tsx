import { AdminLayout } from '@/widgets/admin-sidebar/AdminLayout'

export function AdminLogsPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">로그</h2>
      <p className="text-text-secondary">서버 및 애플리케이션 로그가 표시됩니다.</p>
    </AdminLayout>
  )
}

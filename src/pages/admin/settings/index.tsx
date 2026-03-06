import { AdminLayout } from '@/widgets/admin-layout/AdminLayout'

export function AdminSettingsPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">설정</h2>
      <p className="text-text-secondary">서비스 전반의 환경 설정이 표시됩니다.</p>
    </AdminLayout>
  )
}

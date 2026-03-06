import { AdminLayout } from '@/widgets/admin-layout/AdminLayout'

export function AdminAiPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">AI 관리</h2>
      <p className="text-text-secondary">AI 모델 설정 및 생성 요청 현황이 표시됩니다.</p>
    </AdminLayout>
  )
}

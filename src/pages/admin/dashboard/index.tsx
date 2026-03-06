import { AdminLayout } from '@/widgets/admin-sidebar/AdminLayout'
import { Card } from '@/shared/ui/Card'

const STATS = [
  { label: '총 미션', value: '-' },
  { label: '총 유저', value: '-' },
  { label: '오늘 생성', value: '-' },
]

export function AdminDashboardPage() {
  return (
    <AdminLayout>
      <h2 className="mb-6 text-2xl font-bold">대시보드</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value }) => (
          <Card key={label} className="flex flex-col gap-2 p-6">
            <span className="text-sm text-text-secondary">{label}</span>
            <span className="text-3xl font-bold text-primary">{value}</span>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}

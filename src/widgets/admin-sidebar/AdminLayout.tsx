import { Link } from 'react-router-dom'

const NAV_ITEMS = [
  { label: '대시보드', href: '/admin' },
  { label: '통계', href: '/admin/stats' },
  { label: '미션', href: '/admin/missions' },
  { label: '유저', href: '/admin/users' },
  { label: '커뮤니티', href: '/admin/community' },
  { label: 'AI', href: '/admin/ai' },
  { label: 'DB', href: '/admin/db' },
  { label: '로그', href: '/admin/logs' },
  { label: '설정', href: '/admin/settings' },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-bg-dark text-text-primary">
      <aside className="w-56 shrink-0 border-r border-border-subtle bg-surface px-4 py-6">
        <h1 className="mb-6 text-lg font-bold text-text-primary">Admin 패널</h1>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className="rounded-md px-3 py-2 text-sm text-text-muted transition hover:bg-bg-dark hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-yellow"
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}

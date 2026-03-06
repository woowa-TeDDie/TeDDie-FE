import { createBrowserRouter } from 'react-router-dom'
import { AdminRoute, PrivateRoute } from '@/shared/ui/PrivateRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('@/pages/landing').then((m) => ({ Component: m.LandingPage })),
  },
  {
    path: '/login',
    lazy: () => import('@/pages/login').then((m) => ({ Component: m.LoginPage })),
  },
  {
    path: '/register',
    lazy: () => import('@/pages/register').then((m) => ({ Component: m.RegisterPage })),
  },
  {
    path: '/missions',
    lazy: () => import('@/pages/missions/browse').then((m) => ({ Component: m.MissionBrowsePage })),
  },
  {
    path: '/missions/:id',
    lazy: () => import('@/pages/missions/detail').then((m) => ({ Component: m.MissionDetailPage })),
  },
  {
    path: '/missions/:id/result',
    lazy: () => import('@/pages/missions/result').then((m) => ({ Component: m.MissionResultPage })),
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/generate',
        lazy: () => import('@/pages/generate/form').then((m) => ({ Component: m.GenerateFormPage })),
      },
      {
        path: '/generate/:jobId',
        lazy: () => import('@/pages/generate/loading').then((m) => ({ Component: m.GenerateLoadingPage })),
      },
      {
        path: '/my/missions',
        lazy: () => import('@/pages/my/missions').then((m) => ({ Component: m.MyMissionsPage })),
      },
      {
        path: '/my/profile',
        lazy: () => import('@/pages/my/profile').then((m) => ({ Component: m.MyProfilePage })),
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        path: '/admin',
        lazy: () => import('@/pages/admin/dashboard').then((m) => ({ Component: m.AdminDashboardPage })),
      },
      {
        path: '/admin/stats',
        lazy: () => import('@/pages/admin/stats').then((m) => ({ Component: m.AdminStatsPage })),
      },
      {
        path: '/admin/missions',
        lazy: () => import('@/pages/admin/missions').then((m) => ({ Component: m.AdminMissionsPage })),
      },
      {
        path: '/admin/users',
        lazy: () => import('@/pages/admin/users').then((m) => ({ Component: m.AdminUsersPage })),
      },
      {
        path: '/admin/community',
        lazy: () => import('@/pages/admin/community').then((m) => ({ Component: m.AdminCommunityPage })),
      },
      {
        path: '/admin/ai',
        lazy: () => import('@/pages/admin/ai').then((m) => ({ Component: m.AdminAiPage })),
      },
      {
        path: '/admin/db',
        lazy: () => import('@/pages/admin/db').then((m) => ({ Component: m.AdminDbPage })),
      },
      {
        path: '/admin/logs',
        lazy: () => import('@/pages/admin/logs').then((m) => ({ Component: m.AdminLogsPage })),
      },
      {
        path: '/admin/settings',
        lazy: () => import('@/pages/admin/settings').then((m) => ({ Component: m.AdminSettingsPage })),
      },
    ],
  },
])

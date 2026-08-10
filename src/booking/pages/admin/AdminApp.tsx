import { Routes, Route, Navigate } from 'react-router-dom'
import { useAdminSession } from '../../hooks/useAdminSession'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'
import Dashboard from './Dashboard'
import Bookings from './Bookings'
import Slots from './Slots'
import FormEditor from './FormEditor'
import Survey from './Survey'
import Applications from './Applications'

export default function AdminApp() {
  const { session, isAdmin, loading, signOut } = useAdminSession()

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-muted">불러오는 중…</div>
  }

  if (!session || !isAdmin) {
    return <AdminLogin loggedInButNotAdmin={Boolean(session) && !isAdmin} onSignOut={signOut} />
  }

  return (
    <AdminLayout email={session.user.email} onSignOut={signOut}>
      <Routes>
        {/* ⚠️ 절대 경로로 둘 것 — 상대 경로면 catch-all 이 계속 덧붙이며 무한 루프가 된다 */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="slots" element={<Slots />} />
        <Route path="form" element={<FormEditor />} />
        <Route path="applications" element={<Applications />} />
        <Route path="survey" element={<Survey />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

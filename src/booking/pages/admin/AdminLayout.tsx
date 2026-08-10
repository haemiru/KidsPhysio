import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

/**
 * ⚠️ 반드시 절대 경로로 둘 것.
 * 상대 경로('survey')로 두면 /admin/dashboard 에서 누를 때
 * /admin/dashboard/survey 로 붙어 라우트 매칭에 실패하고,
 * AdminApp 의 catch-all 이 다시 'dashboard' 를 덧붙이며 무한 루프에 빠진다.
 */
const tabs = [
  { to: '/admin/dashboard', label: '신청 현황' },
  { to: '/admin/bookings', label: '예약 현황' },
  { to: '/admin/slots', label: '시간·휴무' },
  { to: '/admin/form', label: '신청서 항목' },
  { to: '/admin/applications', label: '신청 내역' },
  { to: '/admin/survey', label: '설문 응답' },
]

export default function AdminLayout({
  email,
  onSignOut,
  children,
}: {
  email?: string
  onSignOut: () => void
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#faf9fc]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <span className="font-bold text-primary-dark">관리자 · 키즈피지오 코칭</span>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="hidden sm:inline">{email}</span>
            <button onClick={onSignOut} className="rounded-lg border border-black/10 px-3 py-1.5 hover:bg-black/5">
              로그아웃
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-3">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                  isActive ? 'border-primary text-primary-dark' : 'border-transparent text-muted hover:text-ink'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-6">{children}</main>
    </div>
  )
}

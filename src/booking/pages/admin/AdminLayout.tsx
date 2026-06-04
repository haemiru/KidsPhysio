import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const tabs = [
  { to: 'dashboard', label: '신청 현황' },
  { to: 'bookings', label: '예약 현황' },
  { to: 'slots', label: '시간·휴무' },
  { to: 'form', label: '신청서 항목' },
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
          <span className="font-bold text-primary-dark">관리자 · 브레인센트</span>
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

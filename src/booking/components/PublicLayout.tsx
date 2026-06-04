import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export default function PublicLayout({
  children,
  maxWidth = 'max-w-2xl',
}: {
  children: ReactNode
  maxWidth?: string
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur">
        <div className={`mx-auto ${maxWidth} px-5 py-4 flex items-center justify-between`}>
          <Link to="/coaching" className="font-bold text-primary-dark">
            브레인센트 코어 리셋
          </Link>
          <Link to="/my" className="text-sm text-muted hover:text-ink">
            내 예약 조회
          </Link>
        </div>
      </header>

      <main className={`mx-auto w-full ${maxWidth} flex-1 px-5 py-8`}>{children}</main>

      <footer className="border-t border-black/5 py-6 text-center text-xs text-muted">
        <p>피지오 후각 연구소 · 브레인센트 코어 리셋 코칭</p>
        <p className="mt-1">
          <Link to="/privacy" className="underline hover:text-ink">
            개인정보 처리방침
          </Link>
        </p>
      </footer>
    </div>
  )
}

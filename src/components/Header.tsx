import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import Logo from './Logo'
import { nav, site } from '../data/site'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 모바일 메뉴 열림 시 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/85 shadow-[0_8px_30px_-18px_rgba(35,48,56,0.4)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      {/* 헤더는 본문(76rem)보다 살짝 넓은 컨테이너를 써서 메뉴가 늘어나도 로고·전화번호가 접히지 않게 한다 */}
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[86rem] items-center justify-between px-5">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="주요 메뉴">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-2.5 py-2 text-[15px] font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink/80 hover:bg-brand-50 hover:text-brand-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 xl:flex">
          <a
            href={site.phoneHref}
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-bold text-brand-700"
          >
            <Phone className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
            {site.phone}
          </a>
          <Link to="/coaching" className="btn btn-ghost whitespace-nowrap px-4 py-2.5 text-[15px]">
            4주 코칭
          </Link>
          <Link to="/contact" className="btn btn-primary whitespace-nowrap px-4 py-2.5 text-[15px]">
            무료 상담 예약
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-brand-100 bg-white text-ink xl:hidden"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-brand-100/70 bg-cream xl:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="모바일 메뉴">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-semibold ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink/90 hover:bg-brand-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/coaching"
              onClick={() => setOpen(false)}
              className="btn btn-ghost mt-2"
            >
              4주 코칭 신청
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-1"
            >
              무료 상담 예약
            </Link>
            <a
              href={site.phoneHref}
              className="mt-1 inline-flex items-center justify-center gap-2 py-2 text-sm font-bold text-brand-700"
            >
              <Phone className="h-4 w-4" aria-hidden="true" /> {site.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
